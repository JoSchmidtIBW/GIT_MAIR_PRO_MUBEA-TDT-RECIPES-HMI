/* eslint-disable */

import '@babel/polyfill'; // first line of imports, for older browsers
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

import { writeRecipeToSPS, writeRecipeToSPS_noInlogt } from './sps';

import {
  createRecipeSendSPSLog,
  createRecipeSendSPSLog_noInlogt,
  showRecipesSendSPSLogTable,
  showRecipesSendSPSLogTable_de,
  showRecipesSendSPSLogTable_cs,
  showMyRecipeSendTable,
  showMyRecipeSendTable_de,
  showMyRecipeSendTable_cs,
} from './recipeSendSPSLog';

import {
  createRecipeStatistic,
  createRecipeStatistic_noInlogt,
  showRecipeStatisticTable_de,
  showRecipeStatisticTable_cs,
  showRecipeStatisticTable,
} from './recipeStatistic';

import { showAlert } from './alerts';

import {
  convertOldRecipes,
  showRecipesTDToverviewTable,
  showRecipesTDToverviewTable_de,
  showRecipesTDToverviewTable_cs,
  showRecipesTDToverviewTable_de_NotInlogt,
  showRecipesTDToverviewTable_cs_NotInlogt,
  createRecipe2_St_2_BSB,
  createRecipe2_St_4_SBSBS,
  createRecipe2_St_6_BSBSBSB,
  createRecipe3_St_4_MBSBM,
  createRecipe3_St_4_BMSMB,
  createRecipe_ExpertJCD,
  deleteRecipe,
  updateRecipe,
  saveWriteAllRecipteToTXT_Files,
} from './recipes';

import {
  showUsers,
  showUsers_de,
  showUsers_cs,
  createNewUser,
  updateUser,
  deleteUser,
} from './user';

// DOM Element
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');

const recipeSendForm = document.querySelector('.form--recipeSend');
const recipeSendForm_NotInlogt = document.querySelector(
  '.form--recipeSend_NotInlogt',
);

const manageUsersTable = document.querySelector('.manageUsersTable');
const manageUsersTable_de = document.querySelector('.manageUsersTable_de');
const manageUsersTable_cs = document.querySelector('.manageUsersTable_cs');

const newUserDataForm = document.querySelector('.form-new-user-data');
const updateUserByAdminDataForm = document.querySelector(
  '.form-workerAdmin-data',
);

const createRecipe2_St_2_BSB_DataForm = document.querySelector(
  '.form-createRecipe-2_St_2_BSB-data',
);

const createRecipe2_St_4_SBSBS_DataForm = document.querySelector(
  '.form-createRecipe-2_St_4_SBSBS-data',
);

const createRecipe2_St_6_BSBSBSB_DataForm = document.querySelector(
  '.form-createRecipe-2_St_6_BSBSBSB-data',
);

const createRecipe3_St_4_MBSBM_DataForm = document.querySelector(
  '.form-createRecipe-3_St_4_MBSBM-data',
);

const createRecipe3_St_4_BMSMB_DataForm = document.querySelector(
  '.form-createRecipe-3_St_4_BMSMB-data',
);

const createRecipe_ExpertJCD_DataForm = document.querySelector(
  '.form-createRecipe-ExpertJCD-data',
);

const updateRecipeDataForm = document.querySelector('.form-updateRecipe-data');

const dragDropForm = document.querySelector('.form--dragDrop');
const recipesTDToverviewTable = document.querySelector(
  '.recipesTDToverviewTable',
);

const recipesTDToverviewTable_de_NotInlogt = document.querySelector(
  '.recipesTDToverviewTable_de_NotInlogt',
);

const recipesTDToverviewTable_cs_NotInlogt = document.querySelector(
  '.recipesTDToverviewTable_cs_NotInlogt',
);

const recipesTDToverviewTable_de = document.querySelector(
  '.recipesTDToverviewTable_de',
);

const recipesTDToverviewTable_cs = document.querySelector(
  '.recipesTDToverviewTable_cs',
);

const recipesSendSPSLogTable_de = document.querySelector(
  '.recipesSendSPSLogTable_de',
);

const recipesSendSPSLogTable_cs = document.querySelector(
  '.recipesSendSPSLogTable_cs',
);

const recipesSendSPSLogTable = document.querySelector(
  '.recipesSendSPSLogTable',
);

const recipeStatisticTable_de = document.querySelector(
  '.recipeStatisticTable_de',
);

const recipeStatisticTable_cs = document.querySelector(
  '.recipeStatisticTable_cs',
);

const recipeStatisticTable = document.querySelector('.recipeStatisticTable');

const myRecipeSendTable_de = document.querySelector('.myRecipeSendTable_de');

const myRecipeSendTable_cs = document.querySelector('.myRecipeSendTable_cs');

const myRecipeSendTable = document.querySelector('.myRecipeSendTable');

// DELEGATION
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // element prevent from loading the page

    const employeeNumber = document.getElementById('employeeNumber').value;
    const password = document.getElementById('password').value;

    login(employeeNumber, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //also images
    const form = new FormData();
    form.append('firstName', document.getElementById('firstname').value);
    form.append('lastName', document.getElementById('lastname').value);
    form.append('language', document.getElementById('language').value);
    form.append('email', document.getElementById('email').value);
    form.append('role', document.getElementById('role').value);

    form.append('photo', document.getElementById('photo').files[0]); // files are array, need first element

    // console.log(
    //   'bin if(userDataForm), in index.js, wenn bild, sieht keine information sollte aber kein problem sein: ' +
    //     form,
    // );
    console.log('bin if(userDataForm), FormData Objekt:');
    for (const pair of form.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    //console.log('JSON.stringify(form): ' + JSON.stringify(form));

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...'; // innerHtml or textContent

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    ); // this data must be called exactly the same as in postman!

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    console.log('bin forgotPasswordForm');
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log('email: ' + email);
    forgotPassword(email);
  });
}

if (manageUsersTable) {
  console.log('bin If manageUsersTable');
  showUsers();
}

if (manageUsersTable_de) {
  console.log('bin if manageUsersTable_de');
  showUsers_de();
}

if (manageUsersTable_cs) {
  console.log('bin if manageUsersTable_cs');
  showUsers_cs();
}

if (newUserDataForm) {
  newUserDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Bin newUserDataForm');

    const employeeNumber = document.getElementById('employeeNumber').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const language = document.querySelector('#language').value;
    const professional = document.querySelector('#professional').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const role = document.querySelector('#role').value;
    const selectedDepartments = Array.from(
      document.querySelectorAll('input[name="departments"]:checked'),
    ).map((department) => department.value);

    console.log(employeeNumber);
    console.log(firstname);
    console.log(lastname);
    console.log(language);
    console.log(professional);
    console.log(email);
    console.log(password);
    console.log(passwordConfirm);
    console.log(role);

    console.log('-------------------');
    console.log(selectedDepartments);

    const department = selectedDepartments;

    createNewUser(
      employeeNumber,
      firstname,
      lastname,
      language,
      professional,
      email,
      password,
      passwordConfirm,
      role,
      department,
    );
  });
}

const saveUpdateUserByAdminButton = document.querySelector(
  '.btn--saveUpdateUserByAdmin',
);
const deleteUpdateUserByAdminButton = document.querySelector(
  '.btn--deleteUpdateUserByAdmin',
);

if (updateUserByAdminDataForm) {
  updateUserByAdminDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('bin updateUserByAdminDataForm');

    const id = document.getElementById('userId').value;
    const employeeNumber = document.getElementById('employeeNumber').value;
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const language = document.querySelector('#language').value;
    const professional = document.querySelector('#professional').value;
    const email = document.getElementById('email').value;
    const role = document.querySelector('#role').value;
    const departmentString = document.querySelector('#department').value;

    console.log(id);
    console.log(employeeNumber);
    console.log(firstName);
    console.log(lastName);
    console.log(language);
    console.log(professional);
    console.log(email);
    console.log(role);

    console.log(departmentString);
    //TODO: CHeck if Array or only String
    const departmentsArray = departmentString.split(',');

    console.log(departmentsArray);
    const department = departmentsArray;
    if (e.submitter === saveUpdateUserByAdminButton) {
      console.log('bin SAVE in updateUserByAdminDataForm');
      updateUser(
        {
          firstName,
          lastName,
          professional,
          email,
          role,
          department,
        },
        id,
      );
    } else if (e.submitter === deleteUpdateUserByAdminButton) {
      console.log('bin Delete in updateUserByAdminDataForm');
      deleteUser(id);
    }
  });
}

const saveAllRecipteToTXT_FilesButton = document.querySelector(
  '.btn--saveAllRecipteToTXT_Files',
);

if (saveAllRecipteToTXT_FilesButton) {
  console.log('Bin saveAllRecipteToTXT_FilesButton');
  saveAllRecipteToTXT_FilesButton.addEventListener('click', function (e) {
    console.log('saveAllRecipteToTXT_FilesButton wurde geklickt!');
    saveWriteAllRecipteToTXT_Files();
  });
}

const recipeSendButton = document.querySelector('.btn--recipeSend');
export const recipeSendStatus = document.getElementById('recipeSendStatus');

export const setRecipeSendStatus = (message, isSuccess) => {
  recipeSendStatus.textContent = message;
  recipeSendStatus.style.color = isSuccess ? 'green' : 'red';
};

if (recipeSendForm) {
  recipeSendButton.addEventListener('click', async function (e) {
    console.log('Bin recipeSendForm');
    e.preventDefault();

    const userSendData = document.getElementById('userSendData').value;
    console.log('userSendData: ' + userSendData);
    const fa_Nummer = document.getElementById('fa_Nummer').value;
    console.log('fa_Nummer: ' + fa_Nummer);

    const recipeSendDataInput = document.getElementById(
      'recipeToSendRowdataInput',
    );
    let recipeSendDataJSON = '';
    const recipeSendData = recipeSendDataInput.value;
    if (recipeSendData.trim() === '') {
      console.log('Gesendet gedrückt, ohne Rezept ausgewählt');
    } else {
      console.log('recipeSendData:', recipeSendData);
      console.log('JSON.parse(recipeSendData):', JSON.parse(recipeSendData));
      recipeSendDataJSON = JSON.parse(recipeSendData);
    }

    const sendDataA = document.getElementById('sendDataA');

    if (recipeSendData.trim() !== '') {
      console.log('Rezept am senden: ');
      const recipeSendDataParse = JSON.parse(recipeSendData);
      console.log(JSON.stringify(recipeSendDataJSON, null, 2));

      if (typeof recipeSendDataJSON.kommentar === 'string') {
        console.log('ist string');
        recipeSendDataJSON.kommentar = JSON.parse(recipeSendDataJSON.kommentar);
      }

      //console.log('recipeSendData:', recipeSendData);
      //console.log('JSON.parse(recipeSendData):', JSON.parse(recipeSendData));

      //----------------------------------funktioniert Down---------------------------------------------------
      // recipeSendStatus.textContent = `${recipeSendDataJSON.artikelNummer} \u2794 ${recipeSendDataJSON.artikelName}`;
      // sendDataA.textContent = JSON.stringify(recipeSendDataJSON, null, 2); //recipeSendDataParse; //JSON.stringify(recipeSendDataJSON, null, 2);
      //----------------------------------funktioniert UP---------------------------------------------------

      //Orchestrierung ins backend!
      console.log('--------------*/*/*/*/*/*/*/*/*/*/*/*/*---------------');
      //console.log('JSON.parcse(userSendData)', userSendData);
      //---------------------------------------------------------------------------------------------------
      // console.log('userSendDate:', userSendData);
      // console.log('fa_nummer:', fa_Nummer);
      // console.log('recipeSendDataParse:', recipeSendDataParse);
      const spsResponse = await writeRecipeToSPS(
        recipeSendDataParse,
        userSendData,
        fa_Nummer,
      );
      console.log(
        '-----------*********************************************************************------------------',
      );
      // console.log('spsResponse: ', spsResponse); //spsResponse.data.status);
      // console.log('spsResponse.data.status: ', spsResponse.data.status);
      // const logResponce = await createRecipeSendSPSLog(
      //   recipeSendDataParse,
      //   userSendData,
      //   fa_Nummer,
      // );
      // console.log('logResponce:', logResponce);
      // //const recipeSendSPSLogID = logResponce.config.data;
      // const recipeSendSPSLogID = logResponce.data.data;
      // console.log('logResponce: recipeSendSPSLogID:', recipeSendSPSLogID);
      // console.log(
      //   'logResponce: recipeSendSPSLogID: JSON.stringify',
      //   JSON.stringify(recipeSendSPSLogID),
      // );
      // console.log(
      //   'logResponce: createdSendAt:',
      //   recipeSendSPSLogID.createdSendAt,
      // );
      // createRecipeStatistic(recipeSendSPSLogID, userSendData, fa_Nummer);
    } else {
      console.log('Inputfeld ist leer.');
      //writeRecipeToSPS(recipeSendData, userSendID, fa_Nummer);
      recipeSendStatus.textContent = 'No recipe selected';
      recipeSendStatus.style.color = 'red';
      sendDataA.textContent = 'No recipe selected';

      showAlert('error', 'No recipe selected!');
      console.log('Inputfeld ist leeeeeeeeeeeeeeeeeeeeeer.');
    }
  });
}

const recipeSendButton_NotInlogt = document.querySelector(
  '.btn--recipeSend_NotInlogt',
);

if (recipeSendForm_NotInlogt) {
  recipeSendButton_NotInlogt.addEventListener('click', async function (e) {
    console.log('Bin recipeSendForm_NotInlogt');
    e.preventDefault();

    const userSendData = document.getElementById('userSendData').value;
    console.log('userSendData: ' + userSendData);
    const fa_Nummer = document.getElementById('fa_Nummer').value;
    console.log('fa_Nummer: ' + fa_Nummer);

    const recipeSendDataInput = document.getElementById(
      'recipeToSendRowdataInput',
    );
    let recipeSendDataJSON = '';
    const recipeSendData = recipeSendDataInput.value;
    if (recipeSendData.trim() === '') {
      console.log('Gesendet gedrückt, ohne Rezept ausgewählt');
    } else {
      console.log('recipeSendData:', recipeSendData);
      console.log('JSON.parse(recipeSendData):', JSON.parse(recipeSendData));
      recipeSendDataJSON = JSON.parse(recipeSendData);
    }

    const sendDataA = document.getElementById('sendDataA');

    if (recipeSendData.trim() !== '') {
      console.log('Rezept am senden: ');
      const recipeSendDataParse = JSON.parse(recipeSendData);
      console.log(JSON.stringify(recipeSendDataJSON, null, 2));

      if (typeof recipeSendDataJSON.kommentar === 'string') {
        console.log('ist string');
        recipeSendDataJSON.kommentar = JSON.parse(recipeSendDataJSON.kommentar);
      }

      //console.log('recipeSendData:', recipeSendData);
      //console.log('JSON.parse(recipeSendData):', JSON.parse(recipeSendData));

      //----------------------------------funktioniert Down---------------------------------------------------
      // recipeSendStatus.textContent = `${recipeSendDataJSON.artikelNummer} \u2794 ${recipeSendDataJSON.artikelName}`;
      // sendDataA.textContent = JSON.stringify(recipeSendDataJSON, null, 2); //recipeSendDataParse; //JSON.stringify(recipeSendDataJSON, null, 2);
      //----------------------------------funktioniert UP---------------------------------------------------

      //writeRecipeToSPS_notInlogt(recipeSendDataParse);
      const spsResponse = await writeRecipeToSPS_noInlogt(
        recipeSendDataParse,
        userSendData,
        fa_Nummer,
      );
      console.log(
        '-----------*********************************************************************------------------',
      );
      // console.log('spsResponse: ', spsResponse); //spsResponse.data.status);
      // console.log('spsResponse.data.status: ', spsResponse.data.status);
      // const logResponce = await createRecipeSendSPSLog_noInlogt(
      //   recipeSendDataParse,
      //   userSendData,
      //   fa_Nummer,
      // );
      // console.log('logResponce:', logResponce);
      // //const recipeSendSPSLogID = logResponce.config.data;
      // const recipeSendSPSLogID = logResponce.data.data;
      // console.log('logResponce: recipeSendSPSLogID:', recipeSendSPSLogID);
      // console.log(
      //   'logResponce: recipeSendSPSLogID: JSON.stringify',
      //   JSON.stringify(recipeSendSPSLogID),
      // );
      // console.log(
      //   'logResponce: createdSendAt:',
      //   recipeSendSPSLogID.createdSendAt,
      // );
      // createRecipeStatistic_noInlogt(
      //   recipeSendSPSLogID,
      //   userSendData,
      //   fa_Nummer,
      // );
    } else {
      // console.log('Inputfeld ist leer.');
      // writeRecipeToSPS_notInlogt(recipeSendData);
      // recipeSendStatus.textContent = 'No recipe selected';
      // sendDataA.textContent = 'No recipe selected';

      console.log('Inputfeld ist leer.');
      //writeRecipeToSPS(recipeSendData, userSendID, fa_Nummer);
      recipeSendStatus.textContent = 'No recipe selected';
      recipeSendStatus.style.color = 'red';
      sendDataA.textContent = 'No recipe selected';

      showAlert('error', 'No recipe selected!');
      console.log('Inputfeld ist leeeeeeeeeeeeeeeeeeeeeer.');
    }
  });
}

if (createRecipe_ExpertJCD_DataForm) {
  createRecipe_ExpertJCD_DataForm.addEventListener('submit', async (e) => {
    console.log('bin createRecipe_ExpertJCD_DataForm in index.js');
    e.preventDefault();

    const artikelNummer_ExpertJCD =
      document.getElementById('artikelNummer').value;
    const artikelName_ExpertJCD = document.getElementById('artikelName').value;
    const ziehGeschwindigkeit_ExpertJCD = document.getElementById(
      'ziehGeschwindigkeit',
    ).value;

    const vDornVor_ExpertJCD = document.getElementById('vDornVor').value;
    console.log('vDornVor_ExpertJCD:', vDornVor_ExpertJCD);
    const vDornZurueck_ExpertJCD =
      document.getElementById('vDornZurueck').value;
    console.log('vDornZurueck_ExpertJCD:', vDornZurueck_ExpertJCD);

    const benutzerVorName_ExpertJCD =
      document.getElementById('benutzerVorName').value;
    const benutzerNachName_ExpertJCD =
      document.getElementById('benutzerNachName').value;
    const rohrAussenDurchmesserLetzterZug_ExpertJCD = document.getElementById(
      'rohrAussenDurchmesserLetzterZug',
    ).value;
    const rohrWandDickeAussenDurchmesserLetzterZug_ExpertJCD =
      document.getElementById('rohrWandDickeAussenDurchmesserLetzterZug').value;
    const rohrInnenDurchmesserLetzterZugBerechnet_ExpertJCD =
      document.getElementById('rohrInnenDurchmesserLetzterZugBerechnet').value;
    const rohrAussenDurchmesserTDTZug_ExpertJCD = document.getElementById(
      'rohrAussenDurchmesserTDTZug',
    ).value;
    const angel_ExpertJCD = document.getElementById('angel').value;
    const dornDurchmesserErsteStufe_ExpertJCD = document.getElementById(
      'dornDurchmesserErsteStufe',
    ).value;
    const dornPositionErsteStufe_ExpertJCD = document.getElementById(
      'dornPositionErsteStufe',
    ).value;
    const dornDurchmesserZweiteStufe_ExpertJCD = document.getElementById(
      'dornDurchmesserZweiteStufe',
    ).value;
    const dornPositionZweiteStufe_ExpertJCD = document.getElementById(
      'dornPositionZweiteStufe',
    ).value;

    const dornDurchmesserDritteStufe_ExpertJCD = document.getElementById(
      'dornDurchmesserDritteStufe',
    ).value;
    const dornPositionDritteStufe_ExpertJCD = document.getElementById(
      'dornPositionDritteStufe',
    ).value;

    const fixlaenge_ExpertJCD = document.getElementById('fixlaenge').value;
    const ausgleichstueck_ExpertJCD =
      document.getElementById('ausgleichstueck').value;
    const mehrfachlaenge_ExpertJCD =
      document.getElementById('mehrfachlaenge').value;
    const anzahlFixlaengenProMehrfachlaenge_ExpertJCD = document.getElementById(
      'anzahlFixlaengenProMehrfachlaenge',
    ).value;
    const mindestGutanteil_ExpertJCD =
      document.getElementById('mindestGutanteil').value;
    const profileGekoppelt_ExpertJCD =
      document.getElementById('profileGekoppelt').value;
    const obereToleranz_ExpertJCD =
      document.getElementById('obereToleranz').value;
    const untereToleranz_ExpertJCD =
      document.getElementById('untereToleranz').value;

    console.log('artikelNummer_ExpertJCD: ' + artikelNummer_ExpertJCD);
    console.log('artikelName_ExpertJCD: ' + artikelName_ExpertJCD);
    console.log(
      'ziehGeschwindigkeit_ExpertJCD: ' + ziehGeschwindigkeit_ExpertJCD,
    );
    console.log('benutzerVorName_ExpertJCD: ' + benutzerVorName_ExpertJCD);
    console.log('benutzerNachName_ExpertJCD: ' + benutzerNachName_ExpertJCD);
    console.log(
      'rohrAussenDurchmesserLetzterZug_ExpertJCD: ' +
        rohrAussenDurchmesserLetzterZug_ExpertJCD,
    );
    console.log(
      'rohrWandDickeAussenDurchmesserLetzterZug_ExpertJCD: ' +
        rohrWandDickeAussenDurchmesserLetzterZug_ExpertJCD,
    );
    console.log(
      'rohrInnenDurchmesserLetzterZugBerechnet_ExpertJCD: ' +
        rohrInnenDurchmesserLetzterZugBerechnet_ExpertJCD,
    );
    console.log(
      'rohrAussenDurchmesserTDTZug_ExpertJCD: ' +
        rohrAussenDurchmesserTDTZug_ExpertJCD,
    );
    console.log('angel_ExpertJCD: ' + angel_ExpertJCD);
    console.log(
      'dornDurchmesserErsteStufe_ExpertJCD: ' +
        dornDurchmesserErsteStufe_ExpertJCD,
    );
    console.log(
      'dornPositionErsteStufe_ExpertJCD: ' + dornPositionErsteStufe_ExpertJCD,
    );
    console.log(
      'dornDurchmesserZweiteStufe_ExpertJCD: ' +
        dornDurchmesserZweiteStufe_ExpertJCD,
    );
    console.log(
      'dornPositionZweiteStufe_ExpertJCD: ' + dornPositionZweiteStufe_ExpertJCD,
    );
    console.log(
      'dornDurchmesserDritteStufe_ExpertJCD: ' +
        dornDurchmesserDritteStufe_ExpertJCD,
    );
    console.log(
      'dornPositionDritteStufe_ExpertJCD: ' + dornPositionDritteStufe_ExpertJCD,
    );
    console.log('fixlaenge_ExpertJCD: ' + fixlaenge_ExpertJCD);
    console.log('ausgleichstueck_ExpertJCD: ' + ausgleichstueck_ExpertJCD);
    console.log('mehrfachlaenge_ExpertJCD: ' + mehrfachlaenge_ExpertJCD);
    console.log(
      'anzahlFixlaengenProMehrfachlaenge_ExpertJCD: ' +
        anzahlFixlaengenProMehrfachlaenge_ExpertJCD,
    );
    console.log('mindestGutanteil_ExpertJCD: ' + mindestGutanteil_ExpertJCD);
    console.log('profileGekoppelt_ExpertJCD: ' + profileGekoppelt_ExpertJCD);
    console.log('obereToleranz_ExpertJCD: ' + obereToleranz_ExpertJCD);
    console.log('untereToleranz_ExpertJCD: ' + untereToleranz_ExpertJCD);

    console.log(
      'Eckenzeugs!!!!!: --------------------------------------------------------------------------',
    );
    console.log('Positionen');

    const eigenePositionArr_ExpertJCD = document.querySelectorAll(
      '[id^="positionEcke"]',
    );
    console.log('eigenePositionArr_ExpertJCD: ' + eigenePositionArr_ExpertJCD);
    console.log(
      'Anzahl der gefundenen Eingabefelder: ' +
        eigenePositionArr_ExpertJCD.length,
    );

    let eigenePositionArrRichtig_ExpertJCD = [];
    for (let i = 0; i < eigenePositionArr_ExpertJCD.length; i++) {
      console.log(
        'eigenePositionArr_ExpertJCD[i]: ' +
          eigenePositionArr_ExpertJCD[i].value,
      );
      eigenePositionArrRichtig_ExpertJCD.push(
        eigenePositionArr_ExpertJCD[i].value,
      );
    }

    console.log(
      'Wanddicke!!!!!: --------------------------------------------------------------------------',
    );
    let wandDickeArr_ExpertJCD = [];

    let wandDickeStartSelect = document.getElementById(
      'eigeneWandDickeSelectStart',
    );
    let wandDickeStartInput = document.getElementById(
      'eigeneWandDickeInputStart',
    );
    let wandDickeEigeneSelects = document.querySelectorAll(
      '[id^="eigeneWandDickeSelectEigene"]',
    );
    let wandDickeEigeneInputs = document.querySelectorAll(
      '[id^="eigeneWandDickeInputEigene"]',
    );
    let wandDickeEndeSelect = document.getElementById(
      'eigeneWandDickeSelectEnde',
    );
    let wandDickeEndeInput = document.getElementById(
      'eigeneWandDickeInputEnde',
    );

    if (wandDickeStartSelect) {
      if (
        wandDickeStartSelect.value === 'andere' ||
        wandDickeStartSelect.value === 'other' ||
        wandDickeStartSelect.value === 'jiny'
      ) {
        wandDickeArr_ExpertJCD.push(wandDickeStartInput);
      } else {
        wandDickeArr_ExpertJCD.push(wandDickeStartSelect);
      }
    }

    for (let i = 0; i < wandDickeEigeneSelects.length; i++) {
      let select = wandDickeEigeneSelects[i];
      if (
        select.value === 'andere' ||
        select.value === 'other' ||
        select.value === 'jiny'
      ) {
        let correspondingInput = document.getElementById(
          select.id.replace('Select', 'Input'),
        );
        //wandDickeArr.push(wandDickeEigeneInputs[i]);
        wandDickeArr_ExpertJCD.push(correspondingInput);
      } else {
        wandDickeArr_ExpertJCD.push(wandDickeEigeneSelects[i]);
      }
    }

    if (wandDickeEndeSelect) {
      if (
        wandDickeEndeSelect.value === 'andere' ||
        wandDickeEndeSelect.value === 'other' ||
        wandDickeEndeSelect.value === 'jiny'
      ) {
        wandDickeArr_ExpertJCD.push(wandDickeEndeInput);
      } else {
        wandDickeArr_ExpertJCD.push(wandDickeEndeSelect);
      }
    }

    let wandDickeArrRichtig_ExpertJCD = [];
    for (let i = 0; i < wandDickeArr_ExpertJCD.length; i++) {
      console.log(
        'wandDickeArr_ExpertJCD[i]: ' + wandDickeArr_ExpertJCD[i].value,
      );
      wandDickeArrRichtig_ExpertJCD.push(wandDickeArr_ExpertJCD[i].value);
    }

    const benutzerID_ExpertJCD = document.getElementById('benutzerID').value;
    console.log('benutzerID_ExpertJCD: ' + benutzerID_ExpertJCD);

    const data_ExpertJCD = {
      artikelNummer_ExpertJCD,
      artikelName_ExpertJCD,
      ziehGeschwindigkeit_ExpertJCD,
      vDornVor_ExpertJCD,
      vDornZurueck_ExpertJCD,
      benutzerVorName_ExpertJCD,
      benutzerNachName_ExpertJCD,
      benutzerID_ExpertJCD,
      rohrAussenDurchmesserLetzterZug_ExpertJCD,
      rohrWandDickeAussenDurchmesserLetzterZug_ExpertJCD,
      rohrInnenDurchmesserLetzterZugBerechnet_ExpertJCD,
      rohrAussenDurchmesserTDTZug_ExpertJCD,
      angel_ExpertJCD,
      dornDurchmesserErsteStufe_ExpertJCD,
      dornPositionErsteStufe_ExpertJCD,
      dornDurchmesserZweiteStufe_ExpertJCD,
      dornPositionZweiteStufe_ExpertJCD,
      dornDurchmesserDritteStufe_ExpertJCD,
      dornPositionDritteStufe_ExpertJCD,
      fixlaenge_ExpertJCD,
      ausgleichstueck_ExpertJCD,
      mehrfachlaenge_ExpertJCD,
      anzahlFixlaengenProMehrfachlaenge_ExpertJCD,
      mindestGutanteil_ExpertJCD,
      profileGekoppelt_ExpertJCD,
      obereToleranz_ExpertJCD,
      untereToleranz_ExpertJCD,
      //wandDickeArr_ExpertJCD,
      //eigenePositionArr_ExpertJCD,
      eigenePositionArrRichtig_ExpertJCD,
      wandDickeArrRichtig_ExpertJCD,
    };

    createRecipe_ExpertJCD(data_ExpertJCD);
  });
}

if (createRecipe3_St_4_BMSMB_DataForm) {
  createRecipe3_St_4_BMSMB_DataForm.addEventListener('submit', async (e) => {
    console.log('bin createRecipe3_St_4_BMSMB_DataForm in index.js');
    e.preventDefault();

    const artikelNummer_3_St_4_BMSMB =
      document.getElementById('artikelNummer').value;
    const artikelName_3_St_4_BMSMB =
      document.getElementById('artikelName').value;
    const ziehGeschwindigkeit_3_St_4_BMSMB = document.getElementById(
      'ziehGeschwindigkeit',
    ).value;

    const vDornVor_3_St_4_BMSMB = document.getElementById('vDornVor').value;
    console.log('vDornVor_3_St_4_BMSMB:', vDornVor_3_St_4_BMSMB);
    const vDornZurueck_3_St_4_BMSMB =
      document.getElementById('vDornZurueck').value;
    console.log('vDornZurueck_3_St_4_BMSMB:', vDornZurueck_3_St_4_BMSMB);

    const benutzerVorName_3_St_4_BMSMB =
      document.getElementById('benutzerVorName').value;
    const benutzerNachName_3_St_4_BMSMB =
      document.getElementById('benutzerNachName').value;
    const rohrAussenDurchmesserLetzterZug_3_St_4_BMSMB =
      document.getElementById('rohrAussenDurchmesserLetzterZug').value;
    const rohrWandDickeAussenDurchmesserLetzterZug_3_St_4_BMSMB =
      document.getElementById('rohrWandDickeAussenDurchmesserLetzterZug').value;
    const rohrInnenDurchmesserLetzterZugBerechnet_3_St_4_BMSMB =
      document.getElementById('rohrInnenDurchmesserLetzterZugBerechnet').value;
    const rohrAussenDurchmesserTDTZug_3_St_4_BMSMB = document.getElementById(
      'rohrAussenDurchmesserTDTZug',
    ).value;
    const angel_3_St_4_BMSMB = document.getElementById('angel').value;
    const dornDurchmesserErsteStufe_3_St_4_BMSMB = document.getElementById(
      'dornDurchmesserErsteStufe',
    ).value;
    const dornPositionErsteStufe_3_St_4_BMSMB = document.getElementById(
      'dornPositionErsteStufe',
    ).value;
    const dornDurchmesserZweiteStufe_3_St_4_BMSMB = document.getElementById(
      'dornDurchmesserZweiteStufe',
    ).value;
    const dornPositionZweiteStufe_3_St_4_BMSMB = document.getElementById(
      'dornPositionZweiteStufe',
    ).value;

    const dornDurchmesserDritteStufe_3_St_4_BMSMB = document.getElementById(
      'dornDurchmesserDritteStufe',
    ).value;
    const dornPositionDritteStufe_3_St_4_BMSMB = document.getElementById(
      'dornPositionDritteStufe',
    ).value;

    const fixlaenge_3_St_4_BMSMB = document.getElementById('fixlaenge').value;
    const ausgleichstueck_3_St_4_BMSMB =
      document.getElementById('ausgleichstueck').value;
    const mehrfachlaenge_3_St_4_BMSMB =
      document.getElementById('mehrfachlaenge').value;
    const anzahlFixlaengenProMehrfachlaenge_3_St_4_BMSMB =
      document.getElementById('anzahlFixlaengenProMehrfachlaenge').value;
    const mindestGutanteil_3_St_4_BMSMB =
      document.getElementById('mindestGutanteil').value;
    const profileGekoppelt_3_St_4_BMSMB =
      document.getElementById('profileGekoppelt').value;
    const obereToleranz_3_St_4_BMSMB =
      document.getElementById('obereToleranz').value;
    const untereToleranz_3_St_4_BMSMB =
      document.getElementById('untereToleranz').value;

    const wanddickeEcke1_3_St_4_BMSMB =
      document.getElementById('wanddickeEcke1').value;
    const positionEcke1_3_St_4_BMSMB =
      document.getElementById('positionEcke1').value;
    const wanddickeEcke2_3_St_4_BMSMB =
      document.getElementById('wanddickeEcke2').value;
    const positionEcke2_3_St_4_BMSMB =
      document.getElementById('positionEcke2').value;
    const wanddickeEcke3_3_St_4_BMSMB =
      document.getElementById('wanddickeEcke3').value;
    const positionEcke3_3_St_4_BMSMB =
      document.getElementById('positionEcke3').value;
    const wanddickeEcke4_3_St_4_BMSMB =
      document.getElementById('wanddickeEcke4').value;
    const positionEcke4_3_St_4_BMSMB =
      document.getElementById('positionEcke4').value;
    const wanddickeEcke5_3_St_4_BMSMB =
      document.getElementById('wanddickeEcke5').value;
    const positionEcke5_3_St_4_BMSMB =
      document.getElementById('positionEcke5').value;
    const wanddickeEcke6_3_St_4_BMSMB =
      document.getElementById('wanddickeEcke6').value;
    const positionEcke6_3_St_4_BMSMB =
      document.getElementById('positionEcke6').value;
    // const wanddickeEcke6Zwischen8_3_St_4_BMSMB = document.getElementById(
    //   'wanddickeEcke6Zwischen8',
    // ).value;
    // const positionEcke6Zwischen8_3_St_4_BMSMB = document.getElementById(
    //   'positionEcke6Zwischen8',
    // ).value;
    const wanddickeEcke7_3_St_4_BMSMB =
      document.getElementById('wanddickeEcke7').value;
    const positionEcke7_3_St_4_BMSMB =
      document.getElementById('positionEcke7').value;
    const wanddickeEcke8_3_St_4_BMSMB =
      document.getElementById('wanddickeEcke8').value;
    const positionEcke8_3_St_4_BMSMB =
      document.getElementById('positionEcke8').value;
    // const wanddickeEcke9Zwischen11_3_St_4_BMSMB = document.getElementById(
    //   'wanddickeEcke9Zwischen11',
    // ).value;
    // const positionEcke9Zwischen11_3_St_4_BMSMB = document.getElementById(
    //   'positionEcke9Zwischen11',
    // ).value;
    const wanddickeEcke9_3_St_4_BMSMB =
      document.getElementById('wanddickeEcke9').value;
    const positionEcke9_3_St_4_BMSMB =
      document.getElementById('positionEcke9').value;
    const wanddickeEckeEnde_3_St_4_BMSMB =
      document.getElementById('wanddickeEckeEnde').value;
    const positionEckeEnde_3_St_4_BMSMB =
      document.getElementById('positionEckeEnde').value;

    const benutzerID_3_St_4_BMSMB = document.getElementById('benutzerID').value;

    const data_3_St_4_BMSMB = {
      artikelNummer_3_St_4_BMSMB,
      artikelName_3_St_4_BMSMB,
      ziehGeschwindigkeit_3_St_4_BMSMB,
      vDornVor_3_St_4_BMSMB,
      vDornZurueck_3_St_4_BMSMB,
      benutzerVorName_3_St_4_BMSMB,
      benutzerNachName_3_St_4_BMSMB,
      benutzerID_3_St_4_BMSMB,
      rohrAussenDurchmesserLetzterZug_3_St_4_BMSMB,
      rohrWandDickeAussenDurchmesserLetzterZug_3_St_4_BMSMB,
      rohrInnenDurchmesserLetzterZugBerechnet_3_St_4_BMSMB,
      rohrAussenDurchmesserTDTZug_3_St_4_BMSMB,
      angel_3_St_4_BMSMB,
      dornDurchmesserErsteStufe_3_St_4_BMSMB,
      dornPositionErsteStufe_3_St_4_BMSMB,
      dornDurchmesserZweiteStufe_3_St_4_BMSMB,
      dornPositionZweiteStufe_3_St_4_BMSMB,
      dornDurchmesserDritteStufe_3_St_4_BMSMB,
      dornPositionDritteStufe_3_St_4_BMSMB,
      fixlaenge_3_St_4_BMSMB,
      ausgleichstueck_3_St_4_BMSMB,
      mehrfachlaenge_3_St_4_BMSMB,
      anzahlFixlaengenProMehrfachlaenge_3_St_4_BMSMB,
      mindestGutanteil_3_St_4_BMSMB,
      profileGekoppelt_3_St_4_BMSMB,
      obereToleranz_3_St_4_BMSMB,
      untereToleranz_3_St_4_BMSMB,

      wanddickeEcke1_3_St_4_BMSMB,
      positionEcke1_3_St_4_BMSMB,
      wanddickeEcke2_3_St_4_BMSMB,
      positionEcke2_3_St_4_BMSMB,
      wanddickeEcke3_3_St_4_BMSMB,
      positionEcke3_3_St_4_BMSMB,
      wanddickeEcke4_3_St_4_BMSMB,
      positionEcke4_3_St_4_BMSMB,
      wanddickeEcke5_3_St_4_BMSMB,
      positionEcke5_3_St_4_BMSMB,
      wanddickeEcke6_3_St_4_BMSMB,
      positionEcke6_3_St_4_BMSMB,
      // wanddickeEcke6Zwischen8_3_St_4_BMSMB,
      // positionEcke6Zwischen8_3_St_4_BMSMB,
      wanddickeEcke7_3_St_4_BMSMB,
      positionEcke7_3_St_4_BMSMB,
      wanddickeEcke8_3_St_4_BMSMB,
      positionEcke8_3_St_4_BMSMB,
      // wanddickeEcke9Zwischen11_3_St_4_BMSMB,
      // positionEcke9Zwischen11_3_St_4_BMSMB,
      wanddickeEcke9_3_St_4_BMSMB,
      positionEcke9_3_St_4_BMSMB,
      wanddickeEckeEnde_3_St_4_BMSMB,
      positionEckeEnde_3_St_4_BMSMB,
    };

    createRecipe3_St_4_BMSMB(data_3_St_4_BMSMB);
  });
}

if (createRecipe3_St_4_MBSBM_DataForm) {
  createRecipe3_St_4_MBSBM_DataForm.addEventListener('submit', async (e) => {
    console.log('bin createRecipe3_St_4_MBSBM_DataForm in index.js');
    e.preventDefault();

    const artikelNummer_3_St_4_MBSBM =
      document.getElementById('artikelNummer').value;
    const artikelName_3_St_4_MBSBM =
      document.getElementById('artikelName').value;
    const ziehGeschwindigkeit_3_St_4_MBSBM = document.getElementById(
      'ziehGeschwindigkeit',
    ).value;

    const vDornVor_3_St_4_MBSBM = document.getElementById('vDornVor').value;
    console.log('vDornVor_3_St_4_MBSBM:', vDornVor_3_St_4_MBSBM);

    const vDornZurueck_3_St_4_MBSBM =
      document.getElementById('vDornZurueck').value;
    console.log('vDornZurueck_3_St_4_MBSBM:', vDornZurueck_3_St_4_MBSBM);

    const benutzerVorName_3_St_4_MBSBM =
      document.getElementById('benutzerVorName').value;
    const benutzerNachName_3_St_4_MBSBM =
      document.getElementById('benutzerNachName').value;
    const rohrAussenDurchmesserLetzterZug_3_St_4_MBSBM =
      document.getElementById('rohrAussenDurchmesserLetzterZug').value;
    const rohrWandDickeAussenDurchmesserLetzterZug_3_St_4_MBSBM =
      document.getElementById('rohrWandDickeAussenDurchmesserLetzterZug').value;
    const rohrInnenDurchmesserLetzterZugBerechnet_3_St_4_MBSBM =
      document.getElementById('rohrInnenDurchmesserLetzterZugBerechnet').value;
    const rohrAussenDurchmesserTDTZug_3_St_4_MBSBM = document.getElementById(
      'rohrAussenDurchmesserTDTZug',
    ).value;
    const angel_3_St_4_MBSBM = document.getElementById('angel').value;
    const dornDurchmesserErsteStufe_3_St_4_MBSBM = document.getElementById(
      'dornDurchmesserErsteStufe',
    ).value;
    const dornPositionErsteStufe_3_St_4_MBSBM = document.getElementById(
      'dornPositionErsteStufe',
    ).value;
    const dornDurchmesserZweiteStufe_3_St_4_MBSBM = document.getElementById(
      'dornDurchmesserZweiteStufe',
    ).value;
    const dornPositionZweiteStufe_3_St_4_MBSBM = document.getElementById(
      'dornPositionZweiteStufe',
    ).value;

    const dornDurchmesserDritteStufe_3_St_4_MBSBM = document.getElementById(
      'dornDurchmesserDritteStufe',
    ).value;
    const dornPositionDritteStufe_3_St_4_MBSBM = document.getElementById(
      'dornPositionDritteStufe',
    ).value;

    const fixlaenge_3_St_4_MBSBM = document.getElementById('fixlaenge').value;
    const ausgleichstueck_3_St_4_MBSBM =
      document.getElementById('ausgleichstueck').value;
    const mehrfachlaenge_3_St_4_MBSBM =
      document.getElementById('mehrfachlaenge').value;
    const anzahlFixlaengenProMehrfachlaenge_3_St_4_MBSBM =
      document.getElementById('anzahlFixlaengenProMehrfachlaenge').value;
    const mindestGutanteil_3_St_4_MBSBM =
      document.getElementById('mindestGutanteil').value;
    const profileGekoppelt_3_St_4_MBSBM =
      document.getElementById('profileGekoppelt').value;
    const obereToleranz_3_St_4_MBSBM =
      document.getElementById('obereToleranz').value;
    const untereToleranz_3_St_4_MBSBM =
      document.getElementById('untereToleranz').value;

    const wanddickeEcke1_3_St_4_MBSBM =
      document.getElementById('wanddickeEcke1').value;
    const positionEcke1_3_St_4_MBSBM =
      document.getElementById('positionEcke1').value;
    const wanddickeEcke2_3_St_4_MBSBM =
      document.getElementById('wanddickeEcke2').value;
    const positionEcke2_3_St_4_MBSBM =
      document.getElementById('positionEcke2').value;

    // const wanddickeEcke2Zwischen4_3_St_4_MBSBM = document.getElementById(
    //   'wanddickeEcke2Zwischen4',
    // ).value;
    // const positionEcke2Zwischen4_3_St_4_MBSBM = document.getElementById(
    //   'positionEcke2Zwischen4',
    // ).value;

    const wanddickeEcke3_3_St_4_MBSBM =
      document.getElementById('wanddickeEcke3').value;
    const positionEcke3_3_St_4_MBSBM =
      document.getElementById('positionEcke3').value;

    const wanddickeEcke4_3_St_4_MBSBM =
      document.getElementById('wanddickeEcke4').value;
    const positionEcke4_3_St_4_MBSBM =
      document.getElementById('positionEcke4').value;

    const wanddickeEcke5_3_St_4_MBSBM =
      document.getElementById('wanddickeEcke5').value;
    const positionEcke5_3_St_4_MBSBM =
      document.getElementById('positionEcke5').value;
    const wanddickeEcke6_3_St_4_MBSBM =
      document.getElementById('wanddickeEcke6').value;
    const positionEcke6_3_St_4_MBSBM =
      document.getElementById('positionEcke6').value;

    // const wanddickeEcke7Zwischen9_3_St_4_MBSBM = document.getElementById(
    //   'wanddickeEcke7Zwischen9',
    // ).value;
    // const positionEcke7Zwischen9_3_St_4_MBSBM = document.getElementById(
    //   'positionEcke7Zwischen9',
    // ).value;

    const wanddickeEcke7_3_St_4_MBSBM =
      document.getElementById('wanddickeEcke7').value;
    const positionEcke7_3_St_4_MBSBM =
      document.getElementById('positionEcke7').value;

    const wanddickeEcke8_3_St_4_MBSBM =
      document.getElementById('wanddickeEcke8').value;
    const positionEcke8_3_St_4_MBSBM =
      document.getElementById('positionEcke8').value;

    const wanddickeEcke9_3_St_4_MBSBM =
      document.getElementById('wanddickeEcke9').value;
    const positionEcke9_3_St_4_MBSBM =
      document.getElementById('positionEcke9').value;

    const wanddickeEckeEnde_3_St_4_MBSBM =
      document.getElementById('wanddickeEckeEnde').value;
    const positionEckeEnde_3_St_4_MBSBM =
      document.getElementById('positionEckeEnde').value;

    const benutzerID_3_St_4_MBSBM = document.getElementById('benutzerID').value;

    const data_3_St_4_MBSBM = {
      artikelNummer_3_St_4_MBSBM,
      artikelName_3_St_4_MBSBM,
      ziehGeschwindigkeit_3_St_4_MBSBM,
      vDornVor_3_St_4_MBSBM,
      vDornZurueck_3_St_4_MBSBM,
      benutzerVorName_3_St_4_MBSBM,
      benutzerNachName_3_St_4_MBSBM,
      benutzerID_3_St_4_MBSBM,
      rohrAussenDurchmesserLetzterZug_3_St_4_MBSBM,
      rohrWandDickeAussenDurchmesserLetzterZug_3_St_4_MBSBM,
      rohrInnenDurchmesserLetzterZugBerechnet_3_St_4_MBSBM,
      rohrAussenDurchmesserTDTZug_3_St_4_MBSBM,
      angel_3_St_4_MBSBM,
      dornDurchmesserErsteStufe_3_St_4_MBSBM,
      dornPositionErsteStufe_3_St_4_MBSBM,
      dornDurchmesserZweiteStufe_3_St_4_MBSBM,
      dornPositionZweiteStufe_3_St_4_MBSBM,
      dornDurchmesserDritteStufe_3_St_4_MBSBM,
      dornPositionDritteStufe_3_St_4_MBSBM,
      fixlaenge_3_St_4_MBSBM,
      ausgleichstueck_3_St_4_MBSBM,
      mehrfachlaenge_3_St_4_MBSBM,
      anzahlFixlaengenProMehrfachlaenge_3_St_4_MBSBM,
      mindestGutanteil_3_St_4_MBSBM,
      profileGekoppelt_3_St_4_MBSBM,
      obereToleranz_3_St_4_MBSBM,
      untereToleranz_3_St_4_MBSBM,

      wanddickeEcke1_3_St_4_MBSBM,
      positionEcke1_3_St_4_MBSBM,
      wanddickeEcke2_3_St_4_MBSBM,
      positionEcke2_3_St_4_MBSBM,

      // wanddickeEcke2Zwischen4_3_St_4_MBSBM,
      // positionEcke2Zwischen4_3_St_4_MBSBM,

      wanddickeEcke3_3_St_4_MBSBM,
      positionEcke3_3_St_4_MBSBM,
      wanddickeEcke4_3_St_4_MBSBM,
      positionEcke4_3_St_4_MBSBM,

      wanddickeEcke5_3_St_4_MBSBM,
      positionEcke5_3_St_4_MBSBM,
      wanddickeEcke6_3_St_4_MBSBM,
      positionEcke6_3_St_4_MBSBM,

      // wanddickeEcke7Zwischen9_3_St_4_MBSBM,
      // positionEcke7Zwischen9_3_St_4_MBSBM,

      wanddickeEcke7_3_St_4_MBSBM,
      positionEcke7_3_St_4_MBSBM,
      wanddickeEcke8_3_St_4_MBSBM,
      positionEcke8_3_St_4_MBSBM,
      wanddickeEcke9_3_St_4_MBSBM,
      positionEcke9_3_St_4_MBSBM,

      wanddickeEckeEnde_3_St_4_MBSBM,
      positionEckeEnde_3_St_4_MBSBM,
    };

    createRecipe3_St_4_MBSBM(data_3_St_4_MBSBM);
  });
}

if (createRecipe2_St_6_BSBSBSB_DataForm) {
  createRecipe2_St_6_BSBSBSB_DataForm.addEventListener('submit', async (e) => {
    console.log('bin createRecipe2_St_6_BSBSBSB_DataForm in index.js');
    e.preventDefault();

    const artikelNummer_2_St_6_BSBSBSB =
      document.getElementById('artikelNummer').value;
    const artikelName_2_St_6_BSBSBSB =
      document.getElementById('artikelName').value;
    const ziehGeschwindigkeit_2_St_6_BSBSBSB = document.getElementById(
      'ziehGeschwindigkeit',
    ).value;

    const vDornVor_2_St_6_BSBSBSB = document.getElementById('vDornVor').value;
    console.log('vDornVor_2_St_6_BSBSBSB:', vDornVor_2_St_6_BSBSBSB);
    const vDornZurueck_2_St_6_BSBSBSB =
      document.getElementById('vDornZurueck').value;
    console.log('vDornZurueck_2_St_6_BSBSBSB:', vDornZurueck_2_St_6_BSBSBSB);

    const benutzerVorName_2_St_6_BSBSBSB =
      document.getElementById('benutzerVorName').value;
    const benutzerNachName_2_St_6_BSBSBSB =
      document.getElementById('benutzerNachName').value;
    const rohrAussenDurchmesserLetzterZug_2_St_6_BSBSBSB =
      document.getElementById('rohrAussenDurchmesserLetzterZug').value;
    const rohrWandDickeAussenDurchmesserLetzterZug_2_St_6_BSBSBSB =
      document.getElementById('rohrWandDickeAussenDurchmesserLetzterZug').value;
    const rohrInnenDurchmesserLetzterZugBerechnet_2_St_6_BSBSBSB =
      document.getElementById('rohrInnenDurchmesserLetzterZugBerechnet').value;
    const rohrAussenDurchmesserTDTZug_2_St_6_BSBSBSB = document.getElementById(
      'rohrAussenDurchmesserTDTZug',
    ).value;
    const angel_2_St_6_BSBSBSB = document.getElementById('angel').value;
    const dornDurchmesserErsteStufe_2_St_6_BSBSBSB = document.getElementById(
      'dornDurchmesserErsteStufe',
    ).value;
    const dornPositionErsteStufe_2_St_6_BSBSBSB = document.getElementById(
      'dornPositionErsteStufe',
    ).value;
    const dornDurchmesserZweiteStufe_2_St_6_BSBSBSB = document.getElementById(
      'dornDurchmesserZweiteStufe',
    ).value;
    const dornPositionZweiteStufe_2_St_6_BSBSBSB = document.getElementById(
      'dornPositionZweiteStufe',
    ).value;
    const fixlaenge_2_St_6_BSBSBSB = document.getElementById('fixlaenge').value;
    const ausgleichstueck_2_St_6_BSBSBSB =
      document.getElementById('ausgleichstueck').value;
    const mehrfachlaenge_2_St_6_BSBSBSB =
      document.getElementById('mehrfachlaenge').value;
    const anzahlFixlaengenProMehrfachlaenge_2_St_6_BSBSBSB =
      document.getElementById('anzahlFixlaengenProMehrfachlaenge').value;
    const mindestGutanteil_2_St_6_BSBSBSB =
      document.getElementById('mindestGutanteil').value;
    const profileGekoppelt_2_St_6_BSBSBSB =
      document.getElementById('profileGekoppelt').value;
    const obereToleranz_2_St_6_BSBSBSB =
      document.getElementById('obereToleranz').value;
    const untereToleranz_2_St_6_BSBSBSB =
      document.getElementById('untereToleranz').value;

    const wanddickeEcke1_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke1').value;
    const positionEcke1_2_St_6_BSBSBSB =
      document.getElementById('positionEcke1').value;
    const wanddickeEcke2_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke2').value;
    const positionEcke2_2_St_6_BSBSBSB =
      document.getElementById('positionEcke2').value;
    const wanddickeEcke3_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke3').value;
    const positionEcke3_2_St_6_BSBSBSB =
      document.getElementById('positionEcke3').value;
    const wanddickeEcke4_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke4').value;
    const positionEcke4_2_St_6_BSBSBSB =
      document.getElementById('positionEcke4').value;

    // const wanddickeEcke4Zwischen6_2_St_6_BSBSBSB = document.getElementById(
    //   'wanddickeEcke4Zwischen6',
    // ).value;
    // const positionEcke4Zwischen6_2_St_6_BSBSBSB = document.getElementById(
    //   'positionEcke4Zwischen6',
    // ).value;

    const wanddickeEcke5_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke5').value;
    const positionEcke5_2_St_6_BSBSBSB =
      document.getElementById('positionEcke5').value;
    const wanddickeEcke6_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke6').value;
    const positionEcke6_2_St_6_BSBSBSB =
      document.getElementById('positionEcke6').value;
    const wanddickeEcke7_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke7').value;
    const positionEcke7_2_St_6_BSBSBSB =
      document.getElementById('positionEcke7').value;
    const wanddickeEcke8_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke8').value;
    const positionEcke8_2_St_6_BSBSBSB =
      document.getElementById('positionEcke8').value;

    // const wanddickeEcke9Zwischen11_2_St_6_BSBSBSB = document.getElementById(
    //   'wanddickeEcke9Zwischen11',
    // ).value;
    // const positionEcke9Zwischen11_2_St_6_BSBSBSB = document.getElementById(
    //   'positionEcke9Zwischen11',
    // ).value;

    const wanddickeEcke9_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke9').value;
    const positionEcke9_2_St_6_BSBSBSB =
      document.getElementById('positionEcke9').value;
    const wanddickeEcke10_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke10').value;
    const positionEcke10_2_St_6_BSBSBSB =
      document.getElementById('positionEcke10').value;
    const wanddickeEcke11_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke11').value;
    const positionEcke11_2_St_6_BSBSBSB =
      document.getElementById('positionEcke11').value;
    const wanddickeEcke12_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke12').value;
    const positionEcke12_2_St_6_BSBSBSB =
      document.getElementById('positionEcke12').value;

    // const wanddickeEcke14Zwischen16_2_St_6_BSBSBSB = document.getElementById(
    //   'wanddickeEcke14Zwischen16',
    // ).value;
    // const positionEcke14Zwischen16_2_St_6_BSBSBSB = document.getElementById(
    //   'positionEcke14Zwischen16',
    // ).value;

    const wanddickeEcke13_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEcke13').value;
    const positionEcke13_2_St_6_BSBSBSB =
      document.getElementById('positionEcke13').value;

    const wanddickeEckeEnde_2_St_6_BSBSBSB =
      document.getElementById('wanddickeEckeEnde').value;
    const positionEckeEnde_2_St_6_BSBSBSB =
      document.getElementById('positionEckeEnde').value;

    const benutzerID_2_St_6_BSBSBSB =
      document.getElementById('benutzerID').value;

    const data_2_St_6_BSBSBSB = {
      artikelNummer_2_St_6_BSBSBSB,
      artikelName_2_St_6_BSBSBSB,
      ziehGeschwindigkeit_2_St_6_BSBSBSB,
      vDornVor_2_St_6_BSBSBSB,
      vDornZurueck_2_St_6_BSBSBSB,
      benutzerVorName_2_St_6_BSBSBSB,
      benutzerNachName_2_St_6_BSBSBSB,
      benutzerID_2_St_6_BSBSBSB,
      rohrAussenDurchmesserLetzterZug_2_St_6_BSBSBSB,
      rohrWandDickeAussenDurchmesserLetzterZug_2_St_6_BSBSBSB,
      rohrInnenDurchmesserLetzterZugBerechnet_2_St_6_BSBSBSB,
      rohrAussenDurchmesserTDTZug_2_St_6_BSBSBSB,
      angel_2_St_6_BSBSBSB,
      dornDurchmesserErsteStufe_2_St_6_BSBSBSB,
      dornPositionErsteStufe_2_St_6_BSBSBSB,
      dornDurchmesserZweiteStufe_2_St_6_BSBSBSB,
      dornPositionZweiteStufe_2_St_6_BSBSBSB,
      fixlaenge_2_St_6_BSBSBSB,
      ausgleichstueck_2_St_6_BSBSBSB,
      mehrfachlaenge_2_St_6_BSBSBSB,
      anzahlFixlaengenProMehrfachlaenge_2_St_6_BSBSBSB,
      mindestGutanteil_2_St_6_BSBSBSB,
      profileGekoppelt_2_St_6_BSBSBSB,
      obereToleranz_2_St_6_BSBSBSB,
      untereToleranz_2_St_6_BSBSBSB,

      wanddickeEcke1_2_St_6_BSBSBSB,
      positionEcke1_2_St_6_BSBSBSB,
      wanddickeEcke2_2_St_6_BSBSBSB,
      positionEcke2_2_St_6_BSBSBSB,
      wanddickeEcke3_2_St_6_BSBSBSB,
      positionEcke3_2_St_6_BSBSBSB,
      wanddickeEcke4_2_St_6_BSBSBSB,
      positionEcke4_2_St_6_BSBSBSB,
      // wanddickeEcke4Zwischen6_2_St_6_BSBSBSB,
      // positionEcke4Zwischen6_2_St_6_BSBSBSB,
      wanddickeEcke5_2_St_6_BSBSBSB,
      positionEcke5_2_St_6_BSBSBSB,
      wanddickeEcke6_2_St_6_BSBSBSB,
      positionEcke6_2_St_6_BSBSBSB,
      wanddickeEcke7_2_St_6_BSBSBSB,
      positionEcke7_2_St_6_BSBSBSB,
      wanddickeEcke8_2_St_6_BSBSBSB,
      positionEcke8_2_St_6_BSBSBSB,
      // wanddickeEcke9Zwischen11_2_St_6_BSBSBSB,
      // positionEcke9Zwischen11_2_St_6_BSBSBSB,
      wanddickeEcke9_2_St_6_BSBSBSB,
      positionEcke9_2_St_6_BSBSBSB,
      wanddickeEcke10_2_St_6_BSBSBSB,
      positionEcke10_2_St_6_BSBSBSB,
      wanddickeEcke11_2_St_6_BSBSBSB,
      positionEcke11_2_St_6_BSBSBSB,
      wanddickeEcke12_2_St_6_BSBSBSB,
      positionEcke12_2_St_6_BSBSBSB,
      // wanddickeEcke14Zwischen16_2_St_6_BSBSBSB,
      // positionEcke14Zwischen16_2_St_6_BSBSBSB,
      wanddickeEcke13_2_St_6_BSBSBSB,
      positionEcke13_2_St_6_BSBSBSB,
      wanddickeEckeEnde_2_St_6_BSBSBSB,
      positionEckeEnde_2_St_6_BSBSBSB,
    };

    createRecipe2_St_6_BSBSBSB(data_2_St_6_BSBSBSB);
  });
}

if (createRecipe2_St_4_SBSBS_DataForm) {
  createRecipe2_St_4_SBSBS_DataForm.addEventListener('submit', async (e) => {
    console.log('bin createRecipe2_St_4_SBSBS_DataForm in index.js');
    e.preventDefault();
    const artikelNummer_2_St_4_SBSBS =
      document.getElementById('artikelNummer').value;
    const artikelName_2_St_4_SBSBS =
      document.getElementById('artikelName').value;
    const ziehGeschwindigkeit_2_St_4_SBSBS = document.getElementById(
      'ziehGeschwindigkeit',
    ).value;

    const vDornVor_2_St_4_SBSBS = document.getElementById('vDornVor').value;
    const vDornZurueck_2_St_4_SBSBS =
      document.getElementById('vDornZurueck').value;
    console.log('vDornVor_2_St_4_SBSBS:', vDornVor_2_St_4_SBSBS);
    console.log('vDornZurueck_2_St_4_SBSBS:', vDornZurueck_2_St_4_SBSBS);

    const benutzerVorName_2_St_4_SBSBS =
      document.getElementById('benutzerVorName').value;
    const benutzerNachName_2_St_4_SBSBS =
      document.getElementById('benutzerNachName').value;
    const rohrAussenDurchmesserLetzterZug_2_St_4_SBSBS =
      document.getElementById('rohrAussenDurchmesserLetzterZug').value;
    const rohrWandDickeAussenDurchmesserLetzterZug_2_St_4_SBSBS =
      document.getElementById('rohrWandDickeAussenDurchmesserLetzterZug').value;
    const rohrInnenDurchmesserLetzterZugBerechnet_2_St_4_SBSBS =
      document.getElementById('rohrInnenDurchmesserLetzterZugBerechnet').value;
    const rohrAussenDurchmesserTDTZug_2_St_4_SBSBS = document.getElementById(
      'rohrAussenDurchmesserTDTZug',
    ).value;
    const angel_2_St_4_SBSBS = document.getElementById('angel').value;
    const dornDurchmesserErsteStufe_2_St_4_SBSBS = document.getElementById(
      'dornDurchmesserErsteStufe',
    ).value;
    const dornPositionErsteStufe_2_St_4_SBSBS = document.getElementById(
      'dornPositionErsteStufe',
    ).value;
    const dornDurchmesserZweiteStufe_2_St_4_SBSBS = document.getElementById(
      'dornDurchmesserZweiteStufe',
    ).value;
    const dornPositionZweiteStufe_2_St_4_SBSBS = document.getElementById(
      'dornPositionZweiteStufe',
    ).value;
    const fixlaenge_2_St_4_SBSBS = document.getElementById('fixlaenge').value;
    const ausgleichstueck_2_St_4_SBSBS =
      document.getElementById('ausgleichstueck').value;
    const mehrfachlaenge_2_St_4_SBSBS =
      document.getElementById('mehrfachlaenge').value;
    const anzahlFixlaengenProMehrfachlaenge_2_St_4_SBSBS =
      document.getElementById('anzahlFixlaengenProMehrfachlaenge').value;
    const mindestGutanteil_2_St_4_SBSBS =
      document.getElementById('mindestGutanteil').value;
    const profileGekoppelt_2_St_4_SBSBS =
      document.getElementById('profileGekoppelt').value;
    const obereToleranz_2_St_4_SBSBS =
      document.getElementById('obereToleranz').value;
    const untereToleranz_2_St_4_SBSBS =
      document.getElementById('untereToleranz').value;

    const wanddickeEcke1_2_St_4_SBSBS =
      document.getElementById('wanddickeEcke1').value;
    const positionEcke1_2_St_4_SBSBS =
      document.getElementById('positionEcke1').value;
    const wanddickeEcke2_2_St_4_SBSBS =
      document.getElementById('wanddickeEcke2').value;
    const positionEcke2_2_St_4_SBSBS =
      document.getElementById('positionEcke2').value;

    // const wanddickeEcke2Zwischen4_2_St_4_SBSBS = document.getElementById(
    //   'wanddickeEcke2Zwischen4',
    // ).value;
    // const positionEcke2Zwischen4_2_St_4_SBSBS = document.getElementById(
    //   'positionEcke2Zwischen4',
    // ).value;

    const wanddickeEcke3_2_St_4_SBSBS =
      document.getElementById('wanddickeEcke3').value;
    const positionEcke3_2_St_4_SBSBS =
      document.getElementById('positionEcke3').value;
    const wanddickeEcke4_2_St_4_SBSBS =
      document.getElementById('wanddickeEcke4').value;
    const positionEcke4_2_St_4_SBSBS =
      document.getElementById('positionEcke4').value;
    const wanddickeEcke5_2_St_4_SBSBS =
      document.getElementById('wanddickeEcke5').value;
    const positionEcke5_2_St_4_SBSBS =
      document.getElementById('positionEcke5').value;
    const wanddickeEcke6_2_St_4_SBSBS =
      document.getElementById('wanddickeEcke6').value;
    const positionEcke6_2_St_4_SBSBS =
      document.getElementById('positionEcke6').value;

    // const wanddickeEcke7Zwischen9_2_St_4_SBSBS = document.getElementById(
    //   'wanddickeEcke7Zwischen9',
    // ).value;
    // const positionEcke7Zwischen9_2_St_4_SBSBS = document.getElementById(
    //   'positionEcke7Zwischen9',
    // ).value;

    const wanddickeEcke7_2_St_4_SBSBS =
      document.getElementById('wanddickeEcke7').value;
    const positionEcke7_2_St_4_SBSBS =
      document.getElementById('positionEcke7').value;
    const wanddickeEcke8_2_St_4_SBSBS =
      document.getElementById('wanddickeEcke8').value;
    const positionEcke8_2_St_4_SBSBS =
      document.getElementById('positionEcke8').value;
    const wanddickeEcke9_2_St_4_SBSBS =
      document.getElementById('wanddickeEcke9').value;
    const positionEcke9_2_St_4_SBSBS =
      document.getElementById('positionEcke9').value;

    const wanddickeEckeEnde_2_St_4_SBSBS =
      document.getElementById('wanddickeEckeEnde').value;
    const positionEckeEnde_2_St_4_SBSBS =
      document.getElementById('positionEckeEnde').value;

    const benutzerID_2_St_4_SBSBS = document.getElementById('benutzerID').value;

    const data_2_St_4_SBSBS = {
      artikelNummer_2_St_4_SBSBS,
      artikelName_2_St_4_SBSBS,
      ziehGeschwindigkeit_2_St_4_SBSBS,
      vDornVor_2_St_4_SBSBS,
      vDornZurueck_2_St_4_SBSBS,
      benutzerVorName_2_St_4_SBSBS,
      benutzerNachName_2_St_4_SBSBS,
      benutzerID_2_St_4_SBSBS,
      rohrAussenDurchmesserLetzterZug_2_St_4_SBSBS,
      rohrWandDickeAussenDurchmesserLetzterZug_2_St_4_SBSBS,
      rohrInnenDurchmesserLetzterZugBerechnet_2_St_4_SBSBS,
      rohrAussenDurchmesserTDTZug_2_St_4_SBSBS,
      angel_2_St_4_SBSBS,
      dornDurchmesserErsteStufe_2_St_4_SBSBS,
      dornPositionErsteStufe_2_St_4_SBSBS,
      dornDurchmesserZweiteStufe_2_St_4_SBSBS,
      dornPositionZweiteStufe_2_St_4_SBSBS,
      fixlaenge_2_St_4_SBSBS,
      ausgleichstueck_2_St_4_SBSBS,
      mehrfachlaenge_2_St_4_SBSBS,
      anzahlFixlaengenProMehrfachlaenge_2_St_4_SBSBS,
      mindestGutanteil_2_St_4_SBSBS,
      profileGekoppelt_2_St_4_SBSBS,
      obereToleranz_2_St_4_SBSBS,
      untereToleranz_2_St_4_SBSBS,

      wanddickeEcke1_2_St_4_SBSBS,
      positionEcke1_2_St_4_SBSBS,
      wanddickeEcke2_2_St_4_SBSBS,
      positionEcke2_2_St_4_SBSBS,
      // wanddickeEcke2Zwischen4_2_St_4_SBSBS,
      // positionEcke2Zwischen4_2_St_4_SBSBS,
      wanddickeEcke3_2_St_4_SBSBS,
      positionEcke3_2_St_4_SBSBS,
      wanddickeEcke4_2_St_4_SBSBS,
      positionEcke4_2_St_4_SBSBS,
      wanddickeEcke5_2_St_4_SBSBS,
      positionEcke5_2_St_4_SBSBS,
      wanddickeEcke6_2_St_4_SBSBS,
      positionEcke6_2_St_4_SBSBS,
      // wanddickeEcke7Zwischen9_2_St_4_SBSBS,
      // positionEcke7Zwischen9_2_St_4_SBSBS,
      wanddickeEcke7_2_St_4_SBSBS,
      positionEcke7_2_St_4_SBSBS,
      wanddickeEcke8_2_St_4_SBSBS,
      positionEcke8_2_St_4_SBSBS,
      wanddickeEcke9_2_St_4_SBSBS,
      positionEcke9_2_St_4_SBSBS,

      wanddickeEckeEnde_2_St_4_SBSBS,
      positionEckeEnde_2_St_4_SBSBS,
    };

    createRecipe2_St_4_SBSBS(data_2_St_4_SBSBS);
  });
}

if (createRecipe2_St_2_BSB_DataForm) {
  createRecipe2_St_2_BSB_DataForm.addEventListener('submit', async (e) => {
    console.log('bin createRecipe2_St_2_BSB_DataForm in index.js');
    e.preventDefault();

    const artikelNummer_2_St_2_BSB =
      document.getElementById('artikelNummer').value;
    const artikelName_2_St_2_BSB = document.getElementById('artikelName').value;

    const vDornVor_2_St_2_BSB = document.getElementById('vDornVor').value;
    const vDornZurueck_2_St_2_BSB =
      document.getElementById('vDornZurueck').value;
    console.log('vDornVor_2_St_2_BSB:', vDornVor_2_St_2_BSB);
    console.log('vDornZurueck_2_St_2_BSB:', vDornZurueck_2_St_2_BSB);

    const ziehGeschwindigkeit_2_St_2_BSB = document.getElementById(
      'ziehGeschwindigkeit',
    ).value;
    const benutzerVorName_2_St_2_BSB =
      document.getElementById('benutzerVorName').value;
    const benutzerNachName_2_St_2_BSB =
      document.getElementById('benutzerNachName').value;
    const rohrAussenDurchmesserLetzterZug_2_St_2_BSB = document.getElementById(
      'rohrAussenDurchmesserLetzterZug',
    ).value;
    const rohrWandDickeAussenDurchmesserLetzterZug_2_St_2_BSB =
      document.getElementById('rohrWandDickeAussenDurchmesserLetzterZug').value;
    const rohrInnenDurchmesserLetzterZugBerechnet_2_St_2_BSB =
      document.getElementById('rohrInnenDurchmesserLetzterZugBerechnet').value;
    const rohrAussenDurchmesserTDTZug_2_St_2_BSB = document.getElementById(
      'rohrAussenDurchmesserTDTZug',
    ).value;
    const angel_2_St_2_BSB = document.getElementById('angel').value;
    const dornDurchmesserErsteStufe_2_St_2_BSB = document.getElementById(
      'dornDurchmesserErsteStufe',
    ).value;
    const dornPositionErsteStufe_2_St_2_BSB = document.getElementById(
      'dornPositionErsteStufe',
    ).value;
    const dornDurchmesserZweiteStufe_2_St_2_BSB = document.getElementById(
      'dornDurchmesserZweiteStufe',
    ).value;
    const dornPositionZweiteStufe_2_St_2_BSB = document.getElementById(
      'dornPositionZweiteStufe',
    ).value;
    const fixlaenge_2_St_2_BSB = document.getElementById('fixlaenge').value;
    const ausgleichstueck_2_St_2_BSB =
      document.getElementById('ausgleichstueck').value;
    const mehrfachlaenge_2_St_2_BSB =
      document.getElementById('mehrfachlaenge').value;
    const anzahlFixlaengenProMehrfachlaenge_2_St_2_BSB =
      document.getElementById('anzahlFixlaengenProMehrfachlaenge').value;
    const mindestGutanteil_2_St_2_BSB =
      document.getElementById('mindestGutanteil').value;
    const profileGekoppelt_2_St_2_BSB =
      document.getElementById('profileGekoppelt').value;
    const obereToleranz_2_St_2_BSB =
      document.getElementById('obereToleranz').value;
    const untereToleranz_2_St_2_BSB =
      document.getElementById('untereToleranz').value;
    const wanddickeEcke0_2_St_2_BSB =
      document.getElementById('wanddickeEcke0').value;
    const positionEcke0_2_St_2_BSB =
      document.getElementById('positionEcke0').value;
    const wanddickeEcke1_2_St_2_BSB =
      document.getElementById('wanddickeEcke1').value;
    const positionEcke1_2_St_2_BSB =
      document.getElementById('positionEcke1').value;
    const wanddickeEcke2_2_St_2_BSB =
      document.getElementById('wanddickeEcke2').value;
    const positionEcke2_2_St_2_BSB =
      document.getElementById('positionEcke2').value;
    const wanddickeEcke3_2_St_2_BSB =
      document.getElementById('wanddickeEcke3').value;
    const positionEcke3_2_St_2_BSB =
      document.getElementById('positionEcke3').value;
    // const wanddickeEcke3Zwischen4_2_St_2_BSB = document.getElementById(
    //   'wanddickeEcke3Zwischen4',
    // ).value;
    // const positionEcke3Zwischen4_2_St_2_BSB = document.getElementById(
    //   'positionEcke3Zwischen4',
    // ).value;
    const wanddickeEcke4_2_St_2_BSB =
      document.getElementById('wanddickeEcke4').value;
    const positionEcke4_2_St_2_BSB =
      document.getElementById('positionEcke4').value;
    const wanddickeEckeEnde_2_St_2_BSB =
      document.getElementById('wanddickeEckeEnde').value;
    const positionEckeEnde_2_St_2_BSB =
      document.getElementById('positionEckeEnde').value;

    const benutzerID_2_St_2_BSB = document.getElementById('benutzerID').value;

    // console.log('artikelNummer: ' + artikelNummer);
    // console.log('artikelName: ' + artikelName);

    const data_2_St_2_BSB = {
      artikelNummer_2_St_2_BSB,
      artikelName_2_St_2_BSB,
      ziehGeschwindigkeit_2_St_2_BSB,
      vDornVor_2_St_2_BSB,
      vDornZurueck_2_St_2_BSB,
      benutzerVorName_2_St_2_BSB,
      benutzerNachName_2_St_2_BSB,
      benutzerID_2_St_2_BSB,
      rohrAussenDurchmesserLetzterZug_2_St_2_BSB,
      rohrWandDickeAussenDurchmesserLetzterZug_2_St_2_BSB,
      rohrInnenDurchmesserLetzterZugBerechnet_2_St_2_BSB,
      rohrAussenDurchmesserTDTZug_2_St_2_BSB,
      angel_2_St_2_BSB,
      dornDurchmesserErsteStufe_2_St_2_BSB,
      dornPositionErsteStufe_2_St_2_BSB,
      dornDurchmesserZweiteStufe_2_St_2_BSB,
      dornPositionZweiteStufe_2_St_2_BSB,
      fixlaenge_2_St_2_BSB,
      ausgleichstueck_2_St_2_BSB,
      mehrfachlaenge_2_St_2_BSB,
      anzahlFixlaengenProMehrfachlaenge_2_St_2_BSB,
      mindestGutanteil_2_St_2_BSB,
      profileGekoppelt_2_St_2_BSB,
      obereToleranz_2_St_2_BSB,
      untereToleranz_2_St_2_BSB,
      wanddickeEcke0_2_St_2_BSB,
      positionEcke0_2_St_2_BSB,
      wanddickeEcke1_2_St_2_BSB,
      positionEcke1_2_St_2_BSB,
      wanddickeEcke2_2_St_2_BSB,
      positionEcke2_2_St_2_BSB,
      wanddickeEcke3_2_St_2_BSB,
      positionEcke3_2_St_2_BSB,
      // wanddickeEcke3Zwischen4_2_St_2_BSB,
      // positionEcke3Zwischen4_2_St_2_BSB,
      wanddickeEcke4_2_St_2_BSB,
      positionEcke4_2_St_2_BSB,
      wanddickeEckeEnde_2_St_2_BSB,
      positionEckeEnde_2_St_2_BSB,
    };

    createRecipe2_St_2_BSB(data_2_St_2_BSB);
  });
}

const saveUpdateRecipeButton = document.querySelector('.btn--saveUpdateRecipe');
const deleteRecipeButton = document.querySelector('.btn--deleteRecipe');

if (updateRecipeDataForm) {
  console.log('bin updateRecipeDataForm ---1---');
  updateRecipeDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(
      'bin updateRecipeDataForm ---2------------------------*****---****---',
    );

    const recipeID = document.getElementById('recipeID').value;
    console.log('RecipeID: ' + recipeID);

    const userID = document.getElementById('userID').value;
    console.log('userID: ' + userID);
    //TODO: userNewDate braucht es das?? wegen neuer Uhrzeit und Datum? wo wird dies gemacht? im Model bei update?
    const userNewDate = document.getElementById('userNewDate').value;
    console.log('userNewDate: ' + userNewDate);

    const artikelNummerUpdate = parseFloat(
      document.getElementById('artikelNummer').value,
    );
    console.log('artikelNummerUpdate: ' + artikelNummerUpdate);

    //TODO: Name muss sich mehrfachlänge und anzahl fixlänge verändern!!
    const artikelNameOLDtoChangeForUpdate =
      document.getElementById('artikelName').value;
    console.log(
      'artikelNameOLDtoChangeForUpdate: ' + artikelNameOLDtoChangeForUpdate,
    );
    let artikelNameSplit = artikelNameOLDtoChangeForUpdate.split(' ');
    let artikelNameUpdateOLD = artikelNameSplit[0];
    console.log('artikelNameUpdateOLD: ' + artikelNameUpdateOLD);

    const ziehGeschwindigkeitUpdate = document.getElementById(
      'ziehGeschwindigkeit',
    ).value;
    console.log('ziehGeschwindigkeitUpdate: ' + ziehGeschwindigkeitUpdate);

    const commentDropdown = document.getElementById('commentDropdown').value;
    console.log('commentDropdown: ' + commentDropdown);

    const customCommentInput =
      document.getElementById('customCommentInput').value;
    console.log('customCommentInput: ' + customCommentInput);

    let commentUpdate = '';
    if (commentDropdown === 'custom') {
      commentUpdate = customCommentInput;
    } else {
      commentUpdate = commentDropdown;
    }

    console.log('commentUpdate: ' + commentUpdate);

    const vDornVorUpdate = document.getElementById('vDornVor').value;
    console.log('vDornVorUpdate:', vDornVorUpdate);

    const vDornZurueckUpdate = document.getElementById('vDornZurueck').value;
    console.log('vDornZurueckUpdate:', vDornZurueckUpdate);

    const teileNummerUpdate = document.getElementById('teileNummer').value;
    console.log('teileNummerUpdate: ' + teileNummerUpdate);
    // const teileNummerElement = document.getElementById('teileNummer');
    // if (teileNummerElement) {
    //     const teileNummerUpdate = teileNummerElement.value;
    //     console.log('Teilenummer aktualisieren: ' + teileNummerUpdate);
    // } else {
    //     console.log('Teilenummer nicht verfügbar.');

    // }

    const zeichnungsNummerUpdate =
      document.getElementById('zeichnungsNummer').value;
    console.log('zeichnungsNummerUpdate: ' + zeichnungsNummerUpdate);

    const aenderungsstandZeichnungUpdate = parseFloat(
      document.getElementById('aenderungsstandZeichnung').value,
    );
    console.log(
      'aenderungsstandZeichnungUpdate: ' + aenderungsstandZeichnungUpdate,
    );

    const aenderungsstandRezeptUpdate = parseFloat(
      document.getElementById('aenderungsstandRezept').value,
    );
    console.log('aenderungsstandRezeptUpdate: ' + aenderungsstandRezeptUpdate);

    const beschreibungUpdate = document.getElementById('beschreibung').value;
    console.log('beschreibungUpdate: ' + beschreibungUpdate);

    const mindestGutanteilUpdate = parseFloat(
      document.getElementById('mindestGutanteil').value,
    );
    console.log('mindestGutanteilUpdate: ' + mindestGutanteilUpdate);

    const profileGekoppeltUpdate = parseFloat(
      document.getElementById('profileGekoppelt').value,
    );
    console.log('profileGekoppeltUpdate: ' + profileGekoppeltUpdate);

    const rohrAussenDurchmesserLetzterZugUpdate = parseFloat(
      document.getElementById('rohrAussenDurchmesserLetzterZug').value,
    );
    console.log(
      'rohrAussenDurchmesserLetzterZugUpdate: ' +
        rohrAussenDurchmesserLetzterZugUpdate,
    );

    const rohrInnenDurchmesserLetzterZugUpdate = parseFloat(
      document.getElementById('rohrInnenDurchmesserLetzterZug').value,
    );
    console.log(
      'rohrInnenDurchmesserLetzterZugUpdate: ' +
        rohrInnenDurchmesserLetzterZugUpdate,
    );

    const angelUpdate = parseFloat(document.getElementById('angel').value);
    console.log('angelUpdate: ' + angelUpdate);

    const rohrAussenDurchmesserTDTZugUpdate = parseFloat(
      document.getElementById('rohrAussenDurchmesserTDTZug').value,
    );
    console.log(
      'rohrAussenDurchmesserTDTZugUpdate: ' + rohrAussenDurchmesserTDTZugUpdate,
    );

    const dornStufenContainer = document.querySelectorAll(
      '.dornStufen-Container',
    );
    const dornStufenDataUpdate = [];

    dornStufenContainer.forEach((container) => {
      console.log('container: ' + container);
      const stufeID = container.querySelector('.stufeID').value;
      const dornDurchmesser = container.querySelector('.dornDurchmesser').value;
      const position = container.querySelector('.position').value;
      const rampeRein = container.querySelector('.rampeRein').value;
      const rampeRaus = container.querySelector('.rampeRaus').value;
      const dehnung = container.querySelector('.dehnung').value;

      const stufeData = {
        id: stufeID,
        dornDurchmesser: parseFloat(dornDurchmesser),
        position: parseFloat(position),
        rampeRein: parseFloat(rampeRein),
        rampeRaus: parseFloat(rampeRaus),
        dehnung: parseFloat(dehnung),
      };
      console.log('stufeData: ' + stufeData);

      dornStufenDataUpdate.push(stufeData);
      console.log('dornStufenData in F: ' + dornStufenDataUpdate);
    });

    console.log(
      'JSON.stringify(dornStufenData): ' + JSON.stringify(dornStufenDataUpdate),
    );

    dornStufenDataUpdate.forEach((stufe) => {
      console.log('Stufe: ' + stufe);
      console.log('JSON.stringify(stufe): ' + JSON.stringify(stufe));
    });

    const fixlaengeUpdate = parseFloat(
      document.getElementById('fixlaenge').value,
    );
    console.log('fixlaengeUpdate: ' + fixlaengeUpdate);
    const ausgleichstueckUpdate = parseFloat(
      document.getElementById('ausgleichstueck').value,
    );
    console.log('ausgleichstueckUpdate: ' + ausgleichstueckUpdate);
    const mehrfachlaengeUpdate = parseFloat(
      document.getElementById('mehrfachlaenge').value,
    );
    console.log('mehrfachlaengeUpdate: ' + mehrfachlaengeUpdate);
    const anzahlFixlaengenProMehrfachlaengeUpdate = parseFloat(
      document.getElementById('anzahlFixlaengenProMehrfachlaenge').value,
    );
    console.log(
      'anzahlFixlaengenProMehrfachlaengeUpdate: ' +
        anzahlFixlaengenProMehrfachlaengeUpdate,
    );
    const negativeToleranzMehrfachlaengeUpdate = parseFloat(
      document.getElementById('negativeToleranzMehrfachlaenge').value,
    );
    console.log(
      'negativeToleranzMehrfachlaengeUpdate: ' +
        negativeToleranzMehrfachlaengeUpdate,
    );
    const positiveToleranzMehrfachlaengeUpdate = parseFloat(
      document.getElementById('positiveToleranzMehrfachlaenge').value,
    );
    console.log(
      'positiveToleranzMehrfachlaengeUpdate: ' +
        positiveToleranzMehrfachlaengeUpdate,
    );
    const mindestanzahlGutprofileUpdate = parseFloat(
      document.getElementById('mindestanzahlGutprofile').value,
    );
    console.log(
      'mindestanzahlGutprofileUpdate: ' + mindestanzahlGutprofileUpdate,
    );

    const obereToleranzUpdate = parseFloat(
      document.getElementById('obereToleranz').value,
    );
    console.log('obereToleranzUpdate: ' + obereToleranzUpdate);
    const untereToleranzUpdate = parseFloat(
      document.getElementById('untereToleranz').value,
    );
    console.log('untereToleranzUpdate: ' + untereToleranzUpdate);

    // const stufeIDs = document.querySelectorAll('.stufeID');
    // console.log('stufeIDs: ' + stufeIDs);

    // const dornDurchmesserInputs = document.querySelectorAll('.dornDurchmesser');
    // console.log('dornDurchmesserInputs: ' + dornDurchmesserInputs);

    // const dornPositionInputs = document.querySelectorAll('.position');
    // console.log('dornPositionInputs: ' + dornPositionInputs);

    // for (let i = 0; i < dornDurchmesserInputs.length; i++) {
    //   //const currentDornDurchmesser = parseFloat(dornDurchmesserInputs[i].value);
    //   console.log(
    //     'dornDurchmesserInputs[i].value: ' + dornDurchmesserInputs[i].value,
    //   );
    // }

    // const stufeArr = {
    //   id: stufeID,
    //   dornDurchmesser: dornDurchmesserInputs,
    //   position: dornPositionInputs,
    //   rampeRein: rampeReinUpdate,
    //   rampeRaus: rampeRausUpdate,
    //   dehnung: dehnungUpdate,
    // };
    //---------------------------------------------------------------
    const eckenInputs = document.querySelectorAll('.eckeInputs');
    const eckenDataUpdate = [];

    eckenInputs.forEach((eckeInput, index) => {
      const eckeID = eckeInput.querySelector('.eckeID').value;
      console.log('Ecke ID ' + index + ': ' + eckeID);

      const eckeXPosition = eckeInput.querySelector('.eckeXPosition').value;
      console.log('Ecke X-Position ' + index + ': ' + eckeXPosition);

      const eckeZWanddicke = eckeInput.querySelector('.eckeZWanddicke').value;
      console.log('Ecke Wanddicke ' + index + ': ' + eckeZWanddicke);

      const eckeData = {
        id: eckeID,
        x: parseFloat(eckeXPosition),
        z: parseFloat(eckeZWanddicke),
      };

      eckenDataUpdate.push(eckeData);
    });

    console.log(
      'JSON.stringify(eckenDataUpdate): ' + JSON.stringify(eckenDataUpdate),
    );

    eckenDataUpdate.forEach((ecke) => {
      console.log('ecke: ' + ecke);
      console.log('JSON.stringify(ecke): ' + JSON.stringify(ecke));
    });
    //--------------------------------

    // const id = document.getElementById('userId').value;
    // const employeeNumber = document.getElementById('employeeNumber').value;
    // const firstName = document.getElementById('firstname').value;
    // const lastName = document.getElementById('lastname').value;
    // const birthDate = document.getElementById('birthDate').value;
    // const gender = document.querySelector('#gender').value;
    // const language = document.querySelector('#language').value;
    // const professional = document.querySelector('#professional').value;
    // const email = document.getElementById('email').value;
    // const role = document.querySelector('#role').value;
    // const departmentString = document.querySelector('#department').value;

    // console.log(id);
    // console.log(employeeNumber);
    // console.log(firstName);
    // console.log(lastName);
    // console.log(birthDate);
    // console.log(gender);
    // console.log(language);
    // console.log(professional);
    // console.log(email);
    // console.log(role);

    // console.log(departmentString);
    // //TODO: CHeck if Array or only String
    // const departmentsArray = departmentString.split(',');

    // console.log(departmentsArray);
    // const department = departmentsArray;
    if (e.submitter === saveUpdateRecipeButton) {
      console.log('bin SAVE in updateRecipeDataForm');
      updateRecipe(
        {
          artikelNummerUpdate,
          artikelNameUpdateOLD,
          ziehGeschwindigkeitUpdate,
          commentUpdate,
          userID,
          vDornVorUpdate,
          vDornZurueckUpdate,
          teileNummerUpdate,
          zeichnungsNummerUpdate,
          aenderungsstandZeichnungUpdate,
          aenderungsstandRezeptUpdate,
          beschreibungUpdate,
          mindestGutanteilUpdate,
          profileGekoppeltUpdate,
          rohrAussenDurchmesserLetzterZugUpdate,
          rohrInnenDurchmesserLetzterZugUpdate,
          angelUpdate,
          rohrAussenDurchmesserTDTZugUpdate,
          dornStufenDataUpdate,
          fixlaengeUpdate,
          ausgleichstueckUpdate,
          mehrfachlaengeUpdate,
          anzahlFixlaengenProMehrfachlaengeUpdate,
          negativeToleranzMehrfachlaengeUpdate,
          positiveToleranzMehrfachlaengeUpdate,
          mindestanzahlGutprofileUpdate,
          obereToleranzUpdate,
          untereToleranzUpdate,
          eckenDataUpdate,
        },
        recipeID,
      );
    } else if (e.submitter === deleteRecipeButton) {
      console.log('bin Delete in updateRecipeDataForm');
      deleteRecipe(recipeID);
    }
  });
}

if (dragDropForm)
  dragDropForm.addEventListener('submit', (e) => {
    e.preventDefault(); // element prevent from loading the page

    console.log('bin dragDropForm in index.js');

    const inputOldRecipes = document.getElementById('hiddenRecipesField').value;
    console.log('inputOldRecipes: ' + inputOldRecipes);

    console.log('JSON.parse(inputOldRecipes): ' + JSON.parse(inputOldRecipes));
    //login(employeeNumber, password);

    let strTest = 'Helllloooooo';

    convertOldRecipes(inputOldRecipes);
  });

if (recipesTDToverviewTable) {
  console.log('bin If recipesTDToverviewTable');
  showRecipesTDToverviewTable();
}

if (recipesTDToverviewTable_de) {
  console.log('bin If recipesTDToverviewTable_de');
  showRecipesTDToverviewTable_de();
}

if (recipesTDToverviewTable_cs) {
  console.log('bin If recipesTDToverviewTable_cs');
  showRecipesTDToverviewTable_cs();
}

if (recipesTDToverviewTable_de_NotInlogt) {
  console.log('bin If recipesTDToverviewTable_de_NotInlogt');
  showRecipesTDToverviewTable_de_NotInlogt();
}

if (recipesTDToverviewTable_cs_NotInlogt) {
  console.log('bin If recipesTDToverviewTable_cs_NotInlogt');
  showRecipesTDToverviewTable_cs_NotInlogt();
}

if (recipesSendSPSLogTable) {
  console.log('bin If recipesSendSPSLogTable');
  showRecipesSendSPSLogTable();
}
if (recipesSendSPSLogTable_de) {
  console.log('bin If recipesSendSPSLogTable_de');
  showRecipesSendSPSLogTable_de();
}
if (recipesSendSPSLogTable_cs) {
  console.log('bin If recipesSendSPSLogTable_cs');
  showRecipesSendSPSLogTable_cs();
}

if (recipeStatisticTable) {
  console.log('bin If recipeStatisticTable');
  showRecipeStatisticTable();
}
if (recipeStatisticTable_de) {
  console.log('bin If recipeStatisticTable_de');
  showRecipeStatisticTable_de();
}

if (recipeStatisticTable_cs) {
  console.log('bin If recipeStatisticTable_cs');
  showRecipeStatisticTable_cs();
}

if (myRecipeSendTable) {
  console.log('bin If myRecipeSendTable');
  const userID = document.getElementById('userID').value;
  console.log('userID:', userID);
  showMyRecipeSendTable(userID);
}

if (myRecipeSendTable_de) {
  console.log('bin If myRecipeSendTable_de');
  const userID = document.getElementById('userID').value;
  console.log('userID:', userID);
  showMyRecipeSendTable_de(userID);
}

if (myRecipeSendTable_cs) {
  console.log('bin If myRecipeSendTable_cs');
  const userID = document.getElementById('userID').value;
  console.log('userID:', userID);
  showMyRecipeSendTable_cs(userID);
}
