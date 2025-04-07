import catchAsync from '../utils/catchAsync.mjs';

import {
  getFindAllRecipeStatistics,
  getFindAllRecipeStatisticsByItemNumber,
  getUpdateRecipeStatisticByItemNumber,
  newCreateRecipeStatistic,
} from '../models/services/recipeStatistic_de_Service.mjs';

export const getAllRecipeStatistic = catchAsync(async (req, res, next) => {
  console.log('Bin getAllRecipeStatistic');
  let resipeStatisticsAll_Arr = await getFindAllRecipeStatistics();
  console.log('resipeStatisticsAll.length: ', resipeStatisticsAll_Arr.length);

  if (resipeStatisticsAll_Arr.length === 0) {
    resipeStatisticsAll_Arr = []; //['Es sind keine Daten gefunden worden'];
  }

  res.status(200).json({
    status: 'success',
    message: 'resipeStatisticsAll_Arr succefully find!',
    data: resipeStatisticsAll_Arr,
  });
});

export const getCreateRecipeStatistic = catchAsync(async (req, res, next) => {
  console.log('Bin getCreateRecipeStatistic');

  console.log('recipeSendSPSLogID:', req.body.recipeSendSPSLogID);
  console.log('userSendData:', req.body.userSendData);
  console.log('fa_NummerData:', req.body.fa_NummerData);

  const userSendData = JSON.parse(req.body.userSendData);
  const recipeSendSPSLogData = req.body.recipeSendSPSLogID; // JSON.parse(req.body.recipeSendSPSLogID);
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
  //suchen nach vorhandener artikelnummer
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
    );

    if (!recipeStatistikToUpdateID) {
      return next(new AppError('No recipeStatistic updated in db! :(', 404));
    }

    res.status(201).json({
      // 201 = created
      status: 'success',
      message: 'RecipeStatistic succefully updated!',
    });
  } else {
    console.log('hat keines, need new');
    const newRecipeStatistic = await newCreateRecipeStatistic(
      recipeSendSPSLogData,
      userSendData,
    );

    if (!newRecipeStatistic) {
      return next(new AppError('No recipeStatistic created in db! :(', 404));
    }

    res.status(201).json({
      // 201 = created
      status: 'success',
      message: 'RecipeStatistic succefully created!',
    });
  }
});
