import { connectSPS } from '../spsConnector.mjs';

let client;

async function getClientPLC_Connect() {
  console.log('Bin getClientPLC_Connect');
  if (!client) {
    client = await connectSPS();
  }
  return client;
}

async function ensureConnected(client) {
  if (!client.connection || !client.connection.connected) {
    console.log('Verbindung zur SPS wird wiederhergestellt...');
    await client.connect();
  }
}

export async function readDataBySymbolName(symbolName) {
  console.log('Bin readDataBySymbolName');
  try {
    // Künstlicher Fehler zum Testen der Fehlerbehandlung
    // throw new Error('Testfehler: Manuelle Auslösung');

    client = await getClientPLC_Connect();
    const dataBySymbolName = await client.readSymbol(symbolName);
    console.log('dataBySymbolName.value: ' + dataBySymbolName.value);
    return dataBySymbolName;
  } catch (err) {
    console.log(
      `SPS_Service: readDataBySymbolName --> Fehler beim Lesen des Symbols - ${symbolName} - :`,
      err,
    );
    throw err;
  }
}

export async function readDataUploadInfo() {
  console.log('Bin readUploadInfo');
  try {
    // Künstlicher Fehler zum Testen der Fehlerbehandlung
    // throw new Error('Testfehler: Manuelle Auslösung');

    //const client = await connectSPS();
    client = await getClientPLC_Connect();
    const uploadInfo = await client.readUploadInfo();
    console.log('uploadInfo.value: ' + uploadInfo.value);
    return uploadInfo;
  } catch (err) {
    console.log(
      `SPS_Service: readDataUploadInfo --> Fehler beim Lesen UploadInfo:`,
      err,
    );
    throw err;
  }
}

export async function readDataDeviceInfo() {
  console.log('Bin readDataDeviceInfo');
  try {
    // Künstlicher Fehler zum Testen der Fehlerbehandlung
    // throw new Error('Testfehler: Manuelle Auslösung');

    //const client = await connectSPS();
    client = await getClientPLC_Connect();
    await ensureConnected(client);

    const deviceInfo = await client.readDeviceInfo();
    console.log('deviceInfo:', JSON.stringify(deviceInfo));
    return deviceInfo;
  } catch (err) {
    console.log(
      `SPS_Service: readDataDeviceInfo --> Fehler beim Lesen DeviceInfo:`,
      err,
    );
    throw err;
  }
}

export async function readDataSymbolVersion() {
  console.log('Bin readDataSymbolVersion');
  try {
    // Künstlicher Fehler zum Testen der Fehlerbehandlung
    // throw new Error('Testfehler: Manuelle Auslösung');

    //const client = await connectSPS();
    client = await getClientPLC_Connect();
    const symbolVersion = await client.readSymbolVersion();
    console.log('symbolVersion: ', symbolVersion);
    return symbolVersion;
  } catch (err) {
    console.log(
      `SPS_Service: readDataSymbolVersion --> Fehler beim Lesen SymbolVersion:`,
      err,
    );
    throw err;
  }
}

export async function readDataPlcRuntimeState() {
  console.log('Bin readDataPlcRuntimeState');
  try {
    // Künstlicher Fehler zum Testen der Fehlerbehandlung
    // throw new Error('Testfehler: Manuelle Auslösung');

    //const client = await connectSPS();
    client = await getClientPLC_Connect();
    const plcRuntimeState = await client.readPlcRuntimeState();
    console.log('plcRuntimeState:', plcRuntimeState);
    return plcRuntimeState;
  } catch (err) {
    console.log(
      `SPS_Service: readDataPlcRuntimeState --> Fehler beim Lesen PlcRuntimeState:`,
      err,
    );
    throw err;
  }
}

export async function readDataAll_GVL(gvl_Name) {
  try {
    console.log('Bin readDataAll_GVL');

    // Künstlicher Fehler zum Testen der Fehlerbehandlung
    // throw new Error('Testfehler: Manuelle Auslösung');

    //const client = await connectSPS();
    client = await getClientPLC_Connect();
    const ziehpositionen = await client.readSymbol(
      `${gvl_Name}.Ziehpositionen`,
    );
    const vFileLesen = await client.readSymbol(`${gvl_Name}.vFileLesen`);
    const vPositionen1 = await client.readSymbol(`${gvl_Name}.vPositionen1`);
    const vPositionen2 = await client.readSymbol(`${gvl_Name}.vPositionen2`);
    const vPositionen3 = await client.readSymbol(`${gvl_Name}.vPositionen3`);
    const vPositionen4 = await client.readSymbol(`${gvl_Name}.vPositionen4`);
    const vPositionen5 = await client.readSymbol(`${gvl_Name}.vPositionen5`);
    const vPositionen6 = await client.readSymbol(`${gvl_Name}.vPositionen6`);
    const vPositionen7 = await client.readSymbol(`${gvl_Name}.vPositionen7`);
    const vPositionen8 = await client.readSymbol(`${gvl_Name}.vPositionen8`);
    const vPositionen9 = await client.readSymbol(`${gvl_Name}.vPositionen9`);
    const vPositionen10 = await client.readSymbol(`${gvl_Name}.vPositionen10`);
    const vZiehwagenposition = await client.readSymbol(
      `${gvl_Name}.vZiehwagenposition`,
    );
    const vTippenPlus = await client.readSymbol(`${gvl_Name}.vTippenPlus`);
    const vTippenMinus = await client.readSymbol(`${gvl_Name}.vTippenMinus`);
    const vTippenEilgang = await client.readSymbol(
      `${gvl_Name}.vTippenEilgang`,
    );
    const vPosTeachen = await client.readSymbol(`${gvl_Name}.vPosTeachen`);
    const vPosAusgabe = await client.readSymbol(`${gvl_Name}.vPosAusgabe`);
    const vPosSoll = await client.readSymbol(`${gvl_Name}.vPosSoll`);
    const vPosOffset = await client.readSymbol(`${gvl_Name}.vPosOffset`);
    const vAktuelleZylPos = await client.readSymbol(
      `${gvl_Name}.vAktuelleZylPos`,
    );
    const vPosDifferenz = await client.readSymbol(`${gvl_Name}.vPosDifferenz`);
    const vFrg = await client.readSymbol(`${gvl_Name}.vFrg`);
    const vGeschw = await client.readSymbol(`${gvl_Name}.vGeschw`);
    const vNeuStart = await client.readSymbol(`${gvl_Name}.vNeuStart`);
    const vSimGeschw = await client.readSymbol(`${gvl_Name}.vSimGeschw`);
    const vCsvName = await client.readSymbol(`${gvl_Name}.vCsvName`);
    const iIstZiehwagenGeber = await client.readSymbol(
      `${gvl_Name}.iIstZiehwagenGeber`,
    );
    const regToqUeberwach = await client.readSymbol(
      `${gvl_Name}.RegToqUeberwach`,
    );
    const max_CSV_Rows = await client.readSymbol(`${gvl_Name}.Max_CSV_Rows`);
    const max_CSV_Columns = await client.readSymbol(
      `${gvl_Name}.Max_CSV_COLUMNS`,
    );
    const max_CSV_Field_Length = await client.readSymbol(
      `${gvl_Name}.Max_CSV_FIELD_LENGTH`,
    );

    const sps_GVL_Data = {
      ziehpositionen: ziehpositionen,
      vFileLesen: vFileLesen,
      vPositionen1: vPositionen1,
      vPositionen2: vPositionen2,
      vPositionen3: vPositionen3,
      vPositionen4: vPositionen4,
      vPositionen5: vPositionen5,
      vPositionen6: vPositionen6,
      vPositionen7: vPositionen7,
      vPositionen8: vPositionen8,
      vPositionen9: vPositionen9,
      vPositionen10: vPositionen10,
      vZiehwagenposition: vZiehwagenposition,
      vTippenPlus: vTippenPlus,
      vTippenMinus: vTippenMinus,
      vTippenEilgang: vTippenEilgang,
      vPosTeachen: vPosTeachen,
      vPosAusgabe: vPosAusgabe,
      vPosSoll: vPosSoll,
      vPosOffset: vPosOffset,
      vAktuelleZylPos: vAktuelleZylPos,
      vPosDifferenz: vPosDifferenz,
      vFrg: vFrg,
      vGeschw: vGeschw,
      vNeuStart: vNeuStart,
      vSimGeschw: vSimGeschw,
      vCsvName: vCsvName,
      iIstZiehwagenGeber: iIstZiehwagenGeber,
      regToqUeberwach: regToqUeberwach,
      max_CSV_Rows: max_CSV_Rows,
      max_CSV_Columns: max_CSV_Columns,
      max_CSV_Field_Length: max_CSV_Field_Length,
    };

    return sps_GVL_Data;
  } catch (err) {
    console.log(
      `SPS_Service: readDataAll_GVL --> Fehler beim Lesen von allen Daten in  - ${gvl_Name} - :`,
      err,
    );
    throw err;
  }
}

export const writeData_vCsvName_Ziehpositionen = async (
  new_vCsvName,
  new_ziehpositionen,
) => {
  try {
    console.log('Bin spsService: writeData_WithSymbolNameAndValue');
    const newWriteVCsvName = 'GVL.vCsvName';
    const newWriteZiehpositionen = 'GVL.Ziehpositionen';

    console.log('new_vCsvName: ' + new_vCsvName);
    console.log('new_ziehpositionen: ' + new_ziehpositionen);

    //await initializeClient();
    client = await getClientPLC_Connect();
    await ensureConnected(client);

    //await client.writeSymbol(symbolName, value);

    // const invalidSymbolName = 'Ungültiger.Symbol.Name'; // Ein Symbolname, der nicht existiert
    // await client.writeSymbol(invalidSymbolName, value); // Versuche, einen ungültigen Symbolnamen zu schreiben

    console.log(
      'SPS_Service --> writeData_WithSymbolNameAndValue: Wert geschrieben:',
      value,
    );
    //return true;
  } catch (err) {
    console.log(
      'SPS_Service --> writeData_WithSymbolNameAndValue: Fehler beim Schreiben des Symbols:',
      err,
    );
    throw (
      'SPS_Service --> writeData_WithSymbolNameAndValue: Fehler beim Schreiben des Symbols: ' +
      err
    );
  }
};

//TODO: GVL name auslagern config.env
export const writeData_ZiehPositionsArray = async (
  ziehPositionenArr_toWrite,
) => {
  try {
    console.log('Bin spsService: writeData_ZiehPositionsArray');
    //await initializeClient();

    client = await getClientPLC_Connect();
    await ensureConnected(client);

    const overwriteAnyOldPositionsCount_afterZiehPosArr_toWrite =
      ziehPositionenArr_toWrite.length;

    const maxPositionsToOverwrite = 600; // 8000-zieharray.length Attention: time to write is long!

    for (let i = 0; i < ziehPositionenArr_toWrite.length; i++) {
      await client.writeSymbol(`GVL.Ziehpositionen[${i}]`, {
        Pos: ziehPositionenArr_toWrite[i].Pos,
        Verst: ziehPositionenArr_toWrite[i].Verst,
      });
      //console.log(`Ziehposition für Pos ${pos.Pos} erfolgreich geschrieben.`);
    }

    for (
      let i = overwriteAnyOldPositionsCount_afterZiehPosArr_toWrite;
      i <= maxPositionsToOverwrite;
      i++
    ) {
      await client.writeSymbol(`GVL.Ziehpositionen[${i}]`, {
        Pos: 0,
        Verst: 0,
      });
      //console.log(`Wert für Pos ${i} gelöscht (0, 0).`);
    }

    return true;
  } catch (err) {
    console.log(
      'SPS_Service --> writeData_ZiehPositionsArray: Fehler beim Schreiben der Ziehpositionen:',
      err,
    );
    throw (
      'SPS_Service --> writeData_ZiehPositionsArray: Fehler beim Schreiben der Ziehpositionen: ' +
      err
    );
  }
};

export const writeData_WithSymbolNameAndValue = async (symbolName, value) => {
  try {
    console.log('Bin spsService: writeData_WithSymbolNameAndValue');
    //await initializeClient();
    client = await getClientPLC_Connect();
    await ensureConnected(client);

    await client.writeSymbol(symbolName, value);
    // const invalidSymbolName = 'Ungültiger.Symbol.Name'; // Ein Symbolname, der nicht existiert
    // await client.writeSymbol(invalidSymbolName, value); // Versuche, einen ungültigen Symbolnamen zu schreiben

    console.log(
      'SPS_Service --> writeData_WithSymbolNameAndValue: Wert geschrieben:',
      value,
    );
    return true;
  } catch (err) {
    console.log(
      'SPS_Service --> writeData_WithSymbolNameAndValue: Fehler beim Schreiben des Symbols:',
      err,
    );
    throw (
      'SPS_Service --> writeData_WithSymbolNameAndValue: Fehler beim Schreiben des Symbols: ' +
      err
    );
  }
};

//-------------------------------------------SPS--------------------------------------------
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

//-----------------------------------------------------------------------------------------------------------------------

/**
 *
 * @typedef Metadata
 * @property {object} deviceInfo - Target device info (read after connecting)
 * @property {object} systemManagerState - Target device system manager state (run, config, etc.)
 * @property {object} plcRuntimeState - Target PLC runtime state (run, stop, etc.) (the runtime state of settings.targetAdsPort PLC runtime)
 * @property {object} uploadInfo - Contains information of target data types, symbols and so on
 * @property {number} symbolVersion - Active symbol version at target system. Changes when PLC software is updated
 * @property {boolean} allSymbolsCached - True if all symbols are cached (so we know to re-cache all during symbol version change)
 * @property {object} symbols - Object containing all so far cached symbols
 * @property {boolean} allDataTypesCached - True if all data types are cached (so we know to re-cache all during symbol version change)
 * @property {object} dataTypes - Object containing all so far cached data types
 * @property {object} routerState - Local AMS router state (RUN, STOP etc) - Updated only if router sends notification (debug/run change etc)
 */

// const readUploadInfo = await client.readUploadInfo();
// console.log('readUploadInfo(): ', readUploadInfo);
//const readSystemManagerState = await client.rreadSystemManagerState();
//console.log('readSystemManagerState(): ', readSystemManagerState);
// const readDeviceInfo = await client.readDeviceInfo();
// console.log('readDeviceInfo:', JSON.stringify(readDeviceInfo));
// const symbolVersion = await client.readSymbolVersion();
// console.log('Symbol Version:', symbolVersion);
// const readPlcRuntimeState = await client.readPlcRuntimeState();
// console.log('readPlcRuntimeState:', readPlcRuntimeState);

//-------------------------------------------------------------------
// export const readData = async (symbolName) => {
//     try {
//       const result = await client.readSymbol(symbolName);
//       return result.value;
//     } catch (err) {
//       console.log('Fehler beim Lesen des Symbols:', err);
//     }
//   };

//   export const writeData = async (symbolName, value) => {
//     try {
//       await client.writeSymbol(symbolName, value);
//       console.log('Wert geschrieben:', value);
//     } catch (err) {
//       console.log('Fehler beim Schreiben des Symbols:', err);
//     }
//   };
