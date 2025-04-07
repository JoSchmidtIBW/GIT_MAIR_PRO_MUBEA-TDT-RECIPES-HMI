import ads from 'ads-client';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const spsConfig = {
  localAmsNetId: process.env.PLC_LOCAL_AMS_NET_ID, //'192.168.112.1.1', // Lokale AMS-Net-ID
  targetAmsNetId: process.env.PLC_TARGET_AMS_NET_ID, //'5.70.225.241.1.1', // AMS-Net-ID der Beckhoff-SPS
  targetAdsPort: process.env.PLC_TARGET_ADS_PORT, //851, // Ziel-ADS-Port, Standard-ADS-Port wie 851, 852, 801
  routerTcpPort: process.env.PLC_ROUTER_TCP_PORT, //48898, // Offener TCP-Port auf der SPS
  bareClient: true,
  readAndCacheSymbols: true, // Alle Symbole zwischenspeichern, muss dies haben!
  autoReconnect: true, // Automatisches Wiederverbinden aktivieren
  timeoutDelay: 2000,
  //localAdsPort: 32750, // Bsp lokalen ADS-Port
  //routerAddress: '192.168.112.1', // IP-Adresse der SPS
};

let client = null;
let heartbeatInterval = null;
let isConnected = false;
let isReconnecting = false;

// Haupt.-Funktion zur Verbindung mit der SPS
export const connectSPS = async () => {
  //console.log('spsConnector --> Start connectSPS...');

  // Überprüfen, ob bereits verbunden, weil sonst zu viele Clients...
  if (isConnected && client && client.connection) {
    //console.log('spsConnector --> connectSPS: SPS bereits verbunden.');
    return client;
  }

  client = new ads.Client(spsConfig); // ansonsten neuer CLient

  try {
    await client.connect();
    isConnected = true;
    isReconnecting = false;

    console.log(
      `spsConnector --> connectSPS: SPS verbunden mit AmsNetId ${client.connection.localAmsNetId} und Port ${client.connection.localAdsPort}`,
    );

    monitorConnection(); // Fehler-Überwachung starten
    startHeartbeat(); // Heartbeat-Überprüfung starten, braucht es....
  } catch (err) {
    console.error(
      'spsConnector --> connectSPS: Fehler beim Verbinden zur SPS:',
      err,
    );
    client = null;
    isConnected = false;
    throw err;
  }

  return client;
};

// Heartbeat-Überprüfungsfunktion
function startHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);

  heartbeatInterval = setInterval(async () => {
    try {
      await verifyConnection();
    } catch (err) {
      console.error(
        'spsConnector --> startHeartbeat: SPS-Verbindung verloren:',
        err.message,
      );
      isConnected = false;

      // Wenn keine Wiederverbindung läuft, neue starten nbach...
      if (!isReconnecting) {
        isReconnecting = true;
        client.disconnect();
        setTimeout(connectSPS, 15000);
      }
    }
  }, 10000);
}

// Verbindung mit SPS prüfen mit plcRunttimeState, weil aus client-objekt nicht ersichtlich!
async function verifyConnection() {
  try {
    const plcRuntimeState = await client.readPlcRuntimeState();
    // console.log(
    //   'spsConnector --> verifyConnection: Verbindung aktiv, plcRuntimeState:',
    //   plcRuntimeState,
    // );
    isConnected = true;
  } catch (err) {
    isConnected = false;
    throw new Error(
      'spsConnector --> verifyConnection: Verbindung zur SPS wurde unterbrochen',
    );
  }
}

function monitorConnection() {
  console.log('spsConnector --> monitorConnection gestartet.');

  client.on('error', (err) => {
    console.error('spsConnector --> monitorConnection: Fehler:', err.message);
    handleDisconnection();
  });

  client.on('close', () => {
    console.log(
      'spsConnector --> monitorConnection: Verbindung zur SPS wurde geschlossen.',
    );
    handleDisconnection();
  });
}

function handleDisconnection() {
  console.log('spsConnector --> handleDisconnection...');
  if (!isReconnecting) {
    isReconnecting = true;
    isConnected = false;

    client.disconnect();
    setTimeout(connectSPS, 20000);
  }
}

//----------------------------------------------------------------------------------------------------------------------
// VAR_GLOBAL
// 	Ziehpositionen 				: ARRAY [0..8000] OF VerstPos; // Ok zum schreiben

// 	vFileLesen					: BOOL;
// 	vPositionen1					: REAL;
// 	vPositionen2					: REAL;
// 	vPositionen3					: REAL;
// 	vPositionen4					: REAL;
// 	vPositionen5					: REAL;
// 	vPositionen6					: REAL;
// 	vPositionen7					: REAL;
// 	vPositionen8					: REAL;
// 	vPositionen9					: REAL;
// 	vPositionen10				: REAL;
// 	vZiehwagenposition			: INT;

// 	vTippenPlus					: BOOL;
// 	vTippenMinus				: BOOL;
// 	vTippenEilgang				: BOOL;
// 	vPosTeachen				: BOOL;
// 	vPosAusgabe				: REAL;
// 	vPosSoll						: REAL;
// 	vPosOffset					: REAL;
// 	vAktuelleZylPos				: REAL;
// 	vPosDifferenz					: REAL;
// 	vFrg							: BOOL;
// 	vGeschw						: REAL;
// 	vNeuStart					: BOOL;
// 	vSimGeschw					: TIME;

// 	vCsvName					: STRING; //Ok zum Schreiben

// 	iIstZiehwagenGeber			AT%I*	: UDINT;	(* Istwert Position Ziehwagen *)

// 	RegToqUeberwach			: BOOL;

// END_VAR

// VAR_GLOBAL CONSTANT
// 	MAX_CSV_ROWS 			: UDINT := 9001;
// 	MAX_CSV_COLUMNS 			: UDINT := 2;
// 	MAX_CSV_FIELD_LENGTH	: UDINT :=8;
// END_VAR
