import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import {
  OPCUAClient,
  AttributeIds,
  doTraceChunk,
  MessageSecurityMode,
  SecurityPolicy,
} from 'node-opcua';
import { readSimaticStatus } from './services/sps_OPCUA_Service.mjs';

const endpointUrl = process.env.PLC_OPCUA_ENDPOINTURL; //'opc.tcp://127.0.0.1:4334/UA/MyServer'; // Dein OPC UA Server
const nodeIdToMonitor = process.env.PLC_OPCUA_NODEID_RECIPE_NAME; //PLC_OPCUA_NODEIDTOMONITOR; //'ns=1;s=MyStringVariable'; // Die zu überwachende Variable

const plc_OPCUA_WITHSIMATIC = process.env.PLC_OPCUA_WITHSIMATIC;
console.log('plc_OPCUA_WITHSIMATIC: ', plc_OPCUA_WITHSIMATIC);

let clientOPCUA;
let sessionOPCUA;
let currentFailedTimeOPCUA = '';
// const endpointUrl = process.env.PLC_OPCUA_ENDPOINTURL; //'opc.tcp://127.0.0.1:4334/UA/MyServer'; // Dein OPC UA Server
// const nodeIdToMonitor = process.env.PLC_OPCUA_NODEIDTOMONITOR; //'ns=1;s=MyStringVariable'; // Die zu überwachende Variable
let isConnected = false;
let isSession = false;

function pause(milliseconds) {
  console.log('Bin Pause von: ' + milliseconds + 'milliseconds');
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function timeoutPromise(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('OPCUA Timeout!')), ms),
  );
  return Promise.race([promise, timeout]);
}

export async function connectClientOPCUA() {
  console.log('Bin connectClientOPCUA');

  if (
    clientOPCUA &&
    isConnected &&
    clientOPCUA._internalState === 'connected'
  ) {
    //if (clientOPCUA && isConnected && clientOPCUA.isConnected()) {
    console.log('♻️ Client existiert bereits... wird wiederverwendet');

    if (sessionOPCUA && isSession && sessionOPCUA._closed === false) {
      console.log('♻️ ♻️ Session existiert bereits, wird wiederverwendet');
      return { clientOPCUA, sessionOPCUA };
    } else {
      console.log('🟧!! mache createSessionOPCUA(clientOPCUA)');
      //await timeoutPromise(createSessionOPCUA(clientOPCUA));//original

      await timeoutPromise(createSessionOPCUA(clientOPCUA), 10000); // 22.07.2025
      return { clientOPCUA, sessionOPCUA }; // neu 22.07.2025
    }
    //return clientOPCUA;
    return { clientOPCUA, sessionOPCUA };
  }

  try {
    console.log('🔌 connectClientOPCUA: Verbinde mit OPC UA Server...');
    clientOPCUA = OPCUAClient.create({
      endpointMustExist: false,
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
    });
    await timeoutPromise(clientOPCUA.connect(endpointUrl), 4000); //2000 am 22.07.2025
    //await clientOPCUA.connect(endpointUrl);
    if (clientOPCUA._internalState != null) {
      console.log('🟡 clientOPCUA._internalState:', clientOPCUA._internalState);
    } else {
      console.log('🟡 clientOPCUA._internalState: ist Null!!!');
    }
    // // Event-Listener für Verbindungsabbrüche
    // clientOPCUA.on('backoff', async (retryCount) => {
    //   console.warn(`⚠ Verbindungsproblem. Neuer Versuch (${retryCount})...`);
    // });

    if (clientOPCUA._internalState === 'connected') {
      //if (clientOPCUA.isConnected()) {
      //if (clientOPCUA._internalState === 'connecting') {
      console.log('✅ Verbindung zur OPCUA erfolgreich! Client erstellt!');
      console.log('✅ clientOPCUA._internalState:', clientOPCUA._internalState);
      isConnected = true;
      //------------------------
      await createSessionOPCUA(clientOPCUA);
      //return clientOPCUA;
      return { clientOPCUA, sessionOPCUA };
    } else if (clientOPCUA._internalState === 'connecting') {
      console.log(
        '🟡🟡 clientOPCUA._internalState...',
        clientOPCUA._internalState,
      );
      //...warte bis isConnected
    } else {
      console.error(
        '❌🤨 Fehler beim Verbinden, client._internalState is not connected (clientOPCUA = Null, pause(2000) rufe connectClientOPCUA auf❗❗❗):',
      );
      isConnected = false; //original

      clientOPCUA = null; //15.07.2025
      await pause(2000); //15.07.2025
      //await disconnectOPCUA();
      return await connectClientOPCUA(); //15.07.2025
    }
  } catch (err) {
    isConnected = false;
    console.error('❌🤨🤨🤨 Fehler beim Verbinden zu OPCUA:', err.message);
    //await reconnectOPCUA();
    //return client;
    clientOPCUA = null;
    await pause(2000); //15.07.2025
    //TODO: nach 2-3 mal soll thro err kommen und nicht await connect wenn keine sps, laded nicht, wenn
    throw err; //original
    //return await connectClientOPCUA(); //15.07.2025

    // var i = 0; // das geht nicht, mit i, weil dann müsste ...
    // while(i<50) {
    //   do_something(i) --> return await connectClientOPCUA();
    //   i++
    // } --> throw err;
  }
}

export async function createSessionOPCUA(clientOPCUA) {
  console.log('Bin createSessionOPCUA');

  if (
    !clientOPCUA ||
    !isConnected ||
    clientOPCUA._internalState !== 'connected'
  ) {
    console.log('📂❌ client ist nicht connected in createSessionOPCUA');
    await connectClientOPCUA();
  }

  if (sessionOPCUA && isSession && sessionOPCUA._closed === false) {
    console.log('♻️ ♻️ Session existiert bereits, wird wiederverwendet');
    return { clientOPCUA, sessionOPCUA };
  }

  try {
    console.log('🟧⭕ keine gültige Session vorhanden – erstelle neue...');
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
    //return err;
  }
}

export async function disconnectOPCUA() {
  try {
    // if (sessionOPCUA && !sessionOPCUA.isClosed()) {
    //   await sessionOPCUA.close();
    //   sessionOPCUA = null;
    //   isSession = false;
    //   console.log('✅🔴 Session sauber geschlossen.');
    // }
    try {
      if (sessionOPCUA && typeof sessionOPCUA.close === 'function') {
        await sessionOPCUA.close();
        console.log('✅🔴 Session sauber geschlossen.');
      } else {
        console.log('ℹ️ Session war nicht aktiv oder schon geschlossen.');
      }
    } catch (err) {
      console.warn('⚠️ Fehler beim Schließen der Session:', err.message);
    } finally {
      sessionOPCUA = null;
      isSession = false;
    }

    // if (clientOPCUA && clientOPCUA._secureChannel) {
    //   await clientOPCUA.disconnect();
    //   clientOPCUA = null;
    //   isConnected = false;
    //   console.log('✅🔴 Client sauber getrennt.');
    // }
    try {
      if (clientOPCUA && typeof clientOPCUA.disconnect === 'function') {
        await clientOPCUA.disconnect();
        //await clientOPCUA.close();
        console.log('✅🔴 Client sauber getrennt.');
      } else {
        console.log('ℹ️ Client war nicht aktiv oder schon getrennt.');
      }
    } catch (err) {
      console.warn('⚠️ Fehler beim Trennen des Clients:', err.message);
    } finally {
      clientOPCUA = null;
      isConnected = false;
    }
  } catch (err) {
    console.warn('⚠️ Fehler beim Trennen des Clients:', err.message);
  }
  clientOPCUA = null;
  sessionOPCUA = null;
  isSession = false;
  console.log('🔴 OPC UA Verbindung sauber getrennt.');
  //connectClientOPCUA();
}

export async function readHeaderSpezialOPCUAData2() {
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
    await disconnectOPCUA();
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
    throw err;
    //return null;
    //throw new Error();
  }
}

let clientWS = null;
let sessionWS = null;
export async function readHeaderSpezialOPCUAData() {
  try {
    if (clientWS === null) {
      console.log('🔌 WS - Client ist null, wurde noch nicht erstellt!');
      clientWS = OPCUAClient.create({
        endpointMustExist: false,
      });

      try {
        console.log('🔌 WS - Verbinde mit OPC UA Server...');
        //await clientWS.connect(endpointUrl);
        await timeoutPromise(clientWS.connect(endpointUrl), 1000);

        console.log('✅ WS - Client und Verbindung hergestellt!');
      } catch (err) {
        console.error(
          '❌🔌 WS - Fehler beim Verbinden des opcua-Server (MairMaschine):',
          err,
        );
        // console.log(
        //   '❌ WS - Verbindung abgebrochen um: ' + currentFailedTimeOPCUA,
        // );

        // await sessionWS.close();
        // await clientWS.disconnect();

        if (sessionWS) {
          try {
            await sessionWS.close();
          } catch (e) {
            console.warn('⚠️ Konnte Session nicht schließen:', e);
            throw '⚠️ Konnte Session nicht schließen:' + e;
          }
          sessionWS = null;
        }

        if (clientWS) {
          try {
            await clientWS.disconnect();
          } catch (e) {
            console.warn('⚠️ Konnte Client nicht trennen:', e);
            throw '⚠️ Konnte Client nicht trennen:' + e;
          }
          clientWS = null;
        }

        clientWS = null;
        sessionWS = null;
        //return err; //null;
        throw new Error(
          '❌🔌 WS - Fehler beim Verbinden des opcua-Server (MairMaschine):' +
            err.message, //String(err) // err
        );
        //throw err.message;
      }
    }

    //console.log('clientWS: ', clientWS);

    // if (!clientWS._secureChannel || !clientWS._secureChannel.isOpened()) {
    //   console.error('❌🔌 OPC UA Verbindung ist tot! ❌🔌');
    //   throw new Error('❌🔌 OPCUA Verbindung unterbrochen ❌🔌');
    // }

    if (sessionWS === null) {
      try {
        sessionWS = await clientWS.createSession();
        // let errorSession = 'Hallo';
        // sessionWS = await errorSession.createSession();

        console.log('✅📂 WS - Session erstellt!');
      } catch (err) {
        console.error('❌📂 WS - Fehler beim Erstellen einer Session:', err);
        // console.log(
        //   '❌ WS - Verbindung abgebrochen um: ' + currentFailedTimeOPCUA,
        // );

        // await sessionWS.close();
        // await clientWS.disconnect();

        if (sessionWS) {
          try {
            await sessionWS.close();
          } catch (e) {
            console.warn('⚠️ Konnte Session nicht schließen:', e.message);
            throw '⚠️ Konnte Session nicht schließen:' + e.message;
          }
          sessionWS = null;
        }

        if (clientWS) {
          try {
            await clientWS.disconnect();
          } catch (e) {
            console.warn('⚠️ Konnte Client nicht trennen:', e.message);
            throw '⚠️ Konnte Client nicht trennen:' + e.message;
          }
          clientWS = null;
        }

        sessionWS = null;
        //return null;
        throw new Error(
          '❌📂 WS - Fehler beim Erstellen einer Session:' + err.message,
        );
      }
    }

    //try {
    console.log('✅ WS - Versuche Daten zu lesen....');

    const dataValueSPS_serverStatus = await sessionWS.read({
      nodeId: 'ns=0;i=2256', //TODO: auslagern SERVER-Status, nicht SPS
      attributeId: AttributeIds.Value,
    });

    const dataValue = await sessionWS.read({
      //TODO: auslagern, strichpunkt, und try catch wegen abfrage SPS und nicht server OPCUA
      nodeId: `ns=3;s="Baustein_1_DB_1"."RECIPE_NAME"`, //'ns=3,s="Baustein_1_DB_1"."RECIPE_NAME"', //'ns=3;s=RECIPE_NAME', //nodeIdToMonitor,
      attributeId: AttributeIds.Value,
    });
    //console.log('📖📖 Gelesener Wert dataValue:', dataValue);

    // return {
    //   serverStatus: dataValueSPS_serverStatus.value.value,
    //   monitoredValue: dataValue.value.value,
    // };

    let spsSimaticData = '-';
    if (plc_OPCUA_WITHSIMATIC === '1') {
      console.log('✅✅🟦 WS - Suche in Simatic...'); //TODO: auslagern nodeID, trycatch machen, wegen abfrage SPS und nicht OPCUA server
      //spsSimaticData = await readSimaticStatus();
      //const nodeID_SimaticStatus = 'ns=3;i=3063'; // Simatic SPS-Status //'ns=3;s="System"."State"."OperatingState"'
      //const nodeID_SimaticStatus = 'ns=3;s="System"."State"."OperatingState"',
      //const nodeID_SimaticStatus = 'ns=3;s="System"',
      //const nodeID_SimaticStatus = 'ns=3;s="OperatingState"',//3:SimaticOperatingState
      const nodeID_SimaticStatus = 'ns=3;s=OperatingMode'; //'ns=3;s=DeviceRevision'; // 'ns=3;i=6071'; //'ns=3;s="SimaticOperatingState"', //3:SimaticOperatingState
      //'ns=3;s=OperatingMode';
      spsSimaticData = await sessionWS.read({
        nodeId: nodeID_SimaticStatus,
        attributeId: AttributeIds.Value,
      });
      //console.log('📖 Gelesener Wert spsSimaticData:', spsSimaticData);
    }

    currentFailedTimeOPCUA = '';

    //console.log('🟦📖📖 Gelesener Wert spsSimaticData:', spsSimaticData);
    let status_myString_OPCUA = {
      dataValueSPS_serverStatus,
      dataValue,
      spsSimaticData,
      //currentFailedTimeOPCUA,
    };

    // await sessionWS.close();
    // await clientWS.disconnect();
    //console.log('🔴🔌 Verbindung geschlossen.');
    return status_myString_OPCUA;
  } catch (err) {
    // console.error(
    //   '❌ WS - Fehler beim Verbinden des opcua-Server (MairMaschine):',
    //   err,
    // );
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
    console.error(
      '❌ WS - bin in sendOPCUAData Server.mjs: ' +
        err.message +
        ' Verbindung abgebrochen: ' +
        currentFailedTimeOPCUA,
    );

    // await sessionWS.close();
    // await clientWS.disconnect();

    if (sessionWS) {
      try {
        await sessionWS.close();
      } catch (e) {
        console.warn('⚠️ Konnte Session nicht schließen:', e.message);
        throw '⚠️ Konnte Session nicht schließen:' + e.message;
      }
      sessionWS = null;
    }

    if (clientWS) {
      try {
        await clientWS.disconnect();
      } catch (e) {
        console.warn('⚠️ Konnte Client nicht trennen:', e.message);
        throw '⚠️ Konnte Client nicht trennen:' + e.message;
      }
      clientWS = null;
    }

    clientWS = null;
    sessionWS = null;
    console.log('ClientWS: ', clientWS);
    console.log('SessionWS: ', sessionWS);
    //return null;
    //throw new err(
    throw (
      '❌ WS - Fehler: ' +
      err.message +
      ' Verbindung abgebrochen: ' +
      currentFailedTimeOPCUA
    );
    //);
  }
}

//-------------------------------------------------ALT_nichtgebraucht------------------------------------------------------------------

//TODO: wo ist das mit 10minuten timeout!???

// async function sendOPCUAData22() {
//   console.log('Bin sendOBCUAData');

//   try {
//     clientOPCUA = await connectClientOBCUA();
//     console.log('clientOPCUA:', clientOPCUA);
//     sessionOPCUA = await createSessionOPCUA(clientOPCUA);
//     console.log('sessionOPCUA:', sessionOPCUA);
//     //TODO: er geht nicht in schlaufe, weil er immer verbinden versucht. jedoch sollte er ja immer wieder verbinden
//     currentFailedTimeOPCUA = '';
//   } catch (err) {
//     if (currentFailedTimeOPCUA === '') {
//       currentFailedTimeOPCUA = new Date().toLocaleString('de-DE', {
//         timeZone: 'Europe/Zurich',
//       });
//     }
//     console.log(
//       'bin in sendOPCUAData Server.mjs: Verbindung abgebrochen um: ' +
//         currentFailedTimeOPCUA,
//     );
//     console.log('Fehler in sendOPCUAData', err);
//   }
// }

//*************************************************funktioniert unten**************************************************************** */
// let client = null;
// let session = null;
// let reconnecting = false; // Um Mehrfach-Reconnects zu verhindern
// let isConnected = false;

// export async function connectClientOBCUA() {
//   console.log('Bin connectClientOPCUA');

//   if (client && isConnected && client._internalState === 'connected') {
//     console.log('client existiert bereits...');
//     await createSessionOPCUA(client);
//     return client;
//   }

//   try {
//     console.log('🔌 Verbinde mit OPC UA Server...');
//     client = OPCUAClient.create({ endpointMustExist: false });

//     console.log(
//       '-------------------------------------------------------------connectOPCUA-------------------------',
//     );
//     //console.log('client:', client);

//     // Event-Listener für Verbindungsabbrüche
//     client.on('backoff', async (retryCount) => {
//       console.warn(`⚠ Verbindungsproblem. Neuer Versuch (${retryCount})...`);
//     });

//     await client.connect(endpointUrl);
//     console.log(
//       'Verbindungsstatus - client._internalState:',
//       client._internalState,
//     );
//     if (client._internalState === 'connected') {
//       console.log('✅ Verbindung erfolgreich!');
//       isConnected = true;
//       //------------------------
//       await createSessionOPCUA(client);
//       return client;
//     } else {
//       console.error(
//         '❌ Fehler beim Verbinden, client._internalState is not connected:',
//       );
//     }

//     // session = await client.createSession();

//     // if (session._closed != true) {
//     //     console.log('✅ Session erfolgreich erstellt!');
//     //     isSession = true;
//     // }
//     // console.log('session._closed:', session._closed);

//     // await monitorVariable(); // Starte das Überwachen der Variablen

//     //return client;
//     //------------------------------
//     // await createSessionOPCUA(client);
//     //----------------------------------------
//     //return client;
//   } catch (err) {
//     isConnected = false;
//     console.error('❌ Fehler beim Verbinden:', err.message);
//     await reconnectOPCUA();
//     return client;
//   }
// }

// export async function connectClientOBCUA_222222222222() {
//   console.log('Bin connectClientOPCUA');

//   if (client && isConnected && client._internalState === 'connected') {
//     console.log('client existiert bereits...');
//     await createSessionOPCUA(client);
//     return client;
//   }

//   try {
//     console.log('🔌 Verbinde mit OPC UA Server...');
//     client = OPCUAClient.create({ endpointMustExist: false });

//     console.log(
//       '-------------------------------------------------------------connectOPCUA-------------------------',
//     );
//     //console.log('client:', client);

//     // Event-Listener für Verbindungsabbrüche
//     client.on('backoff', async (retryCount) => {
//       console.warn(`⚠ Verbindungsproblem. Neuer Versuch (${retryCount})...`);
//     });

//     await client.connect(endpointUrl);
//     console.log(
//       'Verbindungsstatus - client._internalState:',
//       client._internalState,
//     );
//     if (client._internalState === 'connected') {
//       console.log('✅ Verbindung erfolgreich!');
//       isConnected = true;
//       //------------------------
//       // await createSessionOPCUA(client);
//       // return client;
//     } else {
//       console.error(
//         '❌ Fehler beim Verbinden, client._internalState is not connected:',
//       );
//     }

//     // session = await client.createSession();

//     // if (session._closed != true) {
//     //     console.log('✅ Session erfolgreich erstellt!');
//     //     isSession = true;
//     // }
//     // console.log('session._closed:', session._closed);

//     // await monitorVariable(); // Starte das Überwachen der Variablen

//     //return client;
//     //------------------------------
//     await createSessionOPCUA(client);
//     //----------------------------------------
//     //return client;
//   } catch (err) {
//     isConnected = false;
//     console.error('❌ Fehler beim Verbinden:', err.message);
//     await reconnectOPCUA();
//   }
//   return client;
// }

// let isSession = false;

// export async function createSessionOPCUA(client) {
//   console.log('Bin createSessionOPCUA');

//   if (!client || !isConnected || client._internalState !== 'connected') {
//     console.log('client ist nicht connected in createSessionOPCUA');
//     await connectClientOBCUA();
//   }

//   try {
//     if (!session || !isSession || session._closed !== false) {
//       console.log('keine gültige Session vorhanden – erstelle neue...');
//       session = await client.createSession();
//       console.log('createSessionOPCUA --> Neue Session erstellt');
//       //console.log('neue Session erstellt:', session);

//       if (session._closed !== true) {
//         console.log('✅ createSessionOPCUA Session erfolgreich erstellt!');
//         isSession = true;
//       }

//       await monitorVariable(); // Falls du das brauchst
//     } else {
//       console.log(
//         '♻️ createSessionOPCUA Bestehende Session wird wiederverwendet.',
//       );
//     }

//     return { client, session }; // ✅ IMMER zurückgeben
//   } catch (err) {
//     isSession = false;
//     console.error(
//       '❌ createSessionOPCUA Fehler bei Session-Erstellung:',
//       err.message,
//     );
//     await reconnectOPCUA();
//     throw err; // besser weiterwerfen, damit der Aufrufer reagieren kann
//   }
// }

// export async function connectOPCUA() {
//   console.log('Bin connectOPCUA');
//   if (client && isConnected && client._internalState === 'connected') {
//     return client;
//   }

//   try {
//     console.log('🔌 connectOPCUA Verbinde mit OPC UA Server...');
//     client = OPCUAClient.create({ endpointMustExist: false });

//     console.log(
//       '-------------------------------------------------------------connectOPCUA-------------------------',
//     );
//     console.log('client:', client);

//     // Event-Listener für Verbindungsabbrüche
//     client.on('backoff', async (retryCount) => {
//       console.warn(
//         `⚠ connectOPCUA Verbindungsproblem. Neuer Versuch (${retryCount})...`,
//       );
//     });

//     await client.connect(endpointUrl);
//     console.log(
//       'connectOPCUA Verbindungsstatus - client._internalState:',
//       client._internalState,
//     );
//     console.log('✅ connectOPCUA Verbindung erfolgreich!');

//     session = await client.createSession();
//     session.close();
//     console.log(
//       '-------------------------------------------------------------connectOPCUA-------------------------',
//     );
//     //console.log('session:', session);
//     console.log('session.sessionId:', session.sessionId);
//     console.log(
//       'session. Object.keys(session.sessionId).length:',
//       Object.keys(session.sessionId).length,
//     );
//     console.log('session._closed:', session._closed);
//     console.log('✅ connectOPCUA Session erfolgreich erstellt!');

//     await monitorVariable(); // Starte das Überwachen der Variablen
//   } catch (err) {
//     console.error('❌ connectOPCUA Fehler beim Verbinden:', err.message);
//     await reconnectOPCUA();
//   }
//   return client;
// }

// export async function monitorVariable111() {
//   console.log('Bin monitorVariable');
//   while (true) {
//     let dataValue = '';
//     try {
//       if (!session) {
//         dataValue.value.value =
//           '⚠ monitorVariable Keine aktive Session! Warte auf Wiederverbindung...';
//         console.warn(
//           '⚠ monitorVariable Keine aktive Session! Warte auf Wiederverbindung...',
//         );
//         await new Promise((resolve) => setTimeout(resolve, 5000)); //warte 5 sec
//         continue; // Erneuter Versuch nach 5 Sekunden
//       }

//       // let dataValue = await session.read({
//       //   nodeId: nodeIdToMonitor,
//       //   attributeId: AttributeIds.Value,
//       // });

//       dataValue = await session.read({
//         nodeId: nodeIdToMonitor,
//         attributeId: AttributeIds.Value,
//       });

//       //console.log('📖 Gelesener Wert:', dataValue.value.value);

//       await new Promise((resolve) => setTimeout(resolve, 2000)); // Warte 2 Sekunden
//       return dataValue.value.value;
//     } catch (err) {
//       console.error('❌ monitorVariable Fehler beim Lesen:', err.message);
//       await reconnectOPCUA();
//       break; // Schleife verlassen, wenn ein Fehler auftritt
//     }
//   }
// }

// export async function reconnectOPCUA() {
//   console.log('Bin reconnectOPCUA');
//   if (reconnecting) return; // Verhindere gleichzeitige Reconnects
//   reconnecting = true;

//   console.log('🔄 reconnectOPCUA Versuche, neu zu verbinden...');

//   if (session) {
//     try {
//       await session.close();
//       console.log('🛑 reconnectOPCUA Session geschlossen.');
//     } catch (err) {
//       console.warn(
//         '⚠ reconnectOPCUA Fehler beim Schließen der Session:',
//         err.message,
//       );
//     }
//     session = null;
//   }

//   if (client) {
//     try {
//       await client.disconnect();
//       console.log('🔴 reconnectOPCUA Verbindung getrennt.');
//     } catch (err) {
//       console.warn(
//         '⚠ reconnectOPCUA Fehler beim Trennen der Verbindung:',
//         err.message,
//       );
//     }
//     client = null;
//   }

//   console.log(
//     '⏳ reconnectOPCUA Warte 5 Sekunden vor neuem Verbindungsversuch...',
//   );
//   await new Promise((resolve) => setTimeout(resolve, 5000));

//   reconnecting = false;
//   await connectOPCUA(); // Neuer Verbindungsversuch
// }

// //funktioniert
// export async function monitorVariable() {
//   console.log('Bin monitorVariable');
//   while (true) {
//     try {
//       if (!session) {
//         console.warn(
//           '⚠ monitorVariable Keine aktive Session! Warte auf Wiederverbindung...',
//         );
//         await new Promise((resolve) => setTimeout(resolve, 5000));
//         continue; // Erneuter Versuch nach 5 Sekunden
//       }

//       let dataValue = await session.read({
//         nodeId: nodeIdToMonitor,
//         attributeId: AttributeIds.Value,
//       });

//       //console.log('📖 Gelesener Wert:', dataValue.value.value);

//       await new Promise((resolve) => setTimeout(resolve, 2000)); // Warte 2 Sekunden
//       return dataValue.value.value;
//     } catch (err) {
//       console.error('❌ monitorVariable Fehler beim Lesen:', err.message);
//       await reconnectOPCUA();
//       break; // Schleife verlassen, wenn ein Fehler auftritt
//     }
//   }
// }
//*************************************************funktioniert oben**************************************************************** */
//--------------------------------------------------------------------------------------------------------------------------

// export async function createSessionOPCUA(client) {
//   console.log('Bin createSessionOPCUA');
//   if (!client || !isConnected || client._internalState !== 'connected') {
//     console.log('client ist nicht connected in createSessionOPCUA');
//     await connectClientOBCUA();
//   }

//   if (!session || !isSession || session._closed != false) {
//     console.log('keine session in createSessionOPCUA');
//     //await connectClientOBCUA();
//     session = await client.createSession();
//     console.log('neue Session erstellt: ', session);
//     return { client, session };
//   }

//   try {
//     console.log('Erstelle eine Session...');

//     session = await client.createSession();
//     //console.log('session:', session);

//     if (session._closed != true) {
//       console.log('✅ Session erfolgreich erstellt!');
//       isSession = true;
//     }
//     console.log('session._closed:', session._closed);

//     await monitorVariable();
//     return { client, session };
//   } catch (err) {
//     isSession = false;
//     console.error('❌ Fehler bei Session- Erstellung:', err.message);
//     await reconnectOPCUA();
//   }
// }

// Starte den Client
//connectOPCUA();

//----------------------------------------------------------------------------------------------------------------------------
// // const endpointUrl = 'opc.tcp://127.0.0.1:4334/UA/MyServer'; // Dein OPC UA Server
// // const nodeIdToMonitor = 'ns=1;s=MyStringVariable'; // Die zu überwachende Variable

// // PLC_OPCUA_ENDPOINTURL=opc.tcp://127.0.0.1:4334/UA/MyServer
// // PLC_OPCUA_NODEIDTOMONITOR=ns=1;s=MyStringVariable
// const endpointUrl = process.env.PLC_OPCUA_ENDPOINTURL; //'opc.tcp://127.0.0.1:4334/UA/MyServer'; // Dein OPC UA Server
// const nodeIdToMonitor = process.env.PLC_OPCUA_NODEIDTOMONITOR; //'ns=1;s=MyStringVariable'; // Die zu überwachende Variable

// let client = null;
// let session = null;
// let reconnecting = false; // Um Mehrfach-Reconnects zu verhindern

// export async function connectOPCUA() {
//   try {
//     console.log('🔌 Verbinde mit OPC UA Server...');
//     client = OPCUAClient.create({ endpointMustExist: false });

//     // Event-Listener für Verbindungsabbrüche
//     //client.on('backoff', async (retryCount) => {
//     client.on('opc-ua', async (retryCount) => {
//       console.warn(`⚠ Verbindungsproblem. Neuer Versuch (${retryCount})...`);
//     });

//     await client.connect(endpointUrl);
//     console.log('✅ Verbindung erfolgreich!');

//     session = await client.createSession();
//     console.log('✅ Session erfolgreich erstellt!');

//     await monitorVariable(); // Starte das Überwachen der Variablen
//   } catch (err) {
//     console.error('❌ Fehler beim Verbinden:', err.message);
//     await reconnectOPCUA();
//   }
// }

// export async function monitorVariable() {
//   while (true) {
//     try {
//       if (!session) {
//         console.warn('⚠ Keine aktive Session! Warte auf Wiederverbindung...');
//         await new Promise((resolve) => setTimeout(resolve, 5000));
//         continue; // Erneuter Versuch nach 5 Sekunden
//       }

//       let dataValue = await session.read({
//         nodeId: nodeIdToMonitor,
//         attributeId: AttributeIds.Value,
//       });

//       console.log('📖 Gelesener Wert:', dataValue.value.value);

//       await new Promise((resolve) => setTimeout(resolve, 2000)); // Warte 2 Sekunden
//       return dataValue.value.value;
//     } catch (err) {
//       console.error('❌ Fehler beim Lesen:', err.message);
//       await reconnectOPCUA();
//       break; // Schleife verlassen, wenn ein Fehler auftritt
//     }
//   }
// }

// export async function reconnectOPCUA() {
//   if (reconnecting) return; // Verhindere gleichzeitige Reconnects
//   reconnecting = true;

//   console.log('🔄 Versuche, neu zu verbinden...');

//   if (session) {
//     try {
//       await session.close();
//       console.log('🛑 Session geschlossen.');
//     } catch (err) {
//       console.warn('⚠ Fehler beim Schließen der Session:', err.message);
//     }
//     session = null;
//   }

//   if (client) {
//     try {
//       await client.disconnect();
//       console.log('🔴 Verbindung getrennt.');
//     } catch (err) {
//       console.warn('⚠ Fehler beim Trennen der Verbindung:', err.message);
//     }
//     client = null;
//   }

//   console.log('⏳ Warte 5 Sekunden vor neuem Verbindungsversuch...');
//   await new Promise((resolve) => setTimeout(resolve, 5000));

//   reconnecting = false;
//   await connectOPCUA(); // Neuer Verbindungsversuch
// }

// // Starte den Client
// //connectOPCUA();
//----------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------
// async function getClientPLC_Connect() {
//   console.log("Bin getClientPLC_Connect");
//   if (!client) {
//     client = await connectSPS();
//   }
//   return client;
// }

// // Stellt sicher, dass der Client verbunden bleibt
// async function ensureConnected() {
//   if (!client || !client.connection || !client.connection.connected) {
//     console.log(
//       "🔄 SPS-Verbindung unterbrochen! Versuche, neu zu verbinden..."
//     );
//     await reconnectSPS();
//   }
// }

// // Funktion zum erneuten Verbinden der SPS
// async function reconnectSPS() {
//   console.log("🔄 Reconnecting SPS...");

//   try {
//     if (client) {
//       await client.disconnect();
//       console.log("🔴 SPS-Verbindung getrennt.");
//     }
//   } catch (err) {
//     console.error("⚠ Fehler beim Trennen der Verbindung:", err.message);
//   }

//   console.log("⏳ Warte 5 Sekunden vor neuem Verbindungsversuch...");
//   await new Promise((resolve) => setTimeout(resolve, 5000));

//   try {
//     client = await connectSPS();
//     console.log("✅ SPS erfolgreich wieder verbunden!");
//   } catch (err) {
//     console.error(
//       "❌ Fehler beim erneuten Verbinden mit der SPS:",
//       err.message
//     );
//     setTimeout(reconnectSPS, 5000); // Nächster Versuch nach 5 Sekunden
//   }
// }
