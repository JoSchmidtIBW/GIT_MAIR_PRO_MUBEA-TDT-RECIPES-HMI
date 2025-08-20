import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import CryptoJS from 'crypto-js';

// let key;
// const key = CryptoJS.enc.Hex.parse('your_static_64_char_hex_key');

// const key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY);
// console.log(
//   'Bin crypto.mjs und process.env.CRYPTOJS_SECRET_KEY: ' +
//     process.env.CRYPTOJS_SECRET_KEY,
// );
// console.log('key: ' + key);

const key = CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY);
// console.log(
//   'Bin crypto.mjs und process.env.CRYPTOJS_SECRET_KEY: ' +
//     process.env.CRYPTOJS_SECRET_KEY,
// );
//console.log('Key in decryptPassword:', key.toString());

export function decryptPassword(encryptedPassword) {
  console.log(
    'bin decryptPassword-Funktion in crypto.mjs und bekomme encryptedPassword: ' +
      encryptedPassword,
  );
  console.log(
    'decryptPassword --> process.env.CRYPTOJS_SECRET_KEY:',
    process.env.CRYPTOJS_SECRET_KEY,
  );

  //key = 1; //CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY);

  console.log('Key in decryptPassword: ' + key);

  // Parse den kombinierten Wert aus Base64
  let combined = CryptoJS.enc.Base64.parse(encryptedPassword);
  console.log('combined: ' + combined);

  // Extrahiere die ersten 16 Bytes für den IV (Initialisierungsvektor)
  let iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
  console.log('iv: ' + iv);
  console.log('iv.toString(): ' + iv.toString());

  // Der restliche Teil ist der verschlüsselte Text (Ciphertext)
  let ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));
  console.log('ciphertext: ' + ciphertext);
  console.log('ciphertext.toString(): ' + ciphertext.toString());

  // Entschlüsseln des Passworts
  let decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  console.log('decrypted: ' + decrypted);
  let decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
  console.log('decrypted.toString(CryptoJS.enc.Utf8): ' + decryptedText);

  return decryptedText; // Gib den entschlüsselten Text zurück
}

export function encryptPassword(password) {
  console.log('bin encryptPassword-Funktion in crypto.mjs');
  console.log(
    'encryptPassword --> process.env.CRYPTOJS_SECRET_KEY:',
    process.env.CRYPTOJS_SECRET_KEY,
  );
  //key = 1; //CryptoJS.SHA256(process.env.CRYPTOJS_SECRET_KEY);

  console.log('Key in encryptPassword: ' + key);

  let iv = CryptoJS.lib.WordArray.random(16); // Zufälligen IV generieren
  console.log('IV beim Verschlüsseln: ' + iv);
  console.log('Original IV Länge: ' + iv.sigBytes); // 16 Bytes sollten es sein

  // Verschlüsseln des Passworts
  let encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  console.log('Verschlüsselter Text: ' + encrypted.ciphertext);
  console.log('Ciphertext Länge: ' + encrypted.ciphertext.sigBytes);

  // Kombiniere IV und verschlüsselten Text in einem WordArray
  let combined = iv.concat(encrypted.ciphertext);

  return combined.toString(CryptoJS.enc.Base64); // In Base64 kodieren und zurückgeben
}

// //entschlüsseln
// export function decryptPassword(encryptedPassword) {
//   //console.log('bin decryptPassword-Funktion in crypto.mjs');
//   console.log(
//     'bin decryptPassword-Funktion in crypto.mjs und bekomme encryptedPassword: ' +
//       encryptedPassword,
//   );
//   console.log(
//     'Bin crypto.mjs und process.env.CRYPTOJS_SECRET_KEY: ' +
//       process.env.CRYPTOJS_SECRET_KEY,
//   );
//   console.log('key: ' + key);
//   // Parse den kombinierten Wert aus Base64
//   let combined = CryptoJS.enc.Base64.parse(encryptedPassword);
//   console.log('combined: ' + combined);

//   // Extrahiere IV und verschlüsselten Text
//   let iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
//   console.log('iv: ' + iv);
//   console.log('iv.toString(): ' + iv.toString());
//   console.log('Original IV Länge: ' + iv.sigBytes); // sollte 16 Bytes sein

//   let ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));
//   console.log('ciphertext: ' + ciphertext);
//   console.log('ciphertext.toString(): ' + ciphertext.toString());
//   //console.log('Ciphertext Länge: ' + encrypted.ciphertext.sigBytes);

//   let decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   console.log('decrypted: ' + decrypted);
//   console.log('decrypted.toString(): ' + decrypted.toString());

//   console.log(
//     'decrypted.toString(CryptoJS.enc.Utf8): ' +
//       decrypted.toString(CryptoJS.enc.Utf8),
//   );

//   console.log('Decryption function');
//   console.log('Encrypted password: ', encryptedPassword);
//   console.log('Decryption Key: ', key);
//   console.log('IV (used for decryption): ', iv.toString());
//   console.log('Ciphertext for decryption: ', ciphertext.toString());
//   return decrypted.toString(CryptoJS.enc.Utf8);
// }

// //verschlüsseln
// export function encryptPassword(password) {
//   console.log('bin encryptPassword-Funktion in crypto.mjs');
//   let iv = CryptoJS.lib.WordArray.random(16); // Generiere einen zufälligen IV
//   console.log('IV beim Verschlüsseln: ' + iv);
//   console.log('Original IV Länge: ' + iv.sigBytes); // sollte 16 Bytes sein

//   let encrypted = CryptoJS.AES.encrypt(password, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   // Kombiniere IV und verschlüsselten Text und konvertiere in Base64
//   let combined = CryptoJS.lib.WordArray.create();
//   combined.concat(iv);
//   combined.concat(encrypted.ciphertext);
//   console.log('Verschlüsselter Text: ' + encrypted.ciphertext);
//   console.log('Ciphertext Länge: ' + encrypted.ciphertext.sigBytes);

//   console.log('encrypted function');
//   console.log('Encrypted password: ', encryptedPassword);
//   console.log('encrypted Key: ', key);
//   console.log('IV (used for encrypted): ', iv.toString());
//   console.log('Ciphertext for encrypted: ', encrypted.ciphertext.toString());

//   return combined.toString(CryptoJS.enc.Base64);
// }

// export default { encryptPassword, decryptPassword };

//----------------------------------------------------ALT-----------------------------------------------------------------------

// import CryptoJS from 'crypto-js';

// var encryptedStringPasswortLClient; // has to be var!

// export function encryptData(data, iv, key) {
//   //  console.log("bin encryptData-Funktion in crypto.mjs");
//   if (typeof data == 'string') {
//     data = data.slice();
//     encryptedStringPasswortLClient = CryptoJS.AES.encrypt(data, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });
//   } else {
//     encryptedStringPasswortLClient = CryptoJS.AES.encrypt(
//       JSON.stringify(data),
//       key,
//       {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       },
//     );
//   }
//   return encryptedStringPasswortLClient.toString();
// }

// export function decryptData(encrypted, iv, key) {
//   let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   return decrypted.toString(CryptoJS.enc.Utf8);
// }

// export default { encryptData, decryptData };
// import CryptoJS from 'crypto-js';

// var encryptedStringPasswortLClient; // has to be var!

// export function encryptData(data, iv, key) {
//   console.log('bin encryptData-Funktion in crypto.mjs');
//   if (typeof data == 'string') {
//     data = data.slice();
//     encryptedStringPasswortLClient = CryptoJS.AES.encrypt(data, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });
//   } else {
//     encryptedStringPasswortLClient = CryptoJS.AES.encrypt(
//       JSON.stringify(data),
//       key,
//       {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       },
//     );
//   }
//   return encryptedStringPasswortLClient.toString();
// }

// export function decryptData(encrypted, iv, key) {
//   console.log('bin decryptData-Funktion in crypto.mjs');
//   console.log('bin decryptData-Funktion in crypto.mjs encrypted: ' + encrypted);
//   console.log('bin decryptData-Funktion in crypto.mjs iv: ' + iv);
//   console.log('bin decryptData-Funktion in crypto.mjs key: ' + key);
//   // const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
//   //   iv: iv,
//   //   mode: CryptoJS.mode.CBC,
//   //   padding: CryptoJS.pad.Pkcs7,
//   // });

//   console.log('Decrypted data:', decrypted.toString(CryptoJS.enc.Utf8));
//   console.log('bin decryptData-Funktion in crypto.mjs encrypted: ' + encrypted);
//   console.log('bin decryptData-Funktion in crypto.mjs iv: ' + iv);
//   console.log('bin decryptData-Funktion in crypto.mjs key: ' + key);
//   let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   console.log('bin decryptData-Funktion in crypto.mjs decrypted: ' + decrypted);
//   console.log(
//     'bin decryptData-Funktion in crypto.mjs decrypted.toString(CryptoJS.enc.Utf8): ' +
//       decrypted.toString(CryptoJS.enc.Utf8),
//   );
//   return decrypted.toString(CryptoJS.enc.Utf8);
// }

// export default { encryptData, decryptData };
