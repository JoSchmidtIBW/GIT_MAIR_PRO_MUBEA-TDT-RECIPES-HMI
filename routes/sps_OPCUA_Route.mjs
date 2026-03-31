import express from 'express';

import { getWriteRecipeToSPS_OPCUA } from '../controllers/sps_OPCUA_Controller.mjs';

const router = express.Router();

router.post('/writeRecipeToSPS', getWriteRecipeToSPS_OPCUA);

export default router;
