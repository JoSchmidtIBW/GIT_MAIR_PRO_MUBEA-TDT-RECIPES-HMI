import path from 'path'; //__dirname is not defined
import { fileURLToPath } from 'url'; //__dirname is not defined
import express from 'express';
import morgan from 'morgan';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp'; // against pollution in url
import xss from 'xss-clean';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import axios from 'axios';

import AppError from './utils/appError.mjs';
import globalErrorHandler from './controllers/errorController.mjs';

import startRoute from './routes/startRoute.mjs';
import viewRoute from './routes/viewRoutes.mjs';
import recipeRoute from './routes/recipeRoute.mjs';
import userRoute from './routes/userRoute.mjs';
import spsRoute from './routes/spsRoute.mjs';
import recipeSendSPSLogRoute from './routes/recipeSendSPSLogRoute.mjs';
import recipeStatisticRoute from './routes/recipeStatisticRoute.mjs';

const app = express();

//EsLint
// eslint-disable
const __filename = fileURLToPath(import.meta.url); //__dirname is not defined
const __dirname = path.dirname(__filename); //__dirname is not defined

// Beginning of the app
app.set('view engine', 'pug');

app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views', 'de'),
  path.join(__dirname, 'views', 'en'),
  path.join(__dirname, 'views', 'cs'),
]);
// slash /views// in path, can be a bug with /\- path
// could also be './views', but this is safer, app.set('views', path.join(__dirname, 'views/pages'));

// GLOBAL MIDDLEWARES

app.use((req, res, next) => {
  //console.log('Bin eine globale Middleware');
  res.set('Cache-Control', 'no-store');
  next();
});

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// use cors before all route definitions
//-app.use(cors({ origin: 'http://localhost:8555' }));
app.use(cors({ origin: 'http://127.0.0.1:8555' }));

//--------------------------??? wegen JOKE ??-------------------------
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Set securtity HTTP headers
const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    scriptSrc: ["'self'", 'code.jquery.com', 'cdn.datatables.net'],
    connectSrc: [
      "'self'",
      'http://127.0.0.1:8555',
      'http://127.0.0.1:8557',
      'https://api.chucknorris.io',
      'https://favqs.com/api/qotd',
    ],
  },
};

//TODO: wegen webSocket vorübergehend deaktiviert!
app.use(helmet.contentSecurityPolicy(cspOptions));

app.use(helmet.xssFilter()); // nun kann man im inputfeld zb beim Login nicht <script>alert("XSS")</script> schreiben, und es kommt kein alert    aber nicht mit script testen, sondern mit <iframe src=javascript:alert(1)>
//app.use(helmet.xframe('sameorigin'));
app.use(
  helmet({
    xFrameOptions: { action: 'sameorigin' },
  }),
);
app.disable('x-powered-by'); //sicherheit, damit nicht weiss im Browser, das express genutzt wird

app.use((req, res, next) => {
  //res.set('Content-Security-Policy', 'connect-src *');
  res.set(
    'Content-Security-Policy',
    "connect-src 'self' https://api.chucknorris.io",
  );
  next();
});

axios
  .get('https://api.chucknorris.io/jokes/random')
  .then((response) => {
    console.log('Joke in App.mjs:', response.data.value);
  })
  .catch((error) => {
    console.error('Error fetching joke:', error);
  });

app.get('/joke', async (req, res) => {
  try {
    const response = await axios.get('https://api.chucknorris.io/jokes/random');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching joke');
  }
});

// Development logging
console.log('process.env.NODE_ENV: ' + process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
// global middlewares limiter   for denial-of-service and brute-force- attacks
const limiter = rateLimit({
  // how many request are allowed in a time, by the same ip
  max: 100, // 100 request from the same IP
  windowMS: 60 * 60 * 1000, // window-time MS in miliseconds  = 1h
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '100kb' })); // for POST, to get data from client (need to be json)
// parse data coming in a urlencoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // When form send data to server, for example ejs method=post input, it also called urlencoded , extended true, to send complex data
// parse data from cookies
app.use(cookieParser());

// after the bod-parser, Security for data
// Data sanitization against NoSQLquery injection

// For example: by postman, login as: // or in compass: {"email": {"$gt": ""}} with filter, with {}
// {
//     "email": {"$gt": ""},
//     "password": "newpassword"
// }
app.use(mongoSanitize()); // Filters out all dollar signs

// Data sanatisation against XSS    cross-site-scripting-Attacks
app.use(xss()); // clean user-input from bad / evil html input

// Prevent parameter pollution, cleanup the querystring
app.use(hpp()); // can have a whitelist app.use(hpp({whitelist: ['name']}))

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log('Hello from the middleware :)');
  // console.log(JSON.stringify(req.headers));
  // console.log(JSON.stringify(req.cookies));
  next();
});

// DELETE COOKIE
app.get('/delete-cookie', (req, res) => {
  //DELETING username COOKIE
  res.clearCookie('jwtAdministrator');
  res.clearCookie('jwt');
  // REDIRECT TO HOME
  res.redirect('/');
});

// API- ROUTES
app.use('/', startRoute);
app.use('/api/v1', viewRoute); // has to be the first   Hier sollte nicht /api/v1/ stehen....
app.use('/api/v1/recipes', recipeRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/sps', spsRoute);
app.use('/api/v1/recipeSendSPSLog', recipeSendSPSLogRoute);
app.use('/api/v1/recipeStatistic', recipeStatisticRoute);

// To give an error message for wrong urls, this must happen under the routes
app.all('*', (req, res, next) => {
  // next(err); // error hand over
  // for all errors, get post put delete --> all 404 for not found
  next(new AppError(`Can's find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;

//------------------------------------------------------------ALT---------------------------------------------
// API- Routes

// app.get('/xx', (req, res) => {
//   res.status(200).render('txt_xml_FileUploader', {
//     title: 'fileUploader',
//   });
// });

// app.post('/xx', (req, res) => {
//   const text = req.body.hiddenField;
//   console.log(text); // Dieser Befehl gibt den Text in der Terminalkonsole aus
//   res.send('Daten empfangen');
// });
