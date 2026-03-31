import mongoose from 'mongoose';

const recipeStatisticsSchema_de = new mongoose.Schema({
  artikelNummer: {
    type: Number,
    required: true,
    unique: true, // Jede Artikelnummer hat genau einen Statistik-Eintrag
  },
  artikelName: {
    type: String,
  },
  artikelRealName: [
    {
      type: String,
    },
  ],
  // ziehInfo: [
  //   {
  //     ziehGeschwindigkeit: {
  //       type: String,
  //     },
  //   },
  // ],
  ziehGeschwindigkeiten: [
    {
      type: String,
    },
  ],
  totalSends: {
    type: Number,
    default: 0,
  },
  dornGeschwindigkeiten: [
    {
      dVFwd: { type: Number },
      dVBwd: { type: Number },
    },
  ],
  sendData: [
    {
      userID: { type: mongoose.Schema.ObjectId, ref: 'User' },
      sendDate: { type: Date },
      logEntry: { type: mongoose.Schema.ObjectId, ref: 'RecipeSendSPSLog_de' },
    },
  ],
  faNumbers: [
    {
      type: Number,
    },
  ],
  lastSendAt: {
    type: Date,
  },
});

const RecipeStatistic_de = mongoose.model(
  'RecipeStatistic_de',
  recipeStatisticsSchema_de,
  'RecipeStatistic_de',
);

export default RecipeStatistic_de;
