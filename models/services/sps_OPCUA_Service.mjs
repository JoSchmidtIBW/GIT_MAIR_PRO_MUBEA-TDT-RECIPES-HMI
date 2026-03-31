import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

//import { connectOPCUA } from '../sps_OPCUA_Connector.mjs';
import {
  OPCUAClient,
  AttributeIds,
  DataType,
  Variant,
  StatusCodes,
} from 'node-opcua';
import {
  //connectClientOBCUA,
  connectClientOPCUA,
  createSessionOPCUA,
  disconnectOPCUA,
} from '../sps_OPCUA_Connector.mjs';
//import { bool } from 'sharp';

const plcOPCUA_STEP_POSITIONS_ARRAY_SIZE = parseFloat(
  process.env.PLC_OPCUA_STEP_POSITIONS_ARRAY_SIZE,
);

const plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE = parseFloat(
  process.env.PLC_OPCUA_STEP_POSITIONS_ARRAY_START_VALUE,
);

const plcOPCUA_RECIPE_NAME = process.env.PLC_OPCUA_NODEID_RECIPE_NAME; //'ns=1;s=RECIPE_NAME';

// let client;
// let session;

// async function getClientPLC_Connect() {
//   console.log('Bin getClientPLC_Connect');
//   if (!client || client._internalState !== 'connected') {
//     client = await connectClientOPCUA();
//   }
//   return client;
// }

// async function getClientWithSession_PLC_Connect(client) {
//   console.log('Bin getClientWithSession_PLC_Connect');

//   if (!session || session.isClosed || !session.sessionId) {
//     try {
//       const result = await createSessionOPCUA(client);
//       session = result.session; // ✅ korrekt extrahieren return {client, session}
//       console.log('✅ Neue Session erstellt:', session.sessionId.toString());
//     } catch (error) {
//       console.error('❌ Fehler beim Erstellen der Session:', error.message);
//       throw error;
//     }
//   } else {
//     console.log('♻️ Bestehende Session wird verwendet');
//   }

//   return session;
// }

// async function readNodeDetails(session, nodeId) {
//   const attributes = [
//     AttributeIds.BrowseName,
//     AttributeIds.Description,
//     AttributeIds.DataType,
//     AttributeIds.Value,
//     AttributeIds.SourceTimestamp,
//     AttributeIds.AccessLevel,
//   ];

//   const requests = attributes.map((attrId) => ({
//     nodeId,
//     attributeId: attrId,
//   }));

//   const results = await session.read(requests);

//   const info = {};
//   attributes.forEach((attrId, index) => {
//     info[AttributeIds[attrId]] = results[index]?.value?.value ?? null;
//   });

//   return info;
// }

// Umgekehrtes Mapping für Attributnamen
const attributeNames = {
  1: 'NodeId',
  2: 'NodeClass',
  3: 'BrowseName',
  4: 'DisplayName',
  5: 'Description',
  6: 'WriteMask',
  7: 'UserWriteMask',
  13: 'Value',
  14: 'DataType',
  15: 'ValueRank',
  16: 'ArrayDimensions',
  17: 'AccessLevel',
  18: 'UserAccessLevel',
  19: 'MinimumSamplingInterval',
  20: 'Historizing',
  21: 'Executable',
  22: 'UserExecutable',
  23: 'SourceTimestamp',
};

async function readNodeDetails(session, nodeId) {
  const attributes = [
    AttributeIds.BrowseName,
    AttributeIds.Description,
    AttributeIds.DataType,
    AttributeIds.Value,
    AttributeIds.SourceTimestamp,
    AttributeIds.AccessLevel,
  ];

  const requests = attributes.map((attrId) => ({
    nodeId,
    attributeId: attrId,
  }));

  const results = await session.read(requests);

  const info = {};
  attributes.forEach((attrId, index) => {
    const key = attributeNames[attrId] || `Attr${attrId}`;
    info[key] = results[index]?.value?.value ?? null;
  });

  return info;
}

async function readValueOnly(session, nodeId) {
  const dataValue = await session.read({
    nodeId,
    attributeId: AttributeIds.Value,
  });

  return dataValue?.value?.value ?? null;
}

export async function readPLC_RECIPE_NAME() {
  console.log('Bin readPLC_RECIPE_NAME');

  try {
    const clientSession = await connectClientOPCUA();

    const plcNodeID_Strucktname = process.env.PLC_OPCUA_NODEID__STRUCKTNAME;
    const plcNodeID_RECIPE_NAME = process.env.PLC_OPCUA_NODEID__RECIPE_NAME;

    const data_RECIPE_NAME = await clientSession.sessionOPCUA.read({
      nodeId: `${plcNodeID_Strucktname}.${plcNodeID_RECIPE_NAME}`,
      attributeId: AttributeIds.Value,
    });

    await disconnectOPCUA();

    return data_RECIPE_NAME;
  } catch (err) {
    console.log('Fehler bei readPLC_RECIPE_NAME: ' + err);
  }
}

export async function readTDT_ExchangeArea() {
  console.log('bin readTDT_ExchangeAerea');

  const plcNodeID_Strucktname = process.env.PLC_OPCUA_NODEID__STRUCKTNAME;
  const plcNodeID_RECIPE_NAME = process.env.PLC_OPCUA_NODEID__RECIPE_NAME;
  const plcNodeID_STEP_POSITIONS = process.env.PLC_OPCUA_NODEID__STEP_POSITIONS;
  const plcNodeID_STPO_Pos = process.env.PLC_OPCUA_NODEID__STPO_POS;
  const plcNodeID_STPO_Pos_POS = process.env.PLC_OPCUA_NODEID__STPO_POS_POS;
  const plcNodeID_STPO_Pos_Speed = process.env.PLC_OPCUA_NODEID__STPO_POS_SPEED;
  const plcNodeID_STPO_Pos_Acceleration =
    process.env.PLC_OPCUA_NODEID__STPO_POS_ACCELERATION;
  const plcNodeID_STPO_Pos_Stroke =
    process.env.PLC_OPCUA_NODEID__STPO_POS_STROKE;

  try {
    const clientSession = await connectClientOPCUA();

    const data_RECIPE_NAME = await clientSession.sessionOPCUA.read({
      nodeId: `${plcNodeID_Strucktname}.${plcNodeID_RECIPE_NAME}`,
      attributeId: AttributeIds.Value,
    });

    console.log('**********************************************************');
    console.log('data_RECIPE_NAME: ', data_RECIPE_NAME);

    const dataRECIPE_NAME_Detail = await readNodeDetails(
      clientSession.sessionOPCUA,
      `${plcNodeID_Strucktname}.${plcNodeID_RECIPE_NAME}`,
    );

    console.log('dataRECIPE_NMAME_Deteil: ', dataRECIPE_NAME_Detail);
    console.log('**********************************************************');

    const stepPositionsObj = {};

    let arrayStartIndex1 = parseFloat(
      plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE,
    );
    for (
      let i = 0;
      i <=
      plcOPCUA_STEP_POSITIONS_ARRAY_SIZE -
        plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE;
      i++
    ) {
      const prefix = `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}]`;
      const [pos, speed, acc, stroke] = await Promise.all([
        readValueOnly(
          clientSession.sessionOPCUA,
          `${prefix}.${plcNodeID_STPO_Pos_POS}`,
        ),
        readValueOnly(
          clientSession.sessionOPCUA,
          `${prefix}.${plcNodeID_STPO_Pos_Speed}`,
        ),
        readValueOnly(
          clientSession.sessionOPCUA,
          `${prefix}.${plcNodeID_STPO_Pos_Acceleration}`,
        ),
        readValueOnly(
          clientSession.sessionOPCUA,
          `${prefix}.${plcNodeID_STPO_Pos_Stroke}`,
        ),
      ]);

      stepPositionsObj[`Pos${arrayStartIndex1}`] = {
        POS: pos,
        Speed: speed,
        Acceleration: acc,
        Stroke: stroke,
      };
      arrayStartIndex1 = arrayStartIndex1 + 1;
    }

    console.log(
      '--------------------------------------------------    ----------------------------------------------',
    );
    //console.log('StepPositionsObj:', stepPositionsObj);
    console.log(
      '--------------------------------------------------    ----------------------------------------------',
    );
    const stepPositionsObjN = {};

    let arrayStartIndex = parseFloat(plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE);

    for (
      let i = 0;
      i <=
      plcOPCUA_STEP_POSITIONS_ARRAY_SIZE -
        plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE;
      i++
    ) {
      //const prefix = `ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${i}]`;
      const prefix = `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}]`;

      // Alle 4 Werte gleichzeitig anfragen (werden als Promises gespeichert)
      const posPromise = readNodeDetails(
        clientSession.sessionOPCUA,
        `${prefix}.${plcNodeID_STPO_Pos_POS}`, //"POS"`,
      );
      const speedPromise = readNodeDetails(
        clientSession.sessionOPCUA,
        `${prefix}.${plcNodeID_STPO_Pos_Speed}`, //"Speed"`,
      );
      const accPromise = readNodeDetails(
        clientSession.sessionOPCUA,
        `${prefix}.${plcNodeID_STPO_Pos_Acceleration}`, //"Acceleration"`,
      );
      const strokePromise = readNodeDetails(
        clientSession.sessionOPCUA,
        `${prefix}.${plcNodeID_STPO_Pos_Stroke}`, //"Stroke"`,
      );

      // Jetzt auf alle 4 gleichzeitig warten:
      const [pos, speed, acc, stroke] = await Promise.all([
        posPromise,
        speedPromise,
        accPromise,
        strokePromise,
      ]);

      // Werte ins Objekt schreiben
      stepPositionsObjN[`Pos${i + plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE}`] =
        {
          POS: pos,
          Speed: speed,
          Acceleration: acc,
          Stroke: stroke,
        };

      arrayStartIndex = arrayStartIndex + 1;
    }

    //console.log('StepPositionsObjN:', stepPositionsObjN);
    console.log(
      '--------------------------------------------------    ----------------------------------------------',
    );
    //console.log('StepPositionsObjN:', JSON.stringify(stepPositionsObjN));

    const data_TDT_ExchangeArea = {
      data_RECIPE_NAME: data_RECIPE_NAME,
      dataRECIPE_NAME_Detail: dataRECIPE_NAME_Detail,
      //stepPositionsArr: stepPositionsArr,
      stepPositionsObj: stepPositionsObj,
      stepPositionsObjN: stepPositionsObjN,
    };

    await disconnectOPCUA();

    return data_TDT_ExchangeArea;
  } catch (err) {
    console.log('Fehler bei readTDT_ExchangeArea: ', err);
    throw err;
  }
}

export async function readPLC_Informations() {
  console.log('Bin readPLC_Informations');
  try {
    const clientSession = await connectClientOPCUA();

    const nodeID_DeviceManual = 'ns=3;s=DeviceManual';
    let dataValue_DeviceManual = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_DeviceManual,
      attributeId: AttributeIds.Value,
    });

    const nodeID_DeviceRevision = 'ns=3;s=DeviceRevision';
    let dataValue_DeviceRevision = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_DeviceRevision,
      attributeId: AttributeIds.Value,
    });

    const nodeID_EngineeringRevision = 'ns=3;s=EngineeringRevision';
    let dataValue_EngineeringRevision = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_EngineeringRevision,
      attributeId: AttributeIds.Value,
    });

    const nodeID_HardwareRevision = 'ns=3;s=HardwareRevision';
    let dataValue_HardwareRevision = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_HardwareRevision,
      attributeId: AttributeIds.Value,
    });

    const nodeID_Manufacturer = 'ns=3;s=Manufacturer';
    let dataValue_Manufacturer = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_Manufacturer,
      attributeId: AttributeIds.Value,
    });

    const nodeID_Model = 'ns=3;s=Model';
    let dataValue_Model = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_Model,
      attributeId: AttributeIds.Value,
    });

    const nodeID_OperatingMode = 'ns=3;s=OperatingMode';
    let dataValue_OperatingMode = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_OperatingMode,
      attributeId: AttributeIds.Value,
    });

    const nodeID_OrderNumber = 'ns=3;s=OrderNumber';
    let dataValue_OrderNumber = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_OrderNumber,
      attributeId: AttributeIds.Value,
    });

    const nodeID_RevisionCounter = 'ns=3;s=Revisioncounter';
    let dataValue_RevisionCounter = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_RevisionCounter,
      attributeId: AttributeIds.Value,
    });

    const nodeID_SerialNumber = 'ns=3;s=SerialNumber';
    let dataValue_SerialNumber = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_SerialNumber,
      attributeId: AttributeIds.Value,
    });

    const nodeID_SoftwareRevision = 'ns=3;s=SoftwareRevision';
    let dataValue_SoftwareRevision = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_SoftwareRevision,
      attributeId: AttributeIds.Value,
    });

    // const nodeID_PLC = 'ns=3;s=PLC'; //'ns=2;i=5001'; //'ns=3;i=1002'; //'ns=3;s=PLC';
    // let dataValue_PLC = await clientSession.sessionOPCUA.read({
    //   nodeId: nodeID_PLC,
    //   attributeId: AttributeIds.Value,
    // });

    // console.log('🟦📖🟦 dataValue_DeviceManual: ', dataValue_DeviceManual);
    // console.log('🟦📖🟦 dataValue_DeviceRevision: ', dataValue_DeviceRevision);
    // console.log(
    //   '🟦📖🟦 dataValue_EngineeringRevision ',
    //   dataValue_EngineeringRevision,
    // );
    // console.log(
    //   '🟦📖🟦 dataValue_HardwareRevision: ',
    //   dataValue_HardwareRevision,
    // );
    // console.log('🟦📖🟦 dataValue_Manufacturer: ', dataValue_Manufacturer);
    // console.log('🟦📖🟦 dataValue_Model: ', dataValue_Model);
    // console.log('🟦📖🟦 dataValue_OperatingMode: ', dataValue_OperatingMode);
    // console.log('🟦📖🟦 dataValue_OrderNumber: ', dataValue_OrderNumber);
    // console.log(
    //   '🟦📖🟦 dataValue_RevisionCounter: ',
    //   dataValue_RevisionCounter,
    // );
    // console.log('🟦📖🟦 dataValue_SerialNumber: ', dataValue_SerialNumber);
    // console.log(
    //   '🟦📖🟦 dataValue_SoftwareRevision: ',
    //   dataValue_SoftwareRevision,
    // );
    ////console.log('🟦📖🟦 dataValue_PLC: ', dataValue_PLC);
    const dataPLC_Informations = {
      dataValue_DeviceManual,
      dataValue_DeviceRevision,
      dataValue_EngineeringRevision,
      dataValue_HardwareRevision,
      dataValue_Manufacturer,
      dataValue_Model,
      dataValue_OperatingMode,
      dataValue_OrderNumber,
      dataValue_RevisionCounter,
      dataValue_SerialNumber,
      dataValue_SoftwareRevision,
    };
    await disconnectOPCUA();
    return dataPLC_Informations;
  } catch (err) {
    console.log('Fehler bei readPLC_Informations: ' + err);
  }
}

export async function readSimaticStatus() {
  console.log('Bin readSimaticStatus');
  try {
    const clientSession = await connectClientOPCUA();
    const nodeID_SimaticStatus = 'ns=3;s=OperatingMode'; //'ns=3;i=3063'; // Simatic SPS-Status
    let dataValueSPS_simaticStatus = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_SimaticStatus,
      attributeId: AttributeIds.Value,
    });
    console.log(
      '🟦📖 ✅ Gelesener Wert SimaticStatus:',
      dataValueSPS_simaticStatus,
    );

    //const status = plcSimaticStatus;
    const plcSimaticStatus = {
      ...dataValueSPS_simaticStatus,
      statusCode: {
        value: dataValueSPS_simaticStatus.statusCode.value,
        description: dataValueSPS_simaticStatus.statusCode._description,
        name: dataValueSPS_simaticStatus.statusCode._name,
      },
    };

    await disconnectOPCUA();
    //return dataValueSPS_simaticStatus;
    return plcSimaticStatus;
  } catch (err) {
    console.log('Fehler bei readSimaticStatus: ', err);
    throw err;
  }
}

export async function readServerStatus_OPCUA() {
  console.log('Bin readServerStatus_OPCUA');
  try {
    const clientSession = await connectClientOPCUA();
    // console.log(
    //   'clientSession:-------------------------------------------',
    //   clientSession,
    // );

    const nodeID_SPS_serverStatus = 'ns=0;i=2256'; // OPCUA-ServerStatus
    let dataValueSPS_serverStatus = await clientSession.sessionOPCUA.read({
      nodeId: nodeID_SPS_serverStatus,
      attributeId: AttributeIds.Value,
    });

    // console.log(
    //   '📖 Gelesener Wert SPS_serverStatus:',
    //   dataValueSPS_serverStatus.value.value,
    // );
    await disconnectOPCUA();
    return dataValueSPS_serverStatus.value.value;
  } catch (err) {
    console.log('Fehler bei readServerStatus_OPCUA: ', err);
    throw err;
  }
}

//----------------------------------------------ALT----------------------------------------------------------------
// // TODO: auslagern endpointUrl
// const endpointUrl = 'opc.tcp://127.0.0.1:4334/UA/MyServer'; // Server MairMaschine

// export async function readServerStatus_OPCUA1() {
//   console.log('Bin readServerStatur_OPCUA1');
//   try {
//     const client = OPCUAClient.create({
//       endpointMustExist: false,
//     });

//     await client.connect(endpointUrl);
//     console.log('✅ Verbindung hergestellt!');

//     const session = await client.createSession();
//     console.log('📂 Session erstellt!');

//     const nodeID_SPS_serverStatus = 'ns=0;i=2256'; // ServerStatus
//     let dataValueSPS_serverStatus = await session.read({
//       nodeId: nodeID_SPS_serverStatus,
//       attributeId: AttributeIds.Value,
//     });

//     console.log(
//       '📖 Gelesener Wert SPS_serverStatus:',
//       dataValueSPS_serverStatus.value.value,
//     );
//     return dataValueSPS_serverStatus.value.value;
//     //return dataValueSPS_serverStatus;
//   } catch (err) {
//     console.log('err_ bei readServerStatus_OPCUA:', err);
//   }
// }

// async function getClientWithSession_PLC_Connect33(client) {
//   console.log('Bin getClientWithSession_PLC_Connect');
//   if (!session || session._closed != false) {
//     //await connectClientOBCUA();
//     session = await createSessionOPCUA(client);
//     console.log('Session aus createSessionOPCUA:', session);
//   }
//   return session;
// }

// async function getClientWithSession_PLC_Connect444(client) {
//   console.log('Bin getClientWithSession_PLC_Connect');

//   if (!session || session.isClosed || !session.sessionId) {
//     try {
//       session = await createSessionOPCUA(client);
//       console.log(
//         '✅ getClientWithSession_PLC_Connect Neue Session erstellt:',
//         session.sessionId.toString(),
//       );
//     } catch (error) {
//       console.error(
//         '❌ getClientWithSession_PLC_Connect Fehler beim Erstellen der Session:',
//         error,
//       );
//       throw error;
//     }
//   }

//   return session;
// }
//PLC_OPCUA_NODEID_RECIPE_NAME

// PLC_OPCUA_NODEID__STRUCKTNAME=ns=3;s="Baustein_1_DB_1"
// PLC_OPCUA_NODEID__RECIPE_NAME="RECIPE_NAME"#`ns=3;s="Baustein_1_DB_1"."RECIPE_NAME"`
// PLC_OPCUA_NODEID__STEP_POSITIONS="STEP_POSITIONS"
// PLC_OPCUA_NODEID__STPO_POS="Pos"
// PLC_OPCUA_NODEID__STPO_POS_POS=POS
// PLC_OPCUA_NODEID__STPO_POS_SPEED=Speed
// PLC_OPCUA_NODEID__STPO_POS_ACCELERATION=Acceleration
// PLC_OPCUA_NODEID__STPO_POS_STROKE=Stroke

export async function writeSTEP_POSITIONS_CleanUPwithZeros_toSPS_OPCUA() {
  console.log('🟦 Bin writeSTEP_POSITIONS_CleanUOwithZeros_toSPS_OPCUA');

  const plcNodeID_Strucktname = process.env.PLC_OPCUA_NODEID__STRUCKTNAME;
  const plcNodeID_RECIPE_NAME = process.env.PLC_OPCUA_NODEID__RECIPE_NAME;
  const plcNodeID_STEP_POSITIONS = process.env.PLC_OPCUA_NODEID__STEP_POSITIONS;
  const plcNodeID_STPO_Pos = process.env.PLC_OPCUA_NODEID__STPO_POS;
  const plcNodeID_STPO_Pos_POS = process.env.PLC_OPCUA_NODEID__STPO_POS_POS;
  const plcNodeID_STPO_Pos_Speed = process.env.PLC_OPCUA_NODEID__STPO_POS_SPEED;
  const plcNodeID_STPO_Pos_Acceleration =
    process.env.PLC_OPCUA_NODEID__STPO_POS_ACCELERATION;
  const plcNodeID_STPO_Pos_Stroke =
    process.env.PLC_OPCUA_NODEID__STPO_POS_STROKE;

  try {
    const cleanUpObj = {
      POS: 0,
      Speed: 0,
      Acceleration: 0,
      Stroke: 0,
    };
    const clientSession = await connectClientOPCUA();

    // const result = await clientSession.sessionOPCUA.write([
    //   {
    //     //nodeId: 'ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos[1]"."POS"',
    //     //nodeId: 'ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[1]."POS"', //funktioniert
    //     //nodeId: `ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[1]."POS"`, // funktioniert
    //     nodeId: `ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${200}]."POS"`, // funktioniert
    //     attributeId: AttributeIds.Value,
    //     value: {
    //       value: new Variant({
    //         dataType: DataType.Float,
    //         value: 9999,
    //       }),
    //     },
    //   },
    // ]);
    // console.log('result: ', result);

    const plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS =
      process.env.PLC_OPCUA_NODEID_STEP_POSITIONS_NODE_POS;
    const plcOPCUA_STEP_POSITIONS_ARRAY_SIZE = parseFloat(
      process.env.PLC_OPCUA_STEP_POSITIONS_ARRAY_SIZE,
    );
    let plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE = parseFloat(
      process.env.PLC_OPCUA_STEP_POSITIONS_ARRAY_START_VALUE,
    );

    console.log(
      'plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE: ',
      plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE,
    );
    console.log(
      'plcOPCUA_STEP_POSITIONS_ARRAY_SIZE: ',
      plcOPCUA_STEP_POSITIONS_ARRAY_SIZE,
    );

    // console.log(
    //   '`${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS.toString()}.${plcNodeID_STPO_Pos}[${1}].${plcNodeID_STPO_Pos_Acceleration}`: ',
    //   `${plcNodeID_Strucktname}."${plcNodeID_STEP_POSITIONS}".${plcNodeID_STPO_Pos}[${1}].${plcNodeID_STPO_Pos_Acceleration}`,
    // );

    const nodesToCleanUpWrite = [];
    for (
      let i = 0; //plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE; // 0 funktioniert
      //i <= 200 - 1; //plcOPCUA_STEP_POSITIONS_ARRAY_SIZE; // funktioniert
      i <=
      plcOPCUA_STEP_POSITIONS_ARRAY_SIZE -
        plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE;
      i++
    ) {
      nodesToCleanUpWrite.push(
        //{
        {
          //nodeId: `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[${i}].POS`, // 'ns=1;s=UNGÜLTIGER_NODE', // `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[${plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE}].POS`, //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,

          nodeId: `${plcNodeID_Strucktname}."${plcNodeID_STEP_POSITIONS}".${plcNodeID_STPO_Pos}[${i}].${plcNodeID_STPO_Pos_POS}`,
          //nodeId: `ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${i}]."POS"`, //funktioniert //`ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${i}]`;

          //nodeId: `ns=3;s=Baustein_1_DB_1.STEP_POSITIONS.Pos[${i}].POS`,
          //nodeId: 'ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[1]."POS"',
          attributeId: AttributeIds.Value,
          value: {
            value: new Variant({
              dataType: DataType.Float,
              value: cleanUpObj.POS,
            }),
          },
        },
        {
          //nodeId: `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[${i}].Speed`, //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,

          nodeId: `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}].${plcNodeID_STPO_Pos_Speed}`,
          //nodeId: `ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${i}]."Speed"`, //funktioniert

          //nodeId: `ns=3;s=Baustein_1_DB_1.STEP_POSITIONS.Pos[${i}].Speed`,
          attributeId: AttributeIds.Value,
          value: {
            value: new Variant({
              dataType: DataType.Float,
              value: cleanUpObj.Speed,
            }),
          },
        },
        {
          //nodeId: `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[${i}].Acceleration`, //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,

          nodeId: `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}].${plcNodeID_STPO_Pos_Acceleration}`,
          //nodeId: `ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${i}]."Acceleration"`, //funktioniert

          //nodeId: `ns=3;s=Baustein_1_DB_1.STEP_POSITIONS.Pos[${i}].Acceleration`,
          attributeId: AttributeIds.Value,
          value: {
            value: new Variant({
              dataType: DataType.Float,
              value: cleanUpObj.Acceleration,
            }),
          },
        },
        {
          //nodeId: `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[${i}].Stroke`, //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,

          nodeId: `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}].${plcNodeID_STPO_Pos_Stroke}`, //funktioniert
          //nodeId: `ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${i}]."Stroke"`,//funktioniert

          //nodeId: `ns=3;s=Baustein_1_DB_1.STEP_POSITIONS.Pos[${i}].Stroke`,
          attributeId: AttributeIds.Value,
          value: {
            value: new Variant({
              dataType: DataType.Float,
              value: cleanUpObj.Stroke,
            }),
          },
        },
        //})
      );
      //}
      //)
      // console.log(plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE);
      // plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE =
      //   plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE + 1;
    }

    //console.log('nodesToCleanUpWrite:', nodesToCleanUpWrite);
    const statusCode_cleanUp =
      await clientSession.sessionOPCUA.write(nodesToCleanUpWrite);

    let isStatusBad = false;
    let faultStr = '';
    statusCode_cleanUp.forEach((code, index) => {
      if (code !== StatusCodes.Good) {
        console.warn(
          `❌ Fehler beim Schreiben von Index ${index}: ${code.toString()}`,
        );
        isStatusBad = true;
        faultStr += `\n❌ Fehler beim Schreiben von Index ${index}: ${code.toString()}`;
      } else {
        //console.log(`✅ 🟦 Erfolgreich geschrieben für Index ${index}`);
        //return statusCode;
      }
    });

    await disconnectOPCUA();
    return {
      success: !isStatusBad,
      details: statusCode_cleanUp.map((code, index) => ({
        index,
        status: code.toString(),
        success: code === StatusCodes.Good,
      })),
      message: isStatusBad ? faultStr : '✅ Alle Werte erfolgreich geschrieben',
    };
  } catch (err) {
    console.log('❌ Fehler beim CleanUp der Zieh-Positionen!' + err);
    throw new Error('❌ Fehler beim CleanUp der Zieh-Positionen!' + err);
  }
}

export async function writeSTEP_POSITIONStoSPS_OPCUA(writeZiehPositionenArr) {
  console.log('Bin writeSTEP_POSITIONStoSPS_OBCUA');
  console.log('writeZiehPositionenArr: ', writeZiehPositionenArr);
  //TODO: CleanUP SPS first!!!

  const plcNodeID_Strucktname = process.env.PLC_OPCUA_NODEID__STRUCKTNAME;
  const plcNodeID_RECIPE_NAME = process.env.PLC_OPCUA_NODEID__RECIPE_NAME;
  const plcNodeID_STEP_POSITIONS = process.env.PLC_OPCUA_NODEID__STEP_POSITIONS;
  const plcNodeID_STPO_Pos = process.env.PLC_OPCUA_NODEID__STPO_POS;
  const plcNodeID_STPO_Pos_POS = process.env.PLC_OPCUA_NODEID__STPO_POS_POS;
  const plcNodeID_STPO_Pos_Speed = process.env.PLC_OPCUA_NODEID__STPO_POS_SPEED;
  const plcNodeID_STPO_Pos_Acceleration =
    process.env.PLC_OPCUA_NODEID__STPO_POS_ACCELERATION;
  const plcNodeID_STPO_Pos_Stroke =
    process.env.PLC_OPCUA_NODEID__STPO_POS_STROKE;

  try {
    const clientSession = await connectClientOPCUA();
    //PLC_OPCUA_NODEID_STEP_POSITIONS_NODE_POS
    const plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS =
      process.env.PLC_OPCUA_NODEID_STEP_POSITIONS_NODE_POS;

    let nodesToWrite = [];

    //forEach item in writeZiehPositionenArr (
    let j = 1; //TODO: auslagern
    let plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE = parseFloat(
      process.env.PLC_OPCUA_STEP_POSITIONS_ARRAY_START_VALUE,
    );

    console.log(
      'type of plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE: ',
      typeof plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE,
    );

    for (let i = 0; i <= writeZiehPositionenArr.length - 1; i++) {
      nodesToWrite.push(
        {
          //nodeId: `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[${plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE}].POS`, //'ns=1;s=UNGÜLTIGER_NODE', // //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,
          nodeId: `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}].${plcNodeID_STPO_Pos_POS}`, //'ns=1;s=UNGÜLTIGER_NODE', // //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,
          attributeId: AttributeIds.Value,
          value: {
            value: new Variant({
              dataType: DataType.Float,
              value: writeZiehPositionenArr[i].POS,
            }),
          },
        },
        {
          //nodeId: `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[${plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE}].Speed`, //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,
          nodeId: `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}].${plcNodeID_STPO_Pos_Speed}`,
          attributeId: AttributeIds.Value,
          value: {
            value: new Variant({
              dataType: DataType.Float,
              value: writeZiehPositionenArr[i].Speed,
            }),
          },
        },
        {
          //nodeId: `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[${plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE}].Acceleration`, //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,
          nodeId: `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}].${plcNodeID_STPO_Pos_Acceleration}`,
          attributeId: AttributeIds.Value,
          value: {
            value: new Variant({
              dataType: DataType.Float,
              value: writeZiehPositionenArr[i].Acceleration,
            }),
          },
        },
        {
          //nodeId: `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[${plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE}].Stroke`, //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,
          nodeId: `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}].${plcNodeID_STPO_Pos_Stroke}`,
          attributeId: AttributeIds.Value,
          value: {
            value: new Variant({
              dataType: DataType.Float,
              value: writeZiehPositionenArr[i].Stroke,
            }),
          },
        },
      );

      // console.log(plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE);
      // plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE =
      //   plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE + 1; //TODO: auslagern!
    }

    const statusCode = await clientSession.sessionOPCUA.write(nodesToWrite);

    // for (let i = 0; i <= statusCode.length - 1; i++) {
    //   //TODO: gehe durch, schaue, ob gut steht, oder was anderes, wenn was anderes, schreibe das und gebe aus
    // }

    let isStatusBad = false;
    let faultStr = '';
    statusCode.forEach((code, index) => {
      if (code !== StatusCodes.Good) {
        console.warn(
          `❌ Fehler beim Schreiben von Index ${index}: ${code.toString()}`,
        );
        isStatusBad = true;
        faultStr += `\n❌ Fehler beim Schreiben von Index ${index}: ${code.toString()}`;
      } else {
        console.log(`✅ Erfolgreich geschrieben für Index ${index}`);
        //return statusCode;
      }
    });

    // isStatusBad = false; //muss irgendwann wieder genullt werden
    await disconnectOPCUA();
    return {
      success: !isStatusBad,
      details: statusCode.map((code, index) => ({
        index,
        status: code.toString(),
        success: code === StatusCodes.Good,
      })),
      message: isStatusBad ? faultStr : '✅ Alle Werte erfolgreich geschrieben',
    };

    // if (statusCode === StatusCodes.Good) {
    //   console.log('Status Code:', statusCode.toString());
    //   // console.log(Array.isArray(StatusCodes));
    //   // console.log(StatusCodes.length);
    //   console.log(
    //     `✅ Erfolgreich Zieh-Position geschrieben: --> ${statusCode}`,
    //     //`✅ Erfolgreich Zieh-Position geschrieben: ${newArr} --> ${statusCode}`,
    //   );
    // await disconnectOPCUA();
    // return statusCode;
    //return 'häää';
    // } else {
    //   console.warn('⚠️ Schreiben Zieh-Position fehlgeschlagen!', statusCode);
    // }
  } catch (err) {
    console.log('❌ Fehler beim Schreiben der Zieh-Positionen!' + err);
    throw new Error('❌ Fehler beim Schreiben der Zieh-Positionen!' + err);
  }
}

export async function writeSTEP_POSITIONStoSPS_OPCUA2(writeZiehPositionenArr) {
  console.log('Bin writeSTEP_POSITIONStoSPS_OPCUA');
  console.log('(writeZiehPositionenArr: ', writeZiehPositionenArr);
  //TODO: erst SPS clean Up machen und 0er reinschreiben, oder alle anderen Werte überschreiben!
  try {
    const clientSession = await connectClientOPCUA();
    //PLC_OPCUA_NODEID_STEP_POSITIONS_NODE_POS
    const plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS =
      process.env.PLC_OPCUA_NODEID_STEP_POSITIONS_NODE_POS; //ns=1;s=STEP_POSITIONS.Pos
    console.log(
      'plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS: ',
      plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS,
    );
    const newArr = 44; //{ POS: 22 }; //, Speed: 33, Acceleration: 44, Stroke: 55 };
    //{ POS: 22, Speed: 33, Acceleration: 44, Stroke: 55 };
    let statusCode;
    for (let i = 0; i <= writeZiehPositionenArr.length - 1; i++) {
      statusCode = await clientSession.sessionOPCUA.write({
        nodeId: `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[${i}].POS`, //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,
        attributeId: AttributeIds.Value,
        value: {
          value: new Variant({
            dataType: DataType.Float,
            value: writeZiehPositionenArr[i].POS, //newArr,
          }),
        },
      });
    }

    // const statusCode = await clientSession.sessionOPCUA.write({
    //   nodeId: `${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}[1].POS`, //'ns=1;s=STEP_POSITIONS.Pos[1].POS', //'ns=1;s=STEP_POSITIONS.Pos.Pos[1]', //`${plcOPCUA_NODEID_STEP_POSITIONS_NODE_POS}.Pos[1]`,
    //   attributeId: AttributeIds.Value,
    //   value: {
    //     value: new Variant({
    //       dataType: DataType.Float,
    //       value: newArr,
    //     }),
    //   },
    // });

    if (statusCode === StatusCodes.Good) {
      console.log('Status Code:', statusCode.toString());
      console.log(Array.isArray(StatusCodes));
      console.log(StatusCodes.length);
      console.log(
        `✅ Erfolgreich Zieh-Position geschrieben: --> ${statusCode}`,
        //`✅ Erfolgreich Zieh-Position geschrieben: ${newArr} --> ${statusCode}`,
      );
      await disconnectOPCUA();
      return statusCode;
    } else {
      console.warn('⚠️ Schreiben Zieh-Position fehlgeschlagen!', statusCode);
      throw new Error(
        '⚠️ Schreiben Zieh-Position fehlgeschlagen! ' + statusCode,
      );
    }
  } catch (err) {
    console.log('❌ Fehler beim Schreiben der Zieh-Positionen!' + err);
    throw new Error('❌ Fehler beim Schreiben der Zieh-Positionen!' + err);
  }
}

export async function writeRECIPE_NAMEtoSPS_OPCUA(recipeName) {
  console.log('Bin writeRECIPE_NAMEtoSPS_OPCUA');
  console.log('recipeName: ', recipeName);

  try {
    const clientSession = await connectClientOPCUA();
    const plcNodeID_STRUCKTNAME = process.env.PLC_OPCUA_NODEID__STRUCKTNAME;
    const plcNodeID_RECIPE_NAME = process.env.PLC_OPCUA_NODEID__RECIPE_NAME;

    const newValue = recipeName; // 'Hallo i bims!!! :) :) :) ';

    const statusCode = await clientSession.sessionOPCUA.write({
      nodeId: `${plcNodeID_STRUCKTNAME}.${plcNodeID_RECIPE_NAME}`, //plcOPCUA_RECIPE_NAME, //_RECIPE_NAME, // `ns=3;s="Baustein_1_DB_1"."RECIPE_NAME"`
      attributeId: AttributeIds.Value,
      value: {
        value: new Variant({
          dataType: DataType.String,
          value: newValue,
        }),
      },
    });

    console.log('Status Code:', statusCode.toString());
    if (statusCode === StatusCodes.Good) {
      //'Good') {
      //StatusCodes.Good) {
      console.log(`✅ Erfolgreich geschrieben: ${newValue} --> ${statusCode}`);
      await disconnectOPCUA();
      return statusCode;
    } else {
      console.warn('⚠️ Schreiben fehlgeschlagen!', statusCode);
      // await disconnectOPCUA();
      // return statusCode;
    }
  } catch (err) {
    await disconnectOPCUA();
    console.error(
      '❌ Fehler beim Schreiben in OPCUA, writeRECIPE_NAMEtoSPS_OPCUA:',
      err,
    );
    //throw new Error('❌ Fehler beim Schreiben in OPCUA: ' + err);
    throw (
      '❌ Fehler beim Schreiben in OPCUA, writeRECIPE_NAMEtoSPS_OPCUA: ' + err
    );
  }
}

// TODO: if client...
export async function readServerStatus_OPCUAtototo() {
  console.log('Bin readServerStatus_OPCUA');
  // try {
  // const client = OPCUAClient.create({
  //   endpointMustExist: false,
  // });

  // await client.connect(endpointUrl);
  // console.log('✅ Verbindung hergestellt!');

  // const session = await client.createSession();
  // console.log('📂 Session erstellt!');

  try {
    client = await getClientPLC_Connect();
    console.log('client readServerStatus_OPCUA:', client);
    session = await getClientWithSession_PLC_Connect(client);
    //const { client, session } = await createSessionOPCUA(client);
    //const { client, session } = await getClientWithSession_PLC_Connect(client);

    const nodeID_SPS_serverStatus = 'ns=0;i=2256'; // ServerStatus
    let dataValueSPS_serverStatus = await session.read({
      nodeId: nodeID_SPS_serverStatus,
      attributeId: AttributeIds.Value,
    });

    console.log(
      '📖 Gelesener Wert SPS_serverStatus:',
      dataValueSPS_serverStatus.value.value,
    );
    return dataValueSPS_serverStatus.value.value;
    //return dataValueSPS_serverStatus;
  } catch (err) {
    console.log('err bei readServerStatus_OPCUA:', err);
    //throw err;
    throw new Error();
  }
}

export async function readHeaderSpezialOPCUADatatotototot() {
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
    //throw err;
    return null;
  }
}

//---------------------------------------------------------------ALT-----------------------------------------------
// export async function readTDT_ExchangeArea() {
//   console.log('bin readTDT_ExchangeAerea');

//   const plcNodeID_Strucktname = process.env.PLC_OPCUA_NODEID__STRUCKTNAME;
//   const plcNodeID_RECIPE_NAME = process.env.PLC_OPCUA_NODEID__RECIPE_NAME;
//   const plcNodeID_STEP_POSITIONS = process.env.PLC_OPCUA_NODEID__STEP_POSITIONS;
//   const plcNodeID_STPO_Pos = process.env.PLC_OPCUA_NODEID__STPO_POS;
//   const plcNodeID_STPO_Pos_POS = process.env.PLC_OPCUA_NODEID__STPO_POS_POS;
//   const plcNodeID_STPO_Pos_Speed = process.env.PLC_OPCUA_NODEID__STPO_POS_SPEED;
//   const plcNodeID_STPO_Pos_Acceleration =
//     process.env.PLC_OPCUA_NODEID__STPO_POS_ACCELERATION;
//   const plcNodeID_STPO_Pos_Stroke =
//     process.env.PLC_OPCUA_NODEID__STPO_POS_STROKE;

//   // PLC_OPCUA_NODEID__STRUCKTNAME=ns=3;s=Baustein_1_DB_1
//   // PLC_OPCUA_NODEID__RECIPE_NAME=RECIPE_NAME
//   // PLC_OPCUA_NODEID__STEP_POSITIONS=STEP_POSITIONS
//   // PLC_OPCUA_NODEID__STPO_POS=Pos
//   // PLC_OPCUA_NODEID__STPO_POS_POS=POS
//   // PLC_OPCUA_NODEID__STPO_POS_SPEED=Speed
//   // PLC_OPCUA_NODEID__STPO_POS_ACCELERATION=Acceleration
//   // PLC_OPCUA_NODEID__STPO_POS_STROKE=Stroke

//   try {
//     const clientSession = await connectClientOPCUA();

//     const data_RECIPE_NAME = await clientSession.sessionOPCUA.read({
//       //nodeId: `ns=3;s="Baustein_1_DB_1"."RECIPE_NAME"`, //'ns=3;s=V_"Baustein_1"."RECIPE_NAME"', //plcNodeID_RECIPE_NAME,
//       //nodeId: `ns=3;s="Baustein_1_DB_1"."RECIPE_NAME"`, // funktioniert mit Simatic
//       nodeId: `${plcNodeID_Strucktname}.${plcNodeID_RECIPE_NAME}`,
//       attributeId: AttributeIds.Value,
//     });

//     console.log('**********************************************************');
//     console.log('data_RECIPE_NAME: ', data_RECIPE_NAME);

//     const dataRECIPE_NAME_Detail = await readNodeDetails(
//       clientSession.sessionOPCUA,
//       //`${plcNodeID_RECIPE_NAME}`,
//       //`ns=3;s="Baustein_1_DB_1"."RECIPE_NAME"`, //'ns=3;s=V_"Baustein_1"."RECIPE_NAME"',
//       //`ns=3;s="Baustein_1_DB_1"."RECIPE_NAME"`, // funktioniert mit Simatic
//       `${plcNodeID_Strucktname}.${plcNodeID_RECIPE_NAME}`,
//     );

//     console.log('dataRECIPE_NMAME_Deteil: ', dataRECIPE_NAME_Detail);
//     console.log('**********************************************************');

//     //------------------------------ stepPositionsArr Down ------------------------------------------------
//     // const stepPositionsArr = [];

//     // for (
//     //   let i = 0;
//     //   i <=
//     //   plcOPCUA_STEP_POSITIONS_ARRAY_SIZE -
//     //     plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE;
//     //   i++
//     // ) {
//     //   //TODO: auslagern startvalue
//     //   //const prefixArr = `ns=1;s=Pos${i}`;
//     //   //const prefixArr = `ns=3;s=STEP_POSITIONS.Pos[${i}]`;
//     //   //const prefixArr = `ns=3;s=Baustein_1.STEP_POSITIONS.Pos[${i}]`;

//     //   //const prefixArr = `ns=3;s=V_"Baustein_1"."STEP_POSITIONS".Pos[${i}]`; //TODO: funktioniert, aber auslagern!
//     //   const prefixArr = `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}]`; //TODO: funktioniert, aber auslagern!
//     //   //const prefixArr = `ns=1;s=STEP_POSITIONS.Pos[${i}]`;//TODO: funktioniert, aber auslagern!
//     //   const [pos, speed, acc, stroke] = await Promise.all([
//     //     clientSession.sessionOPCUA.read({
//     //       nodeId: `${prefixArr}.${plcNodeID_STPO_Pos_POS}`, //POS`,
//     //       attributeId: AttributeIds.Value,
//     //     }),
//     //     clientSession.sessionOPCUA.read({
//     //       nodeId: `${prefixArr}.${plcNodeID_STPO_Pos_Speed}`, //Speed`,
//     //       attributeId: AttributeIds.Value,
//     //     }),
//     //     clientSession.sessionOPCUA.read({
//     //       nodeId: `${prefixArr}.${plcNodeID_STPO_Pos_Acceleration}`, //Acceleration`,
//     //       attributeId: AttributeIds.Value,
//     //     }),
//     //     clientSession.sessionOPCUA.read({
//     //       nodeId: `${prefixArr}.${plcNodeID_STPO_Pos_Stroke}`, //Stroke`,
//     //       attributeId: AttributeIds.Value,
//     //     }),
//     //   ]);

//     //   stepPositionsArr.push({
//     //     POS: pos.value.value,
//     //     Speed: speed.value.value,
//     //     Acceleration: acc.value.value,
//     //     Stroke: stroke.value.value,
//     //   });
//     // }

//     // console.log('StepPositionsArr:', stepPositionsArr);
//     //------------------------------ stepPositionsArr UP ------------------------------------------------

//     const stepPositionsObj = {};

//     // for (let i = 1; i <= 3; i++) {
//     //   const prefixObj = `ns=1;s=Pos${i}`;
//     //   const [pos, speed, acc, stroke] = await Promise.all([
//     //     clientSession.sessionOPCUA.read({
//     //       nodeId: `${prefixObj}.POS`,
//     //       attributeId: AttributeIds.Value,
//     //     }),
//     //     clientSession.sessionOPCUA.read({
//     //       nodeId: `${prefixObj}.Speed`,
//     //       attributeId: AttributeIds.Value,
//     //     }),
//     //     clientSession.sessionOPCUA.read({
//     //       nodeId: `${prefixObj}.Acceleration`,
//     //       attributeId: AttributeIds.Value,
//     //     }),
//     //     clientSession.sessionOPCUA.read({
//     //       nodeId: `${prefixObj}.Stroke`,
//     //       attributeId: AttributeIds.Value,
//     //     }),
//     //   ]);

//     //   stepPositionsObj[`pos${i}`] = {
//     //     POS: pos.value.value,
//     //     Speed: speed.value.value,
//     //     Acceleration: acc.value.value,
//     //     Stroke: stroke.value.value,
//     //   };
//     // }

//     // console.log('StepPositionsObj:', stepPositionsObj);

//     let arrayStartIndex1 = parseFloat(
//       plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE,
//     );
//     for (
//       let i = 0;
//       i <=
//       plcOPCUA_STEP_POSITIONS_ARRAY_SIZE -
//         plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE;
//       i++
//     ) {
//       //TODO: auslagern startvalue
//       //const prefix = `ns=1;s=Pos${i}`;
//       //const prefix = `ns=3;s=Baustein_1.STEP_POSITIONS.Pos[${i}]`; //TODO: funktioniert, aber auslagern!
//       //const prefix = `ns=3;s=V_"Baustein_1"."STEP_POSITIONS".Pos[${i}]`; //TODO: funktioniert, aber auslagern!
//       const prefix = `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}]`; //TODO: funktioniert, aber auslagern!
//       //const prefix = `ns=3;s=STEP_POSITIONS.Pos[${i}]`; //TODO: funktioniert, aber auslagern!
//       //const prefix = `ns=1;s=STEP_POSITIONS.Pos[${i}]`;//TODO: funktioniert, aber auslagern!
//       const [pos, speed, acc, stroke] = await Promise.all([
//         // readValueOnly(clientSession.sessionOPCUA, `${prefix}.POS`),
//         // readValueOnly(clientSession.sessionOPCUA, `${prefix}.Speed`),
//         // readValueOnly(clientSession.sessionOPCUA, `${prefix}.Acceleration`),
//         // readValueOnly(clientSession.sessionOPCUA, `${prefix}.Stroke`),

//         readValueOnly(
//           clientSession.sessionOPCUA,
//           `${prefix}.${plcNodeID_STPO_Pos_POS}`,
//         ),
//         readValueOnly(
//           clientSession.sessionOPCUA,
//           `${prefix}.${plcNodeID_STPO_Pos_Speed}`,
//         ),
//         readValueOnly(
//           clientSession.sessionOPCUA,
//           `${prefix}.${plcNodeID_STPO_Pos_Acceleration}`,
//         ),
//         readValueOnly(
//           clientSession.sessionOPCUA,
//           `${prefix}.${plcNodeID_STPO_Pos_Stroke}`,
//         ),
//       ]);

//       stepPositionsObj[`Pos${arrayStartIndex1}`] = {
//         POS: pos,
//         Speed: speed,
//         Acceleration: acc,
//         Stroke: stroke,
//       };
//       arrayStartIndex1 = arrayStartIndex1 + 1;
//       // const pos = await readValueOnly(
//       //   clientSession.sessionOPCUA,
//       //   `${prefix}.POS`,
//       // );
//       // const speed = await readValueOnly(
//       //   clientSession.sessionOPCUA,
//       //   `${prefix}.Speed`,
//       // );
//       // const acc = await readValueOnly(
//       //   clientSession.sessionOPCUA,
//       //   `${prefix}.Acceleration`,
//       // );
//       // const stroke = await readValueOnly(
//       //   clientSession.sessionOPCUA,
//       //   `${prefix}.Stroke`,
//       // );

//       // stepPositionsObj[`Pos${arrayStartIndex1}`] = {
//       //   POS: pos,
//       //   Speed: speed,
//       //   Acceleration: acc,
//       //   Stroke: stroke,
//       // };
//       // arrayStartIndex1 = arrayStartIndex1 + 1;
//     }

//     console.log(
//       '--------------------------------------------------    ----------------------------------------------',
//     );
//     console.log('StepPositionsObj:', stepPositionsObj);
//     console.log(
//       '--------------------------------------------------    ----------------------------------------------',
//     );
//     const stepPositionsObjN = {};

//     // for (let i = 1; i <= 3; i++) {
//     //   const prefix = `ns=1;s=Pos${i}`;

//     //   const [pos, speed, acc, stroke] = await Promise.all([
//     //     readNodeDetails(clientSession.sessionOPCUA, `${prefix}.POS`),
//     //     readNodeDetails(clientSession.sessionOPCUA, `${prefix}.Speed`),
//     //     readNodeDetails(clientSession.sessionOPCUA, `${prefix}.Acceleration`),
//     //     readNodeDetails(clientSession.sessionOPCUA, `${prefix}.Stroke`),
//     //   ]);

//     //   stepPositionsObjN[`pos${i}`] = {
//     //     POS: pos,
//     //     Speed: speed,
//     //     Acceleration: acc,
//     //     Stroke: stroke,
//     //   };
//     // }
//     //funktioniert, aber fragt einzeln nacheinander und nicht gleichzeitig alle 4[i]
//     // let arrayStartIndex = parseFloat(plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE);
//     // for (
//     //   let i = 0;
//     //   i <=
//     //   plcOPCUA_STEP_POSITIONS_ARRAY_SIZE -
//     //     plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE;
//     //   i++
//     // ) {
//     //   //TODO: auslagern startvalue
//     //   //TODO: auslagern startvalue
//     //   //const prefix = `ns=1;s=Pos${i}`;
//     //   //const prefix = `ns=3;s=Baustein_1.STEP_POSITIONS.Pos[${i}]`; //TODO: funktioniert, aber auslagern!
//     //   //const prefix = `ns=3;s=V_"Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${i}]`; //TODO: funktioniert, aber auslagern!
//     //   const prefix = `ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${i}]`; //TODO: funktioniert, aber auslagern!
//     //   //const prefix = `ns=3;s=STEP_POSITIONS.Pos[${i}]`; //TODO: funktioniert, aber auslagern!
//     //   //const prefix = `ns=1;s=STEP_POSITIONS.Pos[${i}]`;//TODO: funktioniert, aber auslagern!

//     //   const pos = await readNodeDetails(
//     //     clientSession.sessionOPCUA,
//     //     `${prefix}."POS"`,
//     //   );
//     //   //console.log(`${prefix}."POS"`);
//     //   //console.log('pos: ', pos);
//     //   const speed = await readNodeDetails(
//     //     clientSession.sessionOPCUA,
//     //     `${prefix}."Speed"`,
//     //   );
//     //   const acc = await readNodeDetails(
//     //     clientSession.sessionOPCUA,
//     //     `${prefix}."Acceleration"`,
//     //   );
//     //   const stroke = await readNodeDetails(
//     //     clientSession.sessionOPCUA,
//     //     `${prefix}."Stroke"`,
//     //   );
//     //   //startet bei arrayStart
//     //   stepPositionsObjN[`Pos${i + plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE}`] =
//     //     {
//     //       POS: pos,
//     //       Speed: speed,
//     //       Acceleration: acc,
//     //       Stroke: stroke,
//     //     };
//     //   arrayStartIndex = arrayStartIndex + 1;
//     // }

//     let arrayStartIndex = parseFloat(plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE);

//     for (
//       let i = 0;
//       i <=
//       plcOPCUA_STEP_POSITIONS_ARRAY_SIZE -
//         plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE;
//       i++
//     ) {
//       //const prefix = `ns=3;s="Baustein_1_DB_1"."STEP_POSITIONS"."Pos"[${i}]`;
//       const prefix = `${plcNodeID_Strucktname}.${plcNodeID_STEP_POSITIONS}.${plcNodeID_STPO_Pos}[${i}]`;

//       // Alle 4 Werte gleichzeitig anfragen (werden als Promises gespeichert)
//       const posPromise = readNodeDetails(
//         clientSession.sessionOPCUA,
//         `${prefix}.${plcNodeID_STPO_Pos_POS}`, //"POS"`,
//       );
//       const speedPromise = readNodeDetails(
//         clientSession.sessionOPCUA,
//         `${prefix}.${plcNodeID_STPO_Pos_Speed}`, //"Speed"`,
//       );
//       const accPromise = readNodeDetails(
//         clientSession.sessionOPCUA,
//         `${prefix}.${plcNodeID_STPO_Pos_Acceleration}`, //"Acceleration"`,
//       );
//       const strokePromise = readNodeDetails(
//         clientSession.sessionOPCUA,
//         `${prefix}.${plcNodeID_STPO_Pos_Stroke}`, //"Stroke"`,
//       );

//       // Jetzt auf alle 4 gleichzeitig warten:
//       const [pos, speed, acc, stroke] = await Promise.all([
//         posPromise,
//         speedPromise,
//         accPromise,
//         strokePromise,
//       ]);

//       // Werte ins Objekt schreiben
//       stepPositionsObjN[`Pos${i + plcOPCUA_STEP_POSITIONS_ARRAY_START_VALUE}`] =
//         {
//           POS: pos,
//           Speed: speed,
//           Acceleration: acc,
//           Stroke: stroke,
//         };

//       arrayStartIndex = arrayStartIndex + 1;
//     }

//     //console.log('StepPositionsObjN:', stepPositionsObjN);
//     console.log(
//       '--------------------------------------------------    ----------------------------------------------',
//     );
//     //console.log('StepPositionsObjN:', JSON.stringify(stepPositionsObjN));

//     const data_TDT_ExchangeArea = {
//       data_RECIPE_NAME: data_RECIPE_NAME,
//       dataRECIPE_NAME_Detail: dataRECIPE_NAME_Detail,
//       //stepPositionsArr: stepPositionsArr,
//       stepPositionsObj: stepPositionsObj,
//       stepPositionsObjN: stepPositionsObjN,
//     };

//     await disconnectOPCUA();

//     // console.log('data_RECIPE_NAME:', data_RECIPE_NAME);
//     // console.log('data_STEP_POSITIONS:', data_STEP_POSITIONS);
//     //const data_TDT_ExchangeArea = { data_RECIPE_NAME, data_STEP_POSITIONS };
//     //return data_RECIPE_NAME;
//     return data_TDT_ExchangeArea;
//   } catch (err) {
//     console.log('Fehler bei readTDT_ExchangeArea: ', err);
//     throw err;
//   }
// }
