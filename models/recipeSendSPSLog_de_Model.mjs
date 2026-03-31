import mongoose, { Mongoose } from 'mongoose';
import User from './userModel.mjs';
import RecipesTDT_de from './recipesTDT_de_Model.mjs';
import AppError from '../utils/appError.mjs';

function validateEightDigitNumber(artikelnummer) {
  return /^[0-9]{8}$/.test(artikelnummer.toString());
}

export const getTeileNummerDefault = () => 'MTTXXXXXXXXX';
export const getZeichnungsNummerDefault = () => 'MTTXXXXXXXXX';
export const getBeschreibungDefault = () => 'MTTXXXXXXXXX';
export const getAenderungsstandZeichnungDefault = () => 1;
export const getAenderungsstandRezeptDefault = () => 1;
export const getZiehGeschwindigkeitDefault = () => '15m/min';
export const getProfileGekoppeltDefault = () => 1;
export const getMindestGutanteilDefault = () => 80;
export const getRampeReinDefault = () => 30.0;
export const getRampeRausDefault = () => 26.0;
export const getDehnungDefault = () => 1.0;
export const getNegativeToleranzMehrfachlaengeDefault = () => 30;
export const getPositiveToleranzMehrfachlaengeDefault = () => 150;
export const getMindestAnzahlGutprofileDefault = () => 2;
export const getVDornFwdDefault = () => 100;
export const getVDornBwdDefault = () => 100;

const recipeSendSPSLog_de_Schema = new mongoose.Schema({
  fa_number: {
    type: Number,
    required: true,
    default: 0,
  },
  recipeSend_recipeOriginalID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecipesTDT_de',
    required: true,
  },
  recipeDataSend: {
    kopfDaten: {
      artikelNummer: {
        type: Number,
        //unique: true, // not two with the same name, it is not a validator
        required: [true, 'A artikel-number must have 8 numbers!'], // validator
        validate: {
          validator: validateEightDigitNumber,
          message: 'Keine gültige achtstellige Nummer',
        },
      },
      artikelName: {
        type: String,
        //unique: true, // not two with the same name, it is not a validator
        // required: [true, 'A artikel-name must have a artikel-name'], // validator
        // trim: true, // name and not space-name-space
        // maxlength: [50, 'A firstName must have less or equal then 50 characters'], // validator
        // minlength: [1, 'A firstName must have more or equal then 1 characters'], // validator
      },
      teileNummer: {
        type: String,
        default: getTeileNummerDefault,
        trim: true,
      },
      zeichnungsNummer: {
        type: String,
        default: getZeichnungsNummerDefault,
        trim: true,
      },
      aenderungsstandZeichnung: {
        type: Number,
        default: getAenderungsstandZeichnungDefault,
      },
      aenderungsstandRezept: {
        type: Number,
        default: getAenderungsstandRezeptDefault,
      },
      beschreibung: {
        type: String,
        default: getBeschreibungDefault,
        trim: true,
      },
      ziehGeschwindigkeit: {
        type: String,
        trim: true,
      },
      v_dorn_Fwd: {
        type: Number,
        default: getVDornFwdDefault,
      },
      v_dorn_Bwd: {
        type: Number,
        default: getVDornBwdDefault,
      },
      kommentar: [
        // {
        //   erstelltAm: {
        //     type: Date,
        //     default: Date.now, // not Date.now(),
        //     //select: false, // than not see it
        //   },
        //   // benutzer: {
        //   //   type: String,
        //   //   default: 'Max Mustermann',
        //   // },
        //   createdBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        //   },
        //   kommentarBeschreibung: {
        //     type: String,
        //     default: 'Erstmals Rezept erstellt',
        //   },
        // },
      ],
    },
    rohrWerte: {
      mindestGutanteil: {
        type: Number,
        default: getMindestGutanteilDefault,
      },
      profileGekoppelt: {
        type: Number,
        default: getProfileGekoppeltDefault,
      },
    },
    dornWerte: {
      rohrAussenDurchmesserLetzterZug: {
        type: Number,
      },
      rohrInnenDurchmesserLetzterZug: {
        type: Number,
      },
      angel: {
        type: Number,
      },
      rohrAussenDurchmesserTDTZug: {
        type: Number,
      },
      dornStufen: {
        dornStufe: [
          {
            dornDurchmesser: {
              type: Number,
            },
            position: {
              type: Number,
            },
            rampeRein: {
              type: Number,
              default: getRampeReinDefault,
            },
            rampeRaus: {
              type: Number,
              default: getRampeRausDefault,
            },
            dehnung: {
              type: Number,
              default: getDehnungDefault,
            },
          },
        ],
      },
    },
    mehrfachlaengenDaten: {
      fixlaenge: {
        type: Number,
      },
      ausgleichstueck: {
        type: Number,
        default: 30,
      },
      mehrfachlaenge: {
        type: Number,
      },
      anzahlFixlaengenProMehrfachlaenge: {
        type: Number,
        default: 6,
      },
      negativeToleranzMehrfachlaenge: {
        type: Number,
        default: getNegativeToleranzMehrfachlaengeDefault,
      },
      positiveToleranzMehrfachlaenge: {
        type: Number,
        default: getPositiveToleranzMehrfachlaengeDefault,
      },
      mindestanzahlGutprofile: {
        type: Number,
        default: getMindestAnzahlGutprofileDefault,
      },
    },
    standartWerte: {
      obereToleranz: {
        type: Number,
        default: 0.15,
      },
      untereToleranz: {
        type: Number,
        default: 0.15,
      },
    },
    eckenListe: {
      ecke: [
        {
          x: {
            type: Number,
          },
          z: {
            type: Number,
          },
        },
      ],
    },
  },
  employeeSendBy: {
    userOriginalID: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    firstName: {
      type: String,
      required: [true, 'A User must have a firstName'], // validator
      trim: true, // name and not space-name-space
      maxlength: [20, 'A firstName must have less or equal then 20 characters'], // validator
      minlength: [1, 'A firstName must have more or equal then 1 characters'], // validator
    },
    lastName: {
      type: String,
      required: [true, 'A User must have a lastName'],
      trim: true,
      maxlength: [20, 'A lastName must have less or equal then 20 characters'],
      minlength: [1, 'A lastName must have more or equal then 1 characters'],
    },
    employeeNumber: {
      type: Number,
      required: [true, 'A user must have a employeeNumber'],
      //unique: true, // not two with the same name, it is not a validator
      trim: true,
      select: true,
    },
  },
  createdSendAt: {
    type: Date,
    default: Date.now, // not Date.now(),
    //select: false, // than not see it
  },
});

const RecipeSendSPSLog_de = mongoose.model(
  'RecipeSendSPSLog_de',
  recipeSendSPSLog_de_Schema,
  'RecipeSendSPSLog_de',
);

export default RecipeSendSPSLog_de;
