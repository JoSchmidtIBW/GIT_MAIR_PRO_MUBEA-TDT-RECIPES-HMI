import RecipeSendSPSLog_de from '../recipeSendSPSLog_de_Model.mjs';

export async function getFindAllRecipesSendSPSLogByUserID(userID) {
  console.log('Bin getFindAllRecipesSendSPSLogByUserID mit userID', userID);
  try {
    let allRecipesSendSPSLogByUserID_de = await RecipeSendSPSLog_de.find({
      'employeeSendBy.userOriginalID': userID,
    });

    if (allRecipesSendSPSLogByUserID_de.length === 0) {
      allRecipesSendSPSLogByUserID_de = [];
    }

    return allRecipesSendSPSLogByUserID_de;
  } catch (err) {
    console.log(`Could not fetch allRecipesSendSPSLogByUserID: ${err}`);
    throw (
      'getFindAllRecipesSendSPSLogByUserID: Could not fetch allRecipesSendSPSLogByUserID: ' +
      err
    );
  }
}

export async function getFindAllRecipesSendSPSLog() {
  try {
    const allRecipesSendSPSLog_de = await RecipeSendSPSLog_de.find()
      .populate({
        path: 'employeeSendBy.userOriginalID',
        select: '-__v -passwordChangedAt', // ausgeblendete Felder
      })
      .populate({
        path: 'recipeSend_recipeOriginalID',
        select: '-__v',
      });
    //.pretty(); //error
    ///.select('createdSendAt');
    //.sort({ createdSendAt: -1 }); //--- 1 for asc and -1 for desc     funktioniert aber nicht
    // .sort({
    //   createdSendAt: -1,
    // }); //.pretty();

    console.log('allRecipesSendSPSLog_de: ' + allRecipesSendSPSLog_de);
    return allRecipesSendSPSLog_de;
  } catch (err) {
    console.log(`Could not fetch allRecipesSendSPSLog_de: ${err}`);
    throw (
      'getFindAllRecipesSendSPSLog: Could not fetch allRecipesSendSPSLog_de: ' +
      err
    );
  }
}

export async function createRecipeSendSPSLog(
  fa_Nummer_RSSL,
  recipeSend_recipeOriginalID_RSSL,
  dataRecipe_RSSL,
  userSendData_RSSL,
) {
  console.log('Bin createRecipeSendSPSLog..');

  try {
    const newRecipeSendSPSLogData = {
      fa_number: fa_Nummer_RSSL,
      recipeSend_recipeOriginalID: recipeSend_recipeOriginalID_RSSL,
      recipeDataSend: {
        kopfDaten: {
          artikelNummer: dataRecipe_RSSL.artikelNummer,
          artikelName: dataRecipe_RSSL.artikelName,
          teileNummer: dataRecipe_RSSL.teileNummer, // || 'MTTXXXXXXXXX',
          zeichnungsNummer: dataRecipe_RSSL.zeichnungsNummer,
          aenderungsstandZeichnung: dataRecipe_RSSL.aenderungsstandZeichnung,
          aenderungsstandRezept: dataRecipe_RSSL.aenderungsstandRezept,
          beschreibung: dataRecipe_RSSL.beschreibung,
          ziehGeschwindigkeit: dataRecipe_RSSL.ziehGeschwindigkeit,
          v_dorn_Fwd: dataRecipe_RSSL.v_dorn_Fwd,
          v_dorn_Bwd: dataRecipe_RSSL.v_dorn_Bwd,
          kommentar: dataRecipe_RSSL.kommentar, //[{}],
          // kommentar: [
          //   { erstelltAm: null, benutzer: null, kommentarBeschreibung: null },
          // ],
        },
        dornWerte: {
          rohrAussenDurchmesserLetzterZug:
            dataRecipe_RSSL.rohrAussenDurchmesserLetzterZug,
          rohrInnenDurchmesserLetzterZug:
            dataRecipe_RSSL.rohrInnenDurchmesserLetzterZug,
          angel: dataRecipe_RSSL.angel,
          rohrAussenDurchmesserTDTZug:
            dataRecipe_RSSL.rohrAussenDurchmesserTDTZug,
          dornStufen: {
            dornStufe: dataRecipe_RSSL.dornStufe,
          },
        },
        mehrfachlaengenDaten: {
          fixlaenge: dataRecipe_RSSL.fixLaenge,
          ausgleichstueck: dataRecipe_RSSL.ausgleichsstueck,
          mehrfachlaenge: dataRecipe_RSSL.mehrfachLaenge,
          anzahlFixlaengenProMehrfachlaenge:
            dataRecipe_RSSL.anzahlFixLaengenProMehrfachLaenge,
          negativeToleranzMehrfachlaenge: dataRecipe_RSSL.negTolMehrfachLaenge,
          positiveToleranzMehrfachlaenge: dataRecipe_RSSL.posTolMehrfachLaenge,
          mindestanzahlGutprofile: dataRecipe_RSSL.mindestAnzahlGutProfile,
        },
        standartWerte: {
          obereToleranz: dataRecipe_RSSL.obereToleranz,
          untereToleranz: dataRecipe_RSSL.untereToleranz,
        },
        rohrWerte: {
          mindestGutanteil: dataRecipe_RSSL.mindestGutanteil,
          profileGekoppelt: dataRecipe_RSSL.profileGekoppelt,
        },
        eckenListe: {
          ecke: dataRecipe_RSSL.ecke,
        },
      },
      employeeSendBy: {
        userOriginalID: userSendData_RSSL.userSendID,
        firstName: userSendData_RSSL.userSendFirstName,
        lastName: userSendData_RSSL.userSendLastName,
        employeeNumber: userSendData_RSSL.userSendEmployeeNumber,
      },
    };
    //TODO: createdSendAt schauen, wenn auslagern ins backend orchestrierung, das .select('+createdSendAt');

    // Falsche Felder um Fehler zu erzeugen
    // const newRecipeSendSPSLogDataWrong = {
    //   invalidField: 'Ungültige Daten',
    // };
    const response = await new RecipeSendSPSLog_de(
      newRecipeSendSPSLogData,
    ).save({
      runValidators: true,
    });
    //.select('+createdSendAt');
    //response.createdSendAt = response.createdSendAt || Date.now();
    if (!response || !response._id) {
      throw new Error(
        'createRecipeSendSPSLog: RecipeSendSPSLog save response is null or missing _id.',
      );
    }

    const response1 = await RecipeSendSPSLog_de.findById(response._id).select(
      '+createdSendAt',
    );
    console.log('createRecipeSendSPSLog service response1', response1);

    console.log('Successfully saved recipeSendSPSLog_de');
    return response1;
  } catch (error) {
    console.log(
      `createRecipeSendSPSLog: Something wrong to create a recipeSendSPSLog_de${error}`,
    );
    console.error(
      `createRecipeSendSPSLog: Error creating recipeSendSPSLog_de: ${error.message}`,
    );
    throw `createRecipeSendSPSLog: Something wrong to create a recipeSendSPSLog_de ${error}`;
  }
}

export const createRecipeSendLogServiceFunction = async (
  recipeData,
  userSendData,
  fa_Nummer,
) => {
  try {
    console.log('bin createRecipeSendLogServiceFunction: ');

    const fa_Nummer_RSSL = parseFloat(fa_Nummer);

    const recipeSend_recipeOriginalID_RSSL = recipeData.id;
    console.log(
      'recipeSend_recipeOriginalID_RSSL: ' + recipeSend_recipeOriginalID_RSSL,
    );

    console.log('userSendDataaaaaaa: ', userSendData);
    const userSendData_RSSL = {
      userSendID: userSendData._id,
      userSendFirstName: userSendData.firstName,
      userSendLastName: userSendData.lastName,
      userSendEmployeeNumber: userSendData.employeeNumber,
    };
    console.log('userSendData_RSSL: ', userSendData_RSSL);
    console.log(
      '/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/',
    );

    const artikelNummer_RSSL = parseFloat(recipeData.artikelNummer);
    console.log('artikelNummer_RSSL: ' + artikelNummer_RSSL);

    const artikelName_RSSL = recipeData.artikelName;
    console.log('artikelName_RSSL: ' + artikelName_RSSL);

    const ziehGeschwindigkeit_RSSL = recipeData.ziehGeschwindigkeit;
    console.log('ziehGeschwindigkeit_RSSL: ' + ziehGeschwindigkeit_RSSL);

    const vDornVor_RSSL = recipeData.v_dorn_Fwd;
    console.log('vDornVor_RSSL:', vDornVor_RSSL);
    console.log('typeof vDornVor_RSSL:', typeof vDornVor_RSSL);

    const vDornZurueck_RSSL = recipeData.v_dorn_Bwd;
    console.log('vDornZurueck_RSSL:', vDornZurueck_RSSL);
    console.log('typeof vDornZurueck_RSSL:', typeof vDornZurueck_RSSL);

    const teileNummer_RSSL = recipeData.teileNummer;
    console.log('teileNummer_RSSL: ' + teileNummer_RSSL);
    const zeichnungsNummer_RSSL = recipeData.zeichnungsNummer;
    console.log('zeichnungsNummer_RSSL: ' + zeichnungsNummer_RSSL);
    const aenderungsstandZeichnung_RSSL = parseFloat(
      recipeData.aenderungsstandZeichnung,
    );
    console.log(
      'aenderungsstandZeichnung_RSSL: ' + aenderungsstandZeichnung_RSSL,
    );
    const aenderungsstandRezept_RSSL = parseFloat(
      recipeData.aenderungsstandRezept,
    );
    console.log('aenderungsstandRezept_RSSL: ' + aenderungsstandRezept_RSSL);
    const beschreibung_RSSL = recipeData.beschreibung;
    console.log('beschreibungUpdate: ' + beschreibung_RSSL);

    const kommentarArr_RSSL = recipeData.kommentar;

    const mindestGutanteil_RSSL = parseFloat(
      recipeData.rohrWerte.mindestGutanteil,
    );
    console.log('mindestGutanteil_RSSL: ' + mindestGutanteil_RSSL);
    const profileGekoppelt_RSSL = parseFloat(
      recipeData.rohrWerte.profileGekoppelt,
    );
    console.log('profileGekoppelt_RSSL: ' + profileGekoppelt_RSSL);

    const rohrAussenDurchmesserLetzterZug_RSSL = parseFloat(
      recipeData.rohrAussenDurchmesserLetzterZug,
    ).toFixed(2);
    console.log(
      'rohrAussenDurchmesserLetzterZug_RSSL: ' +
        rohrAussenDurchmesserLetzterZug_RSSL,
    );
    const rohrInnenDurchmesserLetzterZug_RSSL = parseFloat(
      recipeData.rohrInnenDurchmesserLetzterZug,
    ).toFixed(2);
    console.log(
      'rohrInnenDurchmesserLetzterZug_RSSL: ' +
        rohrInnenDurchmesserLetzterZug_RSSL,
    );
    const angel_RSSL = parseFloat(recipeData.angel);
    console.log('angel_RSSL: ' + angel_RSSL);
    const rohrAussenDurchmesserTDTZug_RSSL = parseFloat(
      recipeData.rohrAussenDurchmesserTDTZug,
    ).toFixed(2);
    console.log(
      'rohrAussenDurchmesserTDTZug_RSSL: ' + rohrAussenDurchmesserTDTZug_RSSL,
    );

    const fixlaenge_RSSL = parseFloat(
      recipeData.mehrfachlaengenDaten.fixlaenge,
    );
    console.log('fixlaenge_RSSL: ' + fixlaenge_RSSL);
    const ausgleichstueck_RSSL = parseFloat(
      recipeData.mehrfachlaengenDaten.ausgleichstueck,
    );
    console.log('ausgleichstueck_RSSL: ' + ausgleichstueck_RSSL);
    const mehrfachlaenge_RSSL = parseFloat(
      recipeData.mehrfachlaengenDaten.mehrfachlaenge,
    );
    console.log('mehrfachlaenge_RSSL: ' + mehrfachlaenge_RSSL);
    const anzahlFixlaengenProMehrfachlaenge_RSSL = parseFloat(
      recipeData.mehrfachlaengenDaten.anzahlFixlaengenProMehrfachlaenge,
    );
    console.log(
      'anzahlFixlaengenProMehrfachlaenge_RSSL: ' +
        anzahlFixlaengenProMehrfachlaenge_RSSL,
    );
    const negativeToleranzMehrfachlaenge_RSSL = parseFloat(
      recipeData.mehrfachlaengenDaten.negativeToleranzMehrfachlaenge,
    );
    console.log(
      'negativeToleranzMehrfachlaenge_RSSL: ' +
        negativeToleranzMehrfachlaenge_RSSL,
    );
    const positiveToleranzMehrfachlaenge_RSSL = parseFloat(
      recipeData.mehrfachlaengenDaten.positiveToleranzMehrfachlaenge,
    );
    console.log(
      'positiveToleranzMehrfachlaenge_RSSL: ' +
        positiveToleranzMehrfachlaenge_RSSL,
    );
    const mindestanzahlGutprofile_RSSL = parseFloat(
      recipeData.mehrfachlaengenDaten.mindestanzahlGutprofile,
    );
    console.log(
      'mindestanzahlGutprofile_RSSL: ' + mindestanzahlGutprofile_RSSL,
    );

    const obereToleranz_RSSL = parseFloat(
      recipeData.standartWerte.obereToleranz,
    ).toFixed(2);
    console.log('obereToleranz: ' + obereToleranz_RSSL);
    const untereToleranz_RSSL = parseFloat(
      recipeData.standartWerte.untereToleranz,
    ).toFixed(2);
    console.log('untereToleranz_RSSL: ' + untereToleranz_RSSL);

    console.log(
      'JSON.stringify(dornStufenData_RSSL): ' +
        JSON.stringify(recipeData.dornStufen),
    );

    const dornStufen_RSSL = recipeData.dornStufen.dornStufe;
    dornStufen_RSSL.forEach((stufe) => {
      console.log('stufeID: ' + stufe._id);
      console.log('stufeDornDurchmesser: ' + stufe.dornDurchmesser);
      console.log('stufeDornPosition ' + stufe.position);
      console.log('stufeDornRampeRein ' + stufe.rampeRein);
      console.log('stufeDornRampeRaus ' + stufe.rampeRaus);
      console.log('stufeDornDehnung ' + stufe.dehnung);
    });

    const dornStufenArr_RSSL = [];

    for (let i = 0; i < dornStufen_RSSL.length; i++) {
      const dornDurchmesser = dornStufen_RSSL[i].dornDurchmesser.toFixed(2);
      const position = dornStufen_RSSL[i].position;
      const rampeRein = dornStufen_RSSL[i].rampeRein;
      const rampeRaus = dornStufen_RSSL[i].rampeRaus;
      const dehnung = dornStufen_RSSL[i].dehnung;
      const dornStufeID = dornStufen_RSSL[i]._id;

      const dornStufe = {
        dornDurchmesser: dornDurchmesser,
        position: position,
        rampeRein: rampeRein,
        rampeRaus: rampeRaus,
        dehnung: dehnung,
        _id: dornStufeID,
      };

      dornStufenArr_RSSL.push(dornStufe);
    }

    console.log('dornStufenArr_RSSL', dornStufenArr_RSSL);

    console.log(
      'JSON.stringify(eckenListe_RSSL): ' +
        JSON.stringify(recipeData.eckenListe),
    );
    const eckenListeArr_RSSL = recipeData.eckenListe.ecke;

    eckenListeArr_RSSL.forEach((ecke) => {
      //console.log('ecke: ' + ecke);
      console.log('eckeID: ' + ecke._id);
      console.log('ecke.x: ' + ecke.x);
      console.log('ecke.z: ' + ecke.z);
    });

    const eckenArr_RSSL = [];

    for (let i = 0; i < eckenListeArr_RSSL.length; i++) {
      const position = eckenListeArr_RSSL[i].x;
      const wanddicke = eckenListeArr_RSSL[i].z;
      const eckenID = eckenListeArr_RSSL[i]._id;

      const ecke = {
        //ecke: i + 1,
        x: position,
        z: wanddicke,
        _id: eckenID,
      };

      eckenArr_RSSL.push(ecke);
    }

    console.log('eckenArr_RSSL', eckenArr_RSSL);

    console.log(
      '-----------------------4- Speicher-Daten-Objekt erstellen----------------------',
    );
    const dataRecipe_RSSL = {
      artikelNummer: artikelNummer_RSSL,
      artikelName: artikelName_RSSL,
      teileNummer: teileNummer_RSSL,
      zeichnungsNummer: zeichnungsNummer_RSSL,
      aenderungsstandZeichnung: aenderungsstandZeichnung_RSSL,
      aenderungsstandRezept: aenderungsstandRezept_RSSL,
      beschreibung: beschreibung_RSSL,
      ziehGeschwindigkeit: ziehGeschwindigkeit_RSSL,
      v_dorn_Fwd: vDornVor_RSSL,
      v_dorn_Bwd: vDornZurueck_RSSL,

      kommentar: kommentarArr_RSSL,

      rohrAussenDurchmesserLetzterZug: rohrAussenDurchmesserLetzterZug_RSSL,
      rohrInnenDurchmesserLetzterZug: rohrInnenDurchmesserLetzterZug_RSSL,
      angel: angel_RSSL,
      rohrAussenDurchmesserTDTZug: rohrAussenDurchmesserTDTZug_RSSL,

      dornStufe: dornStufenArr_RSSL,

      fixLaenge: fixlaenge_RSSL,
      ausgleichsstueck: ausgleichstueck_RSSL,
      mehrfachLaenge: mehrfachlaenge_RSSL,
      anzahlFixLaengenProMehrfachLaenge: anzahlFixlaengenProMehrfachlaenge_RSSL,
      negTolMehrfachLaenge: negativeToleranzMehrfachlaenge_RSSL,
      posTolMehrfachLaenge: positiveToleranzMehrfachlaenge_RSSL,
      mindestAnzahlGutProfile: mindestanzahlGutprofile_RSSL,

      obereToleranz: obereToleranz_RSSL,
      untereToleranz: untereToleranz_RSSL,

      mindestGutanteil: mindestGutanteil_RSSL,
      profileGekoppelt: profileGekoppelt_RSSL,

      ecke: eckenArr_RSSL,
    };

    const newRecipeSendSPSLog = await createRecipeSendSPSLog(
      fa_Nummer_RSSL,
      recipeSend_recipeOriginalID_RSSL,
      dataRecipe_RSSL,
      userSendData_RSSL,
    );

    console.log('newRecipeSendSPSLog: ' + newRecipeSendSPSLog);
    if (!newRecipeSendSPSLog) {
      return next(
        new AppError('No newRecipeSendSPSLog created in db! :(', 404),
      );
    }

    return newRecipeSendSPSLog;
  } catch (err) {
    console.log('Error in createRecipeSendLogServiceFunction: ', err);
    throw 'Error in createRecipeSendLogServiceFunction: ' + err;
  }
};
