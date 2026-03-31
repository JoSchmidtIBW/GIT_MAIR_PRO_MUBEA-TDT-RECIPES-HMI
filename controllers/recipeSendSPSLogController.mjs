import catchAsync from '../utils/catchAsync.mjs';
import {
  createRecipeSendSPSLog,
  getFindAllRecipesSendSPSLog,
  getFindAllRecipesSendSPSLogByUserID,
} from '../models/services/recipeSendSPSLog_de_Service.mjs';

export const getAllRecipeSendSPSLog = catchAsync(async (req, res, next) => {
  console.log('Bin getAllRecipeSendSPSLog');

  let allRecipesSendSPSLog = await getFindAllRecipesSendSPSLog();

  // .sort({
  //   createdSendAt: -1,
  // });

  if (!allRecipesSendSPSLog) {
    allRecipesSendSPSLog = 'No Data';
  }

  res.status(200).json({
    status: 'success',
    message: 'AllRecipesSendSPSLog succefully find!',
    data: allRecipesSendSPSLog,
  });
});

export const getAllRecipeSendSPSLogByUser = catchAsync(
  async (req, res, next) => {
    console.log('Bin getAllRecipeSendSPSLogByUser');
    console.log(req.params.id);
    const userID = req.params.id;
    let myRecipeSendAll = await getFindAllRecipesSendSPSLogByUserID(userID);

    if (!myRecipeSendAll) {
      myRecipeSendAll = 'No Data';
    }

    res.status(200).json({
      status: 'success',
      message: 'MyRecipeSendAll succefully find!',
      data: myRecipeSendAll,
    });
  },
);

export const getCreateRecipeSendSPSLog = catchAsync(async (req, res, next) => {
  console.log('bin getCreateRecipeSendSPSLog: ');
  console.log('recipeData:', req.body.recipeData);
  console.log('userSendData:', req.body.userSendData);
  console.log('fa_NummerData:', req.body.fa_NummerData);
  console.log(
    'JSON.stringify(req.body.recipeData): ' +
      JSON.stringify(req.body.recipeData, null, 2),
  );

  const recipeData = req.body.recipeData;
  const fa_Nummer_RSSL = parseFloat(req.body.fa_NummerData);

  const recipeSend_recipeOriginalID_RSSL = recipeData.id;
  console.log(
    'recipeSend_recipeOriginalID_RSSL: ' + recipeSend_recipeOriginalID_RSSL,
  );

  const userSendData = JSON.parse(req.body.userSendData);
  console.log('userSendDataaaaaaa: ', userSendData);
  const userSendData_RSSL = {
    userSendID: userSendData._id,
    userSendFirstName: userSendData.firstName,
    userSendLastName: userSendData.lastName,
    userSendEmployeeNumber: userSendData.employeeNumber,
  };
  console.log('userSendData_RSSL: ', userSendData_RSSL);

  const artikelNummer_RSSL = parseFloat(recipeData.artikelNummer);
  console.log('artikelNummer_RSSL: ' + artikelNummer_RSSL);

  const artikelName_RSSL = recipeData.artikelName;
  console.log('artikelName_RSSL: ' + artikelName_RSSL);

  const ziehGeschwindigkeit_RSSL = recipeData.ziehGeschwindigkeit;
  console.log('ziehGeschwindigkeit_RSSL: ' + ziehGeschwindigkeit_RSSL);

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

  const fixlaenge_RSSL = parseFloat(recipeData.mehrfachlaengenDaten.fixlaenge);
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
  console.log('mindestanzahlGutprofile_RSSL: ' + mindestanzahlGutprofile_RSSL);

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
    console.log('stufeID: ' + stufe.id);
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
    'JSON.stringify(eckenListe_RSSL): ' + JSON.stringify(recipeData.eckenListe),
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

  console.log(
    'RecipeSendSPSLogController: getCreateRecipeSendSPSLog: newRecipeSendSPSLog: ' +
      newRecipeSendSPSLog,
  );
  if (!newRecipeSendSPSLog) {
    return next(new AppError('No newRecipeSendSPSLog created in db! :(', 404));
  }

  res.status(201).json({
    // 201 = created
    status: 'success',
    message: 'NewRecipeSendSPSLog succefully created!',
    data: newRecipeSendSPSLog,
  });
});
