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

import util from 'util';

import { OPCUAClient, AttributeIds, doTraceChunk } from 'node-opcua';

// import {
//   connectOPCUA,
//   connectClientOBCUA,
//   createSessionOPCUA,
//   monitorVariable,
// } from './models/sps_OPCUA_Connector.mjs';
import { SessionDiagnosticsDataType } from 'node-opcua';

import { readHeaderSpezialOPCUAData } from './models/sps_OPCUA_Connector.mjs';
//import { readSimaticStatus } from './models/services/sps_OPCUA_Service.mjs';

const __filename = fileURLToPath(import.meta.url); //__dirname is not defined // funktioniert, auch wenn rot ist
const __dirname = path.dirname(__filename); //__dirname is not defined

// const plc_OPCUA_WITHSIMATIC = process.env.PLC_OPCUA_WITHSIMATIC;
// console.log('plc_OPCUA_WITHSIMATIC: ', plc_OPCUA_WITHSIMATIC);

// let x = 2;
// console.log('x: ', x);
// console.log('typeof x: ', typeof x);
// console.log('parseFloat(x): ', parseFloat(x));
// //console.log('x.parseFloat(): ', x.parseFloat());
// console.log('typeof x: ', typeof x);

// const hasKey = (obj, keys) => {
//   return (
//     keys.length > 0 &&
//     keys.every((key) => {
//       if (typeof obj !== 'object' || !obj.hasOwnProperty(key)) return false;
//       obj = obj[key];
//       return true;
//     })
//   );
// };

// let obj = {
//   a: 1,
//   b: { c: 4 },
//   'b.d': 5,
// };

// hasKey(obj, ['a']); // true
// hasKey(obj, ['b']); // true
// hasKey(obj, ['b', 'c']); // true
// hasKey(obj, ['b.d']); // true
// hasKey(obj, ['d']); // false
// hasKey(obj, ['c']); // false
// hasKey(obj, ['b', 'f']); // false

// console.log(hasKey(obj, ['a']));

// var buttons = {
//   foo: 'bar',
//   fiz: 'buz',
// };

// for (var property in buttons) {
//   console.log(property + ' , ' + buttons[property]); // Outputs: foo, fiz or fiz, foo
// }

// console.log(1 <= '200');

// console.log(9999999999999999);

// console.log(0.5 + 0.1 == 0.6);
// console.log(0.1 + 0.2 == 0.3);

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

//----------------------------------------------

//connectOPCUA();
//connectClientOBCUA();

async function getSPSBeckhoffStatus() {
  let adsStatus = null;
  try {
    const spsData = await sendSPSData();
    console.log(
      'server.mjs - getSPSBeckhoffStatus - spsData(Beckhoff)',
      spsData,
    );
    return spsData;
  } catch (err) {
    console.log('Fehler beim Lesen von ADS Beckhoff:', err);
    await reconnectSPS();
  }
}
//-------------------------------------------------

const httpServer = http.createServer(app);
const io = new WebSocketServer(httpServer);

//----------------------------SOCKET-------------------------------------------------------------
let lastCSVData = '';
async function readDataCSV() {
  lastCSVData = await readLastCSV_File();
}

let currentFailedTimeOPCUA = '';

io.on('connection', (socket) => {
  console.log('WebSocket: Client connected via WebSocket:', socket.id);
  console.log(
    'WebSocket: Welcher Socket fragt an (Helmet dafür deaktivieren!):',
    socket.handshake.headers.referer,
  );

  socket.emit('message', 'Hallo vom Server.mjs!');

  readDataCSV();
  socket.emit('messageCSVData', lastCSVData);

  // const intervalId = setInterval(() => {
  //   console.log('Sending SPS data...');
  //   sendSPSData();
  // }, 1000);

  console.log('WebSocket: Sending SPS data... (Ich laufe im Hintergrund!!!');
  const intervalId = setInterval(async () => {
    //console.log('Sending SPS data an den Client...');
    try {
      const spsData = '';
      // const spsData = await getSPSBeckhoffStatus();
      // console.log('server.mjs - spsData(Beckhoff)', spsData); //server.mjs - spsData { adsState: 5, adsStateStr: 'Run', deviceState: 0 }

      //const spsData_OPCUA = await monitorVariable();
      let spsData_OPCUA = '';
      // try {
      //   console.log('🟡 Warte auf sendOPCUAData()...');
      //   spsData_OPCUA = await sendOPCUAData();
      //   console.log('server.mjs - spsData_OPCUA', spsData_OPCUA);
      // } catch (err) {
      //   console.log('spsData_OPCUA geht nicht');
      // }
      try {
        console.log('🟨 Warte auf sendOPCUAData()...');

        const ServerState = {
          0: 'Running🟢',
          1: 'Failed❌',
          2: 'NoConfiguration🔴',
          3: 'Suspended🔴',
          4: 'Shutdown🔴',
          5: 'Test🔴',
          6: 'CommunicationFault🔴',
          7: 'Unknown🔴',
        };

        // const value = 15;
        // const enumMap = {
        //   0: "NotSupported",
        //   1: "StopFwUpdate",
        //   3: "StopSelfInitialization",
        //   4: "Stop",
        //   6: "Startup",
        //   8: "Run",
        //   9: "RunRedundant",
        //   10: "Halt",
        //   11: "RunSyncUp",
        //   12: "SyncUp",
        //   13: "Defective",
        //   14: "ErrorSearch",
        //   15: "NoPower",
        //   16: "CiR",
        //   17: "STOPwithoutODIS",
        //   18: "RunODIS"
        // };

        // console.log(enumMap[value]);

        //spsData_OPCUA = await sendOPCUAData();

        //spsData_OPCUA = await readOPCUAData();
        spsData_OPCUA = await readHeaderSpezialOPCUAData();
        console.log(
          '✅ OPC UA Data erhalten spsData_OPCUA...',
          spsData_OPCUA.dataValueSPS_serverStatus.statusCode._value,
          spsData_OPCUA.dataValueSPS_serverStatus.statusCode._name,
          spsData_OPCUA.dataValueSPS_serverStatus.statusCode,
        );
        //console.log('spsData_OPCUA', spsData_OPCUA.dataValueSPS_serverStatus);

        //console.log('✅ OPC UA Data erhalten spsData_OPCUA', spsData_OPCUA);
        // Optional: besserer Debug-Ausdruck ohne Kreisfehler
        //jconsole.log(util.inspect(spsData_OPCUA, { depth: 3, colors: true }));

        // console.log(
        //   'Raw:',
        //   spsData_OPCUA.dataValueSPS_serverStatus.value.value.state,
        // );
        // console.log(
        //   'Text:',
        //   spsData_OPCUA.dataValueSPS_serverStatus.value.value.state.toString(),
        // );

        // Teste auf zirkuläre Struktur
        // try {
        //console.log('🟨🟨🟨 spsData_OPCUA:', spsData_OPCUA);
        console.log('🟨🟨🟨 spsData_OPCUA:...');
        JSON.stringify(spsData_OPCUA);
        // const stateCode =
        //   spsData_OPCUA.dataValueSPS_serverStatus.value.value.state;
        // const stateText = ServerState[stateCode];

        // console.log(`OPC UA - Server-State: ${stateText}`);
        currentFailedTimeOPCUA = '';
        // } catch (err) {
        //   console.warn('⚠️ spsData_OPCUA enthält zirkuläre Referenzen!');
        // }
      } catch (err) {
        //console.log('❌⚠️ ❌ spsData_OPCUA geht nicht: ', err.message);
        console.log('❌⚠️ ❌ spsData_OPCUA geht nicht: ', err);
        console.log('err: ', err);
        if (currentFailedTimeOPCUA === '') {
          currentFailedTimeOPCUA = new Date().toLocaleString('de-DE', {
            timeZone: 'Europe/Zurich',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
        console.log(
          '❌⚠️ ❌ Verbindung abgebrochen um: ' + currentFailedTimeOPCUA,
        );
        //let errOPCUA_Data_SplitArr = err.split(':')[1][err.length - 1]; //WebSocket: Fehler beim Abrufen der SPS-Daten: ReferenceError: Cannot access 'errOPCUA_Data_SplitArr' before initialization
        let errOPCUA_Data_Split = err.split(':').slice(2).join(':').trim(); //errOPCUA_Data_SplitArr; //[errOPCUA_Data_SplitArr.length - 1];
        //errOPCUA_Data_SplitArr[(1, errOPCUA_Data_SplitArr.length - 1)];
        console.log('errOPCUA_Data_Split_Error: ', errOPCUA_Data_Split);
        let errOPCUA_Data_SplitWithoutDateTime = '';
        // console.log('typeof err: ', typeof err);
        // console.log('err.message: ', err.message);
        // console.log('err.message: ', typeof err.message);
        let errStr = String(err);
        if (errStr.includes('🔌 WS')) {
          console.log(' der Fehler hat 🔌 WS:');
          errOPCUA_Data_Split = errStr
            .split(
              '❌🔌 WS - Fehler beim Verbinden des opcua-Server (MairMaschine):',
            )[1]
            .trim();
          errOPCUA_Data_SplitWithoutDateTime = errOPCUA_Data_Split.split(
            ' Verbindung abgebrochen',
          )[0];
        } else {
          console.log(' der Fehler hat keine 🔌 WS!!!!!!!!!:');
          // errOPCUA_Data_SplitWithoutDateTime =
          //   errOPCUA_Data_Split.split('❌ WS - Fehler: ')[0];
          //errOPCUA_Data_Split = err.split('❌ WS - Fehler:')[1].trim();
          // errOPCUA_Data_SplitWithoutDateTime = errOPCUA_Data_Split.split(
          //   ' Verbindung abgebrochen',
          // )[0];
          errOPCUA_Data_SplitWithoutDateTime = errStr.split(':')[1];
          console.log(
            'errOPCUA_Data_SplitWithoutDateTime -----: ',
            errOPCUA_Data_SplitWithoutDateTime,
          );
          errOPCUA_Data_SplitWithoutDateTime =
            errOPCUA_Data_SplitWithoutDateTime.split(
              'Verbindung abgebrochen',
            )[0];
        }
        //console.log('errOPCUA_Data_Split: ', errOPCUA_Data_Split);
        // console.log(
        //   'errOPCUA_Data_SplitWithoutDateTime***: ',
        //   errOPCUA_Data_SplitWithoutDateTime,
        // );

        // if (errOPCUA_Data_Split.includes('Verbindung abgebrochen')) {
        //   errOPCUA_Data_SplitWithoutDateTime = errOPCUA_Data_Split
        //     .split('Verbindung abgebrochen')[0]
        //     .trim();
        // } else {
        //   errOPCUA_Data_SplitWithoutDateTime = errOPCUA_Data_Split;
        // }
        // .slice(1)
        // .trim();
        console.log(
          'errOPCUA_Data_SplitWithoutDateTime: ',
          errOPCUA_Data_SplitWithoutDateTime,
        );
        spsData_OPCUA = errOPCUA_Data_SplitWithoutDateTime;
        //spsData_OPCUA = err;
        //spsData_OPCUA = errOPCUA_Data_Split;
      }

      // console.log(
      //   'Typ:',
      //   typeof spsData_OPCUA.dataValueSPS_serverStatus.value.value,
      // );
      // console.log(
      //   'server.mjs - spsData_OPCUA',
      //   //spsData_OPCUA.dataValueSPS_serverStatus.value.value,
      //   spsData_OPCUA.dataValueSPS_serverStatus.value.value,
      //   spsData_OPCUA.dataValue.value,
      // );
      // //let spsData_OPCUA_RUNBECKHOFF = { spsData_OPCUA, spsData: spsData };
      // //console.log('server.mjs - spsData_OPCUA', spsData_OPCUA);
      // console.log(
      //   'server.mjs - spsData_OPCUA.dataValueSPS_serverStatus.value.value.state',
      //   spsData_OPCUA.dataValueSPS_serverStatus.value.value.state.toString(),
      // );

      // console.log(
      //   typeof spsData_OPCUA.dataValueSPS_serverStatus.value.value.state,
      // );

      // console.log(
      //   '*/*/*/*/*/*/',
      //   JSON.stringify(
      //     spsData_OPCUA.dataValueSPS_serverStatus.value.value.state,
      //   ),
      // );

      // let spsSimaticData = '-';
      // if (plc_OPCUA_WITHSIMATIC === '1') {
      //   console.log(' Suche in Simatic...');
      //   spsSimaticData = await readSimaticStatus();
      // }

      let spsData_OPCUA_RUNBECKHOFF = {
        spsData_OPCUA,
        //spsSimaticData,
        spsData,
      };

      // let stateRaw = spsData_OPCUA.dataValueSPS_serverStatus.value.value.state;
      // let stateFinal =
      //   typeof stateRaw === 'number' ? stateRaw : stateEnumReverseMap[stateRaw];

      // console.log('State final:', stateFinal);

      // console.log(
      //   'spsData_OPCUA_RUNBECKHOFF:---------------------',
      //   JSON.stringify(spsData_OPCUA_RUNBECKHOFF),
      // );

      // let myObj1 = JSON.stringify(spsData_OPCUA_RUNBECKHOFF);
      // let myObjState = myObj1.split('"state":', ',"buildInfo"')[1];
      // console.log(
      //   '************myObjState**********************************',
      //   myObjState,
      // );
      // console.log(
      //   '************myObjState**********************************',
      //   myObjState.spsData_OPCUA.dataValueSPS_serverStatus.value.value.state,
      // );
      // console.log(
      //   '************myObjState**********************************',
      //   JSON.stringify(
      //     myObjState.spsData_OPCUA.dataValueSPS_serverStatus.value.value.state,
      //   ),
      // );
      // console.log(
      //   '************myObjState**********************************',
      //   JSON.parse(
      //     myObjState.spsData_OPCUA.dataValueSPS_serverStatus.value.value.state,
      //   ),
      // );

      // console.log(
      //   '/////',
      //   spsData_OPCUA_RUNBECKHOFF.spsData_OPCUA.dataValueSPS_serverStatus.value
      //     .value.state,
      // );

      // console.log(
      //   '/////',
      //   spsData_OPCUA_RUNBECKHOFF.spsData_OPCUA.dataValueSPS_serverStatus.value.value.state.toString(),
      // );

      // console.log(
      //   '/////',
      //   spsData_OPCUA_RUNBECKHOFF.spsData_OPCUA.dataValueSPS_serverStatus.value
      //     .value,
      // );
      //socket.emit('sps-Socket-spsDataCSVData', spsDataCSVData); // Daten an den Client senden
      //socket.emit('sps-Socket-data', spsData); // Daten an den Client senden
      //socket.emit('sps-Socket-data', spsData_OPCUA);
      socket.emit('sps-Socket-data', spsData_OPCUA_RUNBECKHOFF);
      //console.log('SPS data sent to client:', spsData);
    } catch (error) {
      console.error('WebSocket: Fehler beim Abrufen der SPS-Daten:', error);
      socket.emit(
        'error',
        'WebSocket: Fehler beim Abrufen der SPS-Daten*/*/*/*/*/*/*/*/*/*/*/*/*/',
        error,
      ); // Fehler an den Client senden
      //await reconnectSPS();
    }
  }, 10000); //10000);//10000 original

  socket.on('disconnect', () => {
    clearInterval(intervalId);
    console.log('WebSocket: Client disconnected');
  });
});

// let clientOPCUA;
// let sessionOPCUA;
// let currentFailedTimeOPCUA = '';
// const endpointUrl = process.env.PLC_OPCUA_ENDPOINTURL; //'opc.tcp://127.0.0.1:4334/UA/MyServer'; // Dein OPC UA Server
// const nodeIdToMonitor = process.env.PLC_OPCUA_NODEIDTOMONITOR; //'ns=1;s=MyStringVariable'; // Die zu überwachende Variable
// let isConnected = false;
// let isSession = false;

// function timeoutPromise(promise, ms) {
//   const timeout = new Promise((_, reject) =>
//     setTimeout(() => reject(new Error('OPCUA Timeout!')), ms),
//   );
//   return Promise.race([promise, timeout]);
// }

// async function sendOPCUAData22() {
//   console.log('Bin sendOBCUAData');

//   if (
//     clientOPCUA &&
//     //isConnected &&
//     clientOPCUA._internalState === 'connected'
//   ) {
//     console.log('sendOPCUAData: clientOPCUA existiert bereits...');
//     await createSessionOPCUA(clientOPCUA);
//     return clientOPCUA;
//   }

//   try {
//     console.log(
//       'sendOPCUAData:🔌 OPC UA: Versuche Verbindung mit:',
//       endpointUrl,
//     );
//     clientOPCUA = OPCUAClient.create({ endpointMustExist: false });

//     clientOPCUA.on('backoff', (retry, delay) => {
//       console.warn(`⏳ Reconnect-Versuch #${retry}, nächster in ${delay}ms`);
//     });

//     // try {
//     //   const spsData_OPCUA = await timeoutPromise(sendOPCUAData(), 5000);
//     //   console.log('server.mjs - spsData_OPCUA', spsData_OPCUA);
//     // } catch (err) {
//     //   console.log('❌ OPC UA Fehler oder Timeout:', err.message);
//     // }

//     await timeoutPromise(clientOPCUA.connect(endpointUrl), 500);
//     console.log('sendOPCUAData: ✅ OPC UA: Verbindung erfolgreich');

//     if (clientOPCUA._internalState !== 'connected') {
//       throw new Error(
//         'sendOPCUAData: OPCUA-Verbindung nicht erfolgreich (State !== connected)',
//       );
//     }

//     try {
//       let resultClientSession = await createSessionOPCUA(clientOPCUA); // return { client, session };

//       const nodeID_SPS_serverStatus = 'ns=0;i=2256'; // ServerStatus
//       let dataValueSPS_serverStatus = await resultClientSession.session.read({
//         nodeId: nodeID_SPS_serverStatus,
//         attributeId: AttributeIds.Value,
//       });

//       console.log(
//         '📖 Gelesener Wert SPS_serverStatus:',
//         dataValueSPS_serverStatus.value.value,
//       );

//       let dataValue = await resultClientSession.session.read({
//         nodeId: nodeIdToMonitor,
//         attributeId: AttributeIds.Value,
//       });

//       console.log('📖 Gelesener Wert:', dataValue.value.value);

//       //await new Promise((resolve) => setTimeout(resolve, 2000)); // Warte 2 Sekunden
//       //return dataValue.value.value;

//       return dataValueSPS_serverStatus.value.value;
//     } catch (sessionErr) {
//       console.error('❌ Fehler bei Session-Erstellung:', sessionErr);
//     }

//     //return clientOPCUA;
//   } catch (err) {
//     console.error('❌ OPC UA: Verbindungsfehler →', err.message || err);
//     return null; // oder throw err, wenn du oben damit umgehen willst
//   }
// }

//-------------------------------------------------------------------------------------------------
// async function sendOPCUAData() {
//   const clientOPCUA = OPCUAClient.create({ endpointMustExist: false });

//   try {
//     console.log('🔌 Verbinde mit OPC UA Server...');
//     await clientOPCUA.connect(endpointUrl);

//     const sessionOPCUA = await clientOPCUA.createSession();
//     console.log('✅ Session erstellt!');

//     while (true) {
//       try {
//         const nodeID_SPS_serverStatus = 'ns=0;i=2256'; // ServerStatus
//         let dataValueSPS_serverStatus = await sessionOPCUA.read({
//           //resultClientSession.session.read({
//           nodeId: nodeID_SPS_serverStatus,
//           attributeId: AttributeIds.Value,
//         });

//         console.log(
//           '📖 Gelesener Wert SPS_serverStatus:',
//           dataValueSPS_serverStatus.value.value,
//         );

//         let dataValue = await sessionOPCUA.read({
//           nodeId: nodeIdToMonitor,
//           attributeId: AttributeIds.Value,
//         });

//         console.log('📖 Gelesener Wert:', dataValue.value.value);

//         let status_myString_OPCUA = {
//           dataValueSPS_serverStatus,
//           dataValue,
//         };
//         //console.log('status_myString_OPCUA:', JSON.stringify(status_myString_OPCUA));

//         // Warte 2 Sekunden, bevor der nächste Request gesendet wird
//         //await new Promise((resolve) => setTimeout(resolve, 2000));
//         return status_myString_OPCUA; //dataValue.value.value;
//       } catch (err) {
//         console.error('❌ Fehler beim Lesen der Variable:', err);
//         break; // Beende die Schleife, falls es einen Fehler gibt
//       }
//     }

//     // Verbindung sauber trennen, falls Schleife endet
//     await sessionOPCUA.close();
//     await clientOPCUA.disconnect();
//     console.log('🔴 Verbindung getrennt.');
//   } catch (err) {
//     console.error('❌ OPC UA Fehler:', err);
//     return null;
//   }
// }
//********************************************************************************************************* */

//***************************************funktioniert unten 13.05.2025****************************************************** */
export async function connectClientOPCUA() {
  console.log('Bin connectClientOPCUA');

  if (
    clientOPCUA &&
    isConnected &&
    clientOPCUA._internalState === 'connected'
  ) {
    console.log('♻️ Client existiert bereits... wird wiederverwendet');

    if (sessionOPCUA && isSession && sessionOPCUA._closed === false) {
      console.log('♻️♻️ Session existiert bereits, wird wiederverwendet');
      return { clientOPCUA, sessionOPCUA };
    } else {
      await createSessionOPCUA(clientOPCUA);
    }
    return clientOPCUA;
  }

  try {
    console.log('🔌 Verbinde mit OPC UA Server...');
    clientOPCUA = OPCUAClient.create({ endpointMustExist: false });
    await timeoutPromise(clientOPCUA.connect(endpointUrl), 500);

    // // Event-Listener für Verbindungsabbrüche
    // clientOPCUA.on('backoff', async (retryCount) => {
    //   console.warn(`⚠ Verbindungsproblem. Neuer Versuch (${retryCount})...`);
    // });

    if (clientOPCUA._internalState === 'connected') {
      console.log('✅ Verbindung zur OPCUA erfolgreich! Client erstellt!');
      isConnected = true;
      //------------------------
      await createSessionOPCUA(clientOPCUA);
      return clientOPCUA;
    } else {
      console.error(
        '❌ Fehler beim Verbinden, client._internalState is not connected:',
      );
      isConnected = false;
    }
  } catch (err) {
    isConnected = false;
    console.error('❌ Fehler beim Verbinden zu OPCUA:', err.message);
    //await reconnectOPCUA();
    //return client;
    clientOPCUA = null;
    throw err;
  }
}

export async function createSessionOPCUA(clientOPCUA) {
  console.log('Bin createSessionOPCUA');

  if (
    !clientOPCUA ||
    !isConnected ||
    clientOPCUA._internalState !== 'connected'
  ) {
    console.log('client ist nicht connected in createSessionOPCUA');
    await connectClientOPCUA();
  }

  if (sessionOPCUA && isSession && sessionOPCUA._closed === false) {
    console.log('♻️♻️ Session existiert bereits, wird wiederverwendet');
    return { clientOPCUA, sessionOPCUA };
  }

  try {
    console.log('keine gültige Session vorhanden – erstelle neue...');
    sessionOPCUA = await clientOPCUA.createSession();

    if (sessionOPCUA._closed === false) {
      console.log('✅✅ createSessionOPCUA Session erfolgreich erstellt!');
      isSession = true;
      //await monitorVariable();
      return { clientOPCUA, sessionOPCUA };
    }
  } catch (err) {
    isSession = false;
    console.error(
      '❌❌ createSessionOPCUA Fehler bei Session-Erstellung:',
      err.message,
    );
    //await reconnectOPCUA();
    sessionOPCUA = null;
    throw err;
  }
}

async function readOPCUAData() {
  console.log('Bin readOPCUAData');
  try {
    const session = await createSessionOPCUA(clientOPCUA);

    const dataValueSPS_serverStatus = await session.sessionOPCUA.read({
      nodeId: 'ns=0;i=2256',
      attributeId: AttributeIds.Value,
    });

    const dataValue = await session.sessionOPCUA.read({
      nodeId: nodeIdToMonitor,
      attributeId: AttributeIds.Value,
    });

    // return {
    //   serverStatus: dataValueSPS_serverStatus.value.value,
    //   monitoredValue: dataValue.value.value,
    // };
    currentFailedTimeOPCUA = '';
    let status_myString_OPCUA = {
      dataValueSPS_serverStatus,
      dataValue,
      //currentFailedTimeOPCUA,
    };
    return status_myString_OPCUA;
  } catch (err) {
    console.error('❌ Fehler beim Lesen:', err.message);
    if (currentFailedTimeOPCUA === '') {
      currentFailedTimeOPCUA = new Date().toLocaleString('de-DE', {
        timeZone: 'Europe/Zurich',
      });
    }
    console.log(
      '❌❌❌bin in sendOPCUAData Server.mjs: Verbindung abgebrochen um: ' +
        currentFailedTimeOPCUA,
    );
    await disconnectOPCUA(); // bei Fehler Verbindung zurücksetzen
    //throw err;
    return null;
  }
}

async function sendOPCUAData22() {
  console.log('Bin sendOBCUAData');

  try {
    clientOPCUA = await connectClientOBCUA();
    console.log('clientOPCUA:', clientOPCUA);
    sessionOPCUA = await createSessionOPCUA(clientOPCUA);
    console.log('sessionOPCUA:', sessionOPCUA);
    //TODO: er geht nicht in schlaufe, weil er immer verbinden versucht. jedoch sollte er ja immer wieder verbinden
    currentFailedTimeOPCUA = '';
  } catch (err) {
    if (currentFailedTimeOPCUA === '') {
      currentFailedTimeOPCUA = new Date().toLocaleString('de-DE', {
        timeZone: 'Europe/Zurich',
      });
    }
    console.log(
      'bin in sendOPCUAData Server.mjs: Verbindung abgebrochen um: ' +
        currentFailedTimeOPCUA,
    );
    console.log('Fehler in sendOPCUAData', err);
  }
}

async function disconnectOPCUA() {
  if (sessionOPCUA) {
    await sessionOPCUA.close();
    sessionOPCUA = null;
  }
  if (clientOPCUA) {
    await clientOPCUA.disconnect();
    clientOPCUA = null;
  }
  console.log('🔴 OPC UA Verbindung sauber getrennt.');
}

//***************************************funktioniert oben 13.05.2025****************************************************** */
//********************************************************************************************************* */
//-----------------------------------------funktioniert unten------------------------------------
async function connect_OPCUA111() {
  if (clientOPCUA && sessionOPCUA) {
    return sessionOPCUA; // Bereits verbunden
  }

  try {
    clientOPCUA = OPCUAClient.create({ endpointMustExist: false });
    //await clientOPCUA.connect(endpointUrl);
    await timeoutPromise(clientOPCUA.connect(endpointUrl), 500);
    sessionOPCUA = await clientOPCUA.createSession();
    console.log('✅ OPC UA Session aufgebaut');
    return sessionOPCUA;
  } catch (err) {
    console.error('❌ OPC UA Verbindungsfehler:', err.message);
    clientOPCUA = null;
    sessionOPCUA = null;
    throw err;
  }
}

async function readOPCUAData111() {
  try {
    const session = await connect_OPCUA();

    const dataValueSPS_serverStatus = await session.read({
      nodeId: 'ns=0;i=2256',
      attributeId: AttributeIds.Value,
    });

    const dataValue = await session.read({
      nodeId: nodeIdToMonitor,
      attributeId: AttributeIds.Value,
    });

    // return {
    //   serverStatus: dataValueSPS_serverStatus.value.value,
    //   monitoredValue: dataValue.value.value,
    // };
    let status_myString_OPCUA = {
      dataValueSPS_serverStatus,
      dataValue,
    };
    return status_myString_OPCUA;
  } catch (err) {
    console.error('❌ Fehler beim Lesen:', err.message);
    await disconnectOPCUA(); // bei Fehler Verbindung zurücksetzen
    //throw err;
    return null;
  }
}

async function disconnectOPCUA111() {
  if (sessionOPCUA) {
    await sessionOPCUA.close();
    sessionOPCUA = null;
  }
  if (clientOPCUA) {
    await clientOPCUA.disconnect();
    clientOPCUA = null;
  }
  console.log('🔴 OPC UA Verbindung sauber getrennt.');
}

//---------------------------------------------------funktioniert oben---------------------------------------------------------------------------
// try {
//   console.log('🔌 Verbinde mit OPC UA Server...');
//   clientOPCUA = OPCUAClient.create({ endpointMustExist: false });

//   // clientOPCUA.on('backoff', async (retryCount) => {
//   //   console.warn(`⚠ Verbindungsproblem. Neuer Versuch (${retryCount})...`);
//   // });
//   try {
//     console.log(
//       '-------------111------------------------------------------------connectOPCUA-------------------------',
//     );
//     await clientOPCUA.connect(endpointUrl);
//   } catch (err) {
//     console.log('geeeeht niiiiicht');
//     //return clientOPCUA;
//     throw err;
//   }
//   console.log(
//     'Verbindungsstatus - clientOPCUA._internalState:',
//     clientOPCUA._internalState,
//   );
//   if (clientOPCUA._internalState === 'connected') {
//     console.log('✅ Verbindung erfolgreich!');
//     //isConnected = true;
//     await createSessionOPCUA(clientOPCUA);
//     return clientOPCUA;
//   } else {
//     console.error(
//       '❌ Fehler beim Verbinden, clientOPCUA._internalState is not connected:',
//     );
//   }

//   return clientOPCUA;
// } catch (err) {
//   console.error('❌ Fehler beim Verbinden:', err.message);
//   throw err;
// }
//}

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
    //return null;
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

//----------------------------------------------------------------------------------------------------
// io.on('connection', (socket) => {
//   //console.log('WebSocket: Client connected via WebSocket');
//   console.log('WebSocket: Client connected via WebSocket:', socket.id);
//   console.log(
//     'WebSocket: Welcher Socket fragt an (Helmet dafür deaktivieren!):',
//     socket.handshake.headers.referer,
//   );

//   //console.log('-------------------------Socket-------:', socket.handshake);

//   socket.emit('message', 'Hallo vom Server.mjs!');

//   readDataCSV();
//   socket.emit('messageCSVData', lastCSVData);

//   // const intervalId = setInterval(() => {
//   //   console.log('Sending SPS data...');
//   //   sendSPSData();
//   // }, 1000);

//   console.log('WebSocket: Sending SPS data... (Ich laufe im Hintergrund!!!');
//   const intervalId = setInterval(async () => {
//     //console.log('Sending SPS data...');

//     // SPS-Daten abrufen und an den Client senden
//     try {
//       //console.log('readLastCSV_File:', readLastCSV_File());
//       // const lastCSVData = await readLastCSV_File();
//       // socket.emit('messageCSVData', lastCSVData);

//       const spsData = await sendSPSData(); // Funktion async
//       console.log('server.mjs - spsData', spsData);
//       //server.mjs - spsData { adsState: 5, adsStateStr: 'Run', deviceState: 0 }
//       //const spsData_OPCUA = await monitorVariable();
//       let spsData_OPCUA = '';
//       try {
//         console.log('🟡 Warte auf sendOPCUAData()...');
//         spsData_OPCUA = await sendOPCUAData();
//         console.log('server.mjs - spsData_OPCUA', spsData_OPCUA);
//       } catch (err) {
//         console.log('spsData_OPCUA geht nicht');
//       }

//       //let spsData_OPCUA_RUNBECKHOFF = { spsData_OPCUA, spsData: spsData };
//       let spsData_OPCUA_RUNBECKHOFF = { spsData_OPCUA, spsData };

//       // const spsDataCSVData = {
//       //   spsData,
//       //   lastCSVData,
//       // };

//       //socket.emit('sps-Socket-spsDataCSVData', spsDataCSVData); // Daten an den Client senden
//       //socket.emit('sps-Socket-data', spsData); // Daten an den Client senden
//       //socket.emit('sps-Socket-data', spsData_OPCUA);
//       socket.emit('sps-Socket-data', spsData_OPCUA_RUNBECKHOFF);
//       //console.log('SPS data sent to client:', spsData);
//     } catch (error) {
//       console.error('WebSocket: Fehler beim Abrufen der SPS-Daten:', error);
//       socket.emit(
//         'error',
//         'WebSocket: Fehler beim Abrufen der SPS-Daten*/*/*/*/*/*/*/*/*/*/*/*/*/',
//       ); // Fehler an den Client senden
//       //await reconnectSPS();
//     }
//   }, 10000);

//   socket.on('disconnect', () => {
//     clearInterval(intervalId);
//     console.log('WebSocket: Client disconnected');
//   });
// });
