import express from 'express';

import { getWriteRecipeToSPS } from '../controllers/spsController.mjs';

const router = express.Router();

//TODO:  Routen protect machen und wegen Berechtigungen schauen
router.post('/writeRecipeToSPS', getWriteRecipeToSPS);

export default router;
