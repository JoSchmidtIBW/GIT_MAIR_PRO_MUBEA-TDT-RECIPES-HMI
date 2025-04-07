import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import path from 'path'; //__dirname is not defined
import { fileURLToPath } from 'url'; //__dirname is not defined
import { connectSPS } from './models/spsConnector.mjs';
import mongoose from 'mongoose';
import app from './app.mjs';
import { Server as WebSocketServer } from 'socket.io';
import http from 'http';
import { readLastCSV_File } from './utils/writeCSV_File.mjs';

const __filename = fileURLToPath(import.meta.url); //__dirname is not defined // funktioniert, auch wenn rot ist
const __dirname = path.dirname(__filename); //__dirname is not defined

console.log('hello Mubea_PRO_MAIR_TDT :)'); // I am a test-commit 2

const DB_CONNECTOR = process.env.DB_CONNECTOR;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const DB_URL = `${DB_CONNECTOR}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

try {
  mongoose
    .connect(DB_URL, {
      //DB, ....
      useNewUrlParser: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection succeful!'));
} catch (err) {
  console.log('ERROR DB-Connecting');
  console.log('Bin server.mjs');
}

const httpServer = http.createServer(app);
const io = new WebSocketServer(httpServer);

//----------------------------SOCKET-------------------------------------------------------------
let lastCSVData = '';
async function readDataCSV() {
  lastCSVData = await readLastCSV_File();
}

io.on('connection', (socket) => {
  //console.log('WebSocket: Client connected via WebSocket');
  console.log('WebSocket: Client connected via WebSocket:', socket.id);
  console.log(
    'WebSocket: Welcher Socket fragt an (Helmet dafür deaktivieren!):',
    socket.handshake.headers.referer,
  );

  //console.log('-------------------------Socket-------:', socket.handshake);

  socket.emit('message', 'Hallo vom Server.mjs!');

  readDataCSV();
  socket.emit('messageCSVData', lastCSVData);

  // const intervalId = setInterval(() => {
  //   console.log('Sending SPS data...');
  //   sendSPSData();
  // }, 1000);

  console.log('WebSocket: Sending SPS data... (Ich laufe im Hintergrund!!!');
  const intervalId = setInterval(async () => {
    //console.log('Sending SPS data...');

    // SPS-Daten abrufen und an den Client senden
    try {
      //console.log('readLastCSV_File:', readLastCSV_File());
      // const lastCSVData = await readLastCSV_File();
      // socket.emit('messageCSVData', lastCSVData);

      const spsData = await sendSPSData(); // Funktion async

      // const spsDataCSVData = {
      //   spsData,
      //   lastCSVData,
      // };

      //socket.emit('sps-Socket-spsDataCSVData', spsDataCSVData); // Daten an den Client senden
      socket.emit('sps-Socket-data', spsData); // Daten an den Client senden
      //console.log('SPS data sent to client:', spsData);
    } catch (error) {
      console.error('WebSocket: Fehler beim Abrufen der SPS-Daten:', error);
      socket.emit(
        'error',
        'WebSocket: Fehler beim Abrufen der SPS-Daten*/*/*/*/*/*/*/*/*/*/*/*/*/',
      ); // Fehler an den Client senden
      await reconnectSPS();
    }
  }, 10000);

  socket.on('disconnect', () => {
    clearInterval(intervalId);
    console.log('WebSocket: Client disconnected');
  });
});

//-------------------------------SPS Run- Daten senden -----------------------------------------------
let client;
let currentFailedSPSTime = '';
async function sendSPSData() {
  try {
    //console.log('Server.mjs: bin in sendSPSData');

    client = await connectSPS();

    // SPS Runtime State
    let plcRuntimeState = await client.readPlcRuntimeState();
    // console.log(
    //   'bin sendSPSData in Server.mjs: plcRuntimeState:',
    //   plcRuntimeState,
    // );
    // console.log(
    //   '----------------------------------------------client gut---------------------',
    // );
    // console.log('client: ' + JSON.stringify(client));
    // console.log(
    //   '----------------------------------------------client gut---------------------',
    // );
    currentFailedSPSTime = '';
    return plcRuntimeState;
  } catch (error) {
    console.error(
      'bin in sendSPSData Server.mjs:  Fehler in sendSPSData:',
      error,
    );

    if (currentFailedSPSTime === '') {
      currentFailedSPSTime = new Date().toLocaleString('de-DE', {
        timeZone: 'Europe/Zurich',
      });
    }
    console.log(
      'bin in sendSPSData Server.mjs: Verbindung abgebrochen um:: ' +
        currentFailedSPSTime,
    );
    if (error.message.includes('state failed')) {
      console.log(
        'bin sendSPSData Server.mjs: Error includes: STATE FAILED!!!!',
      );
    }

    if (error.message.includes('Connection to')) {
      //if (error.message.includes('state failed')) {
      console.log(
        'bin sendSPSData Server.mjs: Error includes: CONNECTION TO!!!!',
      );
      // console.log(
      //   'Bin sendSPSData in server.mjs: Verbindung verloren, versuche erneut zu verbinden...',
      // );

      // console.log('bin sendSPSData Server.mjs: warte kurz:');
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      // console.log('bin sendSPSData Server.mjs: gehe zu reconnectSPS');
      // client = null;

      //await reconnectSPS();
    }
    //throw error;
  }
}

async function reconnectSPS() {
  let attempts = 0;
  const maxAttempts = 5; // Numbers of maxTry
  const retryInterval = 5000; //waitingTime

  while (attempts < maxAttempts) {
    try {
      console.log(
        `Server.mjs: reconnectSPS: Versuche erneut, die SPS zu verbinden... Versuch ${attempts + 1}/${maxAttempts}`,
      );
      //await disconnectSPS();
      // if (client) {
      //   await disconnectSPS();
      // }

      client = await connectSPS();

      if (client) {
        if (
          client.plcRuntimeState === null ||
          client.plcRuntimeState === undefined
        ) {
          console.log('Server.mjs: reconnectSPS: NIIIIIIICHT verbunden!');
          console.log(
            'Server.mjs: reconnectSPS: client.plcRuntimeState: ' +
              JSON.stringify(client.plcRuntimeState),
          );
        } else {
          console.log(
            'Server.mjs: reconnectSPS: Erfolgreich wieder verbunden!',
          );
          console.log(
            'Server.mjs: reconnectSPS: client.plcRuntimeState: ' +
              JSON.stringify(client.plcRuntimeState),
          );
          let plcRuntimeState = await client.readPlcRuntimeState();
          if (plcRuntimeState) {
            console.log(
              'Server.mjs: reconnectSPS: Erfolgreich wieder verbunden!',
            );
            console.log(
              'Server.mjs: reconnectSPS: plcRuntimeState:',
              plcRuntimeState,
            );
            return client;
          }
        }

        // console.log('client: ' + JSON.stringify(client));
      }
    } catch (error) {
      attempts++;
      console.error(
        `Server.mjs: reconnectSPS: Fehler beim erneuten Verbindungsversuch: ${error.message}`,
      );

      if (attempts < maxAttempts) {
        console.log(
          `Server.mjs: reconnectSPS: Warte ${retryInterval / 1000} Sekunden und versuche erneut...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      } else {
        console.log(
          'Server.mjs: reconnectSPS: Maximale Anzahl von Verbindungsversuchen erreicht. Verbindung fehlgeschlagen.',
        );
        //await disconnectSPS();
        client = null;

        break;
      }
    }
  }

  throw new Error(
    'Server.mjs: reconnectSPS: Verbindung zur SPS konnte nicht wiederhergestellt werden.',
  );
}

// 4. Start server
let PORT = 8554;
//let PORT = process.env.DEV_PORT;
if (process.env.NODE_ENV === 'development') {
  PORT = process.env.DEV_PORT;
} else if (process.env.NODE_ENV === 'production') {
  PORT = process.env.PROD_PORT;
} else {
  PORT = 8554;
}

//console.log(process.env);

// if ('development' == app.get('env')) {
//   console.log("Rejecting node tls");
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// }

//$env:NODE_TLS_REJECT_UNAUTHORIZED="0"

const httpExpressServer = httpServer.listen(PORT, () => {
  console.log(
    `Server running on port: http://127.0.0.1:${PORT} with Express for HTTP and Socket.io for WebSockets... --> in Browser with cookie (not https)`,
  ); //http://localhost:${PORT} ...
});

export default app;
