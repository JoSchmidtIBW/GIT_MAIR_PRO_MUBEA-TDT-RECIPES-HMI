import express from 'express';

import {
  getConvertOldRecipesToMongoDB,
  getRecipesTDTtoLoad,
  getCreateRecipe2_St_2_BSB,
  getCreateRecipe2_St_4_SBSBS,
  getCreateRecipe2_St_6_BSBSBSB,
  getCreateRecipe3_St_4_MBSBM,
  getCreateRecipe3_St_4_BMSMB,
  getCreateRecipe_ExpertJCD,
  getDeleteRecipe,
  getUpdateRecipe,
  getSaveAllRecipesToTXT,
} from '../controllers/recipesController.mjs';

const router = express.Router();

//TODO:  Routen protect machen und wegen Berechtigungen schauen
router.post('/convertOldRecipesToMongoDB', getConvertOldRecipesToMongoDB);
router.get('/recipesTDTtoLoad', getRecipesTDTtoLoad);
router.post('/createRecipe2_St_2_BSB', getCreateRecipe2_St_2_BSB);
router.post('/createRecipe2_St_4_SBSBS', getCreateRecipe2_St_4_SBSBS);
router.post('/createRecipe2_St_6_BSBSBSB', getCreateRecipe2_St_6_BSBSBSB);
router.post('/createRecipe3_St_4_MBSBM', getCreateRecipe3_St_4_MBSBM);
router.post('/createRecipe3_St_4_BMSMB', getCreateRecipe3_St_4_BMSMB);
router.post('/createRecipe_ExpertJCD', getCreateRecipe_ExpertJCD);

router.delete('/deleteRecipe/:id', getDeleteRecipe);
router.post('/updateRecipe/:id', getUpdateRecipe);

router.post('/saveAllRecipesToTXT', getSaveAllRecipesToTXT);

export default router;
