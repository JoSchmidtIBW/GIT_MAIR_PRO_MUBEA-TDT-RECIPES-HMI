import express from 'express';

import {
  getTxt_Xml_FileUploader,
  getOverview,
  getOverviewInlogt,
  getLogin,
  getCreateRecipeOverview,
  getCreate2_St_2_BSB,
  getCreate2_St_4_SBSBS,
  getCreate2_St_6_BSBSBSB,
  getCreate3_St_4_MBSBM,
  getCreate3_St_4_BMSMB,
  getCreateExpertJCD,
  getAccount,
  getManageUsers,
  getUpdateUser,
  getCreateUser,
  getUpdateRecipe,
  getSPS,
  getSPS_OPCUA,
  getRecipesSendSPSLog,
  getRecipeStatistic,
  getMyRecipeSend,
  getAboutTDT_NotInlogt,
  getAboutTDT,
  getAboutASMAG_NotInlogt,
  getAboutASMAG,
  getContact_NotInlogt,
  getContact,
} from '../controllers/viewsController.mjs';

import {
  protect,
  isLoggedIn,
  restrictTo,
} from '../controllers/authController.mjs';

const router = express.Router();

router.get(
  '/txt_xml_fileuploader',
  protect,
  //isLoggedIn,
  restrictTo('admin', 'Chef'),
  getTxt_Xml_FileUploader,
);
router.get('/overview', getOverview);
router.get('/login', getLogin);
router.get(
  '/overviewInlogt',
  protect,
  restrictTo('admin', 'Chef', 'Schichtleiter', 'user'),
  getOverviewInlogt,
);
router.get(
  '/createRecipeOverview',
  protect,
  isLoggedIn,
  getCreateRecipeOverview,
);
router.get('/create2-St-2-BSB', protect, isLoggedIn, getCreate2_St_2_BSB);
router.get('/create2-St-4-SBSBS', protect, getCreate2_St_4_SBSBS);
router.get('/create2-St-6-BSBSBSB', protect, getCreate2_St_6_BSBSBSB);
router.get('/create3-St-4-MBSBM', protect, getCreate3_St_4_MBSBM);
router.get('/create3-St-4-BMSMB', protect, getCreate3_St_4_BMSMB);
router.get('/createExpertJCD', protect, getCreateExpertJCD);

router.get(
  '/me',
  protect,
  restrictTo('admin', 'Chef', 'Schichtleiter', 'user'),
  getAccount,
);

router.get('/aboutTDT_NotInlogt', getAboutTDT_NotInlogt);
router.get(
  '/aboutTDT',
  protect,
  restrictTo('admin', 'Chef', 'Schichtleiter', 'user'),
  getAboutTDT,
);

router.get('/aboutASMAG_NotInlogt', getAboutASMAG_NotInlogt);
router.get(
  '/aboutASMAG',
  protect,
  restrictTo('admin', 'Chef', 'Schichtleiter', 'user'),
  getAboutASMAG,
);

router.get('/contact_NotInlogt', getContact_NotInlogt);
router.get(
  '/contact',
  protect,
  restrictTo('admin', 'Chef', 'Schichtleiter', 'user'),
  getContact,
);

//TODO: kontrollieren
router.get(
  '/myRecipeSend',
  protect,
  restrictTo('admin', 'Chef', 'Schichtleiter', 'user'),
  getMyRecipeSend,
);

router.get(
  '/recipesSendSPSLog',
  protect,
  restrictTo('admin', 'Chef', 'Schichtleiter', 'user'),
  getRecipesSendSPSLog,
);

router.get(
  '/recipesStatistic',
  protect,
  restrictTo('admin', 'Chef', 'Schichtleiter', 'user'),
  getRecipeStatistic,
);

router.get(
  '/manage_users',
  protect,
  restrictTo('admin', 'Chef'),
  getManageUsers,
);
router.get(
  '/manage_users/:id',
  protect,
  restrictTo('admin', 'Chef'), //, 'Chef'),
  getUpdateUser,
);

router.get('/createUser', protect, restrictTo('admin', 'Chef'), getCreateUser);

router.get('/recipes/updateRecipe/:id', protect, getUpdateRecipe);

//TODO: restrictTo machen...
router.get('/getSPS', protect, getSPS);
router.get('/getSPS_OPCUA', protect, getSPS_OPCUA);

export default router;
