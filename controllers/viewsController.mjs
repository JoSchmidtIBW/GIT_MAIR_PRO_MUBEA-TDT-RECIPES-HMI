import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';
import { decryptPassword } from '../utils/crypto.mjs';
import { execAsyncPing } from '../utils/execAsyncPing.mjs';

import { DataType } from 'node-opcua-variant'; //console.log("Type:", DataType[dataValue.value.dataType]); // => "String"

import {
  readPLC_RECIPE_NAME,
  readServerStatus_OPCUA,
  readTDT_ExchangeArea,
  //readPLC_Status_OPCUA,
  readSimaticStatus,
  readPLC_Informations,
} from '../models/services/sps_OPCUA_Service.mjs';

import { disconnectOPCUA } from '../models/sps_OPCUA_Connector.mjs';

import {
  readDataBySymbolName,
  readDataAll_GVL,
  readDataUploadInfo,
  readDataDeviceInfo,
  readDataSymbolVersion,
  readDataPlcRuntimeState,
} from '../models/services/spsService.mjs';

import {
  getFindRecipesTDTtoLoad,
  getFindRecipeTDT_deByID,
  getFindOneRecipeByDetails,
} from '../models/services/recipesTDT_de_Service.mjs';

import {
  getAllUsers,
  getFindUserByID,
} from '../models/services/userService.mjs';

import {
  getFindAllRecipesSendSPSLog,
  getFindAllRecipesSendSPSLogByUserID,
} from '../models/services/recipeSendSPSLog_de_Service.mjs';

import { getFindAllRecipeStatistics } from '../models/services/recipeStatistic_de_Service.mjs';

export const getStart = catchAsync(async (req, res, next) => {
  res.status(200).render('start', {
    title: 'Start',
  });
});

export const getAccount = (req, res) => {
  if (req.user.language === 'de') {
    res.status(200).render('account_de', {
      title: 'Dein Konto',
      user: req.user,
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('account_cs', {
      title: 'Váš účet',
      user: req.user,
    });
  } else {
    res.status(200).render('account', {
      title: 'Your account',
      user: req.user,
    });
  }
};

export const getTxt_Xml_FileUploader = catchAsync(async (req, res, next) => {
  if (req.user.language === 'de') {
    res.status(200).render('txt_xml_FileUploader_de', {
      title: '.txt- .xml- FileUploader',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('txt_xml_FileUploader_cs', {
      title: '.txt- .xml- FileUploader',
    });
  } else {
    res.status(200).render('txt_xml_FileUploader', {
      title: '.txt- .xml- FileUploader',
    });
  }
});

export const getCreateRecipeOverview = catchAsync(async (req, res, next) => {
  if (req.user.language === 'de') {
    res.status(200).render('createRecipeOverview_de', {
      title: 'Rezepterstellungs- Übersicht',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('createRecipeOverview_cs', {
      title: 'Přehled tvorby receptů',
    });
  } else {
    res.status(200).render('createRecipeOverview', {
      title: 'createRecipeOverview',
    });
  }
});

export const getCreate2_St_2_BSB = catchAsync(async (req, res, next) => {
  if (req.user.language === 'de') {
    res.status(200).render('create2_St_2_BSB_de', {
      title: 'erstellung_2_St_2_BSB',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('create2_St_2_BSB_cs', {
      title: 'vytváření_2_St_2_BSB',
    });
  } else {
    res.status(200).render('create2_St_2_BSB', {
      title: 'create2_St_2_BSB',
    });
  }
});

export const getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render('login_cs', {
    title: 'Přihlášení',
  });
});

export const getMyRecipeSend = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  let myRecipeSendAll = await getFindAllRecipesSendSPSLogByUserID(userID);

  if (!myRecipeSendAll) {
    myRecipeSendAll = 'No Data';
  }

  if (req.user.language === 'de') {
    res.status(200).render('myRecipeSend_de', {
      title: 'Meine Aufträge',
      data: myRecipeSendAll,
      userID: userID,
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('myRecipeSend_cs', {
      title: 'Moje zakázky',
      data: myRecipeSendAll,
      userID: userID,
    });
  } else {
    res.status(200).render('myRecipeSend', {
      title: 'My Orders',
      data: myRecipeSendAll,
      userID: userID,
    });
  }
});

export const getRecipeStatistic = catchAsync(async (req, res, next) => {
  let resipeStatisticsAll_Arr = await getFindAllRecipeStatistics();
  console.log('resipeStatisticsAll.length: ', resipeStatisticsAll_Arr.length);

  if (resipeStatisticsAll_Arr.length === 0) {
    resipeStatisticsAll_Arr = [];
  }

  if (req.user.language === 'de') {
    res.status(200).render('recipeStatistic_de', {
      title: 'Rezept-Statistik',
      data: resipeStatisticsAll_Arr, //JSON.stringify(resipesSPS, 2, null),
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('recipeStatistic_cs', {
      title: 'Receptní-statistika',
      data: resipeStatisticsAll_Arr, //JSON.stringify(resipesSPS, 2, null),
    });
  } else {
    res.status(200).render('recipeStatistic', {
      title: 'Recipe-Statistic',
      data: resipeStatisticsAll_Arr, //JSON.stringify(resipesSPS, 2, null),
    });
  }
});

export const getRecipesSendSPSLog = catchAsync(async (req, res, next) => {
  let resipesSendSPSLogAll = await getFindAllRecipesSendSPSLog();

  if (resipesSendSPSLogAll.length === 0) {
    resipesSendSPSLogAll = [];
  }

  if (req.user.language === 'de') {
    res.status(200).render('recipesSendSPSLog_de', {
      title: 'Rezept-SPS-Sendeverlauf',
      data: resipesSendSPSLogAll, //JSON.stringify(resipesSPS, 2, null),
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('recipesSendSPSLog_cs', {
      title: 'Historie odeslání receptu do SPS',
      data: resipesSendSPSLogAll, //JSON.stringify(resipesSPS, 2, null),
    });
  } else {
    res.status(200).render('recipesSendSPSLog', {
      title: 'Recipe-PLC-send-history',
      data: resipesSendSPSLogAll, //JSON.stringify(resipesSPS, 2, null),
    });
  }
});

//TODO: SPS- Werte laden in gesendetes Rezept!!!
export const getOverviewInlogt = catchAsync(async (req, res, next) => {
  console.log('Bin viewController...getOverviewInlogt');
  let recipesTDT = await getFindRecipesTDTtoLoad();

  // const gvl_vCsvName = 'GVL.vCsvName';
  // const gvl_vCsvName = process.env.PLC_GVL_VCSVNAME;
  // console.log('gvl_vCsvName:', gvl_vCsvName);

  // //PLC_OPCUA_NODEID__STRUCKTNAME=ns=3;s="Baustein_1_DB_1"
  // const plc_OPCUA_STRUCKTNAME = process.env.PLC_OPCUA_NODEID__STRUCKTNAME;
  // //PLC_OPCUA_NODEID__RECIPE_NAME="RECIPE_NAME"#`ns=3;s="Baustein_1_DB_1"."RECIPE_NAME"`
  // const plc_OPCUA_RECIPE_NAME = process.env.PLC_OPCUA_NODEID__RECIPE_NAME;
  // const plc_OPCUA_STRUCKTNAME_RECIPE_NAME = `${plc_OPCUA_STRUCKTNAME}.${plc_OPCUA_RECIPE_NAME}`;

  let loadedSPS_recipe_vCsvName = '';

  let loadedSPS_OPCUA_RECIPE_NAME = '';
  let loadedPLC_OPCUA_RECIPE_NAME = '';

  let loadedSPS_recipe;
  let artikelNummerLoad;
  let [, artikelInfo] = ['', '']; // = loadedSPS_recipe.split('>');
  try {
    //loadedSPS_recipe_vCsvName = await readDataBySymbolName(gvl_vCsvName);

    loadedSPS_OPCUA_RECIPE_NAME = await readPLC_RECIPE_NAME(); // readDataBySymbolName(gvl_vCsvName);
    console.log('loadedSPS_OPCUA_RECIPE_NAME: ', loadedSPS_OPCUA_RECIPE_NAME);
    console.log(
      'loadedSPS_OPCUA_RECIPE_NAME.value.value: ',
      loadedSPS_OPCUA_RECIPE_NAME.value.value,
    );

    if (loadedSPS_OPCUA_RECIPE_NAME.value.value === null) {
      loadedPLC_OPCUA_RECIPE_NAME = '';
    } else {
      loadedPLC_OPCUA_RECIPE_NAME = loadedSPS_OPCUA_RECIPE_NAME.value.value;
    }

    console.log(
      '----> loadedPLC_OPCUA_RECIPE_NAME: ',
      loadedPLC_OPCUA_RECIPE_NAME,
    );

    // loadedSPS_recipe = loadedSPS_recipe_vCsvName.value;
    // console.log('loadedSPS_recipe: ' + loadedSPS_recipe);

    artikelNummerLoad = loadedPLC_OPCUA_RECIPE_NAME.split(' >')[0];
    console.log('artikelNummerLoad : ', artikelNummerLoad);
    [, artikelInfo] = loadedPLC_OPCUA_RECIPE_NAME.split('>');
    if (loadedPLC_OPCUA_RECIPE_NAME.includes(' >')) {
      artikelNummerLoad = loadedPLC_OPCUA_RECIPE_NAME.split(' >')[0];
      [, artikelInfo] = loadedPLC_OPCUA_RECIPE_NAME.split('>');
      //[artikelNummerLoad, artikelInfo] = loadedSPS_recipe.split(' >');
    } else {
      artikelNummerLoad = loadedPLC_OPCUA_RECIPE_NAME; // Falls kein " >" enthalten ist, wird der gesamte String als artikelNummerLoad gesetzt
      artikelInfo = '';
      console.log('artikelInfo_:', artikelInfo);
    }
  } catch (error) {
    loadedPLC_OPCUA_RECIPE_NAME =
      'Fehler beim Lesen readPLC_RECIPE_NAME' + error;
    console.error(error.message);
    //loadedSPS_recipe = 'Fehler beim Lesen readDataBySymbolName' + error;
    loadedPLC_OPCUA_RECIPE_NAME =
      'Fehler beim Lesen readPLC_RECIPE_NAME' + error;
    //console.error(error.message);
  }

  //loadedSPS_recipe_vCsvName = await readDataBySymbolName(gvl_vCsvName);
  // console.log(
  //   'JSON.stringify(loadedSPS_recipe_vCsvName): ' +
  //     JSON.stringify(loadedSPS_recipe_vCsvName),
  // );

  console.log(
    'JSON.stringify(loadedPLC_OPCUA_RECIPE_NAME): ' +
      JSON.stringify(loadedPLC_OPCUA_RECIPE_NAME),
  );

  // console.log('loadedSPS_recipe_vCsvName: ' + loadedSPS_recipe_vCsvName);
  // let loadedSPS_recipe = loadedSPS_recipe_vCsvName.value;
  // console.log('loadedSPS_recipe: ' + loadedSPS_recipe);

  // const artikelNummerLoad = loadedPLC_OPCUA_RECIPE_NAME.split(' >')[0];
  // console.log('artikelNummerLoad: ' + artikelNummerLoad);
  // const artikelNameLoad = loadedSPS_recipe.split('-')[]

  //const [, artikelInfo] = loadedPLC_OPCUA_RECIPE_NAME.split('>');
  [, artikelInfo] = loadedPLC_OPCUA_RECIPE_NAME.split('>');
  console.log('artikelInfo_ [, artikelInfo]:', [, artikelInfo]);
  console.log('artikelInfo______:', artikelInfo);
  if (artikelInfo === undefined) {
    artikelInfo = '';
  }
  console.log('artikelInfo______****:', artikelInfo);

  //loadedSPS_recipe: 10186190 > 23.60x4.10-3.00 - 1470mm-8000mm-7-15m/min 14.07.2025:09.41
  //                  10188735 > 18.10x2.25-1.85 - 1572mm-8730mm-7-15m/min -1-30- 100›|‹100 - 13.08.2025:07.53

  // const regex =
  //   /([\d.x\-]+) - (\d+)mm-(\d+)mm-(\d+)-([\d.]+)m\/min (\d{2}\.\d{2}\.\d{4}):(\d{2}\.\d{2})/;

  let isFindInDB = '';
  const regex =
    /([\d.x\-]+) - (\d+)mm-(\d+)mm-(\d+)-([\d.]+)m\/min(?: -(\d+)-(\d+)-\s*(\d+›\|‹\d+))? - (\d{2}\.\d{2}\.\d{4}):(\d{2}\.\d{2})/;

  const match = artikelInfo.match(regex);

  let artikelNameLoad = '';
  let fixLaengeLoad = '';
  let mehrfachLaengeLoad = '';
  let anzahlFixLaengenLoad = '';
  let ziehGeschwindigkeitLoad = '';
  // let datumLoad = '';
  // let uhrzeitLoad = '';

  if (match) {
    artikelNameLoad = match[1];
    fixLaengeLoad = match[2];
    mehrfachLaengeLoad = match[3];
    anzahlFixLaengenLoad = match[4];
    ziehGeschwindigkeitLoad = match[5];
    // "zusatz1": "1",
    // "zusatz2": "30",
    // "zusatz3": "100›|‹100",
    // datumLoad = match[6];
    // uhrzeitLoad = match[7];

    // console.log('artikelNummerLoad: ' + artikelNummerLoad);
    // console.log('ArtikelnameLoad:', artikelNameLoad);
    // console.log('FixlängeLoad:', fixLaengeLoad);
    // console.log('MehrfachlängeLoad:', mehrfachLaengeLoad);
    // console.log('Anzahl FixlängenLoad:', anzahlFixLaengenLoad);
    // console.log('ZiehgeschwindigkeitLoad:', ziehGeschwindigkeitLoad);
    // console.log('DatumLoad:', datumLoad);
    // console.log('UhrzeitLoad:', uhrzeitLoad);
  } else {
    console.log('Format nicht erkannt!');
    isFindInDB = ' !!! - Nicht in DB gefunden - !!!';
  }

  const recipeDetails = {
    artikelNummer: Number(artikelNummerLoad),
    //artikelName: artikelNameLoad,
    ziehGeschwindigkeit: ziehGeschwindigkeitLoad,
    fixLaenge: Number(fixLaengeLoad),
    mehrfachlaenge: Number(mehrfachLaengeLoad),
    anzahlFixlaengenProMehrfachlaenge: Number(anzahlFixLaengenLoad),
  };

  // const recipefindLoadedinSPSinDB =
  //   await getFindOneRecipeByDetails(recipeDetails);

  let recipefindLoadedinSPSinDB;

  try {
    recipefindLoadedinSPSinDB = await getFindOneRecipeByDetails(recipeDetails);
  } catch (err) {
    recipefindLoadedinSPSinDB = false;
    isFindInDB = ' !!! - Nicht in DB gefunden - !!!';
  }

  if (recipefindLoadedinSPSinDB) {
    //console.log('recipefindLoadedinSPSinDB:', recipefindLoadedinSPSinDB);
    // console.log(
    //   'recipefindLoadedinSPSinDB:',
    //   JSON.stringify(recipefindLoadedinSPSinDB, null, 2),
    // );
    isFindInDB = ' -';
  } else {
    console.log('Kein Rezept gefunden.');
    isFindInDB = ' !!! - Nicht in DB gefunden - !!!';
  }
  console.log('isFindInDB: ' + isFindInDB);

  if (
    loadedPLC_OPCUA_RECIPE_NAME === '' ||
    isFindInDB === ' !!! - Nicht in DB gefunden - !!!' ||
    artikelNummerLoad.length !== 8
  ) {
    loadedPLC_OPCUA_RECIPE_NAME =
      loadedPLC_OPCUA_RECIPE_NAME +
      ' - Es wurde kein Rezept auf die SPS geladen!';
  }

  //console.log('recipesTDT: ' + recipesTDT);
  //console.log('recipesTDT:', JSON.stringify(recipesTDT, null, 2));

  //TODO: überprüfen ob nicht eine Fehlermeldung kommen soll
  if (recipesTDT.length === 0) {
    recipesTDT = 'Es sind keine Daten gefunden worden';
  }

  if (req.user.language === 'de') {
    res.status(200).render('overviewInlogt_de', {
      title: 'overviewIN',
      data: recipesTDT,
      dataSPS: loadedPLC_OPCUA_RECIPE_NAME,
      // ? loadedSPS_recipe
      // : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',

      recipefindLoadedinSPSinDB: JSON.stringify(
        recipefindLoadedinSPSinDB,
        null,
        2,
      ), //recipefindLoadedinSPSinDB,

      // recipefindLoadedinSPSinDB: JSON.stringify(
      //   recipefindLoadedinSPSinDB,
      //   (key, value) => {
      //     if (typeof value === 'number') {
      //       return Number(value.toFixed(2)); //Number(value.toFixed(2)); // Oder String(value.toFixed(2)) wenn du "1.00" sehen willst
      //     }
      //     return value;
      //   },
      //   2,
      // ),

      isFindInDB: isFindInDB,
      user: req.user,
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('overviewInlogt_cs', {
      title: 'overviewIN',
      data: recipesTDT,
      dataSPS: loadedPLC_OPCUA_RECIPE_NAME, //loadedSPS_recipe,
      // ? loadedSPS_recipe
      // : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      recipefindLoadedinSPSinDB: JSON.stringify(
        recipefindLoadedinSPSinDB,
        null,
        2,
      ), //recipefindLoadedinSPSinDB,
      isFindInDB: isFindInDB,
      user: req.user,
    });
  } else {
    res.status(200).render('overviewInlogt', {
      title: 'overviewIN',
      data: recipesTDT,
      dataSPS: loadedPLC_OPCUA_RECIPE_NAME, //loadedSPS_recipe,
      // ? loadedSPS_recipe
      // : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      recipefindLoadedinSPSinDB: JSON.stringify(
        recipefindLoadedinSPSinDB,
        null,
        2,
      ), //recipefindLoadedinSPSinDB,
      isFindInDB: isFindInDB,
      user: req.user,
    });
  }
});
export const getOverview = catchAsync(async (req, res, next) => {
  console.log('bin getOverviewNotInlogt');
  let recipesTDT_NotInlogt = await getFindRecipesTDTtoLoad();
  console.log(req.user);

  //const gvl_vCsvName_NotInlogt = 'GVL.vCsvName';
  // const gvl_vCsvName_NotInlogt = process.env.PLC_GVL_VCSVNAME;
  // console.log('gvl_vCsvName_NotInlogt:', gvl_vCsvName_NotInlogt);

  let loadedSPS_recipe_vCsvName = '';

  let loadedSPS_OPCUA_RECIPE_NAME_NotInlogt = '';
  let loadedPLC_OPCUA_RECIPE_NAME_NotInlogt = '';

  // let loadedSPS_recipe_NotInlogt;
  // let artikelNummerLoad_NotInlogt;
  // let [, artikelInfo_NotInlogt] = ['', '']; // = loadedSPS_recipe.split('>');

  let loadedSPS_recipe_vCsvName_NotInlogt = '';
  let loadedSPS_recipe_NotInlogt;
  let artikelNummerLoad_NotInlogt;
  let [, artikelInfo_NotInlogt] = ['', '']; // = loadedSPS_recipe.split('>');

  try {
    loadedSPS_OPCUA_RECIPE_NAME_NotInlogt = await readPLC_RECIPE_NAME(); // readDataBySymbolName(gvl_vCsvName);
    console.log(
      'loadedSPS_OPCUA_RECIPE_NAME_NotInlogt: ',
      loadedSPS_OPCUA_RECIPE_NAME_NotInlogt,
    );
    console.log(
      'loadedSPS_OPCUA_RECIPE_NAME_NotInlogt.value.value: ',
      loadedSPS_OPCUA_RECIPE_NAME_NotInlogt.value.value,
    );

    if (loadedSPS_OPCUA_RECIPE_NAME_NotInlogt.value.value === null) {
      loadedPLC_OPCUA_RECIPE_NAME_NotInlogt = '';
    } else {
      loadedPLC_OPCUA_RECIPE_NAME_NotInlogt =
        loadedSPS_OPCUA_RECIPE_NAME_NotInlogt.value.value;
    }

    console.log(
      '----> loadedPLC_OPCUA_RECIPE_NAME_NotInlogt: ',
      loadedPLC_OPCUA_RECIPE_NAME_NotInlogt,
    );

    artikelNummerLoad_NotInlogt =
      loadedPLC_OPCUA_RECIPE_NAME_NotInlogt.split(' >')[0];
    console.log('artikelNummerLoad_NotInlogt : ', artikelNummerLoad_NotInlogt);
    [, artikelInfo_NotInlogt] =
      loadedPLC_OPCUA_RECIPE_NAME_NotInlogt.split('>');
    if (loadedPLC_OPCUA_RECIPE_NAME_NotInlogt.includes(' >')) {
      artikelNummerLoad_NotInlogt =
        loadedPLC_OPCUA_RECIPE_NAME_NotInlogt.split(' >')[0];
      [, artikelInfo_NotInlogt] =
        loadedPLC_OPCUA_RECIPE_NAME_NotInlogt.split('>');
    } else {
      artikelNummerLoad_NotInlogt = loadedPLC_OPCUA_RECIPE_NAME_NotInlogt; // Falls kein " >" enthalten ist, wird der gesamte String als artikelNummerLoad gesetzt
      artikelInfo_NotInlogt = '';
      console.log('artikelInfo__NotInlogt:', artikelInfo_NotInlogt);
    }
  } catch (error) {
    loadedPLC_OPCUA_RECIPE_NAME_NotInlogt =
      'Fehler beim Lesen readPLC_RECIPE_NAME_NotInlogt' + error;
    console.error(error.message);
    loadedPLC_OPCUA_RECIPE_NAME_NotInlogt =
      'Fehler beim Lesen readPLC_RECIPE_NAME_NotInlogt' + error;
  }

  console.log(
    'JSON.stringify(loadedPLC_OPCUA_RECIPE_NAME_NotInlogt): ' +
      JSON.stringify(loadedPLC_OPCUA_RECIPE_NAME_NotInlogt),
  );

  [, artikelInfo_NotInlogt] = loadedPLC_OPCUA_RECIPE_NAME_NotInlogt.split('>');
  console.log('artikelInfo__NotInlogt [, artikelInfo_NotInlogt]:', [
    ,
    artikelInfo_NotInlogt,
  ]);
  console.log('artikelInfo_______NotInlogt:', artikelInfo_NotInlogt);
  if (artikelInfo_NotInlogt === undefined) {
    artikelInfo_NotInlogt = '';
  }
  console.log('artikelInfo_______NotInlogt****:', artikelInfo_NotInlogt);

  let isFindInDB_NotInlogt = '';
  const regex_NotInlogt =
    /([\d.x\-]+) - (\d+)mm-(\d+)mm-(\d+)-([\d.]+)m\/min(?: -(\d+)-(\d+)-\s*(\d+›\|‹\d+))? - (\d{2}\.\d{2}\.\d{4}):(\d{2}\.\d{2})/;

  const match_NotInlogt = artikelInfo_NotInlogt.match(regex_NotInlogt);

  let artikelNameLoad_NotInlogt = '';
  let fixLaengeLoad_NotInlogt = '';
  let mehrfachLaengeLoad_NotInlogt = '';
  let anzahlFixLaengenLoad_NotInlogt = '';
  let ziehGeschwindigkeitLoad_NotInlogt = '';
  // let datumLoad = '';
  // let uhrzeitLoad = '';

  if (match_NotInlogt) {
    artikelNameLoad_NotInlogt = match_NotInlogt[1];
    fixLaengeLoad_NotInlogt = match_NotInlogt[2];
    mehrfachLaengeLoad_NotInlogt = match_NotInlogt[3];
    anzahlFixLaengenLoad_NotInlogt = match_NotInlogt[4];
    ziehGeschwindigkeitLoad_NotInlogt = match_NotInlogt[5];
    // "zusatz1": "1",
    // "zusatz2": "30",
    // "zusatz3": "100›|‹100",
    // datumLoad = match[6];
    // uhrzeitLoad = match[7];

    // console.log('artikelNummerLoad: ' + artikelNummerLoad);
    // console.log('ArtikelnameLoad:', artikelNameLoad);
    // console.log('FixlängeLoad:', fixLaengeLoad);
    // console.log('MehrfachlängeLoad:', mehrfachLaengeLoad);
    // console.log('Anzahl FixlängenLoad:', anzahlFixLaengenLoad);
    // console.log('ZiehgeschwindigkeitLoad:', ziehGeschwindigkeitLoad);
    // console.log('DatumLoad:', datumLoad);
    // console.log('UhrzeitLoad:', uhrzeitLoad);
  } else {
    console.log('Format nicht erkannt!');
    isFindInDB_NotInlogt = ' !!! - Nenalezen v databázi - !!!';
  }

  const recipeDetails_NotInlogt = {
    artikelNummer: Number(artikelNummerLoad_NotInlogt),
    //artikelName: artikelNameLoad,
    ziehGeschwindigkeit: ziehGeschwindigkeitLoad_NotInlogt,
    fixLaenge: Number(fixLaengeLoad_NotInlogt),
    mehrfachlaenge: Number(mehrfachLaengeLoad_NotInlogt),
    anzahlFixlaengenProMehrfachlaenge: Number(anzahlFixLaengenLoad_NotInlogt),
  };

  let recipefindLoadedinSPSinDB_NotInlogt;

  try {
    recipefindLoadedinSPSinDB_NotInlogt = await getFindOneRecipeByDetails(
      recipeDetails_NotInlogt,
    );
  } catch (err) {
    recipefindLoadedinSPSinDB_NotInlogt = false;
    isFindInDB_NotInlogt = ' !!! - Nenalezen v databázi - Zkusit znovu - !!!';
  }

  if (recipefindLoadedinSPSinDB_NotInlogt) {
    //console.log('recipefindLoadedinSPSinDB:', recipefindLoadedinSPSinDB);
    // console.log(
    //   'recipefindLoadedinSPSinDB:',
    //   JSON.stringify(recipefindLoadedinSPSinDB, null, 2),
    // );
    isFindInDB_NotInlogt = ' -';
  } else {
    console.log('Kein Rezept gefunden.');
    isFindInDB_NotInlogt = ' !!! - Nenalezen v databázi - Zkusit znovu - !!!';
  }
  console.log('isFindInDB: ' + isFindInDB_NotInlogt);

  if (
    loadedPLC_OPCUA_RECIPE_NAME_NotInlogt === '' ||
    isFindInDB_NotInlogt ===
      ' !!! - Nenalezen v databázi - Zkusit znovu - !!!' ||
    artikelNummerLoad_NotInlogt.length !== 8
  ) {
    loadedPLC_OPCUA_RECIPE_NAME_NotInlogt =
      loadedPLC_OPCUA_RECIPE_NAME_NotInlogt +
      ' - Do PLC nebyl nahrán žádný recept!';
  }

  if (recipesTDT_NotInlogt.length === 0) {
    recipesTDT_NotInlogt = 'Nenalezena žádná data';
  }

  // try {
  //   loadedSPS_recipe_vCsvName_NotInlogt = await readDataBySymbolName(
  //     gvl_vCsvName_NotInlogt,
  //   );
  //   loadedSPS_recipe_NotInlogt = loadedSPS_recipe_vCsvName_NotInlogt.value;
  //   console.log('loadedSPS_recipe_NotInlogt: ' + loadedSPS_recipe_NotInlogt);

  //   artikelNummerLoad_NotInlogt = loadedSPS_recipe_NotInlogt.split(' >')[0];
  //   [, artikelInfo_NotInlogt] = loadedSPS_recipe_NotInlogt.split('>');
  //   if (loadedSPS_recipe_NotInlogt.includes(' >')) {
  //     artikelNummerLoad_NotInlogt = loadedSPS_recipe_NotInlogt.split(' >')[0];
  //     [, artikelInfo_NotInlogt] = loadedSPS_recipe_NotInlogt.split('>');
  //     //[artikelNummerLoad, artikelInfo] = loadedSPS_recipe.split(' >');
  //   } else {
  //     artikelNummerLoad_NotInlogt = loadedSPS_recipe_NotInlogt; // Falls kein " >" enthalten ist, wird der gesamte String als artikelNummerLoad gesetzt
  //     artikelInfo_NotInlogt = ''; // artikelInfo bleibt leer
  //   }
  // } catch (error) {
  //   loadedSPS_recipe_vCsvName_NotInlogt =
  //     'Fehler beim Lesen readDataBySymbolName' + error;
  //   console.error(error.message);
  //   loadedSPS_recipe_NotInlogt =
  //     'Fehler beim Lesen readDataBySymbolName' + error;
  //   //console.error(error.message);
  // }

  // //loadedSPS_recipe_vCsvName = await readDataBySymbolName(gvl_vCsvName);
  // console.log(
  //   'JSON.stringify(loadedSPS_recipe_vCsvName_NotInlogt): ' +
  //     JSON.stringify(loadedSPS_recipe_vCsvName_NotInlogt),
  // );

  // console.log(
  //   'loadedSPS_recipe_vCsvName_NotInlogt: ' +
  //     loadedSPS_recipe_vCsvName_NotInlogt,
  // );
  // // let loadedSPS_recipe = loadedSPS_recipe_vCsvName.value;
  // // console.log('loadedSPS_recipe: ' + loadedSPS_recipe);

  // //const artikelNummerLoad = loadedSPS_recipe.split(' >')[0];
  // console.log('artikelNummerLoad_NotInlogt: ' + artikelNummerLoad_NotInlogt);
  // // const artikelNameLoad = loadedSPS_recipe.split('-')[]

  // //const [, artikelInfo] = loadedSPS_recipe.split('>');
  // //[, artikelInfo] = loadedSPS_recipe.split('>');

  // const regex_NotInlogt =
  //   /([\d.x\-]+) - (\d+)mm-(\d+)mm-(\d+)-([\d.]+)m\/min (\d{2}\.\d{2}\.\d{4}):(\d{2}\.\d{2})/;
  // const match_NotInlogt = artikelInfo_NotInlogt.match(regex_NotInlogt);

  // let artikelNameLoad_NotInlogt = '';
  // let fixLaengeLoad_NotInlogt = '';
  // let mehrfachLaengeLoad_NotInlogt = '';
  // let anzahlFixLaengenLoad_NotInlogt = '';
  // let ziehGeschwindigkeitLoad_NotInlogt = '';
  // let datumLoad_NotInlogt = '';
  // let uhrzeitLoad_NotInlogt = '';

  // if (match_NotInlogt) {
  //   artikelNameLoad_NotInlogt = match_NotInlogt[1];
  //   fixLaengeLoad_NotInlogt = match_NotInlogt[2];
  //   mehrfachLaengeLoad_NotInlogt = match_NotInlogt[3];
  //   anzahlFixLaengenLoad_NotInlogt = match_NotInlogt[4];
  //   ziehGeschwindigkeitLoad_NotInlogt = match_NotInlogt[5];
  //   datumLoad_NotInlogt = match_NotInlogt[6];
  //   uhrzeitLoad_NotInlogt = match_NotInlogt[7];

  //   // console.log('artikelNummerLoad: ' + artikelNummerLoad);
  //   // console.log('ArtikelnameLoad:', artikelNameLoad);
  //   // console.log('FixlängeLoad:', fixLaengeLoad);
  //   // console.log('MehrfachlängeLoad:', mehrfachLaengeLoad);
  //   // console.log('Anzahl FixlängenLoad:', anzahlFixLaengenLoad);
  //   // console.log('ZiehgeschwindigkeitLoad:', ziehGeschwindigkeitLoad);
  //   // console.log('DatumLoad:', datumLoad);
  //   // console.log('UhrzeitLoad:', uhrzeitLoad);
  // } else {
  //   console.log('Format nicht erkannt!');
  // }

  // const recipeDetails_NotInlogt = {
  //   artikelNummer: Number(artikelNummerLoad_NotInlogt),
  //   //artikelName: artikelNameLoad_NotInlogt,
  //   ziehGeschwindigkeit: ziehGeschwindigkeitLoad_NotInlogt,
  //   fixLaenge: Number(fixLaengeLoad_NotInlogt),
  //   mehrfachlaenge: Number(mehrfachLaengeLoad_NotInlogt),
  //   anzahlFixlaengenProMehrfachlaenge: Number(anzahlFixLaengenLoad_NotInlogt),
  // };

  // // const recipefindLoadedinSPSinDB =
  // //   await getFindOneRecipeByDetails(recipeDetails);

  // let recipefindLoadedinSPSinDB_NotInlogt;
  // try {
  //   recipefindLoadedinSPSinDB_NotInlogt = await getFindOneRecipeByDetails(
  //     recipeDetails_NotInlogt,
  //   );
  // } catch (err) {
  //   recipefindLoadedinSPSinDB_NotInlogt = false;
  // }

  // let isFindInDB_NotInlogt = '';
  // if (recipefindLoadedinSPSinDB_NotInlogt) {
  //   console.log(
  //     'recipefindLoadedinSPSinDB_NotInlogt:',
  //     recipefindLoadedinSPSinDB_NotInlogt,
  //   );
  //   console.log(
  //     'recipefindLoadedinSPSinDB_NotInlogt:',
  //     JSON.stringify(recipefindLoadedinSPSinDB_NotInlogt, null, 2),
  //   );
  //   isFindInDB_NotInlogt = ' -';
  // } else {
  //   console.log('Kein Rezept gefunden.');
  //   isFindInDB_NotInlogt = ' !!! - Nicht in DB gefunden - Zkusit znovu - !!!';
  // }
  // console.log('isFindInDB_NotInlogt: ' + isFindInDB_NotInlogt);

  // if (loadedSPS_recipe_NotInlogt === '') {
  //   loadedSPS_recipe_NotInlogt = 'Es wurde kein Rezept auf die SPS geladen!';
  // }

  // //console.log('recipesTDT: ' + recipesTDT);
  // //console.log('recipesTDT:', JSON.stringify(recipesTDT, null, 2));

  // //TODO: überprüfen ob nicht eine Fehlermeldung kommen soll
  // if (recipesTDT_NotInlogt.length === 0) {
  //   recipesTDT_NotInlogt = 'Es sind keine Daten gefunden worden';
  // }

  // // res.status(200).render('overview_NotInlogt_de', {
  // //   title: 'Übersicht',
  // //   data: recipesTDT_NotInlogt,
  // //   dataSPS: loadedSPS_recipe_NotInlogt,
  // //   // ? loadedSPS_recipe
  // //   // : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  // //   recipefindLoadedinSPSinDB: JSON.stringify(
  // //     recipefindLoadedinSPSinDB_NotInlogt,
  // //     null,
  // //     2,
  // //   ), //recipefindLoadedinSPSinDB,
  // //   isFindInDB: isFindInDB_NotInlogt,
  // //   user: req.user,
  // // });

  res.status(200).render('overview_NotInlogt_cs', {
    title: 'Přehled',
    data: recipesTDT_NotInlogt,
    dataSPS: loadedPLC_OPCUA_RECIPE_NAME_NotInlogt, //loadedSPS_recipe_NotInlogt,
    // ? loadedSPS_recipe
    // : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    recipefindLoadedinSPSinDB: JSON.stringify(
      recipefindLoadedinSPSinDB_NotInlogt,
      null,
      2,
    ), //recipefindLoadedinSPSinDB,
    isFindInDB: isFindInDB_NotInlogt,
    user: req.user,
  });
  // res.status(200).render('overviewInlogt_de', {
  //   title: 'overviewIN',
  //   data: recipesTDT,
  //   dataSPS: loadedSPS_recipe,
  //   // ? loadedSPS_recipe
  //   // : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  //   recipefindLoadedinSPSinDB: JSON.stringify(
  //     recipefindLoadedinSPSinDB,
  //     null,
  //     2,
  //   ), //recipefindLoadedinSPSinDB,
  //   isFindInDB: isFindInDB,
  //   user: req.user,
  // });
});
//----------------------original--------------------------------------------------------------------
// export const getOverview = catchAsync(async (req, res, next) => {
//   console.log('bin getOverview');
//   let recipesTDT = await getFindRecipesTDTtoLoad();
//   // const recipesTDT = await RecipesTDT_de.find().sort({
//   //   'kopfDaten.artikelNummer': 1,
//   // });
//   console.log('recipesTDT: ' + recipesTDT);
//   console.log('recipesTDT.length: ' + recipesTDT.length);
//   if (recipesTDT.length === 0) {
//     recipesTDT = 'Es sind keine Daten gefunden worden';
//   }
//   console.log('recipesTDT: ' + recipesTDT);

//   res.status(200).render('overview_NotInlogt_de', {
//     title: 'Übersicht',
//     data: recipesTDT,
//   });
// });

export const getSPS = catchAsync(async (req, res, next) => {
  console.log('Bin in getSPS');

  let deviceInfo, uploadInfo, symbolVersion, plcRunTimeState, dataGVL;
  let errorDetails = [];
  let errorMessages = [];

  const ipSPSZumAnPingen = process.env.PLC_IP;
  let pingResult;
  console.log('Führe einen Ping aus...');

  try {
    // Ping ausführen
    //await execAsync('chcp 65001');
    await execAsyncPing('chcp 65001');
    //pingResult = await execAsync(`ping -n 4 ${ipSPSZumAnPingen}`);//Ping
    pingResult = await execAsyncPing(`ping -n 4 ${ipSPSZumAnPingen}`); //Ping
    console.log('pingResult: ' + pingResult);

    const pingGood = pingResult.includes('Antwort von 192.168.112.10');
    //const pingWrong = pingResult.includes('Antwort von 10.111.127.222');

    if (!pingGood) {
      throw new Error('Ping zur SPS fehlgeschlagen');
    }
    console.log('Ping erfolgreich!');
  } catch (error) {
    console.error('Fehler beim Pingen:', error.message);
    if (req.user.language === 'de') {
      return res.status(500).render('getSPS_de', {
        title: 'getSPS',
        dataPingSPS: pingResult + 'Ping fehlgeschlagen: ' + error.message,
        deviceInfo: '-',
        uploadInfo: '-',
        symbolVersion: '-',
        plcRunTimeState: '-',
        dataGVL: null,
        error: errorMessages.length ? errorMessages : null,
      });
    } else if (req.user.language === 'cs') {
      return res.status(500).render('getSPS_cs', {
        title: 'getSPS',
        dataPingSPS: pingResult + 'Ping se nezdařil: ' + error.message,
        deviceInfo: '-',
        uploadInfo: '-',
        symbolVersion: '-',
        plcRunTimeState: '-',
        dataGVL: null,
        error: errorMessages.length ? errorMessages : null,
      });
    } else {
      return res.status(500).render('getSPS', {
        title: 'getSPS',
        dataPingSPS: pingResult + 'Ping failed: ' + error.message,
        deviceInfo: '-',
        uploadInfo: '-',
        symbolVersion: '-',
        plcRunTimeState: '-',
        dataGVL: null,
        error: errorMessages.length ? errorMessages : null,
      });
    }
  }

  try {
    deviceInfo = await readDataDeviceInfo();
  } catch (error) {
    errorMessages.push('Fehler beim Lesen von DeviceInfo' + error);
    console.error(error.message);
    // errorDetails.push({
    //   message: 'Fehler beim Lesen von DeviceInfo',
    //   details: error,
    // });
  }

  try {
    uploadInfo = await readDataUploadInfo();
  } catch (error) {
    errorMessages.push('Fehler beim Lesen von UploadInfo' + error);
    console.error(error.message);
  }

  try {
    symbolVersion = await readDataSymbolVersion();
  } catch (error) {
    errorMessages.push('Fehler beim Lesen der SymbolVersion' + error);
    console.error(error.message);
  }

  try {
    plcRunTimeState = await readDataPlcRuntimeState();
  } catch (error) {
    errorMessages.push('Fehler beim Lesen des PLC-Runtime-Status' + error);
    console.error(error.message);
  }

  //const gvl_Name = 'GVL'; // Kann auch aus .env kommen
  const gvl_Name = process.env.PLC_GVL_NAME;
  console.log('gvl_Name:', gvl_Name);
  //     dataGVL = await readDataAll_GVL(gvl_Name);
  try {
    dataGVL = await readDataAll_GVL(gvl_Name);
  } catch (error) {
    errorMessages.push('Fehler beim Lesen der GVL-Daten' + error);
    console.error(error.message);
  }

  console.error('Erfolgreich');
  // Erfolgreich
  // return res.status(200).render('getSPS_de', {
  //   title: 'getSPS',
  //   dataPingSPS: pingResult + 'Ping erfolgreich!',
  //   deviceInfo: deviceInfo ? JSON.stringify(deviceInfo, null, 2) : '-',
  //   uploadInfo: uploadInfo ? JSON.stringify(uploadInfo, null, 2) : '-', //errorMessages, //'-',
  //   symbolVersion: symbolVersion ? symbolVersion.toString() : '-', //errorMessages,//'-',
  //   //plcRunTimeState: plcRunTimeState ? plcRunTimeState.toString() : '-',
  //   plcRunTimeState: plcRunTimeState
  //     ? JSON.stringify(plcRunTimeState, null, 2)
  //     : '-',
  //   dataGVL: dataGVL || null,
  //   //error: errorMessages.length ? errorMessages.join(' | ') : null,
  //   error: errorMessages.length ? errorMessages : null,
  // });

  if (req.user.language === 'de') {
    return res.status(200).render('getSPS_de', {
      title: 'getSPS',
      dataPingSPS: pingResult + 'Ping erfolgreich!',
      deviceInfo: deviceInfo ? JSON.stringify(deviceInfo, null, 2) : '-',
      uploadInfo: uploadInfo ? JSON.stringify(uploadInfo, null, 2) : '-', //errorMessages, //'-',
      symbolVersion: symbolVersion ? symbolVersion.toString() : '-', //errorMessages,//'-',
      //plcRunTimeState: plcRunTimeState ? plcRunTimeState.toString() : '-',
      plcRunTimeState: plcRunTimeState
        ? JSON.stringify(plcRunTimeState, null, 2)
        : '-',
      dataGVL: dataGVL || null,
      //error: errorMessages.length ? errorMessages.join(' | ') : null,
      error: errorMessages.length ? errorMessages : null,
    });
  } else if (req.user.language === 'cs') {
    return res.status(200).render('getSPS_cs', {
      title: 'getSPS',
      dataPingSPS: pingResult + 'Ping byl úspěšný!',
      deviceInfo: deviceInfo ? JSON.stringify(deviceInfo, null, 2) : '-',
      uploadInfo: uploadInfo ? JSON.stringify(uploadInfo, null, 2) : '-', //errorMessages, //'-',
      symbolVersion: symbolVersion ? symbolVersion.toString() : '-', //errorMessages,//'-',
      //plcRunTimeState: plcRunTimeState ? plcRunTimeState.toString() : '-',
      plcRunTimeState: plcRunTimeState
        ? JSON.stringify(plcRunTimeState, null, 2)
        : '-',
      dataGVL: dataGVL || null,
      //error: errorMessages.length ? errorMessages.join(' | ') : null,
      error: errorMessages.length ? errorMessages : null,
    });
  } else {
    return res.status(200).render('getSPS', {
      title: 'getPLC',
      dataPingSPS: pingResult + 'Ping successful!',
      deviceInfo: deviceInfo ? JSON.stringify(deviceInfo, null, 2) : '-',
      uploadInfo: uploadInfo ? JSON.stringify(uploadInfo, null, 2) : '-', //errorMessages, //'-',
      symbolVersion: symbolVersion ? symbolVersion.toString() : '-', //errorMessages,//'-',
      //plcRunTimeState: plcRunTimeState ? plcRunTimeState.toString() : '-',
      plcRunTimeState: plcRunTimeState
        ? JSON.stringify(plcRunTimeState, null, 2)
        : '-',
      dataGVL: dataGVL || null,
      //error: errorMessages.length ? errorMessages.join(' | ') : null,
      error: errorMessages.length ? errorMessages : null,
    });
  }
});

//-----------------------------original unten am 29.10.2024------------------------------------
// export const getSPS = catchAsync(async (req, res, next) => {
//   console.log('Bin in getSPS');

//   const ipSPSZumAnPingen = process.env.PLC_IP;
//   let pingResult;
//   console.log('Führe einen Ping aus...');

//   try {
//     // Ping ausführen
//     await execAsync('chcp 65001');
//     pingResult = await execAsync(`ping -n 4 ${ipSPSZumAnPingen}`);
//     console.log('pingResult: ' + pingResult);

//     const pingGood = pingResult.includes('Antwort von 192.168.112.10');
//     const pingWrong = pingResult.includes('Antwort von 10.111.127.222');

//     if (!pingGood) {
//       throw new Error('Ping zur SPS fehlgeschlagen');
//     }
//     console.log('Ping erfolgreich!');
//   } catch (error) {
//     console.error('Fehler beim Pingen:', error.message);
//     return res.status(500).render('getSPS_de', {
//       title: 'getSPS',
//       dataPingSPS: pingResult + 'Ping fehlgeschlagen: ' + error.message,
//       deviceInfo: '-',
//       uploadInfo: '-',
//       symbolVersion: '-',
//       plcRunTimeState: '-',
//       dataGVL: null,
//       error: error.message,
//     });
//   }

//   // SPS-Verbindung herstellen
//   let client;
//   client = await connectSPS();
//   console.log(
//     '--------------------------------------------------SPS-----------------------------------',
//   );
//   //const readUploadInfo = await client.readUploadInfo();

//   const readUploadInfo = await readDataDeviceInfo();
//   console.log('readUploadInfo(): ', readUploadInfo);
//   //const readSystemManagerState = await client.rreadSystemManagerState();
//   //console.log('readSystemManagerState(): ', readSystemManagerState);

//   const readDeviceInfo = await client.readDeviceInfo();
//   console.log('readDeviceInfo:', JSON.stringify(readDeviceInfo));

//   const symbolVersion = await client.readSymbolVersion();
//   console.log('Symbol Version:', symbolVersion);

//   const readPlcRuntimeState = await client.readPlcRuntimeState();
//   console.log('readPlcRuntimeState:', readPlcRuntimeState);
//   console.log(
//     '--------------------------------------------------SPS-----------------------------------',
//   );

//   try {
//     console.log('Verbindung zur SPS wird aufgebaut...');
//     client = await connectSPS();
//     console.log('SPS erfolgreich verbunden');
//   } catch (error) {
//     console.error('Fehler bei der Verbindung zur SPS:', error.message);
//     return res.status(500).render('getSPS_de', {
//       title: 'getSPS',
//       dataPingSPS:
//         pingResult + 'Ping erfolgreich, aber Verbindung zur SPS fehlgeschlagen',
//       deviceInfo: '-',
//       dataGVL: null,
//       error: 'SPS-Verbindung fehlgeschlagen: ' + error.message,
//     });
//   }

//   // SPS Runtime State lesen
//   let plcRuntimeState;
//   try {
//     plcRuntimeState = await client.readPlcRuntimeState();
//     console.log('plcRuntimeState:', plcRuntimeState);
//   } catch (error) {
//     console.error('Fehler beim Lesen des PLC Runtime States:', error.message);
//     console.error('Fehler Stack:', error.stack);
//     return res.status(500).render('getSPS_de', {
//       title: 'getSPS',
//       dataPingSPS:
//         pingResult +
//         'SPS verbunden, aber Fehler beim Lesen des PLC Runtime States',
//       deviceInfo: '-',
//       dataGVL: null,
//       error: 'Fehler beim Lesen des PLC Runtime States: ' + error.message,
//     });
//   }

//   // GVL-Daten lesen
//   let dataGVL;
//   try {
//     const gvl_Name = 'GVL'; // Kann auch aus .env kommen
//     dataGVL = await readDataAll_GVL(gvl_Name);

//     if (!dataGVL) {
//       throw new Error('GVL-Daten konnten nicht gefunden werden');
//     }
//     //console.log('GVL-Daten erfolgreich gelesen:', dataGVL);
//   } catch (error) {
//     console.error('Fehler beim Lesen der GVL-Daten:', error.message);
//     console.error('Fehler Stack:', error.stack);
//     return res.status(500).render('getSPS_de', {
//       title: 'getSPS',
//       dataPingSPS:
//         pingResult + 'SPS verbunden, aber Fehler beim Lesen der GVL-Daten',
//       deviceInfo: JSON.stringify(plcRuntimeState),
//       dataGVL: null,
//       error: 'Fehler beim Lesen der GVL-Daten: ' + error.message,
//     });
//   }

//   return res.status(200).render('getSPS_de', {
//     title: 'getSPS',
//     dataPingSPS: pingResult + 'Ping erfolgreich!',
//     deviceInfo: JSON.stringify(plcRuntimeState),
//     dataGVL: dataGVL,
//   });
// });
//------------------------------------------Original oben 29.10.2024---------------------------------------------

// export const getSPS = catchAsync(async (req, res, next) => {
//   console.log('bin getSPS');

//   //const execPromise = util.promisify(exec);
//   const ipSPSZumAnPingen = process.env.PLC_IP; //'192.168.112.10';
//   console.log('führe einen Ping aus...');

//   //const dataSPS = await readDataBySymbolName('GVL.vFileLesen');
//   // console.log('getSPS: dataSPS: ' + JSON.stringify(dataSPS.value));
//   // console.log('getSPS: Value name: ' + dataSPS.name);
//   // console.log(`getSPS: Value type: ${JSON.stringify(dataSPS.type.type)}`);
//   // console.log(`getSPS: Value read: ${dataSPS.value}`);

//   let client = await connectSPS();
//   console.log(
//     'viewController: JSON.stringify(client.connection.connected): ' +
//       JSON.stringify(client.connection.connected),
//   );

//   console.log('client._eventsCount: ' + client._eventsCount);
//   console.log(
//     'client._internals.socket.connecting: ' +
//       JSON.stringify(client._internals.socket.connecting),
//   );

//   if (client._internals.socket.connecting === false) {
//     console.log('client.socket.connecting hat ein Problem!');
//   }

//   console.log(
//     'JSON.stringify(client)) ////////////////////:',
//     JSON.stringify(client),
//   );

//   const deviceInfo = await client.readDeviceInfo();

//   console.log('Device Info:', deviceInfo);
//   console.log(
//     'JSON.stringify(deviceInfo)) ////////////////////:',
//     JSON.stringify(deviceInfo),
//   );

//   // const symbolVersion = await client.readSymbolVersion();
//   // console.log('Symbol Version:', symbolVersion);

//   // const gvl_Name = 'GVL'; //process.env.PLC_GVL_NAME;
//   // console.log('gvl_Name:', gvl_Name);
//   // const dataGVL = await readDataAll_GVL(gvl_Name);

//   //console.log('dataGVL:', JSON.stringify(dataGVL));

//   // const plcRuntimeState = await client.readPlcRuntimeState();
//   // console.log('plcRuntimeState:', plcRuntimeState);

//   // const readUploadInfo = await client.readUploadInfo();
//   // console.log('readUploadInfo: ' + JSON.stringify(readUploadInfo));

//   await execAsync('chcp 65001');

//   const pingResult = await execAsync(
//     `ping -n 4 ${ipSPSZumAnPingen}`, //chcp 65001 && ping -n 4
//   );
//   console.log('pingResult: ' + pingResult);

//   const pingGood = pingResult.includes(
//     'Antwort von 192.168.112.10: Bytes=32 Zeit=1ms TTL=128',
//   );
//   const pingWrong = pingResult.includes('Antwort von 10.111.127.222:');
//   //const pingWrong = pingResult.includes('Zeitüberschreitung');

//   console.log('pingGood: ' + pingGood);
//   console.log('pingWrong: ' + pingWrong);
//   if (pingGood) {
//     console.log('viewController: Ping erfolgreich.');
//     res.status(200).render('getSPS_de', {
//       title: 'getSPS',
//       dataPingSPS: pingResult + 'Ping erfolgreich.',
//       //dataSPS: dataSPS,
//       deviceInfo:
//         JSON.stringify(deviceInfo) || 'Geräteinformationen nicht verfügbar',
//       // symbolVersion: symbolVersion,
//       //dataGVL: dataGVL,
//     });
//   }
//   if (pingWrong) {
//     console.log('viewController: Keine gültige Antwort von der SPS.');
//     res.status(200).render('getSPS_de', {
//       title: 'getSPS',
//       dataPingSPS: pingResult + 'Ping fehlgeschlagen: Zeitüberschreitung.',
//       //dataSPS: '-',
//       deviceInfo: deviceInfo || 'Geräteinformationen nicht verfügbar',
//       //symbolVersion: '-',
//       //dataGVL: '-',
//     });
//   }

//   // res.status(200).render('getSPS_de', {
//   //   title: 'getSPS',
//   //   dataPingSPS: pingResult,
//   //   // dataSPS: dataSPS,
//   //   // deviceInfo: JSON.stringify(deviceInfo),
//   //   // symbolVersion: symbolVersion,
//   //   // dataGVL: dataGVL,

//   //   //error: null,
//   // });
// });

// let pingResult = '';

// const { stdout } = await execAsync(`ping ${ipSPSZumAnPingen}`);
// pingResult = JSON.stringify(stdout);

//try {
// Warte auf das Ping-Ergebnis
//pingResult = await exec(ipSPSZumAnPingen);

// } catch (error) {
//   // Bei Fehlern das Template mit der Fehlermeldung rendern
//   res.status(500).render('getSPS_de', {
//     title: 'getSPS',
//     dataSPS: null,
//     error: error.message,
//   });
// }

export const getManageUsers = catchAsync(async (req, res, next) => {
  console.log('bin getManageUsers');
  let allUsers = await getAllUsers();
  //console.log('allUsers: ' + allUsers);

  //TODO: kommt hier nicht ein AppError??
  if (allUsers.length === 0) {
    allUsers = 'Es sind keine user gefunden worden';
  }

  if (req.user.language === 'de') {
    res.status(200).render('manageUsers_de', {
      title: 'Benutzerverwaltung',
      data: allUsers,
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('manageUsers_cs', {
      title: 'Správa uživatelů',
      data: allUsers,
    });
  } else {
    res.status(200).render('manageUsers', {
      title: 'manageUsers',
      data: allUsers,
    });
  }
});

export const getUpdateUser = catchAsync(async (req, res, next) => {
  console.log('Bin getUpdateUser');

  const currentUser = req.user;
  const userToUpdate = await getFindUserByID(req.params.id); // User.findById(req.params.id)
  //.select('+password')
  //.populate('machinery');

  console.log('currentUser: ' + currentUser);
  console.log('userToUpdate: ' + userToUpdate);

  // let iv = CryptoJS.enc.Base64.parse(''); //giving empty initialization vector
  // let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY); //hashing the key using SHA256
  console.log('userToUpdate.password: ' + userToUpdate.password.toString());
  let userDecryptedPassword = await decryptPassword(
    userToUpdate.password.toString(),
  );
  console.log('userDecryptedPassword: ' + userDecryptedPassword);

  // const allDepartments = await Department.find()
  //   .sort('_id')
  //   .populate('machinery');

  if (!userToUpdate) {
    return next(new AppError('There is no User with that ID.', 404));
  }

  console.log('currentUser.role: ' + currentUser.role);
  console.log('userToUpdate._id: ' + userToUpdate._id);

  // That no one can change the Admin, NO_ACCOUNT_DUMMY, NO_NAME_IN_OLD_RECIPE_DUMMY, DELETED_USER_DUMMY
  if (
    (userToUpdate.role === 'admin' && req.user.role !== 'admin') ||
    (userToUpdate._id.toString() === '000000000000000000000000' &&
      req.user.role === 'Chef') ||
    (userToUpdate._id.toString() === '000000000000000000000001' &&
      req.user.role === 'Chef') ||
    (userToUpdate._id.toString() === '643c1f042df0321cb8a06a50' &&
      req.user.role === 'Chef')
  ) {
    res.status(401).render('error', {
      msg: 'You do not have permission to perform this action!',
    });
  } else if (req.user.role === 'admin') {
    if (req.user.language === 'de') {
      res.status(200).render('updateUserByAdminPW_de', {
        title: 'Benutzer-Bearbeitung',
        data: {
          userToUpdate: userToUpdate,
          currentUser: currentUser,
          userDecryptedPassword: userDecryptedPassword,
        },
      });
    } else if (req.user.language === 'cs') {
      res.status(200).render('updateUserByAdminPW_cs', {
        title: 'Úprava uživatele',
        data: {
          userToUpdate: userToUpdate,
          currentUser: currentUser,
          userDecryptedPassword: userDecryptedPassword,
        },
      });
    } else {
      res.status(200).render('updateUserByAdminPW', {
        title: 'Update user',
        data: {
          userToUpdate: userToUpdate,
          currentUser: currentUser,
          userDecryptedPassword: userDecryptedPassword,
        },
      });
    }
  } else {
    if (req.user.language === 'de') {
      res.status(200).render('updateUserByChef_de', {
        title: 'Aktualisiere Benutzer',
        data: {
          userToUpdate: userToUpdate,
          currentUser: currentUser,
        },
      });
    } else if (req.user.language === 'cs') {
      res.status(200).render('updateUserByChef_cs', {
        title: 'Aktualizovat uživatele',
        data: {
          userToUpdate: userToUpdate,
          currentUser: currentUser,
        },
      });
    } else {
      res.status(200).render('updateUserByChef', {
        title: 'Update user',
        data: {
          userToUpdate: userToUpdate,
          currentUser: currentUser,
        },
      });
    }
  }
});

export const getCreateUser = catchAsync(async (req, res, next) => {
  console.log('bin getCreateUser');

  if (req.user.language === 'de') {
    res.status(200).render('createUser_de', {
      title: 'Benutzererstellung',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('createUser_cs', {
      title: 'Vytvoření uživatele',
    });
  } else {
    res.status(200).render('createUser', {
      title: 'createUser',
    });
  }
});

export const getUpdateRecipe = catchAsync(async (req, res, next) => {
  console.log('bin getUpdateRecipe');

  const recipeID = req.params.id;
  const recipeToUpdate = await getFindRecipeTDT_deByID(recipeID);

  if (!recipeToUpdate) {
    return next(new AppError('There is no recipe with that ID.', 404));
  }

  if (req.user.language === 'de') {
    res.status(200).render('updateRecipe_de', {
      title: 'Rezept- Bearbeitung',
      data: recipeToUpdate,
      user: req.user,
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('updateRecipe_cs', {
      title: 'Úprava receptu',
      data: recipeToUpdate,
      user: req.user,
    });
  } else {
    res.status(200).render('updateRecipe', {
      title: 'Edit recipe',
      data: recipeToUpdate,
      user: req.user,
    });
  }
});

export const getCreate2_St_4_SBSBS = catchAsync(async (req, res, next) => {
  console.log('bin getCreate2_St_4_SBSBS');

  if (req.user.language === 'de') {
    res.status(200).render('create2_ST_4_SBSBS_de', {
      title: 'Erstellung_2_ST_4_SBSBS',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('create2_ST_4_SBSBS_cs', {
      title: 'Vytváření_2_ST_4_SBSBS',
    });
  } else {
    res.status(200).render('create2_ST_4_SBSBS', {
      title: 'Create 2_ST_4_SBSBS',
    });
  }
});

export const getCreate2_St_6_BSBSBSB = catchAsync(async (req, res, next) => {
  console.log('bin getCreate2_St_6_BSBSBSB');

  if (req.user.language === 'de') {
    res.status(200).render('create2_ST_6_BSBSBSB_de', {
      title: 'Erstellung_2_St_6_BSBSBSB',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('create2_ST_6_BSBSBSB_cs', {
      title: 'Vytváření_2_ST_6_BSBSBSB',
    });
  } else {
    res.status(200).render('create2_ST_6_BSBSBSB', {
      title: 'Create 2_St_6_BSBSBSB',
    });
  }
});

export const getCreate3_St_4_MBSBM = catchAsync(async (req, res, next) => {
  console.log('bin getCreate3_St_4_MBSBM');

  if (req.user.language === 'de') {
    res.status(200).render('create3_ST_4_MBSBM_de', {
      title: 'Erstellung_3_St_4_MBSBM',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('create3_ST_4_MBSBM_cs', {
      title: 'Vytváření_3_St_4_MBSBM',
    });
  } else {
    res.status(200).render('create3_ST_4_MBSBM', {
      title: 'Create 3_St_4_MBSBM',
    });
  }
});

export const getCreate3_St_4_BMSMB = catchAsync(async (req, res, next) => {
  console.log('bin getCreate3_St_4_BMSMB');

  if (req.user.language === 'de') {
    res.status(200).render('create3_St_4_BMSMB_de', {
      title: 'Erstellung_3_St_4_BMSMB',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('create3_ST_4_BMSMB_cs', {
      title: 'Vytváření_3_St_4_BMSMB',
    });
  } else {
    res.status(200).render('create3_St_4_BMSMB', {
      title: 'Create 3_St_4_BMSMB',
    });
  }
});

export const getCreateExpertJCD = catchAsync(async (req, res, next) => {
  console.log('bin getCreateExpertJCD');

  if (req.user.language === 'de') {
    res.status(200).render('createExpertJCD_de', {
      title: 'Erstellung_ExpertJCD',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('createExpertJCD_cs', {
      title: 'Vytváření_ExpertJCD',
    });
  } else {
    res.status(200).render('createExpertJCD', {
      title: 'Create ExpertJCD',
    });
  }
});

export const getAboutTDT = catchAsync(async (req, res, next) => {
  console.log('bin getAboutTDT');

  if (req.user.language === 'de') {
    res.status(200).render('aboutTDT_de', {
      title: 'Über TDT',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('aboutTDT_cs', {
      title: 'O TDT',
      user: req.user,
    });
  } else {
    res.status(200).render('aboutTDT', {
      title: 'About TDT',
    });
  }
});

export const getAboutTDT_NotInlogt = catchAsync(async (req, res, next) => {
  console.log('bin getAboutTDT_NotInlogt');

  res.status(200).render('aboutTDT_NotInlogt_cs', {
    title: 'O TDT',
  });
});

export const getAboutASMAG = catchAsync(async (req, res, next) => {
  console.log('bin getAboutASMAG');

  if (req.user.language === 'de') {
    res.status(200).render('aboutASMAG_de', {
      title: 'Über MAIR',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('aboutASMAG_cs', {
      title: 'O MAIR',
      user: req.user,
    });
  } else {
    res.status(200).render('aboutASMAG', {
      title: 'About MAIR',
    });
  }
});

export const getAboutASMAG_NotInlogt = catchAsync(async (req, res, next) => {
  console.log('bin getAboutASMAG_NotInlogt');

  res.status(200).render('aboutASMAG_NotInlogt_cs', {
    title: 'O MAIR',
  });
});

export const getContact = catchAsync(async (req, res, next) => {
  console.log('bin getContact');

  if (req.user.language === 'de') {
    res.status(200).render('contact_de', {
      title: 'Kontakt',
    });
  } else if (req.user.language === 'cs') {
    res.status(200).render('contact_cs', {
      title: 'Kontakt',
    });
  } else {
    res.status(200).render('contact', {
      title: 'Contact',
    });
  }
});

export const getContact_NotInlogt = catchAsync(async (req, res, next) => {
  console.log('bin getContact_NotInlogt');

  res.status(200).render('contact_NotInlogt_cs', {
    title: 'Kontakt',
  });
});

export const getSPS_OPCUA = catchAsync(async (req, res, next) => {
  console.log('bin getSPS_OPCUA');
  const plc_OPCUA_WITHSIMATIC = process.env.PLC_OPCUA_WITHSIMATIC;

  const typeMap = {
    'ns=0;i=1': 'BOOL / Boolean',
    'ns=0;i=2': 'SINT / SByte',
    'ns=0;i=3': 'USINT / Byte',
    'ns=0;i=4': 'INT / Int16',
    'ns=0;i=5': 'UINT / UInt16',
    'ns=0;i=6': 'DINT / Int32',
    'ns=0;i=7': 'UDINT / UInt32',
    'ns=0;i=8': 'LINT / Int64',
    'ns=0;i=9': 'ULINT / UInt64',
    'ns=0;i=10': 'REAL / Float',
    'ns=0;i=11': 'LREAL / Double',
    'ns=0;i=12': 'WSTRING / String',
    'ns=0;i=13': 'LDT / DateTime',
    'ns=0;i=19': 'DWORD / StatusCode',
    'ns=3;i=3001': 'BYTE / Byte',
    'ns=3;i=3002': 'WORD / Word',
    'ns=3;i=3003': 'DWORD / DWord',
    'ns=3;i=3004': 'LWORD / LWord',
    'ns=3;i=3011': 'DT / Date_And_Time',
    'ns=3;i=3012': 'CHAR / Char',
    'ns=3;i=3013': 'WCHAR / WChar',
    'ns=3;i=3014': 'STRING / String',
  };

  const accessMap = {
    3: 'read/write',
    1: 'read',
    2: 'write',
  };

  //TODO: wenn SimaticWith === 1!!!
  let dataPLC_Simatic_Obj_Emty = {
    value: {
      dataType: '-',
      arrayType: '-',
      value: '-',
    },
    statusCode: {
      value: '-',
      description: '-',
      name: '-',
    },
    sourceTimestamp: '-',
    sourcePicoseconds: '-',
    serverTimestamp: '-',
    serverPicoseconds: '-',
  };

  await disconnectOPCUA();

  let plcSimaticStatus = dataPLC_Simatic_Obj_Emty;
  let plcInformations = '-';
  if (plc_OPCUA_WITHSIMATIC === '1') {
    try {
      plcSimaticStatus = await withTimeout(readSimaticStatus(), 10000);
      console.log('🟦 ✅ plcSimaticStatus: '); //, plcSimaticStatus);
    } catch (err) {
      console.log('‼️ Fehler beim Lesen von readSimaticStatus: ' + err);
      //plcSimaticStatus = dataPLC_Simatic_Obj_Emty;
    }
    //await pause(1000);

    try {
      //console.log('Mache readPLC_Informations()...');
      plcInformations = await withTimeout(readPLC_Informations(), 10000);
      console.log('🟦 ✅ plcInformations: '); //, plcInformations);
    } catch (err) {
      console.log('‼️ Fehler beim Lesen von readPLC_Informations: ' + err);
      plcInformations = '-';
    }
  }

  try {
    const serverStatus = await withTimeout(readServerStatus_OPCUA(), 20000);
    console.log('🟦 ✅ serverStatus:', serverStatus);

    await pause(3000);

    const data_TDT_ExchaneArea = await withTimeout(
      readTDT_ExchangeArea(),
      50000,
    );

    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiir');

    // if (plcSimaticStatus === dataPLC_Simatic_Obj_Emty) {
    //   // Verbindung ist evtl. zu spät gekommen
    //   // Optional: noch einmal lesen oder UI-Message zeigen
    // }

    //await pause(5000);
    await disconnectOPCUA();

    // res.status(200).render('getSPS_OPC_UA_de', {
    //   title: 'getSPS_OPCUA',
    //   dataPLC: serverStatus,
    //   dataSimatic: plcSimaticStatus, //dataPLC_Simatic_Obj_Emty,
    //   dataPLCInfo: plcInformations,
    //   data_TDT_ExchaneArea: data_TDT_ExchaneArea,
    //   typeMap,
    //   accessMap,
    // });

    if (req.user.language === 'de') {
      res.status(200).render('getSPS_OPC_UA_de', {
        title: 'getSPS_OPCUA',
        dataPLC: serverStatus,
        dataSimatic: plcSimaticStatus, //dataPLC_Simatic_Obj_Emty,
        dataPLCInfo: plcInformations,
        data_TDT_ExchaneArea: data_TDT_ExchaneArea,
        typeMap,
        accessMap,
      });
    } else if (req.user.language === 'cs') {
      res.status(200).render('getSPS_OPC_UA_cs', {
        title: 'getSPS_OPCUA',
        dataPLC: serverStatus,
        dataSimatic: plcSimaticStatus, //dataPLC_Simatic_Obj_Emty,
        dataPLCInfo: plcInformations,
        data_TDT_ExchaneArea: data_TDT_ExchaneArea,
        typeMap,
        accessMap,
      });
    } else {
      res.status(200).render('getSPS_OPC_UA', {
        title: 'getSPS_OPCUA',
        dataPLC: serverStatus,
        dataSimatic: plcSimaticStatus, //dataPLC_Simatic_Obj_Emty,
        dataPLCInfo: plcInformations,
        data_TDT_ExchaneArea: data_TDT_ExchaneArea,
        typeMap,
        accessMap,
      });
    }
  } catch (err) {
    let dataPLC_Server_Obj_Emty = {
      startTime: '-',
      currentTime: '-',
      state: '-',
      buildInfo: {
        productUri: '-',
        manufacturerName: '-',
        productName: '-',
        softwareVersion: '-',
        buildNumber: '-',
        buildDate: '-',
      },
      secondsTillShutdown: 0,
      shutdownReason: {},
    };

    console.log('Fehler beim öffnen der Seite getSPS_OPCUA:', err);

    // res.status(200).render('getSPS_OPC_UA_de', {
    //   title: 'getSPS_OPCUA',
    //   dataPLC: dataPLC_Server_Obj_Emty, //'hallo keine verbindung?', //serverStatus,
    //   dataSimatic: plcSimaticStatus, //dataPLC_Simatic_Obj_Emty,
    //   dataPLCInfo: plcInformations,
    //   data_RECIPE_NAME: '-',
    //   typeMap,
    //   accessMap,
    // });

    if (req.user.language === 'de') {
      res.status(200).render('getSPS_OPC_UA_de', {
        title: 'getSPS_OPCUA',
        dataPLC: dataPLC_Server_Obj_Emty, //'hallo keine verbindung?', //serverStatus,
        dataSimatic: plcSimaticStatus, //dataPLC_Simatic_Obj_Emty,
        dataPLCInfo: plcInformations,
        data_RECIPE_NAME: '-',
        typeMap,
        accessMap,
      });
    } else if (req.user.language === 'cs') {
      res.status(200).render('getSPS_OPC_UA_cs', {
        title: 'getSPS_OPCUA',
        dataPLC: dataPLC_Server_Obj_Emty, //'hallo keine verbindung?', //serverStatus,
        dataSimatic: plcSimaticStatus, //dataPLC_Simatic_Obj_Emty,
        dataPLCInfo: plcInformations,
        data_RECIPE_NAME: '-',
        typeMap,
        accessMap,
      });
    } else {
      res.status(200).render('getSPS_OPC_UA', {
        title: 'getSPS_OPCUA',
        dataPLC: dataPLC_Server_Obj_Emty, //'hallo keine verbindung?', //serverStatus,
        dataSimatic: plcSimaticStatus, //dataPLC_Simatic_Obj_Emty,
        dataPLCInfo: plcInformations,
        data_RECIPE_NAME: '-',
        typeMap,
        accessMap,
      });
    }
  }
});

function withTimeout(promise, ms = 10000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            'Timeout beim OPC-UA Zugriff, weil die Zeit für das Ergebnis als Promise abgelaufen ist... :(',
          ),
        ),
      ms,
    ),
  );
  return Promise.race([promise, timeout]);
}

function pause(milliseconds) {
  console.log('Bin Pause von: ' + milliseconds + 'milliseconds');
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// 🔹 Namespace 0 (Standard OPC UA Typen)
// NodeId	IEC-Typ	OPC UA Typ
// ns=0;i=1	BOOL	Boolean
// ns=0;i=2	SINT	SByte
// ns=0;i=3	USINT	Byte
// ns=0;i=4	INT	Int16
// ns=0;i=5	UINT	UInt16
// ns=0;i=6	DINT	Int32
// ns=0;i=7	UDINT	UInt32
// ns=0;i=8	LINT	Int64
// ns=0;i=9	ULINT	UInt64
// ns=0;i=10	REAL	Float
// ns=0;i=11	LREAL	Double
// ns=0;i=12	WSTRING	String
// ns=0;i=13	LDT	DateTime
// ns=0;i=19	DWORD	StatusCode

// 🔹 Namespace 3 (Vendor-spezifisch – z. B. Beckhoff)
// NodeId	IEC-Typ	OPC UA Typ
// ns=3;i=3001	BYTE	Byte
// ns=3;i=3002	WORD	Word
// ns=3;i=3003	DWORD	DWord
// ns=3;i=3004	LWORD	LWord
// ns=3;i=3011	DT	Date_And_Time
// ns=3;i=3012	CHAR	Char
// ns=3;i=3013	WCHAR	WChar
// ns=3;i=3014	STRING	String

// const typeMap = {
//   'ns=0;i=11': 'Double',
//   'ns=0;i=1': 'Boolean',
//   'ns=0;i=4': 'Int32',
// };
