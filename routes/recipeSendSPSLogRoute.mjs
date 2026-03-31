///recipeSendSPSLog/createRecipeSendSPSLog
import express from 'express';

import {
  getCreateRecipeSendSPSLog,
  getAllRecipeSendSPSLog,
  getAllRecipeSendSPSLogByUser,
} from '../controllers/recipeSendSPSLogController.mjs';

const router = express.Router();

//TODO:  Routen protect machen und wegen Berechtigungen schauen
router.post('/createRecipeSendSPSLog', getCreateRecipeSendSPSLog);
router.get('/:id', getAllRecipeSendSPSLogByUser);
router.get('/', getAllRecipeSendSPSLog);

export default router;
