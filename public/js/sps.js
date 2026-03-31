/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts.js';
import process from 'process';

import { setRecipeSendStatus } from './index.js';

const dev_Port = 8555;
const prod_Port = 8557;

const port = process.env.NODE_ENV === 'development' ? dev_Port : prod_Port;
const host = 'http://127.0.0.1:';
const strPathApiV1 = '/api/v1';
const apiUrl = host + port + strPathApiV1;

export const writeRecipeToSPS_noInlogt = async (
  recipeSendDataParse,
  userSendData,
  fa_Nummer,
) => {
  console.log(
    'bin writeRecipeToSPS_noInlogt zum serverschicken und habe bekommen: ' +
      JSON.stringify(recipeSendDataParse),
  );

  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/sps/writeRecipeToSPS`,
      data: {
        recipeData: recipeSendDataParse,
        userSendData: userSendData,
        fa_NummerData: fa_Nummer,
      },
    });

    if (res.data.status === 'success') {
      //console.log('res.data.message:', res.data);
      //showAlert('success', 'Recipe sended successfully to plc');
      showAlert('success', `${res.data.message}`);

      setRecipeSendStatus(
        `${recipeSendDataParse.artikelNummer} → ${recipeSendDataParse.artikelName}`,
        true,
      );
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      // console.log('Executed after 5 seconds');
      // return res;

      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overview`); // über local funktioniert, weil user mit JWT angemeldet bleibt
      }, 3800);
    } else {
      console.log('Recipe not sended to plc!');
      setRecipeSendStatus('Failed to send recipe to PLC', false);
      // return res;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    setRecipeSendStatus('Failed to send recipe to PLC', false);
  }
};

export const writeRecipeToSPS = async (
  recipeSendDataParse,
  userSendData,
  fa_Nummer,
) => {
  console.log(
    'bin writeRecipeToSPS zum serverschicken und habe bekommen: ' +
      JSON.stringify(recipeSendDataParse),
  );

  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/sps/writeRecipeToSPS`,
      data: {
        recipeData: recipeSendDataParse,
        userSendData: userSendData,
        fa_NummerData: fa_Nummer,
      },
    });
    if (res.data.status === 'success') {
      console.log('res.data.message:', res.data.message);
      //showAlert('success', 'Recipe is successfully written to the PLC!');
      showAlert('success', `${res.data.message}`);
      setRecipeSendStatus(
        `${recipeSendDataParse.artikelNummer} → ${recipeSendDataParse.artikelName}`,
        true,
      );
      //await new Promise((resolve) => setTimeout(resolve, 5000));
      //console.log('Executed after 5 seconds');
      //return res;
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`); // über local funktioniert, weil user mit JWT angemeldet bleibt
      }, 3800);
    } else {
      console.log('Recipe not sended to plc!');
      setRecipeSendStatus('Failed to send recipe to PLC', false);
      //return res;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    setRecipeSendStatus('Failed to send recipe to PLC', false);
    throw err;
  }
};
