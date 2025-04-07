import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';

import he from 'he';
import { parseString } from 'xml2js';
import { dataInXml } from '../utils/dataInXMLTXT.mjs';
import { writeTXT_File } from '../utils/writeTXT_File.mjs';
import { getFindUserByIDWithoutPasswordCreatedAt } from '../models/services/userService.mjs';

import {
  getAllRecipesTDT_de,
  createRecipesTDT_de,
  getFindRecipesTDTtoLoad,
  deleteRecipeFindOneAndDelete,
  updateRecipeTDT_deFindByIdAndUpdate,
} from '../models/services/recipesTDT_de_Service.mjs';

import {
  getTeileNummerDefault,
  getZeichnungsNummerDefault,
  getBeschreibungDefault,
  getAenderungsstandZeichnungDefault,
  getAenderungsstandRezeptDefault,
  getZiehGeschwindigkeitDefault,
  getProfileGekoppeltDefault,
  getMindestGutanteilDefault,
  getRampeReinDefault,
  getRampeRausDefault,
  getDehnungDefault,
  getNegativeToleranzMehrfachlaengeDefault,
  getPositiveToleranzMehrfachlaengeDefault,
  getMindestAnzahlGutprofileDefault,
  getVDornFwdDefault,
  getVDornBwdDefault,
} from '../models/recipesTDT_de_Model.mjs';

export const getUpdateRecipe = catchAsync(async (req, res, next) => {
  console.log('bin getUpdateRecipe');
  const recipeUpdateID = req.params.id;

  const updateRecipeData = req.body.updateRecipeData;

  console.log('updateRecipeData:', updateRecipeData);

  const updatedRecipe = await updateRecipeTDT_deFindByIdAndUpdate(
    updateRecipeData,
    recipeUpdateID,
  );

  console.log('updatedRecipe IN Controller: ' + updatedRecipe);

  if (!updatedRecipe) {
    return next(new AppError('No document (recipe) found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedRecipe,
    },
  });
});

export const getDeleteRecipe = catchAsync(async (req, res, next) => {
  console.log('bin getDeleteRecipe');

  const recipeID = req.params.id;
  console.log('recipeID: ' + recipeID);

  const deletedRecipe = await deleteRecipeFindOneAndDelete(recipeID);

  if (!deletedRecipe) {
    // Null is false
    return next(new AppError('No recipe found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getRecipesTDTtoLoad = catchAsync(async (req, res, next) => {
  console.log('bin getRecipesTDTtoLoad im recipesController');

  // const recipesTDTtoLoad = await RecipesTDT_de.find().sort({
  //   'kopfDaten.artikelNummer': 1,
  // });
  const recipesTDTtoLoad = await getFindRecipesTDTtoLoad();

  if (!recipesTDTtoLoad) {
    return next(new AppError('No recipesTDT found to load', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      recipesTDTtoLoad: recipesTDTtoLoad,
    },
  });
});

export const getCreateRecipe_ExpertJCD = catchAsync(async (req, res, next) => {
  console.log('bin getCreateRecipe_ExpertJCD');
  console.log(
    'JSON.stringify(req.body.recipeData): ' +
      JSON.stringify(req.body.recipeData),
  );

  const artikelNummerStr_ExpertJCD =
    req.body.recipeData.artikelNummer_ExpertJCD;
  console.log('artikelNummerStr: ' + artikelNummerStr_ExpertJCD);
  console.log('typeOf artikelNummerStr: ' + typeof artikelNummerStr_ExpertJCD);
  const artikelNummerFloat_ExpertJCD = parseFloat(artikelNummerStr_ExpertJCD);
  console.log(
    'typeOf artikelNummerFloat: ' + typeof artikelNummerFloat_ExpertJCD,
  );

  const artikelNameFirstStr_ExpertJCD =
    req.body.recipeData.artikelName_ExpertJCD;

  const ziehGeschwindigkeitStr_ExpertJCD =
    req.body.recipeData.ziehGeschwindigkeit_ExpertJCD;
  console.log(
    'typeOf ziehGeschwindigkeitStr: ' + typeof ziehGeschwindigkeitStr_ExpertJCD,
  );
  const ziehGeschwindigkeitFloat_ExpertJCD = parseFloat(
    ziehGeschwindigkeitStr_ExpertJCD,
  );
  console.log(
    'typeOf ziehGeschwindigkeitFloat: ' +
      typeof ziehGeschwindigkeitFloat_ExpertJCD,
  );

  const vDornVorStr_ExpertJCD = req.body.recipeData.vDornVor_ExpertJCD;
  console.log('vDornStr_ExpertJCD:', vDornVorStr_ExpertJCD);
  console.log('typeof vDornVorStr_ExpertJCD', typeof vDornVorStr_ExpertJCD);
  const vDornVorFloat_ExpertJCD = parseFloat(vDornVorStr_ExpertJCD);
  console.log(
    'typeof vDornVorFloat_ExpertJCD:',
    typeof vDornVorFloat_ExpertJCD,
  );

  const vDornZurueckStr_ExpertJCD = req.body.recipeData.vDornZurueck_ExpertJCD;
  console.log('vDornZurueckStr_ExpertJCD:', vDornZurueckStr_ExpertJCD);
  console.log(
    'typeof vDornZurueckStr_ExpertJCD:',
    typeof vDornZurueckStr_ExpertJCD,
  );
  const vDornZurueckFloat_ExpertJCD = parseFloat(vDornZurueckStr_ExpertJCD);
  console.log(
    'typeof vDornZurueckFloat_ExpertJCD',
    typeof vDornZurueckFloat_ExpertJCD,
  );

  const benutzerID_ExpertJCD = req.body.recipeData.benutzerID_ExpertJCD;
  console.log('benutzerID:' + benutzerID_ExpertJCD);
  const benutzerVorName_ExpertJCD =
    req.body.recipeData.benutzerVorName_ExpertJCD;
  const benutzerNachName_ExpertJCD =
    req.body.recipeData.benutzerNachName_ExpertJCD;

  console.log('**************************************');

  console.log('**************************************');

  const rohrAussenDurchmesserLetzterZug_ExpertJCD = parseFloat(
    req.body.recipeData.rohrAussenDurchmesserLetzterZug_ExpertJCD,
  );

  console.log(
    'rohrAussenDurchmesserLetzterZug: ' +
      rohrAussenDurchmesserLetzterZug_ExpertJCD,
  );
  console.log(
    'typeOf rohrAussenDurchmesserLetzterZug: ' +
      typeof rohrAussenDurchmesserLetzterZug_ExpertJCD,
  );
  console.log(
    'rohrAussenDurchmesserLetzterZug: ' +
      rohrAussenDurchmesserLetzterZug_ExpertJCD,
  );

  const rohrWandDickeAussenDurchmesserLetzterZug_ExpertJCD = parseFloat(
    req.body.recipeData.rohrWandDickeAussenDurchmesserLetzterZug_ExpertJCD,
  );
  const rohrInnenDurchmesserLetzterZugBerechnet_ExpertJCD = parseFloat(
    req.body.recipeData.rohrInnenDurchmesserLetzterZugBerechnet_ExpertJCD,
  );
  const rohrAussenDurchmesserTDTZug_ExpertJCD = parseFloat(
    req.body.recipeData.rohrAussenDurchmesserTDTZug_ExpertJCD,
  );
  const angel_ExpertJCD = parseFloat(req.body.recipeData.angel_ExpertJCD);
  const dornDurchmesserErsteStufe_ExpertJCD = parseFloat(
    req.body.recipeData.dornDurchmesserErsteStufe_ExpertJCD,
  );
  const dornPositionErsteStufe_ExpertJCD = parseFloat(
    req.body.recipeData.dornPositionErsteStufe_ExpertJCD,
  );
  const dornDurchmesserZweiteStufe_ExpertJCD = parseFloat(
    req.body.recipeData.dornDurchmesserZweiteStufe_ExpertJCD,
  );
  const dornPositionZweiteStufe_ExpertJCD = parseFloat(
    req.body.recipeData.dornPositionZweiteStufe_ExpertJCD,
  );
  const dornDurchmesserDritteStufe_ExpertJCD = parseFloat(
    req.body.recipeData.dornDurchmesserDritteStufe_ExpertJCD,
  );
  const dornPositionDritteStufe_ExpertJCD = parseFloat(
    req.body.recipeData.dornPositionDritteStufe_ExpertJCD,
  );

  const fixlaenge_ExpertJCD = parseFloat(
    req.body.recipeData.fixlaenge_ExpertJCD,
  );
  const ausgleichstueck_ExpertJCD = parseFloat(
    req.body.recipeData.ausgleichstueck_ExpertJCD,
  );
  const mehrfachlaenge_ExpertJCD = parseFloat(
    req.body.recipeData.mehrfachlaenge_ExpertJCD,
  );
  const anzahlFixlaengenProMehrfachlaenge_ExpertJCD = parseFloat(
    req.body.recipeData.anzahlFixlaengenProMehrfachlaenge_ExpertJCD,
  );
  const mindestGutanteil_ExpertJCD = parseFloat(
    req.body.recipeData.mindestGutanteil_ExpertJCD,
  );
  const profileGekoppelt_ExpertJCD = parseFloat(
    req.body.recipeData.profileGekoppelt_ExpertJCD,
  );
  const obereToleranz_ExpertJCD = parseFloat(
    req.body.recipeData.obereToleranz_ExpertJCD,
  );
  const untereToleranz_ExpertJCD = parseFloat(
    req.body.recipeData.untereToleranz_ExpertJCD,
  );

  const eigenePositionArr =
    req.body.recipeData.eigenePositionArrRichtig_ExpertJCD;
  const eigeneWandDickeArr = req.body.recipeData.wandDickeArrRichtig_ExpertJCD;

  for (let i = 0; i < eigenePositionArr.length; i++) {
    console.log('eigenePositionArr[i]: ' + eigenePositionArr[i]);
  }
  for (let i = 0; i < eigeneWandDickeArr.length; i++) {
    console.log('eigeneWandDickeArr[i]: ' + eigeneWandDickeArr[i]);
  }

  const eckenArr_ExpertJCD = [];

  for (let i = 0; i < eigenePositionArr.length; i++) {
    const position = eigenePositionArr[i];
    const wanddicke = eigeneWandDickeArr[i];

    const ecke = {
      ecke: i + 1,
      x: position,
      z: wanddicke,
    };

    eckenArr_ExpertJCD.push(ecke);
  }

  console.log(eckenArr_ExpertJCD);

  console.log(
    '-----------------------1-Kommentar Erstellen----------------------',
  );
  const kommentarArr_ExpertJCD = [];
  let erstelltAm_ExpertJCD = ''; //: dateObject.toISOString(),
  let createdBy_ExpertJCD = benutzerID_ExpertJCD; //: kurzerName,   kurzerName = '643c1f042df0321cb8a06a50';
  let kommentarBeschreibung_ExpertJCD = 'Erstmals erstellt.'; //: worteOderSaetze.trim(),

  const dateObject_ExpertJCD = new Date();
  //   `${year}-${month}-${day}T00:00:00.000Z`,
  // );
  console.log(dateObject_ExpertJCD.toISOString());
  erstelltAm_ExpertJCD = dateObject_ExpertJCD.toISOString();

  kommentarArr_ExpertJCD.push({
    erstelltAm: erstelltAm_ExpertJCD,
    createdBy: createdBy_ExpertJCD,
    kommentarBeschreibung: kommentarBeschreibung_ExpertJCD,
  });
  console.log(
    '-----------------------2-StufenArray erstellen----------------------',
  );

  console.log(
    'dornDurchmesserErsteStufe_ExpertJCD :' +
      dornDurchmesserErsteStufe_ExpertJCD,
  );
  console.log(
    'dornDurchmesserZweiteStufe_ExpertJCD :' +
      dornDurchmesserZweiteStufe_ExpertJCD,
  );
  console.log(
    'dornDurchmesserDritteStufe_ExpertJCD :' +
      dornDurchmesserDritteStufe_ExpertJCD,
  );

  const stufe1Obj_ExpertJCD = {
    dornDurchmesser: dornDurchmesserErsteStufe_ExpertJCD,
    position: dornPositionErsteStufe_ExpertJCD,
    rampeRein: getRampeReinDefault(),
    rampeRaus: getRampeRausDefault(),
    dehnung: getDehnungDefault(),
  };
  const stufe2Obj_ExpertJCD = {
    dornDurchmesser: dornDurchmesserZweiteStufe_ExpertJCD,
    position: dornPositionZweiteStufe_ExpertJCD,
    rampeRein: getRampeReinDefault(),
    rampeRaus: getRampeRausDefault(),
    dehnung: getDehnungDefault(),
  };
  const stufe3Obj_ExpertJCD = {
    dornDurchmesser: dornDurchmesserDritteStufe_ExpertJCD,
    position: dornPositionDritteStufe_ExpertJCD,
    rampeRein: getRampeReinDefault(),
    rampeRaus: getRampeRausDefault(),
    dehnung: getDehnungDefault(),
  };

  let stufenArray_ExpertJCD = [];

  if (
    dornDurchmesserDritteStufe_ExpertJCD === '' ||
    isNaN(dornDurchmesserDritteStufe_ExpertJCD) // === NaN
  ) {
    stufenArray_ExpertJCD = [stufe1Obj_ExpertJCD, stufe2Obj_ExpertJCD];
  } else {
    stufenArray_ExpertJCD = [
      stufe1Obj_ExpertJCD,
      stufe2Obj_ExpertJCD,
      stufe3Obj_ExpertJCD,
    ];
  }

  console.log(stufenArray_ExpertJCD);

  console.log(
    '-----------------------3- ArtikelName erstellen-----------------------',
  );
  console.log(
    'artikelNameFirstStr_ExpertJCD: ' + artikelNameFirstStr_ExpertJCD,
  );
  let artikelName_ExpertJCD = '';

  const ziehGeschwindigkeitLastStr_ExpertJCD =
    ziehGeschwindigkeitFloat_ExpertJCD.toString();
  console.log(
    'ziehGeschwindigkeitLastStr_ExpertJCD: ' +
      ziehGeschwindigkeitLastStr_ExpertJCD,
  );

  const fixlaengeStr_ExpertJCD = fixlaenge_ExpertJCD.toString();
  console.log('fixlaengeStr_ExpertJCD: ' + fixlaengeStr_ExpertJCD);

  artikelName_ExpertJCD =
    artikelNameFirstStr_ExpertJCD +
    ' - ' +
    fixlaengeStr_ExpertJCD +
    'mm - ' +
    mehrfachlaenge_ExpertJCD +
    'mm - ' +
    anzahlFixlaengenProMehrfachlaenge_ExpertJCD +
    'Stk. - ' +
    ziehGeschwindigkeitLastStr_ExpertJCD +
    'm/min -';

  console.log('artikelName_ExpertJCD: ' + artikelName_ExpertJCD);

  console.log(
    '-----------------------4- Speicher-Daten-Objekt erstellen----------------------',
  );
  const data_ExpertJCD = {
    artikelNummer: artikelNummerFloat_ExpertJCD,
    artikelName: artikelName_ExpertJCD,
    teileNummer: getTeileNummerDefault(),
    zeichnungsNummer: getZeichnungsNummerDefault(),
    aenderungsstandZeichnung: getAenderungsstandZeichnungDefault(),
    aenderungsstandRezept: getAenderungsstandRezeptDefault(),
    beschreibung: getBeschreibungDefault(),
    ziehGeschwindigkeit: ziehGeschwindigkeitFloat_ExpertJCD,
    v_dorn_Fwd: vDornVorFloat_ExpertJCD,
    v_dorn_Bwd: vDornZurueckFloat_ExpertJCD,
    kommentar: kommentarArr_ExpertJCD,

    rohrAussenDurchmesserLetzterZug: rohrAussenDurchmesserLetzterZug_ExpertJCD,
    rohrInnenDurchmesserLetzterZug:
      rohrInnenDurchmesserLetzterZugBerechnet_ExpertJCD,
    angel: angel_ExpertJCD,
    rohrAussenDurchmesserTDTZug: rohrAussenDurchmesserTDTZug_ExpertJCD,

    dornStufe: stufenArray_ExpertJCD,

    fixLaenge: fixlaenge_ExpertJCD,
    ausgleichsstueck: ausgleichstueck_ExpertJCD,
    mehrfachLaenge: mehrfachlaenge_ExpertJCD,
    anzahlFixLaengenProMehrfachLaenge:
      anzahlFixlaengenProMehrfachlaenge_ExpertJCD,
    negTolMehrfachLaenge: getNegativeToleranzMehrfachlaengeDefault(),
    posTolMehrfachLaenge: getPositiveToleranzMehrfachlaengeDefault(),
    mindestAnzahlGutProfile: getMindestAnzahlGutprofileDefault(),

    obereToleranz: obereToleranz_ExpertJCD,
    untereToleranz: untereToleranz_ExpertJCD,

    mindestGutanteil: mindestGutanteil_ExpertJCD,
    profileGekoppelt: profileGekoppelt_ExpertJCD,

    ecke: eckenArr_ExpertJCD,
  };

  //-----------------------------------------------5---SpeicherDatenObjekt senden zur DB-------------------------------------------
  const newRecipes_ExpertJCD = await createRecipesTDT_de(data_ExpertJCD);
  console.log('newRecipes_ExpertJCD: ' + newRecipes_ExpertJCD);
  if (!newRecipes_ExpertJCD) {
    // Null is false
    return next(new AppError('No recipe_ExpertJCD write in db! :(', 404));
  }

  res.status(201).json({
    // 201 = created
    status: 'success',
    message: 'Recipe_ExpertJCD succefully created!',
  });
});

export const getCreateRecipe3_St_4_BMSMB = catchAsync(
  async (req, res, next) => {
    console.log('bin getCreateRecipe3_St_4_BMSMB im controller!');
    console.log('req.body: ' + req.body);
    console.log(
      'JSON.stringify(req.body.recipeData): ' +
        JSON.stringify(req.body.recipeData),
    );

    const artikelNummerStr_3_St_4_BMSMB =
      req.body.recipeData.artikelNummer_3_St_4_BMSMB;
    console.log('artikelNummerStr: ' + artikelNummerStr_3_St_4_BMSMB);
    console.log(
      'typeOf artikelNummerStr: ' + typeof artikelNummerStr_3_St_4_BMSMB,
    );
    const artikelNummerFloat_3_St_4_BMSMB = parseFloat(
      artikelNummerStr_3_St_4_BMSMB,
    );
    console.log(
      'typeOf artikelNummerFloat: ' + typeof artikelNummerFloat_3_St_4_BMSMB,
    );

    const artikelNameFirstStr_3_St_4_BMSMB =
      req.body.recipeData.artikelName_3_St_4_BMSMB;

    const ziehGeschwindigkeitStr_3_St_4_BMSMB =
      req.body.recipeData.ziehGeschwindigkeit_3_St_4_BMSMB;
    console.log(
      'typeOf ziehGeschwindigkeitStr: ' +
        typeof ziehGeschwindigkeitStr_3_St_4_BMSMB,
    );
    const ziehGeschwindigkeitFloat_3_St_4_BMSMB = parseFloat(
      ziehGeschwindigkeitStr_3_St_4_BMSMB,
    );
    console.log(
      'typeOf ziehGeschwindigkeitFloat: ' +
        typeof ziehGeschwindigkeitFloat_3_St_4_BMSMB,
    );

    const vDornVorStr_3_St_4_BMSMB = req.body.recipeData.vDornVor_3_St_4_BMSMB;
    console.log('vDornVorStr_3_St_4_BMSMB:', vDornVorStr_3_St_4_BMSMB);
    console.log(
      'typeof vDornVorStr_3_St_4_BMSMB:',
      typeof vDornVorStr_3_St_4_BMSMB,
    );
    const vDornVorFloat_3_St_4_BMSMB = parseFloat(vDornVorStr_3_St_4_BMSMB);
    console.log(
      'typeof vDornVorFloat_3_St_4_BMSMB:',
      typeof vDornVorFloat_3_St_4_BMSMB,
    );

    const vDornZurueckStr_3_St_4_BMSMB =
      req.body.recipeData.vDornZurueck_3_St_4_BMSMB;
    console.log('vDornZurueckStr_3_St_4_BMSMB:', vDornZurueckStr_3_St_4_BMSMB);
    console.log(
      'typeof vDornZurueckStr_3_St_4_BMSMB:',
      typeof vDornZurueckStr_3_St_4_BMSMB,
    );
    const vDornZurueckFloat_3_St_4_BMSMB = parseFloat(
      vDornZurueckStr_3_St_4_BMSMB,
    );
    console.log(
      'typeof vDornZurueckFloat_3_St_4_BMSMB:',
      typeof vDornZurueckFloat_3_St_4_BMSMB,
    );

    const benutzerID_3_St_4_BMSMB = req.body.recipeData.benutzerID_3_St_4_BMSMB;
    console.log('benutzerID:' + benutzerID_3_St_4_BMSMB);
    const benutzerVorName_3_St_4_BMSMB =
      req.body.recipeData.benutzerVorName_3_St_4_BMSMB;
    const benutzerNachName_3_St_4_BMSMB =
      req.body.recipeData.benutzerNachName_3_St_4_BMSMB;

    console.log('**************************************');

    const rohrAussenDurchmesserLetzterZug_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.rohrAussenDurchmesserLetzterZug_3_St_4_BMSMB,
    );

    console.log(
      'rohrAussenDurchmesserLetzterZug: ' +
        rohrAussenDurchmesserLetzterZug_3_St_4_BMSMB,
    );
    console.log(
      'typeOf rohrAussenDurchmesserLetzterZug: ' +
        typeof rohrAussenDurchmesserLetzterZug_3_St_4_BMSMB,
    );
    console.log(
      'rohrAussenDurchmesserLetzterZug: ' +
        rohrAussenDurchmesserLetzterZug_3_St_4_BMSMB,
    );

    const rohrWandDickeAussenDurchmesserLetzterZug_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.rohrWandDickeAussenDurchmesserLetzterZug_3_St_4_BMSMB,
    );
    const rohrInnenDurchmesserLetzterZugBerechnet_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.rohrInnenDurchmesserLetzterZugBerechnet_3_St_4_BMSMB,
    );
    const rohrAussenDurchmesserTDTZug_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.rohrAussenDurchmesserTDTZug_3_St_4_BMSMB,
    );
    const angel_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.angel_3_St_4_BMSMB,
    );
    const dornDurchmesserErsteStufe_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.dornDurchmesserErsteStufe_3_St_4_BMSMB,
    );
    const dornPositionErsteStufe_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.dornPositionErsteStufe_3_St_4_BMSMB,
    );
    const dornDurchmesserZweiteStufe_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.dornDurchmesserZweiteStufe_3_St_4_BMSMB,
    );
    const dornPositionZweiteStufe_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.dornPositionZweiteStufe_3_St_4_BMSMB,
    );
    const dornDurchmesserDritteStufe_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.dornDurchmesserDritteStufe_3_St_4_BMSMB,
    );
    const dornPositionDritteStufe_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.dornPositionDritteStufe_3_St_4_BMSMB,
    );

    const fixlaenge_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.fixlaenge_3_St_4_BMSMB,
    );
    const ausgleichstueck_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.ausgleichstueck_3_St_4_BMSMB,
    );
    const mehrfachlaenge_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.mehrfachlaenge_3_St_4_BMSMB,
    );
    const anzahlFixlaengenProMehrfachlaenge_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.anzahlFixlaengenProMehrfachlaenge_3_St_4_BMSMB,
    );
    const mindestGutanteil_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.mindestGutanteil_3_St_4_BMSMB,
    );
    const profileGekoppelt_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.profileGekoppelt_3_St_4_BMSMB,
    );
    const obereToleranz_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.obereToleranz_3_St_4_BMSMB,
    );
    const untereToleranz_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.untereToleranz_3_St_4_BMSMB,
    );

    const wanddickeEcke1_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.wanddickeEcke1_3_St_4_BMSMB,
    );
    const positionEcke1_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.positionEcke1_3_St_4_BMSMB,
    );
    const wanddickeEcke2_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.wanddickeEcke2_3_St_4_BMSMB,
    );
    const positionEcke2_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.positionEcke2_3_St_4_BMSMB,
    );
    const wanddickeEcke3_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.wanddickeEcke3_3_St_4_BMSMB,
    );
    const positionEcke3_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.positionEcke3_3_St_4_BMSMB,
    );
    const wanddickeEcke4_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.wanddickeEcke4_3_St_4_BMSMB,
    );
    const positionEcke4_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.positionEcke4_3_St_4_BMSMB,
    );
    const wanddickeEcke5_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.wanddickeEcke5_3_St_4_BMSMB,
    );
    const positionEcke5_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.positionEcke5_3_St_4_BMSMB,
    );
    const wanddickeEcke6_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.wanddickeEcke6_3_St_4_BMSMB,
    );
    const positionEcke6_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.positionEcke6_3_St_4_BMSMB,
    );
    // const wanddickeEcke6Zwischen8_3_St_4_BMSMB = parseFloat(
    //   req.body.recipeData.wanddickeEcke6Zwischen8_3_St_4_BMSMB,
    // );
    // const positionEcke6Zwischen8_3_St_4_BMSMB = parseFloat(
    //   req.body.recipeData.positionEcke6Zwischen8_3_St_4_BMSMB,
    // );
    const wanddickeEcke7_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.wanddickeEcke7_3_St_4_BMSMB,
    );
    const positionEcke7_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.positionEcke7_3_St_4_BMSMB,
    );
    const wanddickeEcke8_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.wanddickeEcke8_3_St_4_BMSMB,
    );
    const positionEcke8_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.positionEcke8_3_St_4_BMSMB,
    );
    // const wanddickeEcke9Zwischen11_3_St_4_BMSMB = parseFloat(
    //   req.body.recipeData.wanddickeEcke9Zwischen11_3_St_4_BMSMB,
    // );
    // const positionEcke9Zwischen11_3_St_4_BMSMB = parseFloat(
    //   req.body.recipeData.positionEcke9Zwischen11_3_St_4_BMSMB,
    // );
    const wanddickeEcke9_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.wanddickeEcke9_3_St_4_BMSMB,
    );
    const positionEcke9_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.positionEcke9_3_St_4_BMSMB,
    );
    const wanddickeEckeEnde_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.wanddickeEckeEnde_3_St_4_BMSMB,
    );
    const positionEckeEnde_3_St_4_BMSMB = parseFloat(
      req.body.recipeData.positionEckeEnde_3_St_4_BMSMB,
    );

    const ecke3_St_4_BMSMB_e1 = {
      ecke: 1,
      x: positionEcke1_3_St_4_BMSMB,
      z: wanddickeEcke1_3_St_4_BMSMB,
    };
    const ecke3_St_4_BMSMB_e2 = {
      ecke: 2,
      x: positionEcke2_3_St_4_BMSMB,
      z: wanddickeEcke2_3_St_4_BMSMB,
    };
    const ecke3_St_4_BMSMB_e3 = {
      ecke: 3,
      x: positionEcke3_3_St_4_BMSMB,
      z: wanddickeEcke3_3_St_4_BMSMB,
    };
    const ecke3_St_4_BMSMB_e4 = {
      ecke: 4,
      x: positionEcke4_3_St_4_BMSMB,
      z: wanddickeEcke4_3_St_4_BMSMB,
    };
    const ecke3_St_4_BMSMB_e5 = {
      ecke: 5,
      x: positionEcke5_3_St_4_BMSMB,
      z: wanddickeEcke5_3_St_4_BMSMB,
    };
    const ecke3_St_4_BMSMB_e6 = {
      ecke: 6,
      x: positionEcke6_3_St_4_BMSMB,
      z: wanddickeEcke6_3_St_4_BMSMB,
    };
    // const ecke3_St_4_BMSMB_e68 = {
    //   ecke: 7,
    //   x: positionEcke6Zwischen8_3_St_4_BMSMB,
    //   z: wanddickeEcke6Zwischen8_3_St_4_BMSMB,
    // };
    const ecke3_St_4_BMSMB_e7 = {
      ecke: 7,
      x: positionEcke7_3_St_4_BMSMB,
      z: wanddickeEcke7_3_St_4_BMSMB,
    };
    const ecke3_St_4_BMSMB_e8 = {
      ecke: 8,
      x: positionEcke8_3_St_4_BMSMB,
      z: wanddickeEcke8_3_St_4_BMSMB,
    };
    // const ecke3_St_4_BMSMB_e911 = {
    //   ecke: 10,
    //   x: positionEcke9Zwischen11_3_St_4_BMSMB,
    //   z: wanddickeEcke9Zwischen11_3_St_4_BMSMB,
    // };
    const ecke3_St_4_BMSMB_e9 = {
      ecke: 9,
      x: positionEcke9_3_St_4_BMSMB,
      z: wanddickeEcke9_3_St_4_BMSMB,
    };
    const ecke3_St_4_BMSMB_e12 = {
      ecke: 12,
      x: positionEckeEnde_3_St_4_BMSMB,
      z: wanddickeEckeEnde_3_St_4_BMSMB,
    };

    const eckenArr_3_St_4_BMSMB = [
      ecke3_St_4_BMSMB_e1,
      ecke3_St_4_BMSMB_e2,
      ecke3_St_4_BMSMB_e3,
      ecke3_St_4_BMSMB_e4,
      ecke3_St_4_BMSMB_e5,
      ecke3_St_4_BMSMB_e6,
      // ecke3_St_4_BMSMB_e68,
      ecke3_St_4_BMSMB_e7,
      ecke3_St_4_BMSMB_e8,
      // ecke3_St_4_BMSMB_e911,
      ecke3_St_4_BMSMB_e9,
      ecke3_St_4_BMSMB_e12,
    ];

    console.log('-----------------------1-----------------------');
    const kommentarArr_3_St_4_BMSMB = [];
    let erstelltAm_3_St_4_BMSMB = ''; //: dateObject.toISOString(),
    let createdBy_3_St_4_BMSMB = benutzerID_3_St_4_BMSMB; //: kurzerName,   kurzerName = '643c1f042df0321cb8a06a50';
    let kommentarBeschreibung_3_St_4_BMSMB = 'Erstmals erstellt.'; //: worteOderSaetze.trim(),

    const dateObject_3_St_4_BMSMB = new Date();
    //   `${year}-${month}-${day}T00:00:00.000Z`,
    // );
    console.log(dateObject_3_St_4_BMSMB.toISOString());
    erstelltAm_3_St_4_BMSMB = dateObject_3_St_4_BMSMB.toISOString();

    console.log('-----------------------2-----------------------');
    kommentarArr_3_St_4_BMSMB.push({
      erstelltAm: erstelltAm_3_St_4_BMSMB,
      createdBy: createdBy_3_St_4_BMSMB,
      kommentarBeschreibung: kommentarBeschreibung_3_St_4_BMSMB,
    });

    console.log('-----------------------3-----------------------');
    const stufe1Obj_3_St_4_BMSMB = {
      dornDurchmesser: dornDurchmesserErsteStufe_3_St_4_BMSMB,
      position: dornPositionErsteStufe_3_St_4_BMSMB,
      rampeRein: getRampeReinDefault(),
      rampeRaus: getRampeRausDefault(),
      dehnung: getDehnungDefault(),
    };
    const stufe2Obj_3_St_4_BMSMB = {
      dornDurchmesser: dornDurchmesserZweiteStufe_3_St_4_BMSMB,
      position: dornPositionZweiteStufe_3_St_4_BMSMB,
      rampeRein: getRampeReinDefault(),
      rampeRaus: getRampeRausDefault(),
      dehnung: getDehnungDefault(),
    };
    const stufe3Obj_3_St_4_BMSMB = {
      dornDurchmesser: dornDurchmesserDritteStufe_3_St_4_BMSMB,
      position: dornPositionDritteStufe_3_St_4_BMSMB,
      rampeRein: getRampeReinDefault(),
      rampeRaus: getRampeRausDefault(),
      dehnung: getDehnungDefault(),
    };

    const stufenArray_3_St_4_BMSMB = [
      stufe1Obj_3_St_4_BMSMB,
      stufe2Obj_3_St_4_BMSMB,
      stufe3Obj_3_St_4_BMSMB,
    ];

    console.log(
      '-----------------------------ArtikelName erstellen--------------------------',
    );
    console.log(
      'artikelNameFirstStr_3_St_4_BMSMB: ' + artikelNameFirstStr_3_St_4_BMSMB,
    );
    let artikelName_3_St_4_BMSMB = '';

    const ziehGeschwindigkeitLastStr_3_St_4_BMSMB =
      ziehGeschwindigkeitFloat_3_St_4_BMSMB.toString();
    console.log(
      'ziehGeschwindigkeitLastStr_3_St_4_BMSMB: ' +
        ziehGeschwindigkeitLastStr_3_St_4_BMSMB,
    );

    const fixlaengeStr_3_St_4_BMSMB = fixlaenge_3_St_4_BMSMB.toString();
    console.log('fixlaengeStr_3_St_4_BMSMB: ' + fixlaengeStr_3_St_4_BMSMB);

    artikelName_3_St_4_BMSMB =
      artikelNameFirstStr_3_St_4_BMSMB +
      ' - ' +
      fixlaengeStr_3_St_4_BMSMB +
      'mm - ' +
      mehrfachlaenge_3_St_4_BMSMB +
      'mm - ' +
      anzahlFixlaengenProMehrfachlaenge_3_St_4_BMSMB +
      'Stk. - ' +
      ziehGeschwindigkeitLastStr_3_St_4_BMSMB +
      'm/min -';

    console.log('-----------------------4-----------------------');

    const data_3_St_4_BMSMB = {
      artikelNummer: artikelNummerFloat_3_St_4_BMSMB,
      artikelName: artikelName_3_St_4_BMSMB,
      teileNummer: getTeileNummerDefault(),
      zeichnungsNummer: getZeichnungsNummerDefault(),
      aenderungsstandZeichnung: getAenderungsstandZeichnungDefault(),
      aenderungsstandRezept: getAenderungsstandRezeptDefault(),
      beschreibung: getBeschreibungDefault(),
      ziehGeschwindigkeit: ziehGeschwindigkeitFloat_3_St_4_BMSMB,
      v_dorn_Fwd: vDornVorFloat_3_St_4_BMSMB,
      v_dorn_Bwd: vDornZurueckFloat_3_St_4_BMSMB,
      kommentar: kommentarArr_3_St_4_BMSMB,

      rohrAussenDurchmesserLetzterZug:
        rohrAussenDurchmesserLetzterZug_3_St_4_BMSMB,
      rohrInnenDurchmesserLetzterZug:
        rohrInnenDurchmesserLetzterZugBerechnet_3_St_4_BMSMB,
      angel: angel_3_St_4_BMSMB,
      rohrAussenDurchmesserTDTZug: rohrAussenDurchmesserTDTZug_3_St_4_BMSMB,

      dornStufe: stufenArray_3_St_4_BMSMB,

      fixLaenge: fixlaenge_3_St_4_BMSMB,
      ausgleichsstueck: ausgleichstueck_3_St_4_BMSMB,
      mehrfachLaenge: mehrfachlaenge_3_St_4_BMSMB,
      anzahlFixLaengenProMehrfachLaenge:
        anzahlFixlaengenProMehrfachlaenge_3_St_4_BMSMB,
      negTolMehrfachLaenge: getNegativeToleranzMehrfachlaengeDefault(),
      posTolMehrfachLaenge: getPositiveToleranzMehrfachlaengeDefault(),
      mindestAnzahlGutProfile: getMindestAnzahlGutprofileDefault(),

      obereToleranz: obereToleranz_3_St_4_BMSMB,
      untereToleranz: untereToleranz_3_St_4_BMSMB,

      mindestGutanteil: mindestGutanteil_3_St_4_BMSMB,
      profileGekoppelt: profileGekoppelt_3_St_4_BMSMB,

      ecke: eckenArr_3_St_4_BMSMB,
    };
    console.log('-----------------------5-----------------------');
    const newRecipes_3_St_4_BMSMB =
      await createRecipesTDT_de(data_3_St_4_BMSMB);
    console.log('newRecipes_3_St_4_BMSMB: ' + newRecipes_3_St_4_BMSMB);
    if (!newRecipes_3_St_4_BMSMB) {
      // Null is false
      return next(new AppError('No recipe_3_St_4_BMSMB write in db! :(', 404));
    }

    res.status(201).json({
      // 201 = created
      status: 'success',
      message: 'Recipe_3_St_4_BMSMB succefully created!',
    });
  },
);

export const getCreateRecipe3_St_4_MBSBM = catchAsync(
  async (req, res, next) => {
    console.log('bin getCreateRecipe3_St_4_MBSBM im controller!');
    console.log('req.body: ' + req.body);
    console.log(
      'JSON.stringify(req.body.recipeData): ' +
        JSON.stringify(req.body.recipeData),
    );

    const artikelNummerStr_3_St_4_MBSBM =
      req.body.recipeData.artikelNummer_3_St_4_MBSBM;
    console.log('artikelNummerStr: ' + artikelNummerStr_3_St_4_MBSBM);
    console.log(
      'typeOf artikelNummerStr: ' + typeof artikelNummerStr_3_St_4_MBSBM,
    );
    const artikelNummerFloat_3_St_4_MBSBM = parseFloat(
      artikelNummerStr_3_St_4_MBSBM,
    );
    console.log(
      'typeOf artikelNummerFloat: ' + typeof artikelNummerFloat_3_St_4_MBSBM,
    );

    const artikelNameFirstStr_3_St_4_MBSBM =
      req.body.recipeData.artikelName_3_St_4_MBSBM;

    const ziehGeschwindigkeitStr_3_St_4_MBSBM =
      req.body.recipeData.ziehGeschwindigkeit_3_St_4_MBSBM;
    console.log(
      'typeOf ziehGeschwindigkeitStr: ' +
        typeof ziehGeschwindigkeitStr_3_St_4_MBSBM,
    );
    const ziehGeschwindigkeitFloat_3_St_4_MBSBM = parseFloat(
      ziehGeschwindigkeitStr_3_St_4_MBSBM,
    );
    console.log(
      'typeOf ziehGeschwindigkeitFloat: ' +
        typeof ziehGeschwindigkeitFloat_3_St_4_MBSBM,
    );

    const vDornVorStr_3_St_4_MBSBM = req.body.recipeData.vDornVor_3_St_4_MBSBM;
    console.log('vDornVorStr_3_St_4_MBSBM:', vDornVorStr_3_St_4_MBSBM);
    console.log(
      'typeof vDornVorStr_3_St_4_MBSBM:',
      typeof vDornVorStr_3_St_4_MBSBM,
    );
    const vDornVorFloat_3_St_4_MBSBM = parseFloat(vDornVorStr_3_St_4_MBSBM);
    console.log(
      'typeof vDornVorFloat_3_St_4_MBSBM:',
      typeof vDornVorFloat_3_St_4_MBSBM,
    );

    const vDornZurueckStr_3_St_4_MBSBM =
      req.body.recipeData.vDornZurueck_3_St_4_MBSBM;
    console.log('vDornZurueckStr_3_St_4_MBSBM:', vDornZurueckStr_3_St_4_MBSBM);
    console.log(
      'typeof vDornZurueckStr_3_St_4_MBSBM:',
      typeof vDornZurueckStr_3_St_4_MBSBM,
    );
    const vDornZurueckFloat_3_St_4_MBSBM = parseFloat(
      vDornZurueckStr_3_St_4_MBSBM,
    );
    console.log(
      'typeof vDornZurueckFloat_3_St_4_MBSBM:',
      typeof vDornZurueckFloat_3_St_4_MBSBM,
    );

    const benutzerID_3_St_4_MBSBM = req.body.recipeData.benutzerID_3_St_4_MBSBM;
    console.log('benutzerID:' + benutzerID_3_St_4_MBSBM);
    const benutzerVorName_3_St_4_MBSBM =
      req.body.recipeData.benutzerVorName_3_St_4_MBSBM;
    const benutzerNachName_3_St_4_MBSBM =
      req.body.recipeData.benutzerNachName_3_St_4_MBSBM;

    console.log('**************************************');

    const rohrAussenDurchmesserLetzterZug_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.rohrAussenDurchmesserLetzterZug_3_St_4_MBSBM,
    );

    console.log(
      'rohrAussenDurchmesserLetzterZug: ' +
        rohrAussenDurchmesserLetzterZug_3_St_4_MBSBM,
    );
    console.log(
      'typeOf rohrAussenDurchmesserLetzterZug: ' +
        typeof rohrAussenDurchmesserLetzterZug_3_St_4_MBSBM,
    );
    console.log(
      'rohrAussenDurchmesserLetzterZug: ' +
        rohrAussenDurchmesserLetzterZug_3_St_4_MBSBM,
    );

    const rohrWandDickeAussenDurchmesserLetzterZug_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.rohrWandDickeAussenDurchmesserLetzterZug_3_St_4_MBSBM,
    );
    const rohrInnenDurchmesserLetzterZugBerechnet_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.rohrInnenDurchmesserLetzterZugBerechnet_3_St_4_MBSBM,
    );
    const rohrAussenDurchmesserTDTZug_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.rohrAussenDurchmesserTDTZug_3_St_4_MBSBM,
    );
    const angel_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.angel_3_St_4_MBSBM,
    );
    const dornDurchmesserErsteStufe_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.dornDurchmesserErsteStufe_3_St_4_MBSBM,
    );
    const dornPositionErsteStufe_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.dornPositionErsteStufe_3_St_4_MBSBM,
    );
    const dornDurchmesserZweiteStufe_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.dornDurchmesserZweiteStufe_3_St_4_MBSBM,
    );
    const dornPositionZweiteStufe_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.dornPositionZweiteStufe_3_St_4_MBSBM,
    );
    const dornDurchmesserDritteStufe_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.dornDurchmesserDritteStufe_3_St_4_MBSBM,
    );
    const dornPositionDritteStufe_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.dornPositionDritteStufe_3_St_4_MBSBM,
    );

    const fixlaenge_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.fixlaenge_3_St_4_MBSBM,
    );
    const ausgleichstueck_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.ausgleichstueck_3_St_4_MBSBM,
    );
    const mehrfachlaenge_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.mehrfachlaenge_3_St_4_MBSBM,
    );
    const anzahlFixlaengenProMehrfachlaenge_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.anzahlFixlaengenProMehrfachlaenge_3_St_4_MBSBM,
    );
    const mindestGutanteil_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.mindestGutanteil_3_St_4_MBSBM,
    );
    const profileGekoppelt_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.profileGekoppelt_3_St_4_MBSBM,
    );
    const obereToleranz_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.obereToleranz_3_St_4_MBSBM,
    );
    const untereToleranz_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.untereToleranz_3_St_4_MBSBM,
    );

    const wanddickeEcke1_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.wanddickeEcke1_3_St_4_MBSBM,
    );
    const positionEcke1_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.positionEcke1_3_St_4_MBSBM,
    );
    const wanddickeEcke2_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.wanddickeEcke2_3_St_4_MBSBM,
    );
    const positionEcke2_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.positionEcke2_3_St_4_MBSBM,
    );
    // const wanddickeEcke2Zwischen4_3_St_4_MBSBM = parseFloat(
    //   req.body.recipeData.wanddickeEcke2Zwischen4_3_St_4_MBSBM,
    // );
    // const positionEcke2Zwischen4_3_St_4_MBSBM = parseFloat(
    //   req.body.recipeData.positionEcke2Zwischen4_3_St_4_MBSBM,
    // );
    const wanddickeEcke3_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.wanddickeEcke3_3_St_4_MBSBM,
    );
    const positionEcke3_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.positionEcke3_3_St_4_MBSBM,
    );
    const wanddickeEcke4_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.wanddickeEcke4_3_St_4_MBSBM,
    );
    const positionEcke4_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.positionEcke4_3_St_4_MBSBM,
    );
    const wanddickeEcke5_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.wanddickeEcke5_3_St_4_MBSBM,
    );
    const positionEcke5_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.positionEcke5_3_St_4_MBSBM,
    );
    const wanddickeEcke6_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.wanddickeEcke6_3_St_4_MBSBM,
    );
    const positionEcke6_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.positionEcke6_3_St_4_MBSBM,
    );
    // const wanddickeEcke7Zwischen9_3_St_4_MBSBM = parseFloat(
    //   req.body.recipeData.wanddickeEcke7Zwischen9_3_St_4_MBSBM,
    // );
    // const positionEcke7Zwischen9_3_St_4_MBSBM = parseFloat(
    //   req.body.recipeData.positionEcke7Zwischen9_3_St_4_MBSBM,
    // );
    const wanddickeEcke7_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.wanddickeEcke7_3_St_4_MBSBM,
    );
    const positionEcke7_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.positionEcke7_3_St_4_MBSBM,
    );
    const wanddickeEcke8_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.wanddickeEcke8_3_St_4_MBSBM,
    );
    const positionEcke8_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.positionEcke8_3_St_4_MBSBM,
    );
    const wanddickeEcke9_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.wanddickeEcke9_3_St_4_MBSBM,
    );
    const positionEcke9_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.positionEcke9_3_St_4_MBSBM,
    );
    const wanddickeEckeEnde_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.wanddickeEckeEnde_3_St_4_MBSBM,
    );
    const positionEckeEnde_3_St_4_MBSBM = parseFloat(
      req.body.recipeData.positionEckeEnde_3_St_4_MBSBM,
    );

    const ecke3_St_4_MBSBM_e1 = {
      ecke: 1,
      x: positionEcke1_3_St_4_MBSBM,
      z: wanddickeEcke1_3_St_4_MBSBM,
    };
    const ecke3_St_4_MBSBM_e2 = {
      ecke: 2,
      x: positionEcke2_3_St_4_MBSBM,
      z: wanddickeEcke2_3_St_4_MBSBM,
    };
    // const ecke3_St_4_MBSBM_e24 = {
    //   ecke: 3,
    //   x: positionEcke2Zwischen4_3_St_4_MBSBM,
    //   z: wanddickeEcke2Zwischen4_3_St_4_MBSBM,
    // };
    const ecke3_St_4_MBSBM_e3 = {
      ecke: 3,
      x: positionEcke3_3_St_4_MBSBM,
      z: wanddickeEcke3_3_St_4_MBSBM,
    };
    const ecke3_St_4_MBSBM_e4 = {
      ecke: 4,
      x: positionEcke4_3_St_4_MBSBM,
      z: wanddickeEcke4_3_St_4_MBSBM,
    };
    const ecke3_St_4_MBSBM_e5 = {
      ecke: 5,
      x: positionEcke5_3_St_4_MBSBM,
      z: wanddickeEcke5_3_St_4_MBSBM,
    };
    const ecke3_St_4_MBSBM_e6 = {
      ecke: 6,
      x: positionEcke6_3_St_4_MBSBM,
      z: wanddickeEcke6_3_St_4_MBSBM,
    };
    // const ecke3_St_4_MBSBM_e79 = {
    //   ecke: 8,
    //   x: positionEcke7Zwischen9_3_St_4_MBSBM,
    //   z: wanddickeEcke7Zwischen9_3_St_4_MBSBM,
    // };
    const ecke3_St_4_MBSBM_e7 = {
      ecke: 7,
      x: positionEcke7_3_St_4_MBSBM,
      z: wanddickeEcke7_3_St_4_MBSBM,
    };
    const ecke3_St_4_MBSBM_e8 = {
      ecke: 8,
      x: positionEcke8_3_St_4_MBSBM,
      z: wanddickeEcke8_3_St_4_MBSBM,
    };
    const ecke3_St_4_MBSBM_e9 = {
      ecke: 9,
      x: positionEcke9_3_St_4_MBSBM,
      z: wanddickeEcke9_3_St_4_MBSBM,
    };
    const ecke3_St_4_MBSBM_e10 = {
      ecke: 10,
      x: positionEckeEnde_3_St_4_MBSBM,
      z: wanddickeEckeEnde_3_St_4_MBSBM,
    };

    const eckenArr_3_St_4_MBSBM = [
      ecke3_St_4_MBSBM_e1,
      ecke3_St_4_MBSBM_e2,
      // ecke3_St_4_MBSBM_e24,
      ecke3_St_4_MBSBM_e3,
      ecke3_St_4_MBSBM_e4,
      ecke3_St_4_MBSBM_e5,
      ecke3_St_4_MBSBM_e6,
      // ecke3_St_4_MBSBM_e79,
      ecke3_St_4_MBSBM_e7,
      ecke3_St_4_MBSBM_e8,
      ecke3_St_4_MBSBM_e9,
      ecke3_St_4_MBSBM_e10,
    ];
    //----------------------------------------------------------------------------------------------------------------------------------

    console.log('-----------------------1-----------------------');
    const kommentarArr_3_St_4_MBSBM = [];
    let erstelltAm_3_St_4_MBSBM = ''; //: dateObject.toISOString(),
    let createdBy_3_St_4_MBSBM = benutzerID_3_St_4_MBSBM; //: kurzerName,   kurzerName = '643c1f042df0321cb8a06a50';
    let kommentarBeschreibung_3_St_4_MBSBM = 'Erstmals erstellt.'; //: worteOderSaetze.trim(),

    const dateObject_3_St_4_MBSBM = new Date();
    //   `${year}-${month}-${day}T00:00:00.000Z`,
    // );
    console.log(dateObject_3_St_4_MBSBM.toISOString());
    erstelltAm_3_St_4_MBSBM = dateObject_3_St_4_MBSBM.toISOString();

    console.log('-----------------------2-----------------------');
    kommentarArr_3_St_4_MBSBM.push({
      erstelltAm: erstelltAm_3_St_4_MBSBM,
      createdBy: createdBy_3_St_4_MBSBM,
      kommentarBeschreibung: kommentarBeschreibung_3_St_4_MBSBM,
    });

    console.log('-----------------------3-----------------------');
    const stufe1Obj_3_St_4_MBSBM = {
      dornDurchmesser: dornDurchmesserErsteStufe_3_St_4_MBSBM,
      position: dornPositionErsteStufe_3_St_4_MBSBM,
      rampeRein: getRampeReinDefault(),
      rampeRaus: getRampeRausDefault(),
      dehnung: getDehnungDefault(),
    };
    const stufe2Obj_3_St_4_MBSBM = {
      dornDurchmesser: dornDurchmesserZweiteStufe_3_St_4_MBSBM,
      position: dornPositionZweiteStufe_3_St_4_MBSBM,
      rampeRein: getRampeReinDefault(),
      rampeRaus: getRampeRausDefault(),
      dehnung: getDehnungDefault(),
    };
    const stufe3Obj_3_St_4_MBSBM = {
      dornDurchmesser: dornDurchmesserDritteStufe_3_St_4_MBSBM,
      position: dornPositionDritteStufe_3_St_4_MBSBM,
      rampeRein: getRampeReinDefault(),
      rampeRaus: getRampeRausDefault(),
      dehnung: getDehnungDefault(),
    };

    const stufenArray_3_St_4_MBSBM = [
      stufe1Obj_3_St_4_MBSBM,
      stufe2Obj_3_St_4_MBSBM,
      stufe3Obj_3_St_4_MBSBM,
    ];

    console.log(
      '-----------------------------ArtikelName erstellen--------------------------',
    );
    console.log(
      'artikelNameFirstStr_3_St_4_MBSBM: ' + artikelNameFirstStr_3_St_4_MBSBM,
    );
    let artikelName_3_St_4_MBSBM = '';

    const ziehGeschwindigkeitLastStr_3_St_4_MBSBM =
      ziehGeschwindigkeitFloat_3_St_4_MBSBM.toString();
    console.log(
      'ziehGeschwindigkeitLastStr_3_St_4_MBSBM: ' +
        ziehGeschwindigkeitLastStr_3_St_4_MBSBM,
    );

    const fixlaengeStr_3_St_4_MBSBM = fixlaenge_3_St_4_MBSBM.toString();
    console.log('fixlaengeStr_3_St_4_MBSBM: ' + fixlaengeStr_3_St_4_MBSBM);

    artikelName_3_St_4_MBSBM =
      artikelNameFirstStr_3_St_4_MBSBM +
      ' - ' +
      fixlaengeStr_3_St_4_MBSBM +
      'mm - ' +
      mehrfachlaenge_3_St_4_MBSBM +
      'mm - ' +
      anzahlFixlaengenProMehrfachlaenge_3_St_4_MBSBM +
      'Stk. - ' +
      ziehGeschwindigkeitLastStr_3_St_4_MBSBM +
      'm/min -';

    console.log('-----------------------4-----------------------');

    const data_3_St_4_MBSBM = {
      artikelNummer: artikelNummerFloat_3_St_4_MBSBM,
      artikelName: artikelName_3_St_4_MBSBM,
      teileNummer: getTeileNummerDefault(),
      zeichnungsNummer: getZeichnungsNummerDefault(),
      aenderungsstandZeichnung: getAenderungsstandZeichnungDefault(),
      aenderungsstandRezept: getAenderungsstandRezeptDefault(),
      beschreibung: getBeschreibungDefault(),
      ziehGeschwindigkeit: ziehGeschwindigkeitFloat_3_St_4_MBSBM,
      v_dorn_Fwd: vDornVorFloat_3_St_4_MBSBM,
      v_dorn_Bwd: vDornZurueckFloat_3_St_4_MBSBM,
      kommentar: kommentarArr_3_St_4_MBSBM,

      rohrAussenDurchmesserLetzterZug:
        rohrAussenDurchmesserLetzterZug_3_St_4_MBSBM,
      rohrInnenDurchmesserLetzterZug:
        rohrInnenDurchmesserLetzterZugBerechnet_3_St_4_MBSBM,
      angel: angel_3_St_4_MBSBM,
      rohrAussenDurchmesserTDTZug: rohrAussenDurchmesserTDTZug_3_St_4_MBSBM,

      dornStufe: stufenArray_3_St_4_MBSBM,

      fixLaenge: fixlaenge_3_St_4_MBSBM,
      ausgleichsstueck: ausgleichstueck_3_St_4_MBSBM,
      mehrfachLaenge: mehrfachlaenge_3_St_4_MBSBM,
      anzahlFixLaengenProMehrfachLaenge:
        anzahlFixlaengenProMehrfachlaenge_3_St_4_MBSBM,
      negTolMehrfachLaenge: getNegativeToleranzMehrfachlaengeDefault(),
      posTolMehrfachLaenge: getPositiveToleranzMehrfachlaengeDefault(),
      mindestAnzahlGutProfile: getMindestAnzahlGutprofileDefault(),

      obereToleranz: obereToleranz_3_St_4_MBSBM,
      untereToleranz: untereToleranz_3_St_4_MBSBM,

      mindestGutanteil: mindestGutanteil_3_St_4_MBSBM,
      profileGekoppelt: profileGekoppelt_3_St_4_MBSBM,

      ecke: eckenArr_3_St_4_MBSBM,
    };
    console.log('-----------------------5-----------------------');
    const newRecipes_3_St_4_MBSBM =
      await createRecipesTDT_de(data_3_St_4_MBSBM);
    console.log('newRecipes_3_St_4_MBSBM: ' + newRecipes_3_St_4_MBSBM);
    if (!newRecipes_3_St_4_MBSBM) {
      // Null is false
      return next(new AppError('No recipe_3_St_4_MBSBM write in db! :(', 404));
    }

    res.status(201).json({
      // 201 = created
      status: 'success',
      message: 'Recipe_3_St_4_MBSBM succefully created!',
    });
  },
);

export const getCreateRecipe2_St_6_BSBSBSB = catchAsync(
  async (req, res, next) => {
    console.log('bin getCreateRecipe2_St_6_BSBSBSB im controller!');
    console.log('req.body: ' + req.body);
    console.log(
      'JSON.stringify(req.body.recipeData): ' +
        JSON.stringify(req.body.recipeData),
    );

    const artikelNummerStr_2_St_6_BSBSBSB =
      req.body.recipeData.artikelNummer_2_St_6_BSBSBSB;
    console.log('artikelNummerStr: ' + artikelNummerStr_2_St_6_BSBSBSB);
    console.log(
      'typeOf artikelNummerStr: ' + typeof artikelNummerStr_2_St_6_BSBSBSB,
    );
    const artikelNummerFloat_2_St_6_BSBSBSB = parseFloat(
      artikelNummerStr_2_St_6_BSBSBSB,
    );
    console.log(
      'typeOf artikelNummerFloat: ' + typeof artikelNummerFloat_2_St_6_BSBSBSB,
    );

    const artikelNameFirstStr_2_St_6_BSBSBSB =
      req.body.recipeData.artikelName_2_St_6_BSBSBSB;

    const ziehGeschwindigkeitStr_2_St_6_BSBSBSB =
      req.body.recipeData.ziehGeschwindigkeit_2_St_6_BSBSBSB;
    console.log(
      'typeOf ziehGeschwindigkeitStr: ' +
        typeof ziehGeschwindigkeitStr_2_St_6_BSBSBSB,
    );
    const ziehGeschwindigkeitFloat_2_St_6_BSBSBSB = parseFloat(
      ziehGeschwindigkeitStr_2_St_6_BSBSBSB,
    );
    console.log(
      'typeOf ziehGeschwindigkeitFloat: ' +
        typeof ziehGeschwindigkeitFloat_2_St_6_BSBSBSB,
    );

    const vDornVorStr_2_St_6_BSBSBSB =
      req.body.recipeData.vDornVor_2_St_6_BSBSBSB;
    console.log('vDornVorStr_2_St_6_BSBSBSB:', vDornVorStr_2_St_6_BSBSBSB);
    console.log(
      'Type Of vDornVorStr_2_St_6_BSBSBSB:',
      typeof vDornVorStr_2_St_6_BSBSBSB,
    );
    const vDornVorFloat_2_St_6_BSBSBSB = parseFloat(vDornVorStr_2_St_6_BSBSBSB);
    console.log(
      'ype of vDornVorFloat_2_St_6_BSBSBSB:',
      typeof vDornVorFloat_2_St_6_BSBSBSB,
    );

    const vDornZuerueckStr_2_St_6_BSBSBSB =
      req.body.recipeData.vDornZurueck_2_St_6_BSBSBSB;
    console.log(
      'vDornZuerueckStr_2_St_6_BSBSBSB:',
      vDornZuerueckStr_2_St_6_BSBSBSB,
    );
    console.log(
      'typeof vDornZuerueckStr_2_St_6_BSBSBSB',
      typeof vDornZuerueckStr_2_St_6_BSBSBSB,
    );
    const vDornZurueckFloat_2_St_6_BSBSBSB = parseFloat(
      vDornZuerueckStr_2_St_6_BSBSBSB,
    );
    console.log(
      'typeof vDornZurueckFloat_2_St_6_BSBSBSB:',
      typeof vDornZurueckFloat_2_St_6_BSBSBSB,
    );

    const benutzerID_2_St_6_BSBSBSB =
      req.body.recipeData.benutzerID_2_St_6_BSBSBSB;
    console.log('benutzerID:' + benutzerID_2_St_6_BSBSBSB);
    const benutzerVorName_2_St_6_BSBSBSB =
      req.body.recipeData.benutzerVorName_2_St_6_BSBSBSB;
    const benutzerNachName_2_St_6_BSBSBSB =
      req.body.recipeData.benutzerNachName_2_St_6_BSBSBSB;

    console.log('**************************************');

    const rohrAussenDurchmesserLetzterZug_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.rohrAussenDurchmesserLetzterZug_2_St_6_BSBSBSB,
    );

    console.log(
      'rohrAussenDurchmesserLetzterZug: ' +
        rohrAussenDurchmesserLetzterZug_2_St_6_BSBSBSB,
    );
    console.log(
      'typeOf rohrAussenDurchmesserLetzterZug: ' +
        typeof rohrAussenDurchmesserLetzterZug_2_St_6_BSBSBSB,
    );
    console.log(
      'rohrAussenDurchmesserLetzterZug: ' +
        rohrAussenDurchmesserLetzterZug_2_St_6_BSBSBSB,
    );

    const rohrWandDickeAussenDurchmesserLetzterZug_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData
        .rohrWandDickeAussenDurchmesserLetzterZug_2_St_6_BSBSBSB,
    );
    const rohrInnenDurchmesserLetzterZugBerechnet_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData
        .rohrInnenDurchmesserLetzterZugBerechnet_2_St_6_BSBSBSB,
    );
    const rohrAussenDurchmesserTDTZug_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.rohrAussenDurchmesserTDTZug_2_St_6_BSBSBSB,
    );
    const angel_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.angel_2_St_6_BSBSBSB,
    );
    const dornDurchmesserErsteStufe_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.dornDurchmesserErsteStufe_2_St_6_BSBSBSB,
    );
    const dornPositionErsteStufe_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.dornPositionErsteStufe_2_St_6_BSBSBSB,
    );
    const dornDurchmesserZweiteStufe_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.dornDurchmesserZweiteStufe_2_St_6_BSBSBSB,
    );
    const dornPositionZweiteStufe_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.dornPositionZweiteStufe_2_St_6_BSBSBSB,
    );
    const fixlaenge_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.fixlaenge_2_St_6_BSBSBSB,
    );
    const ausgleichstueck_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.ausgleichstueck_2_St_6_BSBSBSB,
    );
    const mehrfachlaenge_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.mehrfachlaenge_2_St_6_BSBSBSB,
    );
    const anzahlFixlaengenProMehrfachlaenge_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.anzahlFixlaengenProMehrfachlaenge_2_St_6_BSBSBSB,
    );
    const mindestGutanteil_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.mindestGutanteil_2_St_6_BSBSBSB,
    );
    const profileGekoppelt_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.profileGekoppelt_2_St_6_BSBSBSB,
    );
    const obereToleranz_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.obereToleranz_2_St_6_BSBSBSB,
    );
    const untereToleranz_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.untereToleranz_2_St_6_BSBSBSB,
    );

    const wanddickeEcke1_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke1_2_St_6_BSBSBSB,
    );
    const positionEcke1_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke1_2_St_6_BSBSBSB,
    );
    const wanddickeEcke2_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke2_2_St_6_BSBSBSB,
    );
    const positionEcke2_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke2_2_St_6_BSBSBSB,
    );

    const wanddickeEcke3_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke3_2_St_6_BSBSBSB,
    );
    const positionEcke3_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke3_2_St_6_BSBSBSB,
    );
    const wanddickeEcke4_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke4_2_St_6_BSBSBSB,
    );
    const positionEcke4_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke4_2_St_6_BSBSBSB,
    );

    // const wanddickeEcke4Zwischen6_2_St_6_BSBSBSB = parseFloat(
    //   req.body.recipeData.wanddickeEcke4Zwischen6_2_St_6_BSBSBSB,
    // );
    // const positionEcke4Zwischen6_2_St_6_BSBSBSB = parseFloat(
    //   req.body.recipeData.positionEcke4Zwischen6_2_St_6_BSBSBSB,
    // );

    const wanddickeEcke5_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke5_2_St_6_BSBSBSB,
    );
    const positionEcke5_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke5_2_St_6_BSBSBSB,
    );

    const wanddickeEcke6_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke6_2_St_6_BSBSBSB,
    );
    const positionEcke6_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke6_2_St_6_BSBSBSB,
    );

    const wanddickeEcke7_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke7_2_St_6_BSBSBSB,
    );
    const positionEcke7_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke7_2_St_6_BSBSBSB,
    );
    const wanddickeEcke8_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke8_2_St_6_BSBSBSB,
    );
    const positionEcke8_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke8_2_St_6_BSBSBSB,
    );
    // const wanddickeEcke9Zwischen11_2_St_6_BSBSBSB = parseFloat(
    //   req.body.recipeData.wanddickeEcke9Zwischen11_2_St_6_BSBSBSB,
    // );
    // const positionEcke9Zwischen11_2_St_6_BSBSBSB = parseFloat(
    //   req.body.recipeData.positionEcke9Zwischen11_2_St_6_BSBSBSB,
    // );
    const wanddickeEcke9_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke9_2_St_6_BSBSBSB,
    );
    const positionEcke9_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke9_2_St_6_BSBSBSB,
    );
    const wanddickeEcke10_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke10_2_St_6_BSBSBSB,
    );
    const positionEcke10_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke10_2_St_6_BSBSBSB,
    );
    const wanddickeEcke11_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke11_2_St_6_BSBSBSB,
    );
    const positionEcke11_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke11_2_St_6_BSBSBSB,
    );
    const wanddickeEcke12_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke12_2_St_6_BSBSBSB,
    );
    const positionEcke12_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke12_2_St_6_BSBSBSB,
    );
    // const wanddickeEcke14Zwischen16_2_St_6_BSBSBSB = parseFloat(
    //   req.body.recipeData.wanddickeEcke14Zwischen16_2_St_6_BSBSBSB,
    // );
    // const positionEcke14Zwischen16_2_St_6_BSBSBSB = parseFloat(
    //   req.body.recipeData.positionEcke14Zwischen16_2_St_6_BSBSBSB,
    // );
    const wanddickeEcke13_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEcke13_2_St_6_BSBSBSB,
    );
    const positionEcke13_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEcke13_2_St_6_BSBSBSB,
    );

    const wanddickeEckeEnde_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.wanddickeEckeEnde_2_St_6_BSBSBSB,
    );
    const positionEckeEnde_2_St_6_BSBSBSB = parseFloat(
      req.body.recipeData.positionEckeEnde_2_St_6_BSBSBSB,
    );

    const ecke2_St_6_BSBSBSB_e1 = {
      ecke: 1,
      x: positionEcke1_2_St_6_BSBSBSB,
      z: wanddickeEcke1_2_St_6_BSBSBSB,
    };
    const ecke2_St_6_BSBSBSB_e2 = {
      ecke: 2,
      x: positionEcke2_2_St_6_BSBSBSB,
      z: wanddickeEcke2_2_St_6_BSBSBSB,
    };
    const ecke2_St_6_BSBSBSB_e3 = {
      ecke: 3,
      x: positionEcke3_2_St_6_BSBSBSB,
      z: wanddickeEcke3_2_St_6_BSBSBSB,
    };
    const ecke2_St_6_BSBSBSB_e4 = {
      ecke: 4,
      x: positionEcke4_2_St_6_BSBSBSB,
      z: wanddickeEcke4_2_St_6_BSBSBSB,
    };
    // const ecke2_St_6_BSBSBSB_e46 = {
    //   ecke: 5,
    //   x: positionEcke4Zwischen6_2_St_6_BSBSBSB,
    //   z: wanddickeEcke4Zwischen6_2_St_6_BSBSBSB,
    // };
    const ecke2_St_6_BSBSBSB_e5 = {
      ecke: 5,
      x: positionEcke5_2_St_6_BSBSBSB,
      z: wanddickeEcke5_2_St_6_BSBSBSB,
    };
    const ecke2_St_6_BSBSBSB_e6 = {
      ecke: 6,
      x: positionEcke6_2_St_6_BSBSBSB,
      z: wanddickeEcke6_2_St_6_BSBSBSB,
    };
    const ecke2_St_6_BSBSBSB_e7 = {
      ecke: 7,
      x: positionEcke7_2_St_6_BSBSBSB,
      z: wanddickeEcke7_2_St_6_BSBSBSB,
    };
    const ecke2_St_6_BSBSBSB_e8 = {
      ecke: 8,
      x: positionEcke8_2_St_6_BSBSBSB,
      z: wanddickeEcke8_2_St_6_BSBSBSB,
    };
    // const ecke2_St_6_BSBSBSB_e911 = {
    //   ecke: 10,
    //   x: positionEcke9Zwischen11_2_St_6_BSBSBSB,
    //   z: wanddickeEcke9Zwischen11_2_St_6_BSBSBSB,
    // };
    const ecke2_St_6_BSBSBSB_e9 = {
      ecke: 9,
      x: positionEcke9_2_St_6_BSBSBSB,
      z: wanddickeEcke9_2_St_6_BSBSBSB,
    };
    const ecke2_St_6_BSBSBSB_e10 = {
      ecke: 10,
      x: positionEcke10_2_St_6_BSBSBSB,
      z: wanddickeEcke10_2_St_6_BSBSBSB,
    };
    const ecke2_St_6_BSBSBSB_e11 = {
      ecke: 11,
      x: positionEcke11_2_St_6_BSBSBSB,
      z: wanddickeEcke11_2_St_6_BSBSBSB,
    };
    const ecke2_St_6_BSBSBSB_e12 = {
      ecke: 12,
      x: positionEcke12_2_St_6_BSBSBSB,
      z: wanddickeEcke12_2_St_6_BSBSBSB,
    };
    // const ecke2_St_6_BSBSBSB_e1416 = {
    //   ecke: 15,
    //   x: positionEcke14Zwischen16_2_St_6_BSBSBSB,
    //   z: wanddickeEcke14Zwischen16_2_St_6_BSBSBSB,
    // };
    const ecke2_St_6_BSBSBSB_e13 = {
      ecke: 13,
      x: positionEcke13_2_St_6_BSBSBSB,
      z: wanddickeEcke13_2_St_6_BSBSBSB,
    };
    const ecke2_St_6_BSBSBSB_e17 = {
      ecke: 17,
      x: positionEckeEnde_2_St_6_BSBSBSB,
      z: wanddickeEckeEnde_2_St_6_BSBSBSB,
    };

    const eckenArr_2_St_6_BSBSBSB = [
      ecke2_St_6_BSBSBSB_e1,
      ecke2_St_6_BSBSBSB_e2,
      ecke2_St_6_BSBSBSB_e3,
      ecke2_St_6_BSBSBSB_e4,
      // ecke2_St_6_BSBSBSB_e46,
      ecke2_St_6_BSBSBSB_e5,
      ecke2_St_6_BSBSBSB_e6,
      ecke2_St_6_BSBSBSB_e7,
      ecke2_St_6_BSBSBSB_e8,
      // ecke2_St_6_BSBSBSB_e911,
      ecke2_St_6_BSBSBSB_e9,
      ecke2_St_6_BSBSBSB_e10,
      ecke2_St_6_BSBSBSB_e11,
      ecke2_St_6_BSBSBSB_e12,
      // ecke2_St_6_BSBSBSB_e1416,
      ecke2_St_6_BSBSBSB_e13,
      ecke2_St_6_BSBSBSB_e17,
    ];
    //----------------------------------------------------------------------------------------------------------------------------------

    console.log('-----------------------1-----------------------');
    const kommentarArr_2_St_6_BSBSBSB = [];
    let erstelltAm_2_St_6_BSBSBSB = ''; //: dateObject.toISOString(),
    let createdBy_2_St_6_BSBSBSB = benutzerID_2_St_6_BSBSBSB; //: kurzerName,   kurzerName = '643c1f042df0321cb8a06a50';
    let kommentarBeschreibung_2_St_6_BSBSBSB = 'Erstmals erstellt.'; //: worteOderSaetze.trim(),

    const dateObject_2_St_6_BSBSBSB = new Date();
    //   `${year}-${month}-${day}T00:00:00.000Z`,
    // );
    console.log(dateObject_2_St_6_BSBSBSB.toISOString());
    erstelltAm_2_St_6_BSBSBSB = dateObject_2_St_6_BSBSBSB.toISOString();

    console.log('-----------------------2-----------------------');
    kommentarArr_2_St_6_BSBSBSB.push({
      erstelltAm: erstelltAm_2_St_6_BSBSBSB,
      createdBy: createdBy_2_St_6_BSBSBSB,
      kommentarBeschreibung: kommentarBeschreibung_2_St_6_BSBSBSB,
    });

    console.log('-----------------------3-----------------------');
    const stufe1Obj_2_St_6_BSBSBSB = {
      dornDurchmesser: dornDurchmesserErsteStufe_2_St_6_BSBSBSB,
      position: dornPositionErsteStufe_2_St_6_BSBSBSB,
      rampeRein: getRampeReinDefault(),
      rampeRaus: getRampeRausDefault(),
      dehnung: getDehnungDefault(),
    };
    const stufe2Obj_2_St_6_BSBSBSB = {
      dornDurchmesser: dornDurchmesserZweiteStufe_2_St_6_BSBSBSB,
      position: dornPositionZweiteStufe_2_St_6_BSBSBSB,
      rampeRein: getRampeReinDefault(),
      rampeRaus: getRampeRausDefault(),
      dehnung: getDehnungDefault(),
    };

    const stufenArray_2_St_6_BSBSBSB = [
      stufe1Obj_2_St_6_BSBSBSB,
      stufe2Obj_2_St_6_BSBSBSB,
    ];

    console.log(
      '-----------------------------ArtikelName erstellen--------------------------',
    );
    console.log(
      'artikelNameFirstStr_2_St_6_BSBSBSB: ' +
        artikelNameFirstStr_2_St_6_BSBSBSB,
    );
    let artikelName_2_St_6_BSBSBSB = '';

    const ziehGeschwindigkeitLastStr_2_St_6_BSBSBSB =
      ziehGeschwindigkeitFloat_2_St_6_BSBSBSB.toString();
    console.log(
      'ziehGeschwindigkeitLastStr_2_St_6_BSBSBSB: ' +
        ziehGeschwindigkeitLastStr_2_St_6_BSBSBSB,
    );

    const fixlaengeStr_2_St_6_BSBSBSB = fixlaenge_2_St_6_BSBSBSB.toString();
    console.log('fixlaengeStr_2_St_6_BSBSBSB: ' + fixlaengeStr_2_St_6_BSBSBSB);

    artikelName_2_St_6_BSBSBSB =
      artikelNameFirstStr_2_St_6_BSBSBSB +
      ' - ' +
      fixlaengeStr_2_St_6_BSBSBSB +
      'mm - ' +
      mehrfachlaenge_2_St_6_BSBSBSB +
      'mm - ' +
      anzahlFixlaengenProMehrfachlaenge_2_St_6_BSBSBSB +
      'Stk. - ' +
      ziehGeschwindigkeitLastStr_2_St_6_BSBSBSB +
      'm/min -';

    console.log('-----------------------4-----------------------');

    const data_2_St_6_BSBSBSB = {
      artikelNummer: artikelNummerFloat_2_St_6_BSBSBSB,
      artikelName: artikelName_2_St_6_BSBSBSB,
      teileNummer: getTeileNummerDefault(),
      zeichnungsNummer: getZeichnungsNummerDefault(),
      aenderungsstandZeichnung: getAenderungsstandZeichnungDefault(),
      aenderungsstandRezept: getAenderungsstandRezeptDefault(),
      beschreibung: getBeschreibungDefault(),
      ziehGeschwindigkeit: ziehGeschwindigkeitFloat_2_St_6_BSBSBSB,
      v_dorn_Fwd: vDornVorFloat_2_St_6_BSBSBSB,
      v_dorn_Bwd: vDornZurueckFloat_2_St_6_BSBSBSB,
      kommentar: kommentarArr_2_St_6_BSBSBSB,

      rohrAussenDurchmesserLetzterZug:
        rohrAussenDurchmesserLetzterZug_2_St_6_BSBSBSB,
      rohrInnenDurchmesserLetzterZug:
        rohrInnenDurchmesserLetzterZugBerechnet_2_St_6_BSBSBSB,
      angel: angel_2_St_6_BSBSBSB,
      rohrAussenDurchmesserTDTZug: rohrAussenDurchmesserTDTZug_2_St_6_BSBSBSB,

      dornStufe: stufenArray_2_St_6_BSBSBSB,

      fixLaenge: fixlaenge_2_St_6_BSBSBSB,
      ausgleichsstueck: ausgleichstueck_2_St_6_BSBSBSB,
      mehrfachLaenge: mehrfachlaenge_2_St_6_BSBSBSB,
      anzahlFixLaengenProMehrfachLaenge:
        anzahlFixlaengenProMehrfachlaenge_2_St_6_BSBSBSB,
      negTolMehrfachLaenge: getNegativeToleranzMehrfachlaengeDefault(),
      posTolMehrfachLaenge: getPositiveToleranzMehrfachlaengeDefault(),
      mindestAnzahlGutProfile: getMindestAnzahlGutprofileDefault(),

      obereToleranz: obereToleranz_2_St_6_BSBSBSB,
      untereToleranz: untereToleranz_2_St_6_BSBSBSB,

      mindestGutanteil: mindestGutanteil_2_St_6_BSBSBSB,
      profileGekoppelt: profileGekoppelt_2_St_6_BSBSBSB,

      ecke: eckenArr_2_St_6_BSBSBSB,
    };
    console.log('-----------------------5-----------------------');
    const newRecipes_2_St_6_BSBSBSB =
      await createRecipesTDT_de(data_2_St_6_BSBSBSB);
    console.log('newRecipes_2_St_6_BSBSBSB: ' + newRecipes_2_St_6_BSBSBSB);
    if (!newRecipes_2_St_6_BSBSBSB) {
      // Null is false
      return next(
        new AppError('No recipe_2_St_6_BSBSBSB write in db! :(', 404),
      );
    }

    res.status(201).json({
      // 201 = created
      status: 'success',
      message: 'Recipe_2_St_6_BSBSBSB succefully created!',
    });
  },
);

export const getCreateRecipe2_St_4_SBSBS = catchAsync(
  async (req, res, next) => {
    console.log('bin getCreateRecipe2_St_4_SBSBS im controller!');
    console.log('req.body: ' + req.body);
    console.log(
      'JSON.stringify(req.body.recipeData): ' +
        JSON.stringify(req.body.recipeData),
    );

    const artikelNummerStr_2_St_4_SBSBS =
      req.body.recipeData.artikelNummer_2_St_4_SBSBS;
    console.log('artikelNummerStr: ' + artikelNummerStr_2_St_4_SBSBS);
    console.log(
      'typeOf artikelNummerStr: ' + typeof artikelNummerStr_2_St_4_SBSBS,
    );
    const artikelNummerFloat_2_St_4_SBSBS = parseFloat(
      artikelNummerStr_2_St_4_SBSBS,
    );
    console.log(
      'typeOf artikelNummerFloat: ' + typeof artikelNummerFloat_2_St_4_SBSBS,
    );

    const artikelNameFirstStr_2_St_4_SBSBS =
      req.body.recipeData.artikelName_2_St_4_SBSBS;

    const ziehGeschwindigkeitStr_2_St_4_SBSBS =
      req.body.recipeData.ziehGeschwindigkeit_2_St_4_SBSBS;
    console.log(
      'typeOf ziehGeschwindigkeitStr: ' +
        typeof ziehGeschwindigkeitStr_2_St_4_SBSBS,
    );
    const ziehGeschwindigkeitFloat_2_St_4_SBSBS = parseFloat(
      ziehGeschwindigkeitStr_2_St_4_SBSBS,
    );
    console.log(
      'typeOf ziehGeschwindigkeitFloat: ' +
        typeof ziehGeschwindigkeitFloat_2_St_4_SBSBS,
    );

    const vDornVorStr_2_St_4_SBSBS = req.body.recipeData.vDornVor_2_St_4_SBSBS;
    console.log('vDornVorStr_2_St_4_SBSBS:', vDornVorStr_2_St_4_SBSBS);
    console.log(
      'typeOf vDornVorStr_2_St_4_SBSBS:',
      typeof vDornVorStr_2_St_4_SBSBS,
    );
    const vDornVorFloat_2_St_4_SBSBS = parseFloat(vDornVorStr_2_St_4_SBSBS);
    console.log(
      'typeOf vDornVorFloat_2_St_4_SBSBS:',
      typeof vDornVorFloat_2_St_4_SBSBS,
    );

    const vDornZurueckStr_2_St_4_SBSBS =
      req.body.recipeData.vDornZurueck_2_St_4_SBSBS;
    console.log('vDornZurueckStr_2_St_4_SBSBS:', vDornZurueckStr_2_St_4_SBSBS);
    console.log(
      'typeOf vDornZurueckStr_2_St_4_SBSBS:',
      typeof vDornZurueckStr_2_St_4_SBSBS,
    );
    const vDornZurueckFloat_2_St_4_SBSBS = parseFloat(
      vDornZurueckStr_2_St_4_SBSBS,
    );
    console.log(
      'typeOf vDornZurueckFloat_2_St_4_SBSBS:',
      typeof vDornZurueckFloat_2_St_4_SBSBS,
    );

    const benutzerID_2_St_4_SBSBS = req.body.recipeData.benutzerID_2_St_4_SBSBS;
    console.log('benutzerID:' + benutzerID_2_St_4_SBSBS);
    const benutzerVorName_2_St_4_SBSBS =
      req.body.recipeData.benutzerVorName_2_St_4_SBSBS;
    const benutzerNachName_2_St_4_SBSBS =
      req.body.recipeData.benutzerNachName_2_St_4_SBSBS;

    console.log('**************************************');

    const rohrAussenDurchmesserLetzterZug_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.rohrAussenDurchmesserLetzterZug_2_St_4_SBSBS,
    );

    console.log(
      'rohrAussenDurchmesserLetzterZug: ' +
        rohrAussenDurchmesserLetzterZug_2_St_4_SBSBS,
    );
    console.log(
      'typeOf rohrAussenDurchmesserLetzterZug: ' +
        typeof rohrAussenDurchmesserLetzterZug_2_St_4_SBSBS,
    );
    console.log(
      'rohrAussenDurchmesserLetzterZug: ' +
        rohrAussenDurchmesserLetzterZug_2_St_4_SBSBS,
    );

    const rohrWandDickeAussenDurchmesserLetzterZug_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.rohrWandDickeAussenDurchmesserLetzterZug_2_St_4_SBSBS,
    );
    const rohrInnenDurchmesserLetzterZugBerechnet_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.rohrInnenDurchmesserLetzterZugBerechnet_2_St_4_SBSBS,
    );
    const rohrAussenDurchmesserTDTZug_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.rohrAussenDurchmesserTDTZug_2_St_4_SBSBS,
    );
    const angel_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.angel_2_St_4_SBSBS,
    );
    const dornDurchmesserErsteStufe_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.dornDurchmesserErsteStufe_2_St_4_SBSBS,
    );
    const dornPositionErsteStufe_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.dornPositionErsteStufe_2_St_4_SBSBS,
    );
    const dornDurchmesserZweiteStufe_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.dornDurchmesserZweiteStufe_2_St_4_SBSBS,
    );
    const dornPositionZweiteStufe_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.dornPositionZweiteStufe_2_St_4_SBSBS,
    );
    const fixlaenge_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.fixlaenge_2_St_4_SBSBS,
    );
    const ausgleichstueck_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.ausgleichstueck_2_St_4_SBSBS,
    );
    const mehrfachlaenge_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.mehrfachlaenge_2_St_4_SBSBS,
    );
    const anzahlFixlaengenProMehrfachlaenge_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.anzahlFixlaengenProMehrfachlaenge_2_St_4_SBSBS,
    );
    const mindestGutanteil_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.mindestGutanteil_2_St_4_SBSBS,
    );
    const profileGekoppelt_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.profileGekoppelt_2_St_4_SBSBS,
    );
    const obereToleranz_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.obereToleranz_2_St_4_SBSBS,
    );
    const untereToleranz_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.untereToleranz_2_St_4_SBSBS,
    );

    const wanddickeEcke1_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.wanddickeEcke1_2_St_4_SBSBS,
    );
    const positionEcke1_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.positionEcke1_2_St_4_SBSBS,
    );
    const wanddickeEcke2_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.wanddickeEcke2_2_St_4_SBSBS,
    );
    const positionEcke2_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.positionEcke2_2_St_4_SBSBS,
    );
    // const wanddickeEcke2Zwischen4_2_St_4_SBSBS = parseFloat(
    //   req.body.recipeData.wanddickeEcke2Zwischen4_2_St_4_SBSBS,
    // );
    // const positionEcke2Zwischen4_2_St_4_SBSBS = parseFloat(
    //   req.body.recipeData.positionEcke2Zwischen4_2_St_4_SBSBS,
    // );
    const wanddickeEcke3_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.wanddickeEcke3_2_St_4_SBSBS,
    );
    const positionEcke3_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.positionEcke3_2_St_4_SBSBS,
    );
    const wanddickeEcke4_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.wanddickeEcke4_2_St_4_SBSBS,
    );
    const positionEcke4_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.positionEcke4_2_St_4_SBSBS,
    );
    const wanddickeEcke5_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.wanddickeEcke5_2_St_4_SBSBS,
    );
    const positionEcke5_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.positionEcke5_2_St_4_SBSBS,
    );

    const wanddickeEcke6_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.wanddickeEcke6_2_St_4_SBSBS,
    );
    const positionEcke6_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.positionEcke6_2_St_4_SBSBS,
    );
    // const wanddickeEcke7Zwischen9_2_St_4_SBSBS = parseFloat(
    //   req.body.recipeData.wanddickeEcke7Zwischen9_2_St_4_SBSBS,
    // );
    // const positionEcke7Zwischen9_2_St_4_SBSBS = parseFloat(
    //   req.body.recipeData.positionEcke7Zwischen9_2_St_4_SBSBS,
    // );
    const wanddickeEcke7_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.wanddickeEcke7_2_St_4_SBSBS,
    );
    const positionEcke7_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.positionEcke7_2_St_4_SBSBS,
    );
    const wanddickeEcke8_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.wanddickeEcke8_2_St_4_SBSBS,
    );
    const positionEcke8_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.positionEcke8_2_St_4_SBSBS,
    );
    const wanddickeEcke9_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.wanddickeEcke9_2_St_4_SBSBS,
    );
    const positionEcke9_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.positionEcke9_2_St_4_SBSBS,
    );

    const wanddickeEckeEnde_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.wanddickeEckeEnde_2_St_4_SBSBS,
    );
    const positionEckeEnde_2_St_4_SBSBS = parseFloat(
      req.body.recipeData.positionEckeEnde_2_St_4_SBSBS,
    );

    const ecke2_St_4_SBSBS_e1 = {
      ecke: 1,
      x: positionEcke1_2_St_4_SBSBS,
      z: wanddickeEcke1_2_St_4_SBSBS,
    };
    const ecke2_St_4_SBSBS_e2 = {
      ecke: 2,
      x: positionEcke2_2_St_4_SBSBS,
      z: wanddickeEcke2_2_St_4_SBSBS,
    };
    // const ecke2_St_4_SBSBS_e24 = {
    //   ecke: 3,
    //   x: positionEcke2Zwischen4_2_St_4_SBSBS,
    //   z: wanddickeEcke2Zwischen4_2_St_4_SBSBS,
    // };
    const ecke2_St_4_SBSBS_e3 = {
      ecke: 3,
      x: positionEcke3_2_St_4_SBSBS,
      z: wanddickeEcke3_2_St_4_SBSBS,
    };
    const ecke2_St_4_SBSBS_e4 = {
      ecke: 4,
      x: positionEcke4_2_St_4_SBSBS,
      z: wanddickeEcke4_2_St_4_SBSBS,
    };
    const ecke2_St_4_SBSBS_e5 = {
      ecke: 5,
      x: positionEcke5_2_St_4_SBSBS,
      z: wanddickeEcke5_2_St_4_SBSBS,
    };
    const ecke2_St_4_SBSBS_e6 = {
      ecke: 6,
      x: positionEcke6_2_St_4_SBSBS,
      z: wanddickeEcke6_2_St_4_SBSBS,
    };
    // const ecke2_St_4_SBSBS_e79 = {
    //   ecke: 8,
    //   x: positionEcke7Zwischen9_2_St_4_SBSBS,
    //   z: wanddickeEcke7Zwischen9_2_St_4_SBSBS,
    // };
    const ecke2_St_4_SBSBS_e7 = {
      ecke: 7,
      x: positionEcke7_2_St_4_SBSBS,
      z: wanddickeEcke7_2_St_4_SBSBS,
    };
    const ecke2_St_4_SBSBS_e8 = {
      ecke: 8,
      x: positionEcke8_2_St_4_SBSBS,
      z: wanddickeEcke8_2_St_4_SBSBS,
    };
    const ecke2_St_4_SBSBS_e9 = {
      ecke: 9,
      x: positionEcke9_2_St_4_SBSBS,
      z: wanddickeEcke9_2_St_4_SBSBS,
    };
    const ecke2_St_4_SBSBS_e10 = {
      ecke: 10,
      x: positionEckeEnde_2_St_4_SBSBS,
      z: wanddickeEckeEnde_2_St_4_SBSBS,
    };

    const eckenArr_2_St_4_SBSBS = [
      ecke2_St_4_SBSBS_e1,
      ecke2_St_4_SBSBS_e2,
      // ecke2_St_4_SBSBS_e24,
      ecke2_St_4_SBSBS_e3,
      ecke2_St_4_SBSBS_e4,
      ecke2_St_4_SBSBS_e5,
      ecke2_St_4_SBSBS_e6,
      // ecke2_St_4_SBSBS_e79,
      ecke2_St_4_SBSBS_e7,
      ecke2_St_4_SBSBS_e8,
      ecke2_St_4_SBSBS_e9,
      ecke2_St_4_SBSBS_e10,
    ];
    //----------------------------------------------------------------------------------------------------------------------------------

    console.log('-----------------------1-----------------------');
    const kommentarArr_2_St_4_SBSBS = [];
    let erstelltAm_2_St_4_SBSBS = ''; //: dateObject.toISOString(),
    let createdBy_2_St_4_SBSBS = benutzerID_2_St_4_SBSBS; //: kurzerName,   kurzerName = '643c1f042df0321cb8a06a50';
    let kommentarBeschreibung_2_St_4_SBSBS = 'Erstmals erstellt.'; //: worteOderSaetze.trim(),

    const dateObject_2_St_4_SBSBS = new Date();
    //   `${year}-${month}-${day}T00:00:00.000Z`,
    // );
    console.log(dateObject_2_St_4_SBSBS.toISOString());
    erstelltAm_2_St_4_SBSBS = dateObject_2_St_4_SBSBS.toISOString();

    console.log('-----------------------2-----------------------');
    kommentarArr_2_St_4_SBSBS.push({
      erstelltAm: erstelltAm_2_St_4_SBSBS,
      createdBy: createdBy_2_St_4_SBSBS,
      kommentarBeschreibung: kommentarBeschreibung_2_St_4_SBSBS,
    });

    console.log('-----------------------3-----------------------');
    const stufe1Obj_2_St_4_SBSBS = {
      dornDurchmesser: dornDurchmesserErsteStufe_2_St_4_SBSBS,
      position: dornPositionErsteStufe_2_St_4_SBSBS,
      rampeRein: getRampeReinDefault(),
      rampeRaus: getRampeRausDefault(),
      dehnung: getDehnungDefault(),
    };
    const stufe2Obj_2_St_4_SBSBS = {
      dornDurchmesser: dornDurchmesserZweiteStufe_2_St_4_SBSBS,
      position: dornPositionZweiteStufe_2_St_4_SBSBS,
      rampeRein: getRampeReinDefault(),
      rampeRaus: getRampeRausDefault(),
      dehnung: getDehnungDefault(),
    };

    const stufenArray_2_St_4_SBSBS = [
      stufe1Obj_2_St_4_SBSBS,
      stufe2Obj_2_St_4_SBSBS,
    ];

    console.log(
      '-----------------------------ArtikelName erstellen--------------------------',
    );
    console.log(
      'artikelNameFirstStr_2_St_4_SBSBS: ' + artikelNameFirstStr_2_St_4_SBSBS,
    );
    let artikelName_2_St_4_SBSBS = '';

    const ziehGeschwindigkeitLastStr_2_St_4_SBSBS =
      ziehGeschwindigkeitFloat_2_St_4_SBSBS.toString();
    console.log(
      'ziehGeschwindigkeitLastStr_2_St_4_SBSBS: ' +
        ziehGeschwindigkeitLastStr_2_St_4_SBSBS,
    );

    const fixlaengeStr_2_St_4_SBSBS = fixlaenge_2_St_4_SBSBS.toString();
    console.log('fixlaengeStr_2_St_4_SBSBS: ' + fixlaengeStr_2_St_4_SBSBS);

    artikelName_2_St_4_SBSBS =
      artikelNameFirstStr_2_St_4_SBSBS +
      ' - ' +
      fixlaengeStr_2_St_4_SBSBS +
      'mm - ' +
      mehrfachlaenge_2_St_4_SBSBS +
      'mm - ' +
      anzahlFixlaengenProMehrfachlaenge_2_St_4_SBSBS +
      'Stk. - ' +
      ziehGeschwindigkeitLastStr_2_St_4_SBSBS +
      'm/min -';

    console.log('-----------------------4-----------------------');

    const data_2_St_4_SBSBS = {
      artikelNummer: artikelNummerFloat_2_St_4_SBSBS,
      artikelName: artikelName_2_St_4_SBSBS,
      teileNummer: getTeileNummerDefault(),
      zeichnungsNummer: getZeichnungsNummerDefault(),
      aenderungsstandZeichnung: getAenderungsstandZeichnungDefault(),
      aenderungsstandRezept: getAenderungsstandRezeptDefault(),
      beschreibung: getBeschreibungDefault(),
      ziehGeschwindigkeit: ziehGeschwindigkeitFloat_2_St_4_SBSBS,
      v_dorn_Fwd: vDornVorFloat_2_St_4_SBSBS,
      v_dorn_Bwd: vDornZurueckFloat_2_St_4_SBSBS,
      kommentar: kommentarArr_2_St_4_SBSBS,

      rohrAussenDurchmesserLetzterZug:
        rohrAussenDurchmesserLetzterZug_2_St_4_SBSBS,
      rohrInnenDurchmesserLetzterZug:
        rohrInnenDurchmesserLetzterZugBerechnet_2_St_4_SBSBS,
      angel: angel_2_St_4_SBSBS,
      rohrAussenDurchmesserTDTZug: rohrAussenDurchmesserTDTZug_2_St_4_SBSBS,

      dornStufe: stufenArray_2_St_4_SBSBS,

      fixLaenge: fixlaenge_2_St_4_SBSBS,
      ausgleichsstueck: ausgleichstueck_2_St_4_SBSBS,
      mehrfachLaenge: mehrfachlaenge_2_St_4_SBSBS,
      anzahlFixLaengenProMehrfachLaenge:
        anzahlFixlaengenProMehrfachlaenge_2_St_4_SBSBS,
      negTolMehrfachLaenge: getNegativeToleranzMehrfachlaengeDefault(),
      posTolMehrfachLaenge: getPositiveToleranzMehrfachlaengeDefault(),
      mindestAnzahlGutProfile: getMindestAnzahlGutprofileDefault(),

      obereToleranz: obereToleranz_2_St_4_SBSBS,
      untereToleranz: untereToleranz_2_St_4_SBSBS,

      mindestGutanteil: mindestGutanteil_2_St_4_SBSBS,
      profileGekoppelt: profileGekoppelt_2_St_4_SBSBS,

      ecke: eckenArr_2_St_4_SBSBS,
    };
    console.log('-----------------------5-----------------------');
    const newRecipes_2_St_4_SBSBS =
      await createRecipesTDT_de(data_2_St_4_SBSBS);
    console.log('newRecipes_2_St_4_SBSBS: ' + newRecipes_2_St_4_SBSBS);
    if (!newRecipes_2_St_4_SBSBS) {
      // Null is false
      return next(new AppError('No recipe_2_St_4_SBSBS write in db! :(', 404));
    }

    res.status(201).json({
      // 201 = created
      status: 'success',
      message: 'Recipe_2_St_4_SBSBS succefully created!',
    });
  },
);

export const getCreateRecipe2_St_2_BSB = catchAsync(async (req, res, next) => {
  console.log('bin getCreateRecipe2_St_2_BSB');
  console.log('req.body: ' + req.body);
  console.log(
    'JSON.stringify(req.body.recipeData): ' +
      JSON.stringify(req.body.recipeData),
  );

  const artikelNummerStr_2_St_2_BSB =
    req.body.recipeData.artikelNummer_2_St_2_BSB;
  console.log('artikelNummerStr: ' + artikelNummerStr_2_St_2_BSB);
  console.log('typeOf artikelNummerStr: ' + typeof artikelNummerStr_2_St_2_BSB);
  const artikelNummerFloat_2_St_2_BSB = parseFloat(artikelNummerStr_2_St_2_BSB);
  console.log(
    'typeOf artikelNummerFloat: ' + typeof artikelNummerFloat_2_St_2_BSB,
  );

  const artikelNameFirstStr_2_St_2_BSB =
    req.body.recipeData.artikelName_2_St_2_BSB;

  const ziehGeschwindigkeitStr_2_St_2_BSB =
    req.body.recipeData.ziehGeschwindigkeit_2_St_2_BSB;
  console.log(
    'typeOf ziehGeschwindigkeitStr: ' +
      typeof ziehGeschwindigkeitStr_2_St_2_BSB,
  );
  const ziehGeschwindigkeitFloat_2_St_2_BSB = parseFloat(
    ziehGeschwindigkeitStr_2_St_2_BSB,
  );
  console.log(
    'typeOf ziehGeschwindigkeitFloat: ' +
      typeof ziehGeschwindigkeitFloat_2_St_2_BSB,
  );

  const vDornVorStr_2_St_2_BSB = req.body.recipeData.vDornVor_2_St_2_BSB;
  console.log('vDornVorStr_2_St_2_BSB:', vDornVorStr_2_St_2_BSB);
  console.log(
    'typeOf vDornVorStr_2_St_2_BSB: ' + typeof vDornVorStr_2_St_2_BSB,
  );
  const vDornVorFloat_2_St_2_BSB = parseFloat(vDornVorStr_2_St_2_BSB);
  console.log(
    'typeOf vDornVorFloat_2_St_2_BSB: ' + typeof vDornVorFloat_2_St_2_BSB,
  );

  const vDornZurueckStr_2_St_2_BSB =
    req.body.recipeData.vDornZurueck_2_St_2_BSB;
  console.log('vDornZurueckStr_2_St_2_BSB:', vDornZurueckStr_2_St_2_BSB);
  console.log(
    'typeOf vDornZurueckStr_2_St_2_BSB: ' + typeof vDornZurueckStr_2_St_2_BSB,
  );
  const vDornZurueckFloat_2_St_2_BSB = parseFloat(vDornZurueckStr_2_St_2_BSB);
  console.log(
    'typeOf vDornZurueckFloat_2_St_2_BSB: ' +
      typeof vDornZurueckFloat_2_St_2_BSB,
  );

  const benutzerID_2_St_2_BSB = req.body.recipeData.benutzerID_2_St_2_BSB;
  console.log('benutzerID:' + benutzerID_2_St_2_BSB);
  const benutzerVorName_2_St_2_BSB =
    req.body.recipeData.benutzerVorName_2_St_2_BSB;
  const benutzerNachName_2_St_2_BSB =
    req.body.recipeData.benutzerNachName_2_St_2_BSB;

  console.log('**************************************');

  const rohrAussenDurchmesserLetzterZug_2_St_2_BSB = parseFloat(
    req.body.recipeData.rohrAussenDurchmesserLetzterZug_2_St_2_BSB,
  );

  console.log(
    'rohrAussenDurchmesserLetzterZug: ' +
      rohrAussenDurchmesserLetzterZug_2_St_2_BSB,
  );
  console.log(
    'typeOf rohrAussenDurchmesserLetzterZug: ' +
      typeof rohrAussenDurchmesserLetzterZug_2_St_2_BSB,
  );
  console.log(
    'rohrAussenDurchmesserLetzterZug: ' +
      rohrAussenDurchmesserLetzterZug_2_St_2_BSB,
  );

  const rohrWandDickeAussenDurchmesserLetzterZug_2_St_2_BSB = parseFloat(
    req.body.recipeData.rohrWandDickeAussenDurchmesserLetzterZug_2_St_2_BSB,
  );
  const rohrInnenDurchmesserLetzterZugBerechnet_2_St_2_BSB = parseFloat(
    req.body.recipeData.rohrInnenDurchmesserLetzterZugBerechnet_2_St_2_BSB,
  );
  const rohrAussenDurchmesserTDTZug_2_St_2_BSB = parseFloat(
    req.body.recipeData.rohrAussenDurchmesserTDTZug_2_St_2_BSB,
  );
  const angel_2_St_2_BSB = parseFloat(req.body.recipeData.angel_2_St_2_BSB);
  const dornDurchmesserErsteStufe_2_St_2_BSB = parseFloat(
    req.body.recipeData.dornDurchmesserErsteStufe_2_St_2_BSB,
  );
  const dornPositionErsteStufe_2_St_2_BSB = parseFloat(
    req.body.recipeData.dornPositionErsteStufe_2_St_2_BSB,
  );
  const dornDurchmesserZweiteStufe_2_St_2_BSB = parseFloat(
    req.body.recipeData.dornDurchmesserZweiteStufe_2_St_2_BSB,
  );
  const dornPositionZweiteStufe_2_St_2_BSB = parseFloat(
    req.body.recipeData.dornPositionZweiteStufe_2_St_2_BSB,
  );
  const fixlaenge_2_St_2_BSB = parseFloat(
    req.body.recipeData.fixlaenge_2_St_2_BSB,
  );
  const ausgleichstueck_2_St_2_BSB = parseFloat(
    req.body.recipeData.ausgleichstueck_2_St_2_BSB,
  );
  const mehrfachlaenge_2_St_2_BSB = parseFloat(
    req.body.recipeData.mehrfachlaenge_2_St_2_BSB,
  );
  const anzahlFixlaengenProMehrfachlaenge_2_St_2_BSB = parseFloat(
    req.body.recipeData.anzahlFixlaengenProMehrfachlaenge_2_St_2_BSB,
  );
  const mindestGutanteil_2_St_2_BSB = parseFloat(
    req.body.recipeData.mindestGutanteil_2_St_2_BSB,
  );
  const profileGekoppelt_2_St_2_BSB = parseFloat(
    req.body.recipeData.profileGekoppelt_2_St_2_BSB,
  );
  const obereToleranz_2_St_2_BSB = parseFloat(
    req.body.recipeData.obereToleranz_2_St_2_BSB,
  );
  const untereToleranz_2_St_2_BSB = parseFloat(
    req.body.recipeData.untereToleranz_2_St_2_BSB,
  );
  const wanddickeEcke0_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke0_2_St_2_BSB,
  );
  const positionEcke0_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke0_2_St_2_BSB,
  );
  const wanddickeEcke1_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke1_2_St_2_BSB,
  );
  const positionEcke1_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke1_2_St_2_BSB,
  );
  const wanddickeEcke2_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke2_2_St_2_BSB,
  );
  const positionEcke2_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke2_2_St_2_BSB,
  );
  const wanddickeEcke3_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke3_2_St_2_BSB,
  );
  const positionEcke3_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke3_2_St_2_BSB,
  );
  // const wanddickeEcke3Zwischen4_2_St_2_BSB = parseFloat(
  //   req.body.recipeData.wanddickeEcke3Zwischen4_2_St_2_BSB,
  // );
  // const positionEcke3Zwischen4_2_St_2_BSB = parseFloat(
  //   req.body.recipeData.positionEcke3Zwischen4_2_St_2_BSB,
  // );
  const wanddickeEcke4_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEcke4_2_St_2_BSB,
  );
  const positionEcke4_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEcke4_2_St_2_BSB,
  );
  const wanddickeEckeEnde_2_St_2_BSB = parseFloat(
    req.body.recipeData.wanddickeEckeEnde_2_St_2_BSB,
  );
  const positionEckeEnde_2_St_2_BSB = parseFloat(
    req.body.recipeData.positionEckeEnde_2_St_2_BSB,
  );

  const ecke2_St_2_BSB_e0 = {
    ecke: 1,
    x: positionEcke0_2_St_2_BSB,
    z: wanddickeEcke0_2_St_2_BSB,
  };
  const ecke2_St_2_BSB_e1 = {
    ecke: 2,
    x: positionEcke1_2_St_2_BSB,
    z: wanddickeEcke1_2_St_2_BSB,
  };
  const ecke2_St_2_BSB_e2 = {
    ecke: 3,
    x: positionEcke2_2_St_2_BSB,
    z: wanddickeEcke2_2_St_2_BSB,
  };
  const ecke2_St_2_BSB_e3 = {
    ecke: 4,
    x: positionEcke3_2_St_2_BSB,
    z: wanddickeEcke3_2_St_2_BSB,
  };
  // const ecke2_St_2_BSB_e34 = {
  //   ecke: 5,
  //   x: positionEcke3Zwischen4_2_St_2_BSB,
  //   z: wanddickeEcke3Zwischen4_2_St_2_BSB,
  // };
  const ecke2_St_2_BSB_e4 = {
    ecke: 6,
    x: positionEcke4_2_St_2_BSB,
    z: wanddickeEcke4_2_St_2_BSB,
  };
  const ecke2_St_2_BSB_eEnde = {
    ecke: 7,
    x: positionEckeEnde_2_St_2_BSB,
    z: wanddickeEckeEnde_2_St_2_BSB,
  };

  const eckenArr_2_St_2_BSB = [
    ecke2_St_2_BSB_e0,
    ecke2_St_2_BSB_e1,
    ecke2_St_2_BSB_e2,
    ecke2_St_2_BSB_e3,
    //ecke2_St_2_BSB_e34,
    ecke2_St_2_BSB_e4,
    ecke2_St_2_BSB_eEnde,
  ];

  console.log('-----------------------1-----------------------');
  const kommentarArr_2_St_2_BSB = [];
  let erstelltAm_2_St_2_BSB = ''; //: dateObject.toISOString(),
  let createdBy_2_St_2_BSB = benutzerID_2_St_2_BSB; //: kurzerName,   kurzerName = '643c1f042df0321cb8a06a50';
  let kommentarBeschreibung_2_St_2_BSB = 'Erstmals erstellt.'; //: worteOderSaetze.trim(),

  const dateObject_2_St_2_BSB = new Date();
  //   `${year}-${month}-${day}T00:00:00.000Z`,
  // );
  console.log(dateObject_2_St_2_BSB.toISOString());
  erstelltAm_2_St_2_BSB = dateObject_2_St_2_BSB.toISOString();

  console.log('-----------------------2-----------------------');
  kommentarArr_2_St_2_BSB.push({
    erstelltAm: erstelltAm_2_St_2_BSB,
    createdBy: createdBy_2_St_2_BSB,
    kommentarBeschreibung: kommentarBeschreibung_2_St_2_BSB,
  });

  console.log('-----------------------3-----------------------');
  const stufe1Obj_2_St_2_BSB = {
    dornDurchmesser: dornDurchmesserErsteStufe_2_St_2_BSB,
    position: dornPositionErsteStufe_2_St_2_BSB,
    rampeRein: getRampeReinDefault(),
    rampeRaus: getRampeRausDefault(),
    dehnung: getDehnungDefault(),
  };
  const stufe2Obj_2_St_2_BSB = {
    dornDurchmesser: dornDurchmesserZweiteStufe_2_St_2_BSB,
    position: dornPositionZweiteStufe_2_St_2_BSB,
    rampeRein: getRampeReinDefault(),
    rampeRaus: getRampeRausDefault(),
    dehnung: getDehnungDefault(),
  };

  const stufenArray_2_St_2_BSB = [stufe1Obj_2_St_2_BSB, stufe2Obj_2_St_2_BSB];

  console.log(
    '-----------------------------ArtikelName erstellen--------------------------',
  );
  console.log(
    'artikelNameFirstStr_2_St_2_BSB: ' + artikelNameFirstStr_2_St_2_BSB,
  );
  let artikelName_2_St_2_BSB = '';

  const ziehGeschwindigkeitLastStr_2_St_2_BSB =
    ziehGeschwindigkeitFloat_2_St_2_BSB.toString();
  console.log(
    'ziehGeschwindigkeitLastStr_2_St_2_BSB: ' +
      ziehGeschwindigkeitLastStr_2_St_2_BSB,
  );

  const fixlaengeStr_2_St_2_BSB = fixlaenge_2_St_2_BSB.toString();
  console.log('fixlaengeStr_2_St_2_BSB: ' + fixlaengeStr_2_St_2_BSB);

  artikelName_2_St_2_BSB =
    artikelNameFirstStr_2_St_2_BSB +
    ' - ' +
    fixlaengeStr_2_St_2_BSB +
    'mm - ' +
    mehrfachlaenge_2_St_2_BSB +
    'mm - ' +
    anzahlFixlaengenProMehrfachlaenge_2_St_2_BSB +
    'Stk. - ' +
    ziehGeschwindigkeitLastStr_2_St_2_BSB +
    'm/min -';

  console.log('-----------------------4-----------------------');

  const data_2_St_2_BSB = {
    artikelNummer: artikelNummerFloat_2_St_2_BSB,
    artikelName: artikelName_2_St_2_BSB,
    teileNummer: getTeileNummerDefault(),
    zeichnungsNummer: getZeichnungsNummerDefault(),
    aenderungsstandZeichnung: getAenderungsstandZeichnungDefault(),
    aenderungsstandRezept: getAenderungsstandRezeptDefault(),
    beschreibung: getBeschreibungDefault(),
    ziehGeschwindigkeit: ziehGeschwindigkeitFloat_2_St_2_BSB,
    v_dorn_Fwd: vDornVorFloat_2_St_2_BSB,
    v_dorn_Bwd: vDornZurueckFloat_2_St_2_BSB,
    kommentar: kommentarArr_2_St_2_BSB,

    rohrAussenDurchmesserLetzterZug: rohrAussenDurchmesserLetzterZug_2_St_2_BSB,
    rohrInnenDurchmesserLetzterZug:
      rohrInnenDurchmesserLetzterZugBerechnet_2_St_2_BSB,
    angel: angel_2_St_2_BSB,
    rohrAussenDurchmesserTDTZug: rohrAussenDurchmesserTDTZug_2_St_2_BSB,

    dornStufe: stufenArray_2_St_2_BSB,

    fixLaenge: fixlaenge_2_St_2_BSB,
    ausgleichsstueck: ausgleichstueck_2_St_2_BSB,
    mehrfachLaenge: mehrfachlaenge_2_St_2_BSB,
    anzahlFixLaengenProMehrfachLaenge:
      anzahlFixlaengenProMehrfachlaenge_2_St_2_BSB,
    negTolMehrfachLaenge: getNegativeToleranzMehrfachlaengeDefault(),
    posTolMehrfachLaenge: getPositiveToleranzMehrfachlaengeDefault(),
    mindestAnzahlGutProfile: getMindestAnzahlGutprofileDefault(),

    obereToleranz: obereToleranz_2_St_2_BSB,
    untereToleranz: untereToleranz_2_St_2_BSB,

    mindestGutanteil: mindestGutanteil_2_St_2_BSB,
    profileGekoppelt: profileGekoppelt_2_St_2_BSB,

    ecke: eckenArr_2_St_2_BSB,
  };
  console.log('-----------------------5-----------------------');
  const newRecipes_2_St_2_BSB = await createRecipesTDT_de(data_2_St_2_BSB);
  console.log('newRecipes_2_St_2_BSB: ' + newRecipes_2_St_2_BSB);
  if (!newRecipes_2_St_2_BSB) {
    // Null is false
    return next(new AppError('No recipe_2_St_2_BSB write in db! :(', 404));
  }

  res.status(201).json({
    // 201 = created
    status: 'success',
    message: 'Recipe_2_St_2_BSB succefully created!',
  });
});

export const getConvertOldRecipesToMongoDB = catchAsync(
  async (req, res, next) => {
    console.log('bin getConvertOldRecipesToMongoDB');

    let importOldRecipes = req.body.importOldRecipes;

    let oldRecipesArr = JSON.parse(importOldRecipes);

    let recipeFileNumber = 0;
    for (let i = 0; i < oldRecipesArr.length; i++) {
      console.log('fileName[i]: ' + oldRecipesArr[i].fileName);

      if (/^\d{8}\s/.test(oldRecipesArr[i].fileName)) {
        console.log(
          'Der File-Name beginnt mit 8 Zahlen gefolgt von einem Leerzeichen.',
        );
      } else {
        console.log('Der File-Name entspricht nicht dem gesuchten Muster.');
        return next(new AppError('File-Name is wrong. Please try again.', 400)); // 400 = bad request
      }
      recipeFileNumber++;

      let xmlData = oldRecipesArr[i].fileText;
      xmlData = decodeURIComponent(xmlData).trim();
      xmlData = he.decode(xmlData);
      //console.log('xmlData: ' + xmlData);
      //const xmlData = '<root>Hello xml2js!</root>';
      try {
        const resultXML = await dataInXml(xmlData);
        console.log('Erfolgreich geparste XML-Daten:', resultXML);

        let artikelnummerOLD = resultXML.rezept.artikelnummer;
        artikelnummerOLD = String(artikelnummerOLD);
        artikelnummerOLD = parseInt(artikelnummerOLD.replace(/\D/g, ''), 10);

        let artikelnameOLDlong = Array.isArray(resultXML.rezept.artikelname)
          ? resultXML.rezept.artikelname[0]
          : resultXML.rezept.artikelname;

        let artikelnameOLDlongLowerStr = artikelnameOLDlong.toLowerCase();
        console.log(
          'artikelnameOLDlongLowerStr: ' +
            artikelnameOLDlongLowerStr +
            ' -----------------------------------------------------------------------------',
        );
        let muster2 = /(\d+\.\d+[xX]\d+\.\d+-\d+\.\d+-\d+\.\d+)/;
        let muster1 = /(\d+\.\d+[xX]\d+\.\d+-\d+\.\d+-\d+\.\d+)/;
        let muster3 = /(\d+\.\d+[xX]\d+\.\d+(?:-\d+\.\d+){1,2})/;
        let matchName = artikelnameOLDlongLowerStr.match(muster3);
        console.log('matchName: ' + matchName);

        let artikelnameOLD = matchName[0].replace(/^0+/, '');
        console.log('artikelnameOLD: ' + artikelnameOLD);

        const teilenummerOLD =
          resultXML.rezept.teilenummer &&
          resultXML.rezept.teilenummer[0].trim() !== ''
            ? resultXML.rezept.teilenummer[0]
            : getTeileNummerDefault();

        const zeichnungsnummerOLD =
          resultXML.rezept.zeichnungsnummer &&
          resultXML.rezept.zeichnungsnummer[0].trim() !== ''
            ? resultXML.rezept.zeichnungsnummer[0]
            : getZeichnungsNummerDefault();
        console.log('zeichnungsnummerOLD: ' + zeichnungsnummerOLD);
        console.log(
          'getZeichnungsNummerDefault(): ' + getZeichnungsNummerDefault(),
        );

        const aenderungsstandzeichnungOLD = resultXML.rezept[
          'aenderungsstand-zeichnung'
        ]
          ? parseInt(resultXML.rezept['aenderungsstand-zeichnung'][0], 10) !==
            ''
          : getAenderungsstandZeichnungDefault();

        const aenderungsstandrezeptOLD = resultXML.rezept[
          'aenderungsstand-rezept'
        ]
          ? parseInt(resultXML.rezept['aenderungsstand-rezept'][0], 10) !== ''
          : getAenderungsstandRezeptDefault();

        const beschreibungOLD =
          resultXML.rezept.beschreibung &&
          resultXML.rezept.beschreibung[0].trim() !== ''
            ? resultXML.rezept.beschreibung[0]
            : getBeschreibungDefault();

        let ziehgeschwindigkeitOLD = '';

        //--------------------------------------------------------------------------------------------------------
        // const davOLD = resultXML.rezept.dorn[0].dav[0];
        // const divOLD = resultXML.rezept.dorn[0].div[0];
        const vDornVorStrOLD =
          resultXML.rezept.v_dorn_Fwd &&
          resultXML.rezept.v_dorn_Fwd[0].trim() !== ''
            ? resultXML.rezept.v_dorn_Fwd[0]
            : getVDornFwdDefault(); //req.body.recipeData.vDornVor_2_St_2_BSB;
        console.log('vDornVorStrOLD:', vDornVorStrOLD);
        console.log('typeOf vDornVorStrOLD: ' + typeof vDornVorStrOLD);
        const vDornVorFloatOLD = parseFloat(vDornVorStrOLD);
        console.log('typeOf vDornVorFloatOLD: ' + typeof vDornVorFloatOLD);

        const vDornZurueckStrOLD =
          resultXML.rezept.v_dorn_Bwd &&
          resultXML.rezept.v_dorn_Bwd[0].trim() !== ''
            ? resultXML.rezept.v_dorn_Bwd[0]
            : getVDornBwdDefault(); //req.body.recipeData.vDornZurueck_2_St_2_BSB;
        console.log('vDornZurueckStrOLD:', vDornZurueckStrOLD);
        console.log('typeOf vDornZurueckStrOLD: ' + typeof vDornZurueckStrOLD);
        const vDornZurueckFloatOLD = parseFloat(vDornZurueckStrOLD);
        console.log(
          'typeOf vDornZurueckFloatOLD: ' + typeof vDornZurueckFloatOLD,
        );

        //---------------------------------------------------------------------------------------------------

        const davOLD = resultXML.rezept.dorn[0].dav[0];
        const divOLD = resultXML.rezept.dorn[0].div[0];
        const angelOLD = resultXML.rezept.dorn[0].angel[0];
        const danOLD = resultXML.rezept.dorn[0].dan[0];

        const stufenOLD = resultXML.rezept.dorn[0].stufen;
        console.log(
          'JSON.stringify(stufenOLD): ' + JSON.stringify(stufenOLD[0]),
        );

        const stufenArray = stufenOLD[0].stufe.map((stufe, index) => ({
          //stufe: index + 1,
          dornDurchmesser: stufe.d[0],
          position: stufe.pos[0],
          rampeRein: stufe['rampe-rein'][0],
          rampeRaus: stufe['rampe-raus'][0],
          dehnung: stufe.dehnung[0],
        }));

        const fixlaengeOLD = resultXML.rezept.mehrfachlaenge[0].fixlaenge[0];
        const ausgleichsstueckOLD =
          resultXML.rezept.mehrfachlaenge[0].ausgleichsstueck[0];
        const mehrfachlaengeOLD =
          resultXML.rezept.mehrfachlaenge[0].mehrfachlaenge[0];
        const anzahlfixlaengenpromehrfachlaengeOLD =
          resultXML.rezept.mehrfachlaenge[0][
            'anzahl-fixlaengen-pro-mehrfachlaenge'
          ][0];
        const negtolmehrfachlaengeOLD =
          resultXML.rezept.mehrfachlaenge[0]['neg-tol-mehrfachlaenge'][0];
        const postolmehrfachlaengeOLD =
          resultXML.rezept.mehrfachlaenge[0]['pos-tol-mehrfachlaenge'][0];
        const mindestanzahlgutprofileOLD =
          resultXML.rezept.mehrfachlaenge[0]['mindestanzahl-gutprofile'][0];

        const oberetoleranzOLD =
          resultXML.rezept.standardwerte[0]['obere-toleranz'][0];
        const unteretoleranzOLD =
          resultXML.rezept.standardwerte[0]['untere-toleranz'][0];

        // //--------------------mindes-gutanteil----------------------------------
        const mindestgutanteilOLDstandart =
          resultXML.rezept.standardwerte[0]['mindest-gutanteil'][0];
        console.log(
          'mindestgutanteilOLDstandart: ' + mindestgutanteilOLDstandart,
        );
        console.log('komme hier her');
        let mindestgutanteilOLDout = '';
        if (
          resultXML.rezept['mindest-gutanteil'] &&
          resultXML.rezept['mindest-gutanteil'].length > 0
        ) {
          if (mindestgutanteilOLDout === undefined) {
            mindestgutanteilOLDout = 0;
          } else {
            mindestgutanteilOLDout = resultXML.rezept['mindest-gutanteil'][0];
          }
        } else {
          console.log('mindest-gutanteil ist im XML nicht vorhanden');
          mindestgutanteilOLDout = 0;
        }

        const profilegekoppelOLD = resultXML.rezept['profile-gekoppelt']
          ? parseInt(resultXML.rezept['profile-gekoppelt'][0], 10) !== ''
          : getProfileGekoppeltDefault();

        // //----------------------------------------------------------------------

        const eckenlisteOLD = resultXML.rezept.eckenliste;
        console.log(
          'JSON.stringify(eckenlisteOLD): ' + JSON.stringify(eckenlisteOLD),
        );

        const eckenArray = eckenlisteOLD[0].ecke.map((ecke, index) => ({
          ecke: index + 1,
          x: ecke.x[0],
          z: ecke.z[0],
        }));

        console.log('artikelnameOLD: ' + artikelnameOLD);

        // Regulärer Ausdruck, um die Zahl vor "m/min" zu extrahieren
        const artikelNameZiehgeschwindigkeitMatch =
          artikelnameOLDlong.match(/(\d+)m\/min/);

        ziehgeschwindigkeitOLD = artikelNameZiehgeschwindigkeitMatch
          ? parseInt(artikelNameZiehgeschwindigkeitMatch[1], 10)
          : null;
        console.log('ziehgeschwindigkeitOLD:', ziehgeschwindigkeitOLD);

        console.log(
          'mindestgutanteilOLDstandart: ' + mindestgutanteilOLDstandart,
        );
        console.log('mindestgutanteilOLDout: ' + mindestgutanteilOLDout);
        console.log('profilegekoppelOLD: ' + profilegekoppelOLD);

        console.log('----------------------');
        console.log('Ecken im Array:', eckenArray);
        console.log('----------------------');

        eckenArray.forEach((ecke) => {
          console.log(`Ecke: ${ecke.ecke}`);
          console.log(`x: ${ecke.x}`);
          console.log(`z: ${ecke.z}`);
        });

        let mindestGutanteilOLD = 0;

        if (
          isNaN(mindestgutanteilOLDout) &&
          !isNaN(mindestgutanteilOLDstandart)
        ) {
          mindestGutanteilOLD = mindestgutanteilOLDstandart;
        } else if (
          isNaN(mindestgutanteilOLDstandart) &&
          !isNaN(mindestgutanteilOLDout)
        ) {
          mindestGutanteilOLD = mindestgutanteilOLDout;
        } else {
          mindestGutanteilOLD = getMindestGutanteilDefault();
        }

        let kommentarOLD = Array.isArray(resultXML.rezept.kommentar)
          ? resultXML.rezept.kommentar[0]
              .split('\r\n')
              .map((line) => line.trim())
              .filter((line) => line !== '')
          : [];
        console.log('kommentarOLD:', kommentarOLD);
        console.log('kommentarOld.length: ' + kommentarOLD.length);

        let kommentarArr = [];
        let zeile = '';

        if (kommentarOLD.length === 0) {
          console.log(
            'Die Zeile mit Kommentar ist leer!----------------------------------------------------------------',
          );
          const erstelltAmDatum2 = '01.01.1970';
          const [day, month, year] = erstelltAmDatum2.split('.');
          const dateObject2 = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
          console.log(dateObject2.toISOString());

          kommentarArr.push({
            erstelltAm: dateObject2.toISOString(),
            createdBy: '643c1f042df0321cb8a06a50', //'KeinName',
            kommentarBeschreibung: 'Kein Kommentar vorhanden',
          });
        } else {
          for (let i = 0; i < kommentarOLD.length; i++) {
            zeile = kommentarOLD[i].trim();
            console.log('zeile-i: ' + zeile);

            if (zeile !== '') {
              const regex = /^(.*?) (\d{2}\.\d{2}\.\d{4}) (\w+)$/gm;

              let match1 = regex.exec(zeile);
              console.log('match1-i: ' + match1);
              if (match1) {
                console.log('bin im if..');
                let worteOderSaetze = match1[1];
                let erstelltAmDatum = match1[2];
                let kurzerName = match1[3];

                console.log('Worte oder Sätze:', worteOderSaetze);
                console.log('Datum:', erstelltAmDatum);
                console.log('Kurzname:', kurzerName);

                const isUserJOSInDB =
                  await getFindUserByIDWithoutPasswordCreatedAt(
                    '643c1f042df0321cb8a06a47',
                  );

                const isUserKAEInDB =
                  await getFindUserByIDWithoutPasswordCreatedAt(
                    '643c1f042df0321cb8a06a70',
                  );

                const isUserMATInDB =
                  await getFindUserByIDWithoutPasswordCreatedAt(
                    '643c1f042df0321cb8a06a51',
                  );

                const isUserSADInDB =
                  await getFindUserByIDWithoutPasswordCreatedAt(
                    '643c1f042df0321cb8a06a52',
                  );

                const isUserJAGInDB =
                  await getFindUserByIDWithoutPasswordCreatedAt(
                    '643c1f042df0321cb8a06a53',
                  );

                console.log(
                  '*****************************JOS********************: ' +
                    isUserJOSInDB,
                );
                console.log('isUserJOSInDB.length: ' + isUserJOSInDB.length);

                console.log('isUserKAEInDB: ' + isUserKAEInDB);
                console.log('isUserJOSInDB.length: ' + isUserJOSInDB.length);

                if (kurzerName === 'JOS') {
                  //if (isUserJOSInDB)
                  kurzerName = '643c1f042df0321cb8a06a47';
                } else if (kurzerName === 'MAT') {
                  if (isUserMATInDB === null) {
                    console.log('is null: ' + isUserMATInDB);
                    kurzerName = '000000000000000000000000';
                    worteOderSaetze = worteOderSaetze + '; Matthias Trudewind';
                  } else {
                    console.log('is not null: ' + isUserMATInDB);
                    kurzerName = '643c1f042df0321cb8a06a51';
                  }
                } else if (kurzerName === 'SAD') {
                  if (isUserSADInDB === null) {
                    console.log('is null: ' + isUserSADInDB);
                    kurzerName = '000000000000000000000000';
                    worteOderSaetze = worteOderSaetze + '; Samuel Danehl';
                  } else {
                    console.log('is not null: ' + isUserSADInDB);
                    kurzerName = '643c1f042df0321cb8a06a52';
                  }
                } else if (kurzerName === 'JAG') {
                  if (isUserJAGInDB === null) {
                    console.log('is null: ' + isUserJAGInDB);
                    kurzerName = '000000000000000000000000';
                    worteOderSaetze = worteOderSaetze + '; Janik Grote';
                  } else {
                    console.log('is not null: ' + isUserKAEInDB);
                    kurzerName = '643c1f042df0321cb8a06a53';
                  }
                } else if (kurzerName === 'KAE') {
                  if (isUserKAEInDB === null) {
                    console.log('is null: ' + isUserKAEInDB);
                    kurzerName = '000000000000000000000000';
                    worteOderSaetze = worteOderSaetze + '; Enes Karaalp';
                  } else {
                    console.log('is not null: ' + isUserKAEInDB);
                    kurzerName = '643c1f042df0321cb8a06a70';
                  }
                } else {
                  kurzerName = '643c1f042df0321cb8a06a50';
                }
                console.log('Kurzname_ID:', kurzerName);

                const [day, month, year] = erstelltAmDatum.split('.');
                const dateObject = new Date(
                  `${year}-${month}-${day}T00:00:00.000Z`,
                );
                console.log(dateObject.toISOString());

                console.log('---');
                if (
                  worteOderSaetze === '' ||
                  erstelltAmDatum === '' ||
                  kurzerName === ''
                ) {
                  console.log(
                    'warum gehe ich hier hinein???????????????????????????????',
                  );
                  kommentarBeschreibung: zeile.trim();
                } else {
                  kommentarArr.push({
                    erstelltAm: dateObject.toISOString(),
                    createdBy: kurzerName,
                    kommentarBeschreibung: worteOderSaetze.trim(),
                  });
                }
              } else {
                console.log('Kein Kommentar oder keine Regel gefunden.');
                const erstelltAmDatum3 = '01.01.1970';
                const [day, month, year] = erstelltAmDatum3.split('.');
                const dateObject3 = new Date(
                  `${year}-${month}-${day}T00:00:00.000Z`,
                );
                console.log(dateObject3.toISOString());

                kommentarArr.push({
                  erstelltAm: dateObject3.toISOString(),
                  createdBy: '643c1f042df0321cb8a06a50',
                  kommentarBeschreibung: zeile.trim(),
                });
              }
            }
          }
        }
        kommentarOLD = kommentarArr;

        console.log('*****************************');

        console.log('kommentarOLD: ' + kommentarOLD);
        kommentarArr.forEach((kommentar) => {
          console.log(`kommentar: ${JSON.stringify(kommentar)}`); // [object object]

          console.log('Erstellt am:', kommentar.erstelltAm);
          console.log('createdBy:', kommentar.createdBy);
          console.log('Worte:', kommentar.kommentarBeschreibung);
        });
        console.log('kommentarArr: ' + kommentarArr);
        console.log('*****************************');

        artikelnameOLD =
          artikelnameOLD +
          ' - ' +
          fixlaengeOLD +
          'mm - ' +
          mehrfachlaengeOLD +
          'mm - ' +
          anzahlfixlaengenpromehrfachlaengeOLD +
          'Stk. - ' +
          ziehgeschwindigkeitOLD +
          'm/min -';

        const data = {
          artikelNummer: artikelnummerOLD,
          artikelName: artikelnameOLD,
          teileNummer: teilenummerOLD,
          zeichnungsNummer: zeichnungsnummerOLD,
          aenderungsstandZeichnung: aenderungsstandzeichnungOLD,
          aenderungsstandRezept: aenderungsstandrezeptOLD,
          beschreibung: beschreibungOLD,
          ziehGeschwindigkeit: ziehgeschwindigkeitOLD,

          v_dorn_Fwd: vDornVorFloatOLD,
          v_dorn_Bwd: vDornZurueckFloatOLD,

          kommentar: kommentarOLD,

          rohrAussenDurchmesserLetzterZug: davOLD,
          rohrInnenDurchmesserLetzterZug: divOLD,
          angel: angelOLD,
          rohrAussenDurchmesserTDTZug: danOLD,

          dornStufe: stufenArray,

          fixLaenge: fixlaengeOLD,
          ausgleichsstueck: ausgleichsstueckOLD,
          mehrfachLaenge: mehrfachlaengeOLD,
          anzahlFixLaengenProMehrfachLaenge:
            anzahlfixlaengenpromehrfachlaengeOLD,
          negTolMehrfachLaenge: negtolmehrfachlaengeOLD,
          posTolMehrfachLaenge: postolmehrfachlaengeOLD,
          mindestAnzahlGutProfile: mindestanzahlgutprofileOLD,

          obereToleranz: oberetoleranzOLD,
          untereToleranz: unteretoleranzOLD,

          mindestGutanteil: mindestGutanteilOLD,
          profileGekoppelt: profilegekoppelOLD,

          ecke: eckenArray,
        };

        const newRecipes = await createRecipesTDT_de(data);
        console.log('newRecipes: ' + newRecipes);
        if (!newRecipes) {
          // Null is false
          return next(new AppError('No recipes write in db! :(', 404));
        }
      } catch (error) {
        console.error('Fehler beim Parsen der XML-Daten:', error);
        return next(new AppError(error.message, 400));
      }
    }

    console.log('recipeFileNumber: ' + recipeFileNumber);

    res.status(201).json({
      // 201 = created
      status: 'success',
      message: 'Recipes succefully created!',
    });
  },
);

export const getSaveAllRecipesToTXT = catchAsync(async (req, res, next) => {
  console.log('Bin getSaveAllRecipesToTXT');
  let isAllRecipesWritten = false;
  try {
    const allRecipes = await getFindRecipesTDTtoLoad();
    //   .populate({
    //     path: 'kopfDaten.kommentar',
    //     populate: {
    //       path: 'createdBy',
    //       model: 'User',
    //     },
    //   })
    //   .populate('eckenListe.ecke');

    console.log('----------------------------------------------------------');
    console.log('allRecipes: ', JSON.stringify(allRecipes, null, 2));

    for (let i = 0; i < allRecipes.length; i++) {
      const artikelNummerTXT = allRecipes[i].kopfDaten.artikelNummer;
      const teileNummerTXT = allRecipes[i].kopfDaten.teileNummer;
      const zeichnungsNummerTXT = allRecipes[i].kopfDaten.zeichnungsNummer;
      const aenderungsstandZeichnungTXT =
        allRecipes[i].kopfDaten.aenderungsstandZeichnung;
      const aenderungsstandRezeptTXT =
        allRecipes[i].kopfDaten.aenderungsstandRezept;
      const beschreibungTXT = allRecipes[i].kopfDaten.beschreibung;

      const v_dorn_FwdTXT = allRecipes[i].kopfDaten.v_dorn_Fwd;
      const v_dorn_BwdTXT = allRecipes[i].kopfDaten.v_dorn_Bwd;

      const kommentarTXT_Arr = allRecipes[i].kopfDaten.kommentar;
      let neu_kommentarTXT = '';
      if (
        kommentarTXT_Arr &&
        Array.isArray(kommentarTXT_Arr) &&
        kommentarTXT_Arr.length > 0
      ) {
        kommentarTXT_Arr.forEach((kommentar) => {
          const datumTXT = new Date(kommentar.erstelltAm).toLocaleDateString(
            'de-DE',
            {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            },
          );

          neu_kommentarTXT +=
            '\n' +
            '          ' +
            kommentar.kommentarBeschreibung +
            ' ' +
            datumTXT;

          if (kommentar.createdBy) {
            neu_kommentarTXT +=
              ' ' +
              kommentar.createdBy.firstName +
              ' ' +
              kommentar.createdBy.lastName;
          }
        });
        neu_kommentarTXT += '\n' + '      ';
      } else {
        neu_kommentarTXT += '\n' + '      Keine Kommentare gefunden.' + '\n';
      }

      const mindestGutanteilTXT = allRecipes[i].rohrWerte.mindestGutanteil;
      const profileGekoppeltTXT = allRecipes[i].rohrWerte.profileGekoppelt;

      const fixlaengeTXT = allRecipes[i].mehrfachlaengenDaten.fixlaenge;
      const ausgleichstueckTXT =
        allRecipes[i].mehrfachlaengenDaten.ausgleichstueck;
      const mehrfachlaengeTXT =
        allRecipes[i].mehrfachlaengenDaten.mehrfachlaenge;
      const anzahlFixlaengenProMehrfachlaengeTXT =
        allRecipes[i].mehrfachlaengenDaten.anzahlFixlaengenProMehrfachlaenge;
      const negativeToleranzMehrfachlaengeTXT =
        allRecipes[i].mehrfachlaengenDaten.negativeToleranzMehrfachlaenge;
      const positiveToleranzMehrfachlaengeTXT =
        allRecipes[i].mehrfachlaengenDaten.positiveToleranzMehrfachlaenge;
      const mindestanzahlGutprofileTXT =
        allRecipes[i].mehrfachlaengenDaten.mindestanzahlGutprofile;

      const obereToleranzTXT = allRecipes[i].standartWerte.obereToleranz;
      const untereToleranzTXT = allRecipes[i].standartWerte.untereToleranz;

      const rohrAussenDurchmesserLetzterZugTXT =
        allRecipes[i].dornWerte.rohrAussenDurchmesserLetzterZug;
      const rohrInnenDurchmesserLetzterZugTXT =
        allRecipes[i].dornWerte.rohrInnenDurchmesserLetzterZug;
      const angelTXT = allRecipes[i].dornWerte.angel;
      const rohrAussenDurchmesserTDTZugTXT =
        allRecipes[i].dornWerte.rohrAussenDurchmesserTDTZug;

      let artikelNameTXT = '';
      const artikelNameSplitOne =
        allRecipes[i].kopfDaten.artikelName.split(' ')[0];
      artikelNameTXT +=
        artikelNameSplitOne +
        ' - ' +
        fixlaengeTXT +
        'mm - ' +
        allRecipes[i].kopfDaten.ziehGeschwindigkeit +
        'm/min -';

      let dataToWrite = `<rezept>
        <artikelnummer>${artikelNummerTXT}</artikelnummer>
        <artikelname>${artikelNameTXT}</artikelname>
        <teilenummer>${teileNummerTXT}</teilenummer>
        <zeichnungsnummer>${zeichnungsNummerTXT}</zeichnungsnummer>
        <aenderungsstand-zeichnung>${aenderungsstandZeichnungTXT}</aenderungsstand-zeichnung>
        <aenderungsstand-rezept>${aenderungsstandRezeptTXT}</aenderungsstand-rezept>
        <beschreibung>${beschreibungTXT}</beschreibung> 

        <v_dorn_Fwd>${v_dorn_FwdTXT}</v_dorn_Fwd>
        <v_dorn_Bwd>${v_dorn_BwdTXT}</v_dorn_Bwd>        
  
        <kommentar>  ${neu_kommentarTXT}  </kommentar>
        `;

      if (profileGekoppeltTXT === 2) {
        dataToWrite += '\n' + '      ';
        dataToWrite += `<profile-gekoppelt>${profileGekoppeltTXT}</profile-gekoppelt>`;
        dataToWrite += '\n';
      }

      dataToWrite += `
        <dorn>
          <dav>${parseFloat(rohrAussenDurchmesserLetzterZugTXT).toFixed(2)}</dav>
          <div>${parseFloat(rohrInnenDurchmesserLetzterZugTXT).toFixed(2)}</div>
          <angel>${angelTXT}</angel>
          <dan>${parseFloat(rohrAussenDurchmesserTDTZugTXT).toFixed(2)}</dan>
          <stufen>`;

      const dornStufenTXT_Arr = allRecipes[i].dornWerte.dornStufen.dornStufe;

      if (
        dornStufenTXT_Arr &&
        Array.isArray(dornStufenTXT_Arr) &&
        dornStufenTXT_Arr.length > 0
      ) {
        dornStufenTXT_Arr.forEach((stufe) => {
          dataToWrite += `
            <stufe>
              <d>${parseFloat(stufe.dornDurchmesser).toFixed(2)}</d>
              <pos>${stufe.position}</pos>
              <rampe-rein>${stufe.rampeRein}</rampe-rein>
              <rampe-raus>${stufe.rampeRaus}</rampe-raus>
              <dehnung>${stufe.dehnung}</dehnung>
            </stufe>`;
        });
      } else {
        dataToWrite += `
          <stufe>
            <d>0</d>
            <pos>0</pos>
            <rampe-rein>0</rampe-rein>
            <rampe-raus>0</rampe-raus>
            <dehnung>0</dehnung>
          </stufe>`;
      }

      dataToWrite += `
          </stufen>
        </dorn>
  
        <mehrfachlaenge>
          <fixlaenge>${fixlaengeTXT}</fixlaenge>
          <ausgleichsstueck>${ausgleichstueckTXT}</ausgleichsstueck>
          <mehrfachlaenge>${mehrfachlaengeTXT}</mehrfachlaenge>
          <anzahl-fixlaengen-pro-mehrfachlaenge>${anzahlFixlaengenProMehrfachlaengeTXT}</anzahl-fixlaengen-pro-mehrfachlaenge>
          <neg-tol-mehrfachlaenge>${negativeToleranzMehrfachlaengeTXT}</neg-tol-mehrfachlaenge>
          <pos-tol-mehrfachlaenge>${positiveToleranzMehrfachlaengeTXT}</pos-tol-mehrfachlaenge>
          <mindestanzahl-gutprofile>${mindestanzahlGutprofileTXT}</mindestanzahl-gutprofile>
        </mehrfachlaenge>
  
        <standardwerte>
          <obere-toleranz>${obereToleranzTXT}</obere-toleranz>
          <untere-toleranz>${untereToleranzTXT}</untere-toleranz>
          <mindest-gutanteil>${mindestGutanteilTXT}</mindest-gutanteil>
        </standardwerte>
  
        <eckenliste>`;

      const eckenTXT_Arr = allRecipes[i].eckenListe.ecke;

      if (
        eckenTXT_Arr &&
        Array.isArray(eckenTXT_Arr) &&
        eckenTXT_Arr.length > 0
      ) {
        eckenTXT_Arr.forEach((ecke) => {
          dataToWrite += `
          <ecke>
            <x>${ecke.x}</x>
            <z>${parseFloat(ecke.z).toFixed(2)}</z>
          </ecke>`;
        });
      } else {
        dataToWrite += `
        <ecke>
          <x>0</x>
          <z>0</z>
        </ecke>`;
      }

      dataToWrite += `
        </eckenliste>
      </rezept>`;

      let fileNameToWrite = `${artikelNummerTXT} ${artikelNameSplitOne} - ${fixlaengeTXT}mm - ${allRecipes[i].kopfDaten.ziehGeschwindigkeit}mmin -.txt`;

      try {
        isAllRecipesWritten = await writeTXT_File(fileNameToWrite, dataToWrite);
      } catch (err) {
        //throw err;
        isAllRecipesWritten = err; //false;
        break;
      }
    }

    if (!allRecipes) {
      return next(new AppError('No recipesTDT found to write!!!', 404));
    }

    if (isAllRecipesWritten !== true) {
      // Null is false
      return next(
        new AppError(
          `No recipes write to .TXT- files! :( ${isAllRecipesWritten}`,
          404,
        ),
      );
    }

    res.status(201).json({
      // 201 = created
      status: 'success',
      message: 'Recipes succefully write to .TXT-files !',
    });
  } catch (error) {
    console.error('Fehler bei alle Rezepte in TXT-files schreiben:', error);
    return next(new AppError(error.message, 400));
  }
});

export default getConvertOldRecipesToMongoDB;
