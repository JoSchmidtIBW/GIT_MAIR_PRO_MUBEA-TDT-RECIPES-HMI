import express from 'express';

import {
  getCreateRecipeStatistic,
  getAllRecipeStatistic,
} from '../controllers/recipeStatisticController.mjs';

const router = express.Router();

//TODO:  Routen protect machen und wegen Berechtigungen schauen
router.post('/createRecipeStatistic', getCreateRecipeStatistic);
router.get('/', getAllRecipeStatistic);

export default router;
