import crypto from 'crypto';
import mongoose, { Mongoose } from 'mongoose';
import validator from 'validator';

import bcrypt from 'bcryptjs';

import { encryptPassword, decryptPassword } from '../utils/crypto.mjs';
import CryptoJS from 'crypto-js';
import AppError from '../utils/appError.mjs';
import RecipesTDT_de from './recipesTDT_de_Model.mjs';
import RecipeSendSPSLog_de from './recipeSendSPSLog_de_Model.mjs';
import RecipeStatistic_de from './recipesStatistic_de_Model.mjs';

const userSchema = new mongoose.Schema({
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
    unique: true, // not two with the same name, it is not a validator
    trim: true,
    select: true,
  },
  language: {
    type: String,
    default: 'de',
    trim: true,
  },
  professional: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'Chef', 'Schichtleiter', 'Unterhalt'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now, // not Date.now(),
    select: false, // than not see it
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, // than not see the password in postman or browser
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE, not for Update  (also not work at ... user updates password)
      validator: function (el) {
        // this is the function checks if password is equal to passwordConfirm     el is element_passwortConfirm
        return el === this.password; //return true or false      abc === abc --> true
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date, // this is for resetToken expires
  active: {
    // for example to make user inactive
    type: Boolean,
    default: true, // active user, boolean = true
    select: false, // it shows not in the output if active oder inactive
  },
  department: {
    type: [String],
    default: ['Operations'],
    enum: [
      'Engineering',
      'Konstruktion',
      'IT',
      'Unterhalt',
      'Geschäfts-Führung',
      'Schweisserei',
      'Zieherei',
      'Anarbeit',
      'Operations',
    ],
  },
});

// Checks that there can only be one admin, if only one exist, and it is himself, that he can save
// also that this pre-save-middleware does not have to be commented out, when the first user- data is loaded into mongodb
userSchema.pre('save', async function (next) {
  console.log('Bin pre-save-  schaue, das es nur ein Admin gibt');
  const adminCount = await this.constructor.countDocuments({ role: 'admin' });

  const saveFields = this;

  if (adminCount > 0 && saveFields.role === 'admin' && !saveFields.isNew) {
    // The document already exists in the database and it is an admin user
    next();
  } else if (
    adminCount > 0 &&
    saveFields.role === 'admin' &&
    saveFields.isNew
  ) {
    console.log('Es hat mehrere Admins!!!');
    console.log(
      'Dieser User kann nicht in der DB gespeichert werden: ' + saveFields,
    );
    // The document is new and it is a new admin user
    return next(new AppError('Only one admin-user is allowed!', 400));
  } else {
    // All other cases allow saving
    next();
  }
  next();
});

// Check that admin, deleted_User, noAccount_user, or no_name_user not can be deleted
userSchema.pre('findOneAndDelete', async function (next) {
  console.log('Bin pre-findOneAndDelete111');
  console.log('this: ' + this);
  //console.log('JSON.stringify(this): ' + JSON.stringify(this));// Gibt Fehler
  //console.log('this.getQuery: ' + this.getQuery);
  const user = await this.model.findOne(this.getQuery());
  console.log('user: ' + user);

  const ADMIN_ID = '643c1f042df0321cb8a06a47'; //ID (Admin) by MongoDB
  const DELETED_USER_ID = '000000000000000000000000'; // Dummy, für Rezept-verläufe, und Statistik, wenn ein user gelöscht wurde
  const NONAME_USER_ID = '643c1f042df0321cb8a06a50'; // Für alte Rezepte, wo kein Name drin steht
  const NOACCOUNT_USER_ID = '000000000000000000000001'; // für Bediener ohne Login, zum Rezept senden und das es Statistik gibt

  if (user.role === 'admin' || user._id.toString() === ADMIN_ID) {
    console.log(
      'Der zu löschende User ist der Admin! Dieser darf nicht gelöscht werden!',
    );
    return next(
      new AppError('User with the role admin cannot be deleted!', 400),
    );
  }
  console.log('user._id.toString(): ' + user._id.toString());
  //TODO: alles in eine If-Schlaufe machen
  if (user._id.toString() === DELETED_USER_ID) {
    console.log(
      'Der zu löschende User ist der Deleted_User! Dieser darf nicht gelöscht werden!',
    );
    return next(new AppError('The user Deleded_User cannot be deleted!', 400));
  }

  if (user._id.toString() === NONAME_USER_ID) {
    console.log(
      'Der zu löschende User ist der NoName_User! Dieser darf nicht gelöscht werden!',
    );
    return next(new AppError('The user NoName_User cannot be deleted!', 400));
  }

  if (user._id.toString() === NOACCOUNT_USER_ID) {
    console.log(
      'Der zu löschende User ist der NoAccount_User! Dieser darf nicht gelöscht werden!',
    );
    return next(
      new AppError('The user NoAccount_User cannot be deleted!', 400),
    );
  }

  next();
});

userSchema.pre('findOneAndDelete', async function (next) {
  console.log(
    'Bin pre-findOneAndDelete, und schreibe Del-User in recipeStatistic bei delete...',
  );

  const queryConditions = this.getQuery(); // Erhalte die Bedingungen der Abfrage, weil dies nicht mit "this..." angeblich geht
  console.log('queryConditions: ' + JSON.stringify(queryConditions)); //id

  const userToDelete = await this.model.findOne(this.getQuery());
  console.log('userToDelete: ', userToDelete);
  const userToDeleteID = userToDelete._id;
  console.log('userToDeleteID:', userToDeleteID);

  //TODO: ID in config.env machen
  //TODO: alle Dummy ausserhaslb und zuoberst
  //const DELETED_USER_ID = '000000000000000000000000'; // Dummy, für Rezept-verläufe, und Statistik, wenn ein user gelöscht wurde
  const DELETED_USER_ID = new mongoose.Types.ObjectId(
    '000000000000000000000000',
  );

  const userIdToSearch = new mongoose.Types.ObjectId(
    userToDeleteID, //'643c1f042df0321cb8a06a52',
  );
  //TODO: kommt das nicht in Service?????!
  const allRecipeStatisticsWithDelUserID_Arr = await RecipeStatistic_de.find({
    'sendData.userID': userIdToSearch,
  }).populate('sendData.userID');

  console.log(
    'allRecipeStatisticsWithDelUserID_Arr:',
    allRecipeStatisticsWithDelUserID_Arr,
  );

  console.log('DELETED_USER_ID:', DELETED_USER_ID);

  for (const recipeStatistic of allRecipeStatisticsWithDelUserID_Arr) {
    let hasChanges = false;

    for (const entryLog of recipeStatistic.sendData) {
      console.log('entrLogy:', entryLog);

      const userIdToCompare =
        entryLog.userID && entryLog.userID._id
          ? entryLog.userID._id.toString()
          : entryLog.userID.toString();

      console.log('Vergleich:', userIdToCompare, userToDeleteID.toString());
      //return next(new AppError('Noooooooooooooooooo Statistic Delete!!', 400));
      if (entryLog.userID && entryLog.userID._id.equals(userToDeleteID)) {
        console.log('ID Match gefunden. Setze Dummy-ID.');
        entryLog.userID = DELETED_USER_ID;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      console.log(
        'Änderungen erkannt. Speichere Statistik:',
        recipeStatistic._id,
      );
      recipeStatistic.markModified('sendData');
      await recipeStatistic.save();
    } else {
      console.log('Keine Änderungen für Statistik:', recipeStatistic._id);
    }
  }

  console.log(
    'allRecipeStatisticsWithDelUserID_Arr:',
    allRecipeStatisticsWithDelUserID_Arr,
  );

  next();
  //return next(new AppError('Noooooooooooooooooo Statistic Delete!!', 400));
});

// for (let i = 0; i < allRecipeSendSPSLogWithDelUserID_Arr; i++) {
//   const letzterVorname = userToDelete.firstName;
//   const letzterNachmane = userToDelete.lastName;

//   allRecipeSendSPSLogWithDelUserID_Arr[i].employeeSendBy.firstName =
//     letzterVorname;
//   allRecipeSendSPSLogWithDelUserID_Arr[i].employeeSendBy.lastName =
//     letzterNachmane;
//   allRecipeSendSPSLogWithDelUserID_Arr[i].employeeSendBy.userOriginalID =
//   mongoose.Types.ObjectId(DELETED_USER_ID);
//   save...;
// };

// console.log(
//   'userOriginalID before update:',
//   recipeSendSPSLog.employeeSendBy.userOriginalID,
// );

// for (const recipeStatistic of allRecipeStatisticsWithDelUserID_Arr) {
//   recipeStatistic.sendData.forEach((entry) => {
//     console.log('entry:', entry);
//     if (entry.userID.toString() === userToDeleteID.toString()) {
//       entry.userID._id = DELETED_USER_ID; // Setze die Dummy-ID
//       await recipeStatistic.save();
//     }
//   });
//   //await recipeStatistic.save();
//   //
// }

// for (const recipeStatistic of allRecipeStatisticsWithDelUserID_Arr) {
//   let hasChanges = false; // Flag, um zu prüfen, ob Änderungen vorgenommen wurden

//   recipeStatistic.sendData = recipeStatistic.sendData.map((entry) => {
//     if (
//       entry.userID &&
//       entry.userID.toString() === userToDeleteID.toString()
//     ) {
//       entry.userID = DELETED_USER_ID; // Setze die Dummy-ID
//       hasChanges = true; // Änderungen markieren
//     }
//     return entry; // Geändertes oder unverändertes Entry zurückgeben
//   });

//   // Speichere nur, wenn Änderungen vorgenommen wurden
//   if (hasChanges) {
//     await recipeStatistic.save();
//     console.log(`Statistik aktualisiert: ${recipeStatistic._id}`);
//   }
// }

//TODO: user Del in recipeStatistic
//   //TODO: erst für user recipeSendSPSLog und recipeStatistic alles machen, damit man testen kann...
userSchema.pre('findOneAndDelete', async function (next) {
  console.log(
    'Bin pre-findOneAndDelete, und schreibe Del-User in RecipeSendSPSLog bei delete...',
  );

  const queryConditions = this.getQuery(); // Erhalte die Bedingungen der Abfrage, weil dies nicht mit "this..." angeblich geht
  console.log('queryConditions: ' + JSON.stringify(queryConditions)); //id
  //const userToDeleteID = await this.model.findOne(this.getQuery());
  //console.log('userToDeleteID: ' + userToDeleteID);

  const userToDelete = await this.model.findOne(this.getQuery());
  console.log('userToDelete: ', userToDelete);
  const userToDeleteID = userToDelete._id;
  console.log('userToDeleteID:', userToDeleteID);
  // const xDel = '643c1f042df0321cb8a06a52';
  // const objectIdDel = new mongoose.Types.ObjectId(xDel);

  //TODO: ID in config.env machen
  //TODO: alle Dummy ausserhaslb und zuoberst
  const DELETED_USER_ID = '000000000000000000000000'; // Dummy, für Rezept-verläufe, und Statistik, wenn ein user gelöscht wurde

  // const allRecipeSendSPSLogWith_Arr = await RecipeSendSPSLog_de.find(
  //   {},
  // ).populate('employeeSendBy.userOriginalID');

  // console.log('allRecipeSendSPSLogWith_Arr:', allRecipeSendSPSLogWith_Arr);

  const userIdToSearch = new mongoose.Types.ObjectId(
    userToDeleteID, //'643c1f042df0321cb8a06a52',
  );
  const allRecipeSendSPSLogWithDelUserID_Arr = await RecipeSendSPSLog_de.find({
    'employeeSendBy.userOriginalID': userIdToSearch,
  }).populate('employeeSendBy.userOriginalID');

  // console.log(
  //   'allRecipeSendSPSLogWithDelUserID_Arr:',
  //   allRecipeSendSPSLogWithDelUserID_Arr,
  // );

  console.log('DELETED_USER_ID:', DELETED_USER_ID);
  // for (let i = 0; i < allRecipeSendSPSLogWithDelUserID_Arr; i++) {
  //   const letzterVorname = userToDelete.firstName;
  //   const letzterNachmane = userToDelete.lastName;

  //   allRecipeSendSPSLogWithDelUserID_Arr[i].employeeSendBy.firstName =
  //     letzterVorname;
  //   allRecipeSendSPSLogWithDelUserID_Arr[i].employeeSendBy.lastName =
  //     letzterNachmane;
  //   allRecipeSendSPSLogWithDelUserID_Arr[i].employeeSendBy.userOriginalID =
  //   mongoose.Types.ObjectId(DELETED_USER_ID);
  //   save...;
  // };

  // console.log(
  //   'userOriginalID before update:',
  //   recipeSendSPSLog.employeeSendBy.userOriginalID,
  // );

  for (const recipeSendSPSLog of allRecipeSendSPSLogWithDelUserID_Arr) {
    // console.log(
    //   'userOriginalID before update:',
    //   recipeSendSPSLog.employeeSendBy.userOriginalID,
    // );
    const letzterVorname = userToDelete.firstName;
    const letzterNachname = userToDelete.lastName;

    recipeSendSPSLog.employeeSendBy.firstName = letzterVorname;
    recipeSendSPSLog.employeeSendBy.lastName = letzterNachname;
    //recipeSendSPSLog.employeeSendBy.userOriginalID =
    //  new mongoose.Types.ObjectId(DELETED_USER_ID);

    recipeSendSPSLog.employeeSendBy.userOriginalID = DELETED_USER_ID;
    //mongoose.Types.ObjectId(DELETED_USER_ID);

    await recipeSendSPSLog.save();
  }

  // console.log(
  //   'allRecipeSendSPSLogWithDelUserID_Arr:',
  //   allRecipeSendSPSLogWithDelUserID_Arr,
  // );

  next();
  //return next(new AppError('Noooooooooooooooooo Delete!!', 400));
});

//Check if the to deleted user has comments in recipes, and if they exist, that the user change his ID
// with the ID from the deleted-Dummy-user and that the first- and lastname is write to the comment
userSchema.pre('findOneAndDelete', async function (next) {
  console.log(
    'Bin pre-findOneAndDelete 2222***********************************************',
  );
  //console.log('this: ' + this);
  //console.log('JSON.stringify(this): ' + JSON.stringify(this));// Gibt Fehler
  //console.log('this.getQuery: ' + this.getQuery);
  const user = await this.model.findOne(this.getQuery());
  //console.log('user: ' + user);

  //const userId = mongoose.Types.ObjectId(user._id); //(user._id.toString());//Class constructor ObjectId cannot be invoked without 'new'
  const userId = user._id;
  const userFirstName = user.firstName;
  const userLastName = user.lastName;
  const deletedUserId = new mongoose.Types.ObjectId('000000000000000000000000');

  console.log('userId: ' + userId);
  console.log('userFirstName: ' + userFirstName);
  console.log('userLastName: ' + userLastName);

  const recipesAll = await RecipesTDT_de.find({
    'kopfDaten.kommentar.createdBy': userId,
  })
    .populate('kopfDaten.kommentar.createdBy')
    .exec();

  for (const recipe of recipesAll) {
    //console.log('Rezept ---->:', recipe.kopfDaten.artikelName);
    // console.log('Recipe ID:', recipe._id);

    for (const comment of recipe.kopfDaten.kommentar) {
      // console.log(
      //   `Kommentar erstellt von: ${comment.createdBy._id}; ${comment.createdBy.firstName} ${comment.createdBy.lastName}`,
      // );
      // console.log(
      //   'Comment ID:',
      //   comment._id,
      //   ' CommentText: ',
      //   comment.kommentarBeschreibung,
      // );

      if (comment.createdBy && comment.createdBy._id.equals(userId)) {
        // console.log(
        //   `Übereinstimmung gefunden für Kommentar-ID: ${comment._id}`,
        // );

        const newDescription = `${comment.kommentarBeschreibung}; ${userFirstName} ${userLastName}`;

        // console.log(
        //   `Neue hinzufügende Kommentarbeschreibung: ${newDescription}`,
        // );

        const updatedRecipeWithComments = await RecipesTDT_de.updateOne(
          { _id: recipe._id, 'kopfDaten.kommentar._id': comment._id },
          {
            $set: {
              'kopfDaten.kommentar.$.createdBy': deletedUserId,
              'kopfDaten.kommentar.$.kommentarBeschreibung': newDescription,
            },
          },
          {
            arrayFilters: [{ 'elem._id': comment._id }],
            new: true,
          },
        );

        //console.log('updatedRecipeWithComments:', updatedRecipeWithComments);

        if (updatedRecipeWithComments.nModified === 0) {
          console.error(
            `Kommentar mit ID ${comment._id} konnte nicht aktualisiert werden.`,
          );
        } else {
          console.log(
            `Kommentar mit ID ${comment._id} erfolgreich aktualisiert.`,
          );
        }
      } else {
        console.log(`Kommentar nicht von gesuchtem Benutzer erstellt`);
      }
    }
  }

  console.log('-----------------------------------------');
  next();
  //return next(new AppError('Stopp, nicht weiter im Programm!', 400));
});

// Checks when the admin updates that he cannot change his role as "admin"
userSchema.pre('findOneAndUpdate', async function (next) {
  console.log(
    'bin findOneAndUpdate in userModel, schaue das Admin nicht seine rolle ändern kann',
  );

  const updatedFields = this.getUpdate();
  console.log('updatedFields: ' + updatedFields);
  console.log('updatedFields.role: ' + updatedFields.role);

  const queryConditions = this.getQuery(); // Erhalte die Bedingungen der Abfrage, weil dies nicht mit "this..." angeblich geht
  console.log('queryConditions: ' + queryConditions);

  //const user = await this.findOne();
  const user = await this.model.findOne(queryConditions);
  console.log('user: ' + user);

  const ADMIN_ID = '643c1f042df0321cb8a06a47'; //ID (Admin) by MongoDB

  if (user._id.toString() === ADMIN_ID) {
    console.log('ID ist diese vom ADMIN! Admin darf seine rolle nicht ändern!');
    if (updatedFields.role && updatedFields.role !== user.role) {
      return next(new AppError('Admin cannot update role field', 400));
    }
  }

  console.log(
    'bin findOneAndUpdate in userModel, schaue das Admin nicht seine rolle ändern kann, alles gut, next',
  );
  next();
});

// Checks that the last name of dummy-user cannot be changed
userSchema.pre('findOneAndUpdate', async function (next) {
  console.log(
    'Bin pre-findOneAndUpdate - Überprüfung: Das der Nachname von DUMMY-User nicht geändert werden kann.',
    //this,
  );

  //console.log('this._update:', this._update);

  const queryConditions = this.getQuery(); // Erhalte die Bedingungen der Abfrage, weil dies nicht mit "this..." angeblich geht
  console.log('queryConditions: ' + JSON.stringify(queryConditions)); //id

  const DELETED_USER_ID = '000000000000000000000000'; // Dummy, für Rezept-verläufe, und Statistik, wenn ein user gelöscht wurde
  const NONAME_IN_OLDRECIPE_USER_ID = '643c1f042df0321cb8a06a50'; // Für alte Rezepte, wo kein Name drin steht
  const NOACCOUNT_USER_ID = '000000000000000000000001'; // für Bediener ohne Login, zum Rezept senden und das es Statistik gibt

  if (
    queryConditions._id.toString() === DELETED_USER_ID ||
    queryConditions._id.toString() === NOACCOUNT_USER_ID ||
    queryConditions._id.toString() === NONAME_IN_OLDRECIPE_USER_ID
  ) {
    console.log('Es ist Deleted_user!!');

    const existingUser = await this.model.findOne(queryConditions);
    console.log('existingUser: ' + existingUser);
    console.log('this._update.lastName: ' + this._update.lastName);

    //const existingUser = await this.constructor.findById(this._id);

    if (existingUser && existingUser.lastName !== this._update.lastName) {
      console.log(
        `Der Nachname von Deleted-User-Dummy darf nicht geändert werden. Aktueller Nachname: ${existingUser.lastName}, Neuer Nachname: ${this._update.lastName}`,
      );
      return next(
        new AppError(
          `The last name of ${existingUser.lastName}-Dummy cannot be changed!`,
          400,
        ),
      );
    }
  }

  next();
});

// Against bruteforce- attack (if hacker can access db, and sees all pw in it)
// This document pre-save-middleware make all password to a encrypted password, when password is updated or new
userSchema.pre('save', async function (next) {
  console.log('bin pre-save im userModel');
  console.log('this.password  in pre-save: ' + this.password);
  // if not changed the password, make next, go to next middleware, otherwise, stay in it
  if (!this.isModified('password')) return next(); // this, is the actually document, isModified is function when something in the document is being modified, needs name of the field that is being modified

  // console.log('key: ' + key);
  // this.password = encryptPassword(this.password, key);
  this.password = encryptPassword(this.password);
  console.log('encryptPassword  in pre-save: ' + this.password);

  // after that, confirmPassword must be deleted, because only hashPassword exists, with set to undefined
  // Delete the passwordConfirm field
  this.passwordConfirm = undefined; // required input, not input in database
  //this.cryptoKey = key;
  next(); // passwordConfirm is only needed at the beginning so that the user does not make a mistake
});

// Return true or false
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  console.log('bin methods.correctPassword');
  console.log('userPassword: ' + userPassword);
  console.log('this.password: ' + this.password);
  console.log('candidatePassword: ' + candidatePassword);

  //let key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY);
  //console.log('key: ' + key);
  //let decryptedPassword = decryptPassword(this.password, key); //this.cryptoKey);
  let decryptedPassword = decryptPassword(userPassword);

  console.log('Decrypted data in correctPassword: ', decryptedPassword);

  if (decryptedPassword === candidatePassword) {
    console.log('Passwords match!');
    return true;
  } else {
    console.log('Passwords do not match!');
    return false;
  }

  return false;
};

userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
  // return false, --> user has not change password, after the token was issued
  if (this.passwordChangeAt) {
    // if user never changed password, this does not exist
    console.log(
      'passwordChangeAt, JWTTimestamp: ' + passwordChangeAt,
      JWTTimestamp,
    ); // output with milliseconds

    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    ); // base is 10 numbers
    console.log(
      'changedTimestamp, JWTTimestamp: ' + changedTimestamp,
      JWTTimestamp,
    );
    return JWTTimestamp < changedTimestamp; // token time 100, pw changed time 200
  }

  // false means not changed
  return false; //token time 300, pw changed time 200
};

// // Inactive
// userSchema.methods.createPasswordResetToken = function () {
//   // password- reset- token should be a randomString
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   console.log({ resetToken }, this.passwordResetToken); // logged as an object resetToken32, and resetTokenHash

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 * 60 * 1000 = 10 minutes   not saved in db, only modified
//   return resetToken;
// };

// // Inactive
// //this function would be intended when user wants to make his account (deleteME) inactive. The user would be deleted but not in the db, and so you do not see at "getalluser", only sees all active accounts
// userSchema.pre(/^find/, function (next) {
//   //this.find({ active: true }); // but then it doesn't show any users in getalluser, because the existing ones don't have it yet!
//   this.find({ active: { $ne: false } });
//   next();
// });

const User = mongoose.model('User', userSchema);

export default User;

//-----------------------------------------------------------------------------------------------------

//------------------------Der USER bei löschen oder veränderung in recipeSPS schreiben!!!!!
// userSchema.pre('deleteOne', async function(next) {
//   const userId = this.getQuery()["_id"];

//   // Ersetze den Benutzer in allen 'employeeSend'-Feldern mit 'NoName' (der ID des "NoName"-Benutzers)
//   await mongoose.model('EmployeeModel').updateMany(
//     { 'employeeSend.userOriginalID': userId },
//     { $set: { 'employeeSend.$.userOriginalID': 'ID_von_NoName_Benutzer' } }
//   );

//   next();
// });
// userSchema.pre('findOneAndUpdate', async function(next) {
//   const updateData = this.getUpdate();
//   const userId = this.getQuery()["_id"];

//   // Wenn der Vorname oder Nachname geändert wurde, aktualisiere auch die Referenzen in employeeSend
//   if (updateData.firstName || updateData.lastName) {
//     await mongoose.model('EmployeeModel').updateMany(
//       { 'employeeSend.userOriginalID': userId },
//       {
//         $set: {
//           'employeeSend.$.firstName': updateData.firstName || 'AlterVorname',
//           'employeeSend.$.lastName': updateData.lastName || 'AlterNachname'
//         }
//       );
//   }

//   next();
// });

// userSchema.pre('deleteOne', async function(next) {
//   const userId = this.getQuery()["_id"];

//   // Hole den ursprünglichen Vorname und Nachname des Benutzers
//   const user = await mongoose.model('User').findById(userId);

//   // Ersetze den Benutzer in allen `employeeSend`-Feldern und setze `firstName` auf den alten Namen
//   await mongoose.model('EmployeeModel').updateMany(
//     { 'employeeSend.userOriginalID': userId },
//     {
//       $set: {
//         'employeeSend.$.userOriginalID': 'ID_von_NoName_Benutzer',  // Setze auf NoName
//         'employeeSend.$.firstName': user.firstName,  // Setze auf den alten Namen
//         'employeeSend.$.lastName': user.lastName     // Setze auf den alten Namen
//       }
//     );

//   next();
// });

//TODO: Dummy-User und Admin nicht löschen                                              Gut
//TODO: Dummy-User nachnamen nicht verändern                                            Gut
//TODO: user NoAccount nur 1x, und nicht löschen (MItarbeiterNummer ist unique!)        Gut (unique)
//TODO: recipeSEndSPSLog User bei Del NoAccount reinschreiben und namen behalten.
//TODO: recipeStatistik user NoAccount reinschreiben bei löschen
//TODO: recipeSendSPSLog originalrezept bei löschen muss NULL stehen
