import RecipeStatistic_de from '../recipesStatistic_de_Model.mjs';

export async function getFindAllRecipeStatisticsByItemNumber(itemNumber) {
  try {
    const allRecipeStatisticsByItemNumber = await RecipeStatistic_de.find({
      artikelNummer: itemNumber,
    });

    return allRecipeStatisticsByItemNumber;
  } catch (err) {
    console.log(`Could not fetch AllRecipeStatisticsByItemNumber: ${err}`);
    throw `Could not fetch AllRecipeStatisticsByItemNumber: ${err}`;
  }
}

export async function getFindAllRecipeStatistics() {
  console.log('bin getFindAllRecipeStatistics');
  try {
    const allRecipeStatistics = await RecipeStatistic_de.find()
      .populate('sendData.logEntry')
      .populate('sendData.userID')
      .populate('dornGeschwindigkeiten.dVFwd')
      .populate('dornGeschwindigkeiten.dVBwd');
    console.log('allRecipeStatistics: ' + allRecipeStatistics);
    return allRecipeStatistics;
  } catch (err) {
    console.log(`Could not fetch allRecipeStatistics: ${err}`);
    throw `Could not fetch allRecipeStatistics: ${err}`;
  }
}

export async function getUpdateRecipeStatisticByItemNumber(
  recipeStatistikToUpdateID,
  recipeSendSPSLogData,
  userSendData,
) {
  console.log('bin getUpdateRecipeStatisticByItemNumber');

  console.log('recipeStatistikToUpdateID:', recipeStatistikToUpdateID);
  console.log('recipeData: ', recipeSendSPSLogData);
  console.log('userSendData:', userSendData);

  const newFa_Number = recipeSendSPSLogData.fa_number;
  console.log('newFa_Number', newFa_Number);

  try {
    console.log('Schreibe...');
    console.log(
      'recipeSendSPSLogData.recipeDataSend.kopfDaten.ziehGeschwindigkeit',
      recipeSendSPSLogData.recipeDataSend.kopfDaten.ziehGeschwindigkeit,
    );

    const updatedRecipeStatistic = await RecipeStatistic_de.findByIdAndUpdate(
      recipeStatistikToUpdateID,
      {
        $addToSet: {
          //nur wenn nicht vorhanden
          artikelRealName:
            recipeSendSPSLogData.recipeDataSend.kopfDaten.artikelName, //'bla bla',
          //ziehGeschwindigkeiten: '25',
          ziehGeschwindigkeiten:
            recipeSendSPSLogData.recipeDataSend.kopfDaten.ziehGeschwindigkeit,
          dornGeschwindigkeiten: {
            dVFwd: recipeSendSPSLogData.recipeDataSend.kopfDaten.v_dorn_Fwd,
            dVBwd: recipeSendSPSLogData.recipeDataSend.kopfDaten.v_dorn_Bwd,
          },
        },

        $push: {
          sendData: {
            userID: userSendData._id, //'643c1f042df0321cb8a06a47',
            sendDate: recipeSendSPSLogData.createdSendAt,
            logEntry: recipeSendSPSLogData._id,
          },
          faNumbers: newFa_Number,
        },
        $inc: { totalSends: 1 }, // Erhöhe totalSends um 1
        lastSendAt: new Date(), //Date.now(),
      },
      { new: true },
    );
    return updatedRecipeStatistic;
  } catch (err) {
    console.log(`Could not UpdateRecipeStatisticByItemNumber: ${err}`);
    throw `Could not UpdateRecipeStatisticByItemNumber: ${err}`;
  }
}

export async function makeCreateRecipeStatistic(
  recipeSendSPSLogData,
  userSendData,
  fa_NummerData,
) {
  console.log('Bin makeCreateRecipeStatistic for create or update!');
  console.log(
    'Bin getCreateRecipeStatistic recipeSendSPSLogData:',
    recipeSendSPSLogData,
  );

  const artikelNummer =
    recipeSendSPSLogData.recipeDataSend.kopfDaten.artikelNummer;
  console.log('Bin getCreateRecipeStatistic artikelNummer:', artikelNummer);

  const artNum = 10183037;
  const findrecipeStatisticsIDByItemNumber =
    await getFindAllRecipeStatisticsByItemNumber(artikelNummer); //artNum); //createdSendAt; //artikelNummer);
  console.log(
    'findrecipeStatisticsIDByItemNumber vor if:',
    findrecipeStatisticsIDByItemNumber,
    findrecipeStatisticsIDByItemNumber.length,
  );
  //suchen nach artikelnummer
  if (findrecipeStatisticsIDByItemNumber.length > 0) {
    console.log(
      'es existiert bereits etwas',
      JSON.stringify(findrecipeStatisticsIDByItemNumber, null, 2),
    );
    const recipeStatistikToUpdateID = findrecipeStatisticsIDByItemNumber[0]._id;
    console.log('recipeStatistikToUpdateID', recipeStatistikToUpdateID);
    const upDateRecipeStatistic = await getUpdateRecipeStatisticByItemNumber(
      recipeStatistikToUpdateID,
      recipeSendSPSLogData,
      userSendData,
    ); //artikelNummer);
    console.log(
      '----------------------------------------------------------------upDateRecipeStatistic',
      upDateRecipeStatistic,
    );
    if (!recipeStatistikToUpdateID) {
      return next(new AppError('No recipeStatistic updated in db! :(', 404));
    }
    return upDateRecipeStatistic;
  } else {
    console.log('hat keines, need new');
    const newRecipeStatistic = await createRecipeStatisticServiceFunction(
      recipeSendSPSLogData,
      userSendData,
    );

    if (!newRecipeStatistic) {
      return next(new AppError('No recipeStatistic created in db! :(', 404));
    }
    return newRecipeStatistic;
  }
}

export const createRecipeStatisticServiceFunction = async (
  recipeSendSPSLogData,
  userSendData,
) => {
  console.log('bin createRecipeStatisticServiceFunction: ');

  console.log('recipeSendSPSLogData:', recipeSendSPSLogData);
  console.log('userSendData:', userSendData);

  try {
    const newRecipeStatistic = {
      artikelNummer:
        recipeSendSPSLogData.recipeDataSend.kopfDaten.artikelNummer,
      artikelName:
        recipeSendSPSLogData.recipeDataSend.kopfDaten.artikelName.split(' ')[0], //'bla bla',
      artikelRealName:
        recipeSendSPSLogData.recipeDataSend.kopfDaten.artikelName, //['MTT0106DC013 5Stk;', 'bla bla'],
      ziehGeschwindigkeiten:
        recipeSendSPSLogData.recipeDataSend.kopfDaten.ziehGeschwindigkeit, //['15', '25'],
      totalSends: 1,
      dornGeschwindigkeiten: [
        {
          dVFwd: recipeSendSPSLogData.recipeDataSend.kopfDaten.v_dorn_Fwd,
          dVBwd: recipeSendSPSLogData.recipeDataSend.kopfDaten.v_dorn_Bwd,
        },
      ],
      sendData: [
        {
          userID: userSendData._id, //'643c1f042df0321cb8a06a47',
          sendDate: Date.now(), //'2024-11-28T12:00:00.000Z',
          logEntry: recipeSendSPSLogData._id, //recipeSendSPSLogData.recipeDataSend._id, //'6745749d6bc4aa22cd22c22c',
          //"_id": "674d97a092b43dc9984f760e"
        },
      ],
      faNumbers: recipeSendSPSLogData.fa_number, //[fa_NummerData],
      lastSendAt: Date.now(),
    };

    const responseSave = await new RecipeStatistic_de(newRecipeStatistic).save({
      runValidators: true,
    });
    //console.log('responseSave:', responseSave);
    return responseSave;
  } catch (err) {
    console.log(`Could not create recipeStatistic: ${err}`);
    throw `Could not create recipeStatistic: ${err}`;
  }
};

export const newCreateRecipeStatistic = async (
  recipeSendSPSLogData,
  userSendData,
) => {
  console.log('bin createRecipeStatistic: ');
  console.log('recipeSendSPSLogData:', recipeSendSPSLogData);
  console.log('userSendData:', userSendData);

  try {
    const newRecipeStatistic = {
      artikelNummer:
        recipeSendSPSLogData.recipeDataSend.kopfDaten.artikelNummer,
      artikelName:
        recipeSendSPSLogData.recipeDataSend.kopfDaten.artikelName.split(' ')[0], //'bla bla',
      artikelRealName:
        recipeSendSPSLogData.recipeDataSend.kopfDaten.artikelName, //['MTT0106DC013 5Stk;', 'bla bla'],
      ziehGeschwindigkeiten:
        recipeSendSPSLogData.recipeDataSend.kopfDaten.ziehGeschwindigkeit, //['15', '25'],
      totalSends: 1,
      dornGeschwindigkeiten: [
        {
          dVFwd: recipeSendSPSLogData.recipeDataSend.kopfDaten.v_dorn_Fwd,
          dVBwd: recipeSendSPSLogData.recipeDataSend.kopfDaten.v_dorn_Bwd,
        },
      ],
      sendData: [
        {
          userID: userSendData._id, //'643c1f042df0321cb8a06a47',
          sendDate: Date.now(), //'2024-11-28T12:00:00.000Z',
          logEntry: recipeSendSPSLogData._id, //recipeSendSPSLogData.recipeDataSend._id, //'6745749d6bc4aa22cd22c22c',
          //"_id": "674d97a092b43dc9984f760e"
        },
      ],
      faNumbers: recipeSendSPSLogData.fa_number, //[fa_NummerData],
      lastSendAt: Date.now(),
    };

    const responseSave = await new RecipeStatistic_de(newRecipeStatistic).save({
      runValidators: true,
    });
    return responseSave;
  } catch (err) {
    console.log(`Could not create recipeStatistic: ${err}`);
    throw `Could not create recipeStatistic: ${err}`;
  }
};
