import RecipesTDT_de from '../recipesTDT_de_Model.mjs';

export async function getAllRecipesTDT_de() {
  try {
    const allRecipesTDT_de = await RecipesTDT_de.find();
    console.log('allRecipesTDT_de: ' + allRecipesTDT_de);
    return allRecipesTDT_de;
  } catch (err) {
    console.log(`Could not fetch recipesTDT_de: ${error}`);
  }
}

export async function deleteRecipeFindOneAndDelete(recipeID) {
  console.log(
    'bin deleteRecipeFindOneAndDelete' + deleteRecipeFindOneAndDelete,
  );

  try {
    const deletedRecipe = await RecipesTDT_de.findOneAndDelete({
      _id: recipeID,
    });

    if (deletedRecipe !== null) {
      console.log('Benutzer erfolgreich gelöscht');
    } else {
      console.log('Benutzer mit der gegebenen ID nicht gefunden beim Löschen!');
    }

    return deletedRecipe;
  } catch (err) {
    console.log(`Could not delete a recipe: ${err}`);
  }
}

export async function getFindRecipeTDT_deByID(_id) {
  console.log('bin getFindRecipeTDT_deByID');

  try {
    const recipe = await RecipesTDT_de.findOne({ _id }).populate(
      'kopfDaten.kommentar.createdBy',
    ); //.select('+createdAt');
    console.log('recipe:', recipe);
    return recipe;
  } catch (err) {
    console.log(`Could not fetch recipe by ID: ${err}`);
  }
}

export async function updateRecipeTDT_deFindByIdAndUpdate(data, recipeID) {
  console.log(
    'bin updateRecipeTDT_deFindByIdAndUpdate und habe id: ' + recipeID,
  );
  console.log('JSON.stringify(data): ' + JSON.stringify(data));

  const artikelNummerUpdate = data.artikelNummerUpdate;
  console.log('artikelNummerUpdate: ' + artikelNummerUpdate);

  const artikelNameOLDtoChangeForUpdate = data.artikelNameUpdateOLD;
  console.log(
    'artikelNameOLDtoChangeForUpdate: ' + artikelNameOLDtoChangeForUpdate,
  );

  const ziehGeschwindigkeitUpdate = data.ziehGeschwindigkeitUpdate;
  console.log('ziehGeschwindigkeitUpdate: ' + ziehGeschwindigkeitUpdate);

  //------------------------------------------------------------------------------------
  const vDornVorStrUpdate = data.vDornVorUpdate;
  console.log('vDornVorStrUpdate:', vDornVorStrUpdate);
  console.log('typeOf vDornVorStrUpdate: ' + typeof vDornVorStrUpdate);
  const vDornVorFloatUpdate = parseFloat(vDornVorStrUpdate);
  console.log('typeOf vDornVorFloatUpdate: ' + typeof vDornVorFloatUpdate);

  const vDornZurueckStrUpdate = data.vDornZurueckUpdate;
  console.log('vDornZurueckStrUpdate:', vDornZurueckStrUpdate);
  console.log('typeOf vDornZurueckStrUpdate: ' + typeof vDornZurueckStrUpdate);
  const vDornZurueckFloatUpdate = parseFloat(vDornZurueckStrUpdate);
  console.log(
    'typeOf vDornZurueckFloatUpdate: ' + typeof vDornZurueckFloatUpdate,
  );
  //-----------------------------------------------------------------------------------

  const commentUpdate = data.commentUpdate;
  console.log('commentUpdate: ' + commentUpdate);

  const userID = data.userID;
  console.log('userID: ' + userID);

  const teileNummerUpdate = data.teileNummerUpdate;
  console.log('teileNummerUpdate: ' + teileNummerUpdate);
  const zeichnungsNummerUpdate = data.zeichnungsNummerUpdate;
  console.log('zeichnungsNummerUpdate: ' + zeichnungsNummerUpdate);
  const aenderungsstandZeichnungUpdate = data.aenderungsstandZeichnungUpdate;
  console.log(
    'aenderungsstandZeichnungUpdate: ' + aenderungsstandZeichnungUpdate,
  );
  const aenderungsstandRezeptUpdate = data.aenderungsstandRezeptUpdate;
  console.log('aenderungsstandRezeptUpdate: ' + aenderungsstandRezeptUpdate);
  const beschreibungUpdate = data.beschreibungUpdate;
  console.log('beschreibungUpdate: ' + beschreibungUpdate);

  const mindestGutanteilUpdate = data.mindestGutanteilUpdate;
  console.log('mindestGutanteilUpdate: ' + mindestGutanteilUpdate);
  const profileGekoppeltUpdate = data.profileGekoppeltUpdate;
  console.log('profileGekoppeltUpdate: ' + profileGekoppeltUpdate);

  const rohrAussenDurchmesserLetzterZugUpdate =
    data.rohrAussenDurchmesserLetzterZugUpdate;
  console.log(
    'rohrAussenDurchmesserLetzterZugUpdate: ' +
      rohrAussenDurchmesserLetzterZugUpdate,
  );
  const rohrInnenDurchmesserLetzterZugUpdate =
    data.rohrInnenDurchmesserLetzterZugUpdate;
  console.log(
    'rohrInnenDurchmesserLetzterZugUpdate: ' +
      rohrInnenDurchmesserLetzterZugUpdate,
  );
  const angelUpdate = data.angelUpdate;
  console.log('angelUpdate: ' + angelUpdate);
  const rohrAussenDurchmesserTDTZugUpdate =
    data.rohrAussenDurchmesserTDTZugUpdate;
  console.log(
    'rohrAussenDurchmesserTDTZugUpdate: ' + rohrAussenDurchmesserTDTZugUpdate,
  );

  console.log(
    'JSON.stringify(dornStufenDataUpdate): ' +
      JSON.stringify(data.dornStufenDataUpdate),
  );

  const fixlaengeUpdate = data.fixlaengeUpdate;
  console.log('fixlaengeUpdate: ' + fixlaengeUpdate);
  const ausgleichstueckUpdate = data.ausgleichstueckUpdate;
  console.log('ausgleichstueckUpdate: ' + ausgleichstueckUpdate);
  const mehrfachlaengeUpdate = data.mehrfachlaengeUpdate;
  console.log('mehrfachlaengeUpdate: ' + mehrfachlaengeUpdate);
  const anzahlFixlaengenProMehrfachlaengeUpdate =
    data.anzahlFixlaengenProMehrfachlaengeUpdate;
  console.log(
    'anzahlFixlaengenProMehrfachlaengeUpdate: ' +
      anzahlFixlaengenProMehrfachlaengeUpdate,
  );
  const negativeToleranzMehrfachlaengeUpdate =
    data.negativeToleranzMehrfachlaengeUpdate;
  console.log(
    'negativeToleranzMehrfachlaengeUpdate: ' +
      negativeToleranzMehrfachlaengeUpdate,
  );
  const positiveToleranzMehrfachlaengeUpdate =
    data.positiveToleranzMehrfachlaengeUpdate;
  console.log(
    'positiveToleranzMehrfachlaengeUpdate: ' +
      positiveToleranzMehrfachlaengeUpdate,
  );
  const mindestanzahlGutprofileUpdate = data.mindestanzahlGutprofileUpdate;
  console.log(
    'mindestanzahlGutprofileUpdate: ' + mindestanzahlGutprofileUpdate,
  );

  const obereToleranzUpdate = data.obereToleranzUpdate;
  console.log('obereToleranzUpdate: ' + obereToleranzUpdate);
  const untereToleranzUpdate = data.untereToleranzUpdate;
  console.log('untereToleranzUpdate: ' + untereToleranzUpdate);

  console.log(
    'JSON.stringify(eckenDataUpdate): ' + JSON.stringify(data.eckenDataUpdate),
  );

  const dornStufenDataUpdate = data.dornStufenDataUpdate;
  dornStufenDataUpdate.forEach((stufe) => {
    console.log('stufeID: ' + stufe.id);
    console.log('stufeDornDurchmesser: ' + stufe.dornDurchmesser);
    console.log('stufeDornPosition ' + stufe.position);
    console.log('stufeDornRampeRein ' + stufe.rampeRein);
    console.log('stufeDornRampeRaus ' + stufe.rampeRaus);
    console.log('stufeDornDehnung ' + stufe.dehnung);
  });

  const eckenDataUpdate = data.eckenDataUpdate;

  eckenDataUpdate.forEach((ecke) => {
    //console.log('ecke: ' + ecke);
    console.log('eckeID: ' + ecke.id);
    console.log('ecke.x: ' + ecke.x);
    console.log('ecke.z: ' + ecke.z);
  });

  const artikelNameUpdate =
    artikelNameOLDtoChangeForUpdate +
    ' - ' +
    fixlaengeUpdate +
    'mm - ' +
    mehrfachlaengeUpdate +
    'mm - ' +
    anzahlFixlaengenProMehrfachlaengeUpdate +
    'Stk. - ' +
    ziehGeschwindigkeitUpdate +
    'm/min -';

  try {
    try {
      const updatedRecipeWithUserComment =
        await RecipesTDT_de.findByIdAndUpdate(
          recipeID,
          {
            $push: {
              'kopfDaten.kommentar': {
                erstelltAm: new Date(),
                createdBy: userID,
                kommentarBeschreibung: commentUpdate,
              },
            },
          },
          { new: true },
        );
      console.log(
        'Aktualisiertes Rezept mit neuem Kommentar:',
        updatedRecipeWithUserComment,
      );
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Kommentars:', error);
      throw error;
    }

    const updatedRecipeWithoutEckeStufe = await RecipesTDT_de.findByIdAndUpdate(
      recipeID,
      {
        $set: {
          'kopfDaten.artikelNummer': artikelNummerUpdate,
          'kopfDaten.artikelName': artikelNameUpdate,
          'kopfDaten.teileNummer': teileNummerUpdate,
          'kopfDaten.zeichnungsNummer': zeichnungsNummerUpdate,
          'kopfDaten.aenderungsstandZeichnnung': aenderungsstandZeichnungUpdate,
          'kopfDaten.aenderungsstandRezept': aenderungsstandRezeptUpdate,
          'kopfDaten.beschreibung': beschreibungUpdate,
          'kopfDaten.ziehGeschwindigkeit': ziehGeschwindigkeitUpdate,
          'kopfDaten.v_dorn_Fwd': vDornVorFloatUpdate,
          'kopfDaten.v_dorn_Bwd': vDornZurueckFloatUpdate,

          'rohrWerte.mindestGutanteil': mindestGutanteilUpdate,
          'rohrWerte.profileGekoppelt': profileGekoppeltUpdate,

          'dornWerte.rohrAussenDurchmesserLetzterZug':
            rohrAussenDurchmesserLetzterZugUpdate,
          'dornWerte.rohrInnenDurchmesserLetzterZug':
            rohrInnenDurchmesserLetzterZugUpdate,
          'dornWerte.angel': angelUpdate,
          'dornWerte.rohrAussenDurchmesserTDTZug':
            rohrAussenDurchmesserTDTZugUpdate,

          'mehrfachlaengenDaten.fixlaenge': fixlaengeUpdate,
          'mehrfachlaengenDaten.ausgleichstueck': ausgleichstueckUpdate,
          'mehrfachlaengenDaten.mehrfachlaenge': mehrfachlaengeUpdate,
          'mehrfachlaengenDaten.anzahlFixlaengenProMehrfachlaenge':
            anzahlFixlaengenProMehrfachlaengeUpdate,
          'mehrfachlaengenDaten.negativeToleranzMehrfachlaenge':
            negativeToleranzMehrfachlaengeUpdate,
          'mehrfachlaengenDaten.positiveToleranzMehrfachlaenge':
            positiveToleranzMehrfachlaengeUpdate,
          'mehrfachlaengenDaten.mindestanzahlGutprofile':
            mindestanzahlGutprofileUpdate,

          'standartWerte.obereToleranz': obereToleranzUpdate,
          'standartWerte.untereToleranz': untereToleranzUpdate,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    console.log(
      'Aktualisiertes Rezeptohne Kommentar, Dornstufen und Eckenliste:',
      updatedRecipeWithoutEckeStufe,
    );
    // } catch (error) {
    //   console.error(
    //     'Fehler beim aktualisieren des Rezeptes ohne Kommentar, Dornstufen und Eckenliste:',
    //     error,
    //   );
    //   throw error;
    // }

    for (let i = 0; i < dornStufenDataUpdate.length; i++) {
      const stufe = dornStufenDataUpdate[i];
      console.log('Aktualisiere Stufe mit ID: ' + stufe.id);

      try {
        const updatedRecipeDornStufen = await RecipesTDT_de.findOneAndUpdate(
          {
            _id: recipeID,
            'dornWerte.dornStufen.dornStufe._id': stufe.id,
          },
          {
            $set: {
              'dornWerte.dornStufen.dornStufe.$.dornDurchmesser':
                stufe.dornDurchmesser,
              'dornWerte.dornStufen.dornStufe.$.position': stufe.position,
              'dornWerte.dornStufen.dornStufe.$.rampeRein': stufe.rampeRein,
              'dornWerte.dornStufen.dornStufe.$.rampeRaus': stufe.rampeRaus,
              'dornWerte.dornStufen.dornStufe.$.dehnung': stufe.dehnung,
            },
          },
          {
            new: true,
          },
        );

        console.log(
          'Aktualisierte RezeptStufenliste:',
          updatedRecipeDornStufen,
        );
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Stufe:', error);
        throw error;
      }
    }

    for (let i = 0; i < eckenDataUpdate.length; i++) {
      const ecke = eckenDataUpdate[i];
      console.log('Aktualisiere Ecke mit ID: ' + ecke.id);
      console.log('Neue Koordinaten - x: ' + ecke.x + ', z: ' + ecke.z);

      try {
        const updatedRecipeEckenListe = await RecipesTDT_de.findOneAndUpdate(
          {
            _id: recipeID,
            'eckenListe.ecke._id': ecke.id,
          },
          {
            $set: {
              'eckenListe.ecke.$.x': ecke.x,
              'eckenListe.ecke.$.z': ecke.z,
            },
          },
          {
            new: true,
          },
        );

        console.log(
          'Aktualisiertes RezeptEckenListe:',
          updatedRecipeEckenListe,
        );
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Ecke:', error);
        throw error;
      }
    }

    console.log('response...');
    console.log('Successfully updated recipe:');
    return updatedRecipeWithoutEckeStufe;
  } catch (error) {
    console.log(`Something wrong to update recipe in recipesTDT_de${error}`);
    console.error(`Error update recipe: ${error.message}`);
    throw error;
  }
}

export async function createRecipesTDT_de(data) {
  console.log('bin createRecipesTDT_de und habe data: ' + data);
  try {
    const newRecipesTDT_de = {
      kopfDaten: {
        artikelNummer: data.artikelNummer,
        artikelName: data.artikelName,
        teileNummer: data.teileNummer, // || 'MTTXXXXXXXXX',
        zeichnungsNummer: data.zeichnungsNummer,
        aenderungsstandZeichnung: data.aenderungsstandZeichnung,
        aenderungsstandRezept: data.aenderungsstandRezept,
        beschreibung: data.beschreibung,
        ziehGeschwindigkeit: data.ziehGeschwindigkeit,

        v_dorn_Fwd: data.v_dorn_Fwd,
        v_dorn_Bwd: data.v_dorn_Bwd,

        kommentar: data.kommentar, //[{}],
        // kommentar: [
        //   { erstelltAm: null, benutzer: null, kommentarBeschreibung: null },
        // ],
      },
      dornWerte: {
        rohrAussenDurchmesserLetzterZug: data.rohrAussenDurchmesserLetzterZug,
        rohrInnenDurchmesserLetzterZug: data.rohrInnenDurchmesserLetzterZug,
        angel: data.angel,
        rohrAussenDurchmesserTDTZug: data.rohrAussenDurchmesserTDTZug,
        dornStufen: {
          dornStufe: data.dornStufe,
        },
      },
      mehrfachlaengenDaten: {
        fixlaenge: data.fixLaenge,
        ausgleichstueck: data.ausgleichsstueck,
        mehrfachlaenge: data.mehrfachLaenge,
        anzahlFixlaengenProMehrfachlaenge:
          data.anzahlFixLaengenProMehrfachLaenge,
        negativeToleranzMehrfachlaenge: data.negTolMehrfachLaenge,
        positiveToleranzMehrfachlaenge: data.posTolMehrfachLaenge,
        mindestanzahlGutprofile: data.mindestAnzahlGutProfile,
      },
      standartWerte: {
        obereToleranz: data.obereToleranz,
        untereToleranz: data.untereToleranz,
      },
      rohrWerte: {
        mindestGutanteil: data.mindestGutanteil,
        profileGekoppelt: data.profileGekoppelt,
      },
      eckenListe: {
        ecke: data.ecke,
      },
    };
    const response = await new RecipesTDT_de(newRecipesTDT_de).save({
      runValidators: true,
    });
    console.log('Successfully saved');
    return response;
  } catch (error) {
    console.log(`Something wrong to create a recipesTDT_de${error}`);
    console.error(`Error creating recipesTDT_de: ${error.message}`);
    throw error;
  }
}

export async function getFindRecipesTDTtoLoad() {
  console.log('BIN getFindRecipesTDTtoLoad im Model.service...: ');
  try {
    const allRecipesTDTtoLoad = await RecipesTDT_de.find()
      .sort({
        'kopfDaten.artikelNummer': 1,
      })
      //.populate('kopfDaten.kommentar')
      .populate({
        path: 'kopfDaten.kommentar',
        populate: {
          path: 'createdBy',
          model: 'User',
        },
      })
      .populate('eckenListe.ecke');

    //console.log('allRecipesTDTtoLoad:', allRecipesTDTtoLoad);
    return allRecipesTDTtoLoad;
  } catch (error) {
    console.log(`Could not fetch recipesTDT_deToLoad ${error}`);
    console.error(`Error creating recipesTDT_de: ${error.message}`);
    throw error;
  }
}

export async function getFindOneRecipeByDetails(details) {
  console.log('BIN getFindOneRecipeByDetails im Model.service...: ');

  try {
    const recipe = await RecipesTDT_de.findOne({
      'kopfDaten.artikelNummer': details.artikelNummer,
      'kopfDaten.ziehGeschwindigkeit': details.ziehGeschwindigkeit,
      'mehrfachlaengenDaten.fixlaenge': details.fixLaenge,
      'mehrfachlaengenDaten.mehrfachlaenge': details.mehrfachlaenge,
      'mehrfachlaengenDaten.anzahlFixlaengenProMehrfachlaenge':
        details.anzahlFixlaengenProMehrfachlaenge,
    })
      .populate({
        path: 'kopfDaten.kommentar',
        populate: {
          path: 'createdBy',
          model: 'User',
        },
      })
      .populate('eckenListe.ecke');

    if (!recipe) {
      console.log('Kein Rezept gefunden mit diesen Details.');
      return null;
    }

    return recipe;
  } catch (error) {
    console.error(`Fehler beim Abrufen des Rezepts: ${error.message}`);
    throw error;
  }
}
