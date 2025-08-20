import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';

import {
  writeRECIPE_NAMEtoSPS_OPCUA,
  writeSTEP_POSITIONStoSPS_OPCUA,
  writeSTEP_POSITIONS_CleanUPwithZeros_toSPS_OPCUA,
} from '../models/services/sps_OPCUA_Service.mjs';

import {
  writeData_WithSymbolNameAndValue,
  writeData_ZiehPositionsArray,
} from '../models/services/spsService.mjs';
import { connectSPS } from '../models/spsConnector.mjs';
import {
  zuordnenDornPositionen,
  checkWallThicknessArray,
  checkWallTicknesInCornerArrayWithoutBetweenCorner,
  checkDornPositions,
  newDateTimeNow,
} from '../utils/spsProcessingHelpers.mjs';

import {
  writeCSV_File,
  formatZiehPositionsData_toWriteCSV_File,
  formatZiehPositionsData_OPCUA_toWriteCSV_File,
} from '../utils/writeCSV_File.mjs';

import { getCreateRecipeSendSPSLog } from './recipeSendSPSLogController.mjs';

import { createRecipeSendLogServiceFunction } from '../models/services/recipeSendSPSLog_de_Service.mjs';
import {
  createRecipeStatisticServiceFunction,
  makeCreateRecipeStatistic,
} from '../models/services/recipeStatistic_de_Service.mjs';

//---------------------------------------Funktioniert-----------------------------------------------------------
export const getWriteRecipeToSPS_3_OPCUA = catchAsync(
  async (req, res, next) => {
    console.log('bin getWriteRecipeToSPS');
    console.log('req.body.recipeData: ' + JSON.stringify(req.body.recipeData));
    //console.log('req.body.data.recipeData: ' + req.body.data.recipeData);
    const recipeToSend = req.body.recipeData;
    console.log('recipeToSend.length: ' + req.body.length);
    console.log('recipeToSend.artikelNummer: ' + recipeToSend.artikelNummer);

    const date = new Date();

    // Datum erstellen
    let day = date.getDate(); // Gibt den Tag (1-31) zurück
    let month = date.getMonth() + 1; // Gibt den Monat (0-11) zurück, daher +1 für richtige Zahl
    let year = date.getFullYear(); // Gibt das volle Jahr (z.B. 2024) zurück

    // Wenn der Tag oder Monat nur eine Ziffer hat, fügen wir eine "0" davor ein
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }

    // So sieht unser Datum aus: "TT.MM.JJJJ"
    const datum = day + '.' + month + '.' + year;

    // Uhrzeit erstellen
    let hours = date.getHours(); // Gibt die Stunden zurück (0-23)
    let minutes = date.getMinutes(); // Gibt die Minuten zurück (0-59)

    // Auch hier: Falls Stunden oder Minuten nur eine Ziffer haben, fügen wir eine "0" davor ein
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    const uhrzeit = hours + '.' + minutes;

    console.log('Datum:', datum);
    console.log('Uhrzeit:', uhrzeit);

    //schreibe zuur SPS...
    //wenn gut
    if (recipeToSend === '') {
      console.log('recipeToSend ist leer!');
      return next(new AppError('Es wurde kein Rezept angewählt!', 400));
    }

    //TODO: vCsvName auslagern!!!
    try {
      //const vCsvName = 'GVL.vCsvName';
      const vCsvName = process.env.PLC_GVL_VCSVNAME;
      console.log('vCsvName:', vCsvName);

      const spsResult = await writeData_WithSymbolNameAndValue(
        vCsvName,
        recipeToSend.artikelNummer + ' ' + datum + ':' + uhrzeit,
      );

      if (spsResult === true) {
        res.status(200).json({
          status: 'success',
          message: 'Recipe is successfully written to the SPS!',
        });
      }
    } catch (err) {
      console.log('Fehler in getWriteRecipeToSPS:', err);

      return next(
        new AppError(
          'Fehler beim Schreiben eines Rezeptes auf der SPS! ' +
            'Fehler in getWriteRecipeToSPS erhalten von: ' +
            err,
          400,
        ),
      );
    }
  },
);

//------------------------------------------------*******------------------------------------------------------------
export const getWriteRecipeToSPS_OPCUA = catchAsync(async (req, res, next) => {
  console.log('bin getWriteRecipeToSPS_OPCUA');
  console.log('req.body.recipeData: ' + JSON.stringify(req.body.recipeData));
  const recipeToSend = req.body.recipeData;

  const userSendData = req.body.userSendData;
  console.log('userSendData:', userSendData);
  const fa_Nummer = req.body.fa_NummerData;
  console.log('fa_Nummer:', fa_Nummer);
  const recipeSendID = req.body.recipeData.id;
  console.log('recipeSendID: ' + recipeSendID);

  const vDornVorSPS = req.body.recipeData.v_dorn_Fwd;
  console.log('vDornVorSPS SPSload:', vDornVorSPS);
  const vDornZurueckSPS = req.body.recipeData.v_dorn_Bwd;
  console.log('vDornZurueckSPS SPSLoad:', vDornZurueckSPS);

  //**************************************************************************************************** */
  const faNummer_Min = 1000000;
  const faNummer_Max = 9999999;

  if (recipeToSend === '') {
    console.log('getWriteRecipeToSPS: recipeToSend ist leer!');
    return next(
      new AppError(
        'No recipe selected!' + '<br>' + 'Es wurde kein Rezept angewählt!',
        400,
      ),
    );
  }

  if (fa_Nummer === '') {
    console.log('getWriteRecipeToSPS: fa_Nummer ist leer!');
    return next(
      new AppError(
        'FA-Nummer ist leer!' +
          '<br>' +
          'Falsche FA-Nummer!' +
          '<br>' +
          'Číslo výrobní zakázky je prázdné nebo nesprávné!',
        400,
      ),
    );
  }

  if (fa_Nummer < faNummer_Min) {
    console.log('getWriteRecipeToSPS: fa_Nummer ist zu klein!');
    return next(
      new AppError(
        'FA-Nummer ist zu klein!<br>Číslo výrobní zakázky je příliš malé!',
        400,
      ),
    );
  }

  if (fa_Nummer > faNummer_Max) {
    console.log('getWriteRecipeToSPS: fa_Nummer ist zu gross!');
    return next(
      new AppError(
        'FA-Nummer ist zu gross!<br>Číslo výrobní zakázky je příliš velké!',
        400,
      ),
    );
  }

  const newArtikelNummer = recipeToSend.artikelNummer;
  const newZiehGeschwindigkeit = recipeToSend.ziehGeschwindigkeit;
  const newFixlaenge = recipeToSend.mehrfachlaengenDaten.fixlaenge;

  const newProfileGekoppelt = recipeToSend.profileGekoppelt;
  const newAusgleichStueck = recipeToSend.mehrfachlaengenDaten.ausgleichstueck;

  console.log('newProfileGekoppelt: ', newProfileGekoppelt);
  console.log('typeof newProfileGekoppelt: ', typeof newProfileGekoppelt);

  console.log('newAusgleichStueck: ', newAusgleichStueck);
  console.log('typeof newAusgleichStueck: ', typeof newAusgleichStueck);

  console.log('vDornVorSPS: ', vDornVorSPS);
  console.log('typeof vDornVorSPS: ', typeof vDornVorSPS);
  console.log('vDornZurueckSPS: ', vDornZurueckSPS);
  console.log('typeof vDornZurueckSPS: ', typeof vDornZurueckSPS);

  const newMehrfachlaenge = recipeToSend.mehrfachlaengenDaten.mehrfachlaenge;
  const newAnzahlFixlaengenProMehrfachlaenge =
    recipeToSend.mehrfachlaengenDaten.anzahlFixlaengenProMehrfachlaenge;

  const newArtikel_TDT_NameToSplit = recipeToSend.artikelName;
  const newArtikel_TDT_Name = newArtikel_TDT_NameToSplit.split(' ')[0];

  console.log('newArtikelNummer: ' + newArtikelNummer);
  console.log('newZiehGeschwindigkeit: ' + newZiehGeschwindigkeit);
  console.log('newFixlaenge: ' + newFixlaenge);
  console.log('newMehrfachlaenge: ' + newMehrfachlaenge);
  console.log(
    'newAnzahlFixlaengenProMehrfachlaenge: ' +
      newAnzahlFixlaengenProMehrfachlaenge,
  );
  console.log('newArtikel_TDT_Name: ' + newArtikel_TDT_Name);

  let newDateTime = newDateTimeNow();
  console.log('newDateTime:', newDateTime);

  let isPLC_Result_recipeName = false;
  try {
    //----------------------------------------------SPS-RECIPE_NAME-Schreiben----Down------------------------------------------------
    let new_RECIPE_NAME_toWrite = '';
    try {
      new_RECIPE_NAME_toWrite =
        newArtikelNummer +
        //'➔' +
        ' > ' +
        newArtikel_TDT_Name +
        ' - ' +
        newFixlaenge +
        'mm-' +
        newMehrfachlaenge +
        'mm-' +
        newAnzahlFixlaengenProMehrfachlaenge +
        '-' +
        newZiehGeschwindigkeit +
        'm/min ' +
        '-' +
        newProfileGekoppelt +
        '-' +
        newAusgleichStueck +
        '- ' +
        vDornVorSPS +
        //'⤅↦»-' +
        //'» ' +
        '›|‹' +
        vDornZurueckSPS +
        ' - ' +
        //'« -' +
        //'«↤⬶-' +
        newDateTime;
      // newDatum +
      // ':' +
      // newUhrzeit;

      const spsResult_recipeName = await writeRECIPE_NAMEtoSPS_OPCUA(
        new_RECIPE_NAME_toWrite,
      );

      console.log('spsResult_recipeName: ', spsResult_recipeName);

      if (!spsResult_recipeName) {
        isPLC_Result_recipeName = false;
        return next(
          new AppError('Fehler im Schreiben von RECIPE_NAME!!! ', 400),
        );
      }

      isPLC_Result_recipeName = true;
    } catch (err) {
      console.log('Fehler im Schreiben von RECIPE_NAME to sps_OPCUA!', err);
      isPLC_Result_recipeName = false;
      return next(
        new AppError('Fehler im Schreiben von RECIPE_NAME!!! ' + err, 400),
      );
    }
    //----------------------------------------------SPS-RECIPE_NAME-Schreiben----Up--------------------------------------------------

    //----------------------------------------------ZiehPositionen----Down-----------------------------------------------------------

    console.log(
      '--------------------------------ziehPositionen-------------------------------------',
    );
    const dornStufenPositionenArr = [];

    for (let i = 0; i < recipeToSend.dornStufen.dornStufe.length; i++) {
      let stufe = recipeToSend.dornStufen.dornStufe[i];
      dornStufenPositionenArr.push(stufe.position);
    }

    console.log('dornStufenPositionenArr:', dornStufenPositionenArr);

    for (let i = 0; i < dornStufenPositionenArr.length; i++) {
      for (let j = 0; j < dornStufenPositionenArr.length - 1; j++) {
        if (dornStufenPositionenArr[j] > dornStufenPositionenArr[j + 1]) {
          // Tauschen, wenn das aktuelle Element größer als das nächste ist
          let temp = dornStufenPositionenArr[j];
          dornStufenPositionenArr[j] = dornStufenPositionenArr[j + 1];
          dornStufenPositionenArr[j + 1] = temp;
        }
      }
    }
    console.log('dornStufenPositionenArr:', dornStufenPositionenArr);
    let isCheckDornPosition = checkDornPositions(dornStufenPositionenArr);
    console.log('isCheckDornPosition: ' + isCheckDornPosition);

    //------------------------------------------Dorn-Speed-Array erstellen----Down------------------------------------------------------
    const dornSpeedArr = [vDornVorSPS, vDornZurueckSPS];
    console.log('----------------Dorn-Speed-Array erstellen---', dornSpeedArr);
    //------------------------------------------Dorn-Speed-Array erstellen----Up--------------------------------------------------------

    //----------------------------------Falls man ZwischenEcke mal haben möchte... --------------------------
    let wanddickenEckeArrMitZE = [];

    for (let i = 0; i < recipeToSend.eckenListe.ecke.length; i++) {
      let wanddicke = recipeToSend.eckenListe.ecke[i];
      wanddickenEckeArrMitZE.push(wanddicke.z);
    }
    //console.log('wanddickenEckeArrMitZE: ' + wanddickenEckeArrMitZE);

    let uniqueWanddickenEckeArrMitZE = wanddickenEckeArrMitZE.filter(
      (x, i) => wanddickenEckeArrMitZE.indexOf(x) === i,
    );
    // console.log(
    //   'UniqueWanddickenEckeArrMitZE ohne doppel: ' +
    //     uniqueWanddickenEckeArrMitZE,
    // );

    uniqueWanddickenEckeArrMitZE.sort((a, b) => a - b);
    // console.log(
    //   'sortiert UniqueWanddickenEckeArrMitZE: ' + uniqueWanddickenEckeArrMitZE,
    // );
    //----------------------------------Falls man ZwischenEcke mal haben möchte... --------------------------

    //console.log('recipeToSend.artikelName: ' + recipeToSend.artikelName);
    let artikelFull = recipeToSend.artikelName.split(' ')[0];
    console.log('artikelFull: ' + artikelFull);

    let wanddickenFull = artikelFull.split('x')[1];
    console.log('wanddickenFull: ' + wanddickenFull);

    //let wanddickenArray = wanddickenFull.split('-').map(parseFloat);
    // let wanddickenArray = wanddickenFull
    //   .split('-')
    //   .map((num) => parseFloat(parseFloat(num).toFixed(2)));

    let wanddickenArray = wanddickenFull
      .split('-')
      .map((num) => parseFloat(num).toFixed(2));

    console.log('wanddickenArray:', wanddickenArray);
    let isCheckWandickenArrayName = checkWallThicknessArray(wanddickenArray);
    console.log('isCheckWandickenArrayName', isCheckWandickenArrayName);

    console.log('-------------------------------------');
    let angel = recipeToSend.angel;
    console.log('angel:', angel);

    //"mehrfachlaengenDaten":{"fixlaenge":1625,"ausgleichstueck":30,"mehrfachlaenge":8500,"anzahlFixlaengenProMehrfachlaenge":5,
    let profileGekoppelt = recipeToSend.profileGekoppelt;
    console.log('profileGekoppelt:', profileGekoppelt);

    let mehrfachlaenge = recipeToSend.mehrfachlaengenDaten.mehrfachlaenge;
    console.log('mehrfachlaenge:', mehrfachlaenge);

    let fixlaengeMFL = recipeToSend.mehrfachlaengenDaten.fixlaenge;
    console.log('fixlaengeMFL:', fixlaengeMFL);

    let ausgleichstueck = recipeToSend.mehrfachlaengenDaten.ausgleichstueck;
    console.log('ausgleichstueck:', ausgleichstueck);

    let anzahlFixlaengenProMehrfachlaenge =
      recipeToSend.mehrfachlaengenDaten.anzahlFixlaengenProMehrfachlaenge;
    console.log(
      'anzahlFixlaengenProMehrfachlaenge:',
      anzahlFixlaengenProMehrfachlaenge,
    );

    const eckenArrayOhneId = recipeToSend.eckenListe.ecke.map((ecke) => ({
      x: ecke.x,
      z: parseFloat(ecke.z).toFixed(2),
    }));
    //console.log('eckenArrayOhneId:', eckenArrayOhneId);
    // console.log(
    //   'eckenArrayOhneId:\n',
    //   JSON.stringify(eckenArrayOhneId, null, 2),
    // );
    console.log('-------------------------------------');
    console.log('wanddickenArray:', wanddickenArray);
    console.log('eckenArrayOhneId:', eckenArrayOhneId);
    //--------------------Entferne ZwischenEcken---------------------------------------------------
    let eckenArrOhneZE = [];
    for (let i = 0; i < eckenArrayOhneId.length; i++) {
      if (i > 0 && eckenArrayOhneId[i].x === eckenArrayOhneId[i - 1].x + 2) {
        // Überspringe wenn 2mm grösser
        continue;
      }
      eckenArrOhneZE.push(eckenArrayOhneId[i]);
    }

    console.log('eckenArrOhneZE:', eckenArrOhneZE);
    let isCheckWallTicknesInCornerArrayWithoutBetweenCorner =
      checkWallTicknesInCornerArrayWithoutBetweenCorner(eckenArrOhneZE);
    console.log(
      'isCheckWallTicknesInCornerArrayWithoutBetweenCorner:',
      isCheckWallTicknesInCornerArrayWithoutBetweenCorner,
    );

    console.log(
      'hier dornVerstellung Probleme!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    );
    let eckenArrOhneZwischenEckeMitDornPos = zuordnenDornPositionen(
      eckenArrOhneZE,
      wanddickenArray,
      dornStufenPositionenArr,
    );
    console.log(
      'eckenArrOhneZwischenEckeMitDornPos:',
      eckenArrOhneZwischenEckeMitDornPos,
    );
    console.log(
      '---------------------------------------------------------------------------',
    );

    //-----------------Suche erste dornPos-----------------------
    let ersteEcke = eckenArrOhneZwischenEckeMitDornPos[0];
    console.log('ersteEcke:', ersteEcke);

    let letzteEcke =
      eckenArrOhneZwischenEckeMitDornPos[
        eckenArrOhneZwischenEckeMitDornPos.length - 1
      ];
    console.log('letzteEcke:', letzteEcke);

    let ersteEckeDornPos = eckenArrOhneZwischenEckeMitDornPos[0].dVerst;
    console.log('ersteEckeDornPos:', ersteEckeDornPos);

    let letzteEckeDornPos =
      eckenArrOhneZwischenEckeMitDornPos[
        eckenArrOhneZwischenEckeMitDornPos.length - 1
      ].dVerst;
    console.log('letzteEckeDornPos:', letzteEckeDornPos);

    let ersteEckeWD = parseFloat(
      eckenArrOhneZwischenEckeMitDornPos[0].z,
    ).toFixed(2);
    console.log('ersteEckeWD:', ersteEckeWD);

    let letzteEckeWD = parseFloat(
      eckenArrOhneZwischenEckeMitDornPos[
        eckenArrOhneZwischenEckeMitDornPos.length - 1
      ].z,
    ).toFixed(2);
    console.log('letzteEckeWD:', letzteEckeWD);
    console.log('-------------------');
    //-------------------------AngelArray mit dornPos------------------------------
    let angelArrDornPos = [
      {
        x: angel,
        z: ersteEckeWD,
        dVerst: ersteEckeDornPos,
      },
    ];
    console.log('angelArrDornPos:', angelArrDornPos);
    console.log('angelArrDornPos[0].z:', angelArrDornPos[0].z);

    //-------------------------erstes ZwischenStück mit dornPos------------------------------
    let angelZwischenStueck = [
      {
        x: 0,
        z: parseFloat(angelArrDornPos[0].z).toFixed(2),
        dVerst: ersteEckeDornPos,
      },
      {
        x: ausgleichstueck,
        z: parseFloat(angelArrDornPos[0].z).toFixed(2),
        dVerst: ersteEckeDornPos,
      },
    ];
    console.log('angelZwischenStueck:', angelZwischenStueck);
    // console.log(
    //   'angelZwischenStueck:',
    //   JSON.stringify(angelZwischenStueck, null, 2),
    // );
    //------------------------------------ZwischenStück normale (achtung AnfangEndeWD von Fixlänge in betracht)--------------------
    let zwischenStueck = [
      {
        x: 0,
        z: letzteEckeWD,
        dVerst: letzteEckeDornPos,
      },
      {
        x: ausgleichstueck,
        z: ersteEckeWD,
        dVerst: ersteEckeDornPos,
      },
    ];
    console.log('zischenStueck:', zwischenStueck);
    //     //----------------------------------------------meinObjekt*------------------------------------
    // let ziehPositionsArr = [
    //   angelArrDornPos,
    //   angelZwischenStueck,
    //   eckenArrOhneZEmitDornPos,
    //   zwischenStueck,
    // ];
    // console.log('ziehPositionsArr:', ziehPositionsArr);

    let ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe = [];

    if (profileGekoppelt === 1) {
      ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.push(
        ...angelArrDornPos,
      );
      ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.push(
        ...angelZwischenStueck,
      );
      for (let i = 0; i < anzahlFixlaengenProMehrfachlaenge; i++) {
        ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.push(
          ...eckenArrOhneZwischenEckeMitDornPos,
        );
        ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.push(
          ...zwischenStueck,
        );
      }
    }

    if (profileGekoppelt === 2) {
      ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.push(
        ...angelArrDornPos,
      );
      ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.push(
        ...angelZwischenStueck,
      );
      for (
        let i = 0;
        i < Math.floor(anzahlFixlaengenProMehrfachlaenge / 2); //gerade anzahl Profile
        i++
      ) {
        ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.push(
          ...eckenArrOhneZwischenEckeMitDornPos,
        );
        ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.push(
          ...eckenArrOhneZwischenEckeMitDornPos,
        );
        ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.push(
          ...zwischenStueck,
        );
      }

      if (anzahlFixlaengenProMehrfachlaenge % 2 !== 0) {
        //Modulo für letztes Profil bei ungerade
        ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.push(
          ...eckenArrOhneZwischenEckeMitDornPos,
        );
      }
    }
    console.log(
      'ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe:',
      ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe,
    );

    // let ziehPositionsArr1 = [
    //   // {
    //   //   x: angelArrDornPos[0].x,
    //   //   z: angelArrDornPos[0].z,
    //   //   dVerst: angelArrDornPos[0].dVerst,
    //   // },
    //   // {
    //   //   x: angelZwischenStueck[1].x,
    //   //   z: angelZwischenStueck[1].z,
    //   //   dVerst: angelZwischenStueck[1].dVerst,
    //   // },
    //   ...angelArrDornPos,
    //   ...angelZwischenStueck,
    //   ...eckenArrOhneZEmitDornPos,
    //   ...zwischenStueck,
    // ];
    // console.log('ziehPositionsArr1:', ziehPositionsArr1);

    console.log(
      'anzahlFixlaengenProMehrfachlaenge',
      anzahlFixlaengenProMehrfachlaenge,
    );
    console.log('profileGekoppelt', profileGekoppelt);

    //     //--------------------------------------Ziehpositionen-------------------------------------------------------------------------------
    let ziehPositionsArrDoubleValues_x_z_dVerst = [];
    let aktuellePosition = 0;

    let fixLaengenArr = [
      { x: 0, z: '3.50', dVerst: 0 },
      { x: 200, z: '3.50', dVerst: 0 },
      { x: 220, z: '2.30', dVerst: 47 },
      { x: 300, z: '2.30', dVerst: 47 },
      { x: 320, z: '3.50', dVerst: 0 },
      { x: 5000, z: '3.50', dVerst: 0 },
    ];
    fixLaengenArr = eckenArrOhneZwischenEckeMitDornPos;
    console.log('fixLaengenArr:', fixLaengenArr);

    function addPosition(arr) {
      arr.forEach((element) => {
        ziehPositionsArrDoubleValues_x_z_dVerst.push({
          x: aktuellePosition + element.x,
          z: element.z,
          dVerst: element.dVerst,
        });
        aktuellePosition += element.x;
      });
    }

    function addPositionFixLaenge(arr) {
      arr.forEach((element) => {
        ziehPositionsArrDoubleValues_x_z_dVerst.push({
          x: aktuellePosition + element.x,
          z: element.z,
          dVerst: element.dVerst,
        });
      });
      aktuellePosition =
        ziehPositionsArrDoubleValues_x_z_dVerst[
          ziehPositionsArrDoubleValues_x_z_dVerst.length - 1
        ].x;
      console.log('addPositionFixLaenge: aktuellePosition:', aktuellePosition);
    }

    addPosition(angelArrDornPos);
    addPosition(angelZwischenStueck);

    if (profileGekoppelt === 1) {
      for (let i = 0; i < anzahlFixlaengenProMehrfachlaenge; i++) {
        addPositionFixLaenge(fixLaengenArr);
        addPosition(zwischenStueck);
      }
    }

    if (profileGekoppelt === 2) {
      for (
        let i = 0;
        i < Math.floor(anzahlFixlaengenProMehrfachlaenge / 2); //gerade anzahl Profile
        i++
      ) {
        addPositionFixLaenge(fixLaengenArr);
        addPositionFixLaenge(fixLaengenArr);
        addPosition(zwischenStueck);
      }

      if (anzahlFixlaengenProMehrfachlaenge % 2 !== 0) {
        //Modulo für letztes Profil bei ungerade
        addPositionFixLaenge(fixLaengenArr);
      }
    }

    // addPositionFixLaenge(fixLaengenArr);
    // //aktuellePosition = ziehPositionsArr44[ziehPositionsArr44.length - 1].x;
    // console.log('aktuellePosition:', aktuellePosition);
    // addPosition(zwischenStueck);
    // addPositionFixLaenge(fixLaengenArr);
    // //aktuellePosition = ziehPositionsArr44[ziehPositionsArr44.length - 1].x;
    // console.log('aktuellePosition:', aktuellePosition);
    // addPosition(zwischenStueck);
    // addPositionFixLaenge(fixLaengenArr);

    console.log(
      'ziehPositionsArrDoubleValues_x_z_dVerst:',
      ziehPositionsArrDoubleValues_x_z_dVerst,
    );

    //------------------------------Doppelte entfernen----------------------------
    let ziehPositionsArrUnique = [];
    let doppelXValueArr = [];

    ziehPositionsArrDoubleValues_x_z_dVerst.forEach((position) => {
      if (!doppelXValueArr.includes(position.x)) {
        ziehPositionsArrUnique.push(position);

        doppelXValueArr.push(position.x);
      }
    });

    console.log('ziehPositionsArrUnique:', ziehPositionsArrUnique);

    //--------------------------------------Array mit Speed und Beschleunigung---Down-----------------------------------------------------------------------------
    console.log(
      '--------------------------------------Array mit Speed und Beschleunigung',
    );

    let ziehPositionWithWriteByDobbleUnique = [
      // {
      //   x,
      //   z,
      //   dVerst,
      //   doubleDVerst,
      // },
    ];

    for (let i = 0; i < ziehPositionsArrUnique.length; i++) {
      //-console.log(ziehPositionsArrUnique[i]);

      if (
        i > 0 &&
        ziehPositionsArrUnique[i - 1].dVerst ===
          ziehPositionsArrUnique[i].dVerst
      ) {
        ziehPositionWithWriteByDobbleUnique.push({
          x: ziehPositionsArrUnique[i].x,
          z: ziehPositionsArrUnique[i].z,
          dVerst: ziehPositionsArrUnique[i].dVerst,
          doubleDVerst: ziehPositionsArrUnique[i].dVerst + ' - doppelt',
        });
      } else {
        ziehPositionWithWriteByDobbleUnique.push({
          x: ziehPositionsArrUnique[i].x,
          z: ziehPositionsArrUnique[i].z,
          dVerst: ziehPositionsArrUnique[i].dVerst,
          doubleDVerst: ziehPositionsArrUnique[i].dVerst,
        });
      }
    }

    console.log(
      '***---*** ziehPositionWithWriteByDobbleUnique: ',
      ziehPositionWithWriteByDobbleUnique,
    );

    let ziehPositionWithoutDobbleUnique = [];
    for (let i = 0; i <= ziehPositionWithWriteByDobbleUnique.length - 1; i++) {
      //console.log('*-*', ziehPositionWithWriteByDobbleUnique[i]);
      if (
        !ziehPositionWithWriteByDobbleUnique[i].doubleDVerst
          .toString()
          .includes('doppelt')
      ) {
        ziehPositionWithoutDobbleUnique.push(
          ziehPositionWithWriteByDobbleUnique[i],
        );
      }
    }
    console.log(
      '*-*-*-*-*-* ziehPositionWithoutDobbleUnique: ',
      ziehPositionWithoutDobbleUnique,
    );

    let ziehPosition_DIN = [];
    for (let i = 0; i <= ziehPositionWithoutDobbleUnique.length - 1; i++) {
      ziehPosition_DIN.push({
        x: ziehPositionWithoutDobbleUnique[i].x,
        z: ziehPositionWithoutDobbleUnique[i].z,
        dVerst: ziehPositionWithoutDobbleUnique[i].dVerst,
      });
    }
    console.log(
      '------------------------------DIN----------------------------------------',
    );
    console.log('ZiehPosition_DIN: \n', ziehPosition_DIN);

    let ziehPositionWithSpeedDirectionUnique = [];

    for (let i = 0; i <= ziehPositionWithoutDobbleUnique.length - 1; i++) {
      //console.log('---***---:', ziehPositionWithoutDobbleUnique); //richtig

      if (i === 0) {
        if (ziehPositionWithoutDobbleUnique[i].dVerst > 0) {
          ziehPositionWithSpeedDirectionUnique.push({
            x: ziehPositionWithoutDobbleUnique[i].x,
            z: ziehPositionWithoutDobbleUnique[i].z,
            dVerst: ziehPositionWithoutDobbleUnique[i].dVerst,
            doubleDVerst: ziehPositionWithoutDobbleUnique[i].doubleDVerst,
            vSpeed: 'Vor',
          });
        } else {
          ziehPositionWithSpeedDirectionUnique.push({
            x: ziehPositionWithoutDobbleUnique[i].x,
            z: ziehPositionWithoutDobbleUnique[i].z,
            dVerst: ziehPositionWithoutDobbleUnique[i].dVerst,
            doubleDVerst: ziehPositionWithoutDobbleUnique[i].doubleDVerst,
            vSpeed: 'Zurueck',
          });
        }
      } else if (i > 0) {
        if (
          ziehPositionWithoutDobbleUnique[i].dVerst <
          ziehPositionWithoutDobbleUnique[i - 1].dVerst
        ) {
          ziehPositionWithSpeedDirectionUnique.push({
            x: ziehPositionWithoutDobbleUnique[i].x,
            z: ziehPositionWithoutDobbleUnique[i].z,
            dVerst: ziehPositionWithoutDobbleUnique[i].dVerst,
            doubleDVerst: ziehPositionWithoutDobbleUnique[i].doubleDVerst,
            vSpeed: 'Zurueck',
          });
        } else {
          ziehPositionWithSpeedDirectionUnique.push({
            x: ziehPositionWithoutDobbleUnique[i].x,
            z: ziehPositionWithoutDobbleUnique[i].z,
            dVerst: ziehPositionWithoutDobbleUnique[i].dVerst,
            doubleDVerst: ziehPositionWithoutDobbleUnique[i].doubleDVerst,
            vSpeed: 'Vor',
          });
        }
      }
    }

    console.log('*-*-*-*-*-* ziehPositionWithSpeedDirectionUnique: [');

    for (const item of ziehPositionWithSpeedDirectionUnique) {
      console.log(
        `  { x: ${item.x}, z: '${item.z}', dVerst: ${item.dVerst}, doubleDVerst: ${item.doubleDVerst}, vSpeed: '${item.vSpeed}' },`,
      );
    }

    console.log(']');

    //----------------------------------------------------------------------------

    const plcOPCUA_ACCELERATION_VALUE =
      process.env.PLC_OPCUA_ACCELERATION_VALUE;

    console.log('plcOPCUA_ACCELERATION_VALUE: ', plcOPCUA_ACCELERATION_VALUE);
    //vDornVorSPS = 16;
    console.log('vDornVorSPS:', vDornVorSPS);
    console.log('vDornZurueckSPS:', vDornZurueckSPS);

    const vDornVorSPS_ratio = vDornVorSPS / 100;
    const vDornZurueckSPS_ratio = vDornZurueckSPS / 100;

    console.log('vDornVorSPS_ratio:', vDornVorSPS_ratio);
    console.log('vDornZurueckSPS_ratio:', vDornZurueckSPS_ratio);

    console.log('vDornVorSPS / 100', vDornVorSPS / 100);
    console.log('vDornZurueckSPS / 100', vDornZurueckSPS / 100);

    let ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique = [];
    for (let i = 0; i <= ziehPositionWithSpeedDirectionUnique.length - 1; i++) {
      if (ziehPositionWithSpeedDirectionUnique[i].vSpeed === 'Vor') {
        ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique.push({
          x: ziehPositionWithSpeedDirectionUnique[i].x,
          z: ziehPositionWithSpeedDirectionUnique[i].z,
          dVerst: ziehPositionWithSpeedDirectionUnique[i].dVerst,
          //doubleDVerst: ziehPositionWithSpeedDirectionUnique[i].doubleDVerst,
          vSpeed: ziehPositionWithSpeedDirectionUnique[i].vSpeed,
          POS: ziehPositionWithSpeedDirectionUnique[i].x,
          Speed: vDornVorSPS_ratio,
          Acceleration: parseFloat(plcOPCUA_ACCELERATION_VALUE), //7.5,
          Stroke: ziehPositionWithSpeedDirectionUnique[i].dVerst,
        });
      } else {
        ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique.push({
          x: ziehPositionWithSpeedDirectionUnique[i].x,
          z: ziehPositionWithSpeedDirectionUnique[i].z,
          dVerst: ziehPositionWithSpeedDirectionUnique[i].dVerst,
          //doubleDVerst: ziehPositionWithSpeedDirectionUnique[i].doubleDVerst,
          vSpeed: ziehPositionWithSpeedDirectionUnique[i].vSpeed,
          POS: ziehPositionWithSpeedDirectionUnique[i].x,
          Speed: vDornZurueckSPS_ratio,
          Acceleration: parseFloat(plcOPCUA_ACCELERATION_VALUE), //7.5,
          Stroke: ziehPositionWithSpeedDirectionUnique[i].dVerst,
        });
      }
    }

    // console.log(
    //   '*-*-*-*-*-* ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique: ',
    //   ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique, //JSON.stringify(ziehPositionWithSpeedDirectionUnique, null, 2),
    // );
    console.log(
      '*-*-*-*-*-*  ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique: [',
    );
    for (const item of ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique) {
      console.log(
        `  { x: ${item.x}, z: '${item.z}', dVerst: ${item.dVerst}, vSpeed: ${item.vSpeed}, POS: ${item.POS}, Speed: ${item.Speed}, Acceleration: ${item.Acceleration}, Stroke: ${item.Stroke} },`,
      );
    }
    console.log('TODO: UMWANDELN IN REAL!]');
    //TODO: UMWANDELN IN REAL!!!!!!!!

    //------------------------------Umwandeln in spezifischen DatenTyp-------Down--------------------------------------------------------
    let ziehPositionenQuestionDataTypArr = [];
    for (
      let i = 0;
      i <=
      ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique.length -
        1;
      i++
    ) {
      ziehPositionenQuestionDataTypArr.push({
        x: ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i].x,
        x_typ:
          typeof ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[
            i
          ].x,
        z: ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i].z,
        z_typ:
          typeof ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[
            i
          ].z,
        dVerst:
          ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i]
            .dVerst,
        dVerst_typ:
          typeof ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[
            i
          ].dVerst,
        vSpeed:
          ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i]
            .vSpeed,
        vSpeed_typ:
          typeof ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[
            i
          ].vSpeed,
        POS: ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i]
          .POS,
        POS_typ:
          typeof ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[
            i
          ].POS,
        Speed:
          ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i]
            .Speed,
        Speed_typ:
          typeof ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[
            i
          ].Speed,
        Acceleration:
          ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i]
            .Acceleration,
        Acceleration_typ:
          typeof ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[
            i
          ].Acceleration,
        Stroke:
          ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i]
            .Stroke,
        Stroke_typ:
          typeof ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[
            i
          ].Stroke,
      });
    }

    // console.log('*-*-*-*-*-*  ziehPositionenQuestionDataTypArr: [');
    // for (const item of ziehPositionenQuestionDataTypArr) {
    //   console.log(
    //     `  { x: ${item.x}, x_typ: ${item.x_typ}, z: ${item.z}, z_typ: ${item.z_typ}, dVerst: ${item.dVerst}, dVerst_typ: ${item.dVerst_typ}, vSpeed: ${item.vSpeed}, vSpeed_typ: ${item.vSpeed_typ}, POS: ${item.POS}, POS_typ: ${item.POS_typ}, Speed: ${item.Speed}, Speed_typ: ${item.Speed_typ}, Acceleration: ${item.Acceleration}, Acceleration_typ: ${item.Acceleration_typ}, Stroke: ${item.Stroke} }, Stroke_typ: ${item.Stroke_typ} },`,
    //   );
    // }
    // console.log(']');
    console.log('*-*-*-*-*-*  ziehPositionenQuestionDataTypArr: [');
    for (const item of ziehPositionenQuestionDataTypArr) {
      console.log(
        `  { x_t: ${item.x_typ}, z_t: ${item.z_typ}, dVerst_t: ${item.dVerst_typ}, vSpeed_t: ${item.vSpeed_typ}, POS_t: ${item.POS_typ}, Speed_t: ${item.Speed_typ}, Acceleration_t: ${item.Acceleration_typ}, Stroke_t: ${item.Stroke_typ} },`,
      );
    }
    console.log(']');

    let ziehPositionenDatatypFloatArr = [];
    for (
      let i = 0;
      i <=
      ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique.length -
        1;
      i++
    ) {
      ziehPositionenDatatypFloatArr.push({
        POS: ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i]
          .POS,
        Speed:
          ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i]
            .Speed,
        Acceleration:
          ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i]
            .Acceleration,
        Stroke:
          ziehArray_X_Z_dVerst_Speed_POS_Speed_Acceleration_Stroke_Unique[i]
            .Stroke,
      });
    }
    console.log(
      'ziehPositionenDatatypFloatArr:',
      ziehPositionenDatatypFloatArr,
    );

    let ziehPositionenQuestionFloatArr = [];
    for (let i = 0; i <= ziehPositionenDatatypFloatArr.length - 1; i++) {
      ziehPositionenQuestionFloatArr.push({
        POS_t: typeof ziehPositionenDatatypFloatArr[i].POS,
        Speed_t: typeof ziehPositionenDatatypFloatArr[i].Speed,
        Acceleration_t: typeof ziehPositionenDatatypFloatArr[i].Acceleration,
        //Stroke: Number.parseFloat(ziehPositionenDatatypFloatArr[i].Stroke), //ziehPositionenDatatypFloatArr[i].Stroke.parseFloat(), //Number.parseFloat(ziehPositionenDatatypFloatArr[i].Stroke),
        Stroke_t: typeof ziehPositionenDatatypFloatArr[i].Stroke,
      });
    }

    // console.log(
    //   'ziehPositionenQuestionFloatArr:',
    //   ziehPositionenQuestionFloatArr,
    // );
    //console.log(JSON.stringify(ziehPositionenQuestionFloatArr, null, 2));
    console.table(ziehPositionenQuestionFloatArr);

    try {
      console.log('🟦🟦🟦 CleanUP OPCUA...');
      const cleanUpResult =
        await writeSTEP_POSITIONS_CleanUPwithZeros_toSPS_OPCUA();
      //console.log('cleanUpResult: ', JSON.stringify(cleanUpResult));
      if (cleanUpResult.success === false) {
        return next(
          new AppError(
            'Fehler beim CleanUp der Zieh-Positionen! ' +
              'Fehler in getWriteRecipeToSPS_OPCUA erhalten von: ' +
              JSON.stringify(cleanUpResult),
            400,
          ),
        );
      } else {
        console.log('✅ 🟦🟦🟦 CleanUP OPCUA erfolgreich!');
      }
      //}
    } catch (err) {
      console.log('❌❌❌ Fehler bei Clean Up!...' + err);
      return next(
        new AppError(
          'Fehler beim ❌❌❌ CleanUp der Zieh-Positionen! ' +
            'Fehler in getWriteRecipeToSPS_OPCUA erhalten von: ' +
            JSON.stringify(cleanUpResult) +
            err,
          400,
        ),
      );
    }

    // //TODO: erst wenn positionen geschrieben, name schreiben, ansonsten apperror?
    let isResultSTEP_POSITIONS = false;
    try {
      const resultSTEP_POSITIONS = await writeSTEP_POSITIONStoSPS_OPCUA(
        ziehPositionenDatatypFloatArr,
      );
      console.log('resultSTEP_POSITIONS: ', resultSTEP_POSITIONS);
      if (resultSTEP_POSITIONS.success === false) {
        isResultSTEP_POSITIONS = false;
        return next(
          new AppError(
            'Fehler beim Schreiben der Positionen auf der SPS! ' +
              'Fehler in getWriteRecipeToSPS_OPCUA erhalten von: ' +
              JSON.stringify(resultSTEP_POSITIONS),
            400,
          ),
        );
      }
      console.log(
        'resultSTEP_POSITIONS:---------------------',
        resultSTEP_POSITIONS,
      );
      isResultSTEP_POSITIONS = true;
    } catch (err) {
      isResultSTEP_POSITIONS = false;
      console.log('Feeeeeeeeehllllller: ' + err);
      return next(
        new AppError(
          'Fehler beim Schreiben der Positionen auf der SPS! ❌❌❌ ' +
            'Fehler in getWriteRecipeToSPS_OPCUA erhalten von: ' +
            err,
          400,
        ),
      );
    }
    //-----------------------------------------------------------------

    // let ziehPositionenQuestionFloatArr1 = [];
    // for (let i = 0; i <= 1; i++) {
    //   ziehPositionenQuestionFloatArr1.push({
    //     // POS_t: typeof ziehPositionenQuestionFloatArr[i].POS_t,
    //     // Speed_t: typeof ziehPositionenQuestionFloatArr[i].Speed_t,
    //     // Acceleration_t: typeof ziehPositionenQuestionFloatArr[i].Acceleration_t,
    //     Stroke: typeof ziehPositionenQuestionFloatArr[i].Stroke,
    //     Stroke_t: typeof ziehPositionenQuestionFloatArr[i].Stroke_t,
    //   });
    // }

    // console.log(
    //   'ziehPositionenQuestionFloatArr1:',
    //   ziehPositionenQuestionFloatArr1,
    // );
    //------------------------------Umwandeln in spezifischen DatenTyp-------Up----------------------------------------------------------

    //--------------------------------------Array mit Speed und Beschleunigung---UP---------------------------------------------------------------

    //--------------------------------ziehPositionen BECKHOFF----DOWN------------------------------------------------
    // let ziehPositionenArr_toWrite_BECKHOFF = [];

    // for (let i = 0; i < ziehPositionsArrUnique.length; i++) {
    //   let ziehPositionenObj_BECKHOFF = {
    //     Pos: ziehPositionsArrUnique[i].x,
    //     Verst: ziehPositionsArrUnique[i].dVerst,
    //     // Pos: parseFloat(ziehPositionsArrUnique[i].x),
    //     // Verst: parseFloat(ziehPositionsArrUnique[i].dVerst),
    //   };
    //   // ziehPositionenObj.Pos = ziehPositionsArrUnique[i].x;
    //   // ziehPositionenObj.Verst = ziehPositionsArrUnique[i].dVerst;

    //   ziehPositionenArr_toWrite_BECKHOFF.push(ziehPositionenObj_BECKHOFF);
    // }

    // console.log('***************************************');
    // console.log(
    //   'ziehPositionenArr:',
    //   JSON.stringify(ziehPositionenArr, null, 2),
    // );
    //console.log('ziehPositionenArr_toWrite_BECKHOFF:', ziehPositionenArr_toWrite_BECKHOFF);

    //     //try {
    //     const spsResult_ZiehPositionsArray = await writeData_ZiehPositionsArray(
    //       ziehPositionenArr_toWrite,
    //     );
    //--------------------------------ziehPositionen BECKHOFF----UP------------------------------------------------

    // // let isWrittenInCSV = false;
    // // let csvError = '';
    // // try {
    // //   console.log('WriteCSV_File');
    // //   const dataToWrite = formatZiehPositionsData_toWriteCSV_File(
    // //     ziehPositionenArr_toWrite,
    // //     ziehPositionsArrDoubleValues_x_z_dVerst,
    // //     ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe,
    // //   );

    // //   const fileNameToWrite = `${newArtikelNummer}.csv`;
    // //   isWrittenInCSV = await writeCSV_File(fileNameToWrite, dataToWrite);

    // //   console.log(`CSV-Datei ${fileNameToWrite} erfolgreich geschrieben.`);
    // // } catch (error) {
    // //   console.error('Fehler beim Schreiben der CSV-Datei:', error);
    // //   isWrittenInCSV = false;
    // //   csvError = 'Fehler beim Schreiben der CSV-Datei:' + error;
    // // }

    console.log(
      'WriteCSV_File ------------------------------------------------------------- *********',
    );

    let isWrittenInCSV = false;
    let csvError = '';
    try {
      console.log('WriteCSV_File');
      const dataToWrite = formatZiehPositionsData_OPCUA_toWriteCSV_File(
        // ziehPositionenArr_toWrite,
        // ziehPositionsArrDoubleValues_x_z_dVerst,
        // ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe,

        //ziehPositionenDatatypFloatArr,
        //ziehPositionenQuestionDataTypArr,
        new_RECIPE_NAME_toWrite,
        //writeZiehPositionenArr,
        ziehPositionenDatatypFloatArr,
        ziehPositionWithSpeedDirectionUnique,
        ziehPosition_DIN,
        ziehPositionWithWriteByDobbleUnique,
        ziehPositionsArrUnique,
        ziehPositionsArrDoubleValues_x_z_dVerst,
        fixLaengenArr,
        ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe,
      );

      const fileNameToWrite = `${newArtikelNummer}.csv`;
      isWrittenInCSV = await writeCSV_File(fileNameToWrite, dataToWrite);

      console.log(`CSV-Datei ${fileNameToWrite} erfolgreich geschrieben.`);
      console.log('isWrittenInCSV:****', isWrittenInCSV);
    } catch (error) {
      console.error('Fehler beim Schreiben der CSV-Datei:', error);
      isWrittenInCSV = false;
      csvError = 'Fehler beim Schreiben der CSV-Datei:' + error;
    }
    //---------------------------------AAAAAAAAAAAAAAAAABBBBBBB hierrrrrrrrrrrrrr-------------------------------------------------
    let isWrittenRecipeSendSPSLog = false;
    let recipeSendSPSLogError = '';
    let isWirttenRecipeStatistic = false;
    let recipeStatisticError = '';

    if (
      //isWrittenInCSV &&
      //spsResult_vCSvName === true &&
      //spsResult_ZiehPositionsArray === true
      // spsResult_recipeName.success === true &&
      // resultSTEP_POSITIONS.success === true
      isWrittenInCSV === true &&
      isPLC_Result_recipeName === true &&
      isResultSTEP_POSITIONS === true
    ) {
      console.log('-----------------------------');
      console.log(req.body.userSendData);
      console.log(fa_Nummer);
      //--------------------------------------------Orchistrierung-----------------------------------------------------
      let createRecipeSendLog = '';
      try {
        //const logResponce = await createRecipeSendSPSLog(
        console.log('recipeToSend:', recipeToSend);
        console.log('userSendData:', userSendData);
        console.log('fa_Nummer:', fa_Nummer);
        console.log(
          '----------------------------------------------------------',
        );

        createRecipeSendLog = await createRecipeSendLogServiceFunction(
          recipeToSend,
          JSON.parse(userSendData),
          fa_Nummer,
        );
        //console.log('createRecipeSendLog', createRecipeSendLog);
        //return createRecipeSendLog;
        isWrittenRecipeSendSPSLog = true;
      } catch (err) {
        console.log('Es konnte kein RecipeSEndSPSLog erstellt werden! ', err);
        isWrittenRecipeSendSPSLog = false;
        //throw 'Es konnte kein RecipeSEndSPSLog erstellt werden' + err;
        recipeSendSPSLogError =
          'Es konnte kein RecipeSEndSPSLog erstellt werden! ' + err;
        //throw 'Es konnte kein RecipeSEndSPSLog erstellt werden! ' + err;
      }
      //console.log('createRecipeSendLog', createRecipeSendLog);
      //const newRecipeSendSPSLogID = createRecipeSendLog._id;

      if (createRecipeSendLog !== '') {
        let createRecipeStatistic = '';
        try {
          console.log('Mache makeCreateRecipeStatistic...');
          createRecipeStatistic = await makeCreateRecipeStatistic(
            //createRecipeStatisticServiceFunction(
            createRecipeSendLog, //newRecipeSendSPSLogID,
            JSON.parse(userSendData),
            //fa_Nummer,
          );

          isWirttenRecipeStatistic = true;
          console.log(
            'Mache makeCreateRecipeStatistic...return createRecipeStatistic',
            createRecipeStatistic,
          );
          //return createRecipeStatistic;
        } catch (err) {
          console.log('Es konnte keine RecipeStatistik erstellt werden', err);
          isWirttenRecipeStatistic = false;
          // throw 'Es konnte kein RecipeStatistik erstellt werden' + err;
          recipeStatisticError =
            'Es konnte kein RecipeStatistik erstellt werden' + err;
          //throw 'Es konnte kein RecipeStatistik erstellt werden' + err;
        }
      }

      //try{
      // if (
      //   isWrittenRecipeSendSPSLog === true &&
      //   isWirttenRecipeStatistic === true
      // ) {
      console.log('----------------bbbb-----------');
      console.log('csvError.length:', csvError.length);
      console.log(
        'recipeSendSPSLogError.length:',
        recipeSendSPSLogError.length,
      );
      console.log('recipeStatisticError.length:', recipeStatisticError.length);

      let messageCSVLogStatistic = '';

      if (
        csvError.length > 0 ||
        recipeSendSPSLogError.length > 0 ||
        recipeStatisticError.length > 0
      ) {
        messageCSVLogStatistic +=
          'Fehler bei Rezept-SPS- Senden: ' +
          csvError +
          recipeSendSPSLogError +
          recipeStatisticError;

        // return next(
        //   new AppError(
        //     'Fehler beim Schreiben eines Rezeptes auf der SPS! ' +
        //     'Fehler in getWriteRecipeToSPS erhalten von: ' +
        //     csvError +
        //     recipeSendSPSLogError +
        //     recipeStatisticError,
        //     400,
        //   ),
        // );
      } else {
        messageCSVLogStatistic += `Recipe sent successfully to plc!<br>CSV: ${isWrittenInCSV}, LOG: ${isWrittenRecipeSendSPSLog}, STATS: ${isWirttenRecipeStatistic}`;
      }

      //*************************************** */
      res.status(200).json({
        status: 'success', //Recipe sended successfully to plc
        //message: `Recipe sent successfully to plc!<br>CSV: ${isWrittenInCSV}, LOG: ${isWrittenRecipeSendSPSLog}, STATS: ${isWirttenRecipeStatistic}`,
        message: messageCSVLogStatistic, //`Recipe sent successfully to plc!<br>CSV: ${isWrittenInCSV}, LOG: ${isWrittenRecipeSendSPSLog}, STATS: ${isWirttenRecipeStatistic}`,
      });
      //*************************************** */
      //     } else {
      //       return next(
      //         new AppError(
      //           'Fehler beim Schreiben eines Rezeptes auf der SPS! ' +
      //             'Fehler in getWriteRecipeToSPS erhalten von: ' +
      //             csvError +
      //             recipeSendSPSLogError +
      //             recipeStatisticError,
      //           400,
      //         ),
      //       );
      //     }

      // }  else {
    }
  } catch (err) {
    console.log('Fehler in getWriteRecipeToSPS:', err);

    return next(
      new AppError(
        'Fehler beim Schreiben eines Rezeptes auf der SPS! ' +
          'Fehler in getWriteRecipeToSPS erhalten von: ' +
          err,
        400,
      ),
    );
  }
  //**************************************************************************************************** */ isPLC_Result_recipeName  isResultSTEP_POSITIONS = true;
});
