import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import fs from 'node:fs/promises';
import path from 'path';

const FILE_STORAGE_PATH = process.env.FILE_STORAGE_PATH;
const FOLDER_STORAGE_RECIPES_CSV = process.env.FOLDER_STORAGE_RECIPES_CSV;

export async function writeCSV_File(fileNameToWrite, dataToWrite) {
  try {
    console.log('Bin writeCSV_File');

    const folderStorage = `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}`;

    // Create Folder (if not exist)
    await fs.mkdir(folderStorage, { recursive: true });

    // Ungültiger Pfad, um Fehler zu testen
    // await fs.writeFile(
    //   'Z:\\NonExistentFolder\\invalidFile.csv',
    //   dataToWrite,
    // );

    await fs.writeFile(
      `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}\\${fileNameToWrite}`,
      dataToWrite,
    );
    return true;
  } catch (err) {
    console.log('Fehler in writeCSV_File: ', err);
    throw 'Fehler in writeCSV_File: ' + err;
  }
}

export function formatZiehPositionsData_OPCUA_toWriteCSV_File(
  new_RECIPE_NAME_toWrite,
  //writeZiehPositionenArr,
  ziehPositionenDatatypFloatArr,
  ziehPositionWithSpeedDirectionUnique,
  ziehPosition_DIN,
  ziehPositionWithWriteByDobbleUnique,
  ziehPositionsArrUnique,
  ziehPositionsArrDoubleValues_x_z_dVerst,
  fixLaengenArr,
  ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe,
) {
  console.log('Bin formatZiehPositionsData_toWriteCSV_File');
  //TODO: CSV_ Datem Schreiben!
  let dataToWrite = new_RECIPE_NAME_toWrite; // + '\n' + '\n';//,'';
  dataToWrite += '\n' + '\n';

  for (let i = 0; i < ziehPositionenDatatypFloatArr.length; i++) {
    dataToWrite +=
      ziehPositionenDatatypFloatArr[i].POS +
      ',' +
      ziehPositionenDatatypFloatArr[i].Speed +
      ',' +
      ziehPositionenDatatypFloatArr[i].Acceleration +
      ',' +
      ziehPositionenDatatypFloatArr[i].Stroke +
      '\n';
  }

  dataToWrite += '\n' + '\n' + '\n' + '\n' + '\n';

  for (let i = 0; i < ziehPositionWithSpeedDirectionUnique.length; i++) {
    dataToWrite +=
      ziehPositionWithSpeedDirectionUnique[i].x +
      ',' +
      ziehPositionWithSpeedDirectionUnique[i].z +
      ',' +
      ziehPositionWithSpeedDirectionUnique[i].dVerst +
      ',' +
      ziehPositionWithSpeedDirectionUnique[i].vSpeed +
      '\n';
  }

  dataToWrite += '\n' + '\n' + '\n' + '\n' + '\n';

  for (let i = 0; i < ziehPosition_DIN.length; i++) {
    dataToWrite += JSON.stringify(ziehPosition_DIN[i]) + '\n';
  }

  dataToWrite += '\n' + '\n' + '\n' + '\n' + '\n';

  for (let i = 0; i < ziehPositionWithWriteByDobbleUnique.length; i++) {
    dataToWrite +=
      ziehPositionWithWriteByDobbleUnique[i].x +
      ',' +
      ziehPositionWithWriteByDobbleUnique[i].z +
      ',' +
      ziehPositionWithWriteByDobbleUnique[i].doubleDVerst +
      '\n';
  }

  dataToWrite += '\n' + '\n' + '\n' + '\n' + '\n';

  for (let i = 0; i < ziehPositionsArrUnique.length; i++) {
    dataToWrite += JSON.stringify(ziehPositionsArrUnique[i]) + '\n';
  }

  dataToWrite += '\n' + '\n' + '\n' + '\n' + '\n';

  // for (let i = 0; i < ziehPositionenArr_toWrite.length; i++) {
  //   dataToWrite +=
  //     ziehPositionenArr_toWrite[i].Pos +
  //     ',' +
  //     ziehPositionenArr_toWrite[i].Verst +
  //     '\n';
  // }
  // dataToWrite += '\n' + '\n' + '\n' + '\n' + '\n';
  for (let i = 0; i < ziehPositionsArrDoubleValues_x_z_dVerst.length; i++) {
    dataToWrite +=
      ziehPositionsArrDoubleValues_x_z_dVerst[i].x +
      ',' +
      ziehPositionsArrDoubleValues_x_z_dVerst[i].z +
      ',' +
      ziehPositionsArrDoubleValues_x_z_dVerst[i].dVerst +
      '\n';
  }

  dataToWrite += '\n' + '\n' + '\n' + '\n' + '\n';

  for (let i = 0; i < fixLaengenArr.length; i++) {
    dataToWrite += JSON.stringify(fixLaengenArr[i]) + '\n';
  }

  dataToWrite += '\n' + '\n' + '\n' + '\n' + '\n';

  for (
    let i = 0;
    i < ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.length;
    i++
  ) {
    dataToWrite +=
      JSON.stringify(
        ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe[i],
      ) + '\n';
  }

  return dataToWrite;
}

export function formatZiehPositionsData_toWriteCSV_File(
  ziehPositionenArr_toWrite,
  ziehPositionsArrDoubleValues_x_z_dVerst,
  ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe,
) {
  console.log('Bin formatZiehPositionsData_toWriteCSV_File');

  let dataToWrite = '';
  for (let i = 0; i < ziehPositionenArr_toWrite.length; i++) {
    dataToWrite +=
      ziehPositionenArr_toWrite[i].Pos +
      ',' +
      ziehPositionenArr_toWrite[i].Verst +
      '\n';
  }
  dataToWrite += '\n' + '\n' + '\n' + '\n' + '\n';
  for (let i = 0; i < ziehPositionsArrDoubleValues_x_z_dVerst.length; i++) {
    dataToWrite +=
      ziehPositionsArrDoubleValues_x_z_dVerst[i].x +
      ',' +
      ziehPositionsArrDoubleValues_x_z_dVerst[i].z +
      ',' +
      ziehPositionsArrDoubleValues_x_z_dVerst[i].dVerst +
      '\n';
  }

  dataToWrite += '\n' + '\n' + '\n' + '\n' + '\n';
  for (
    let i = 0;
    i < ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe.length;
    i++
  ) {
    dataToWrite +=
      JSON.stringify(
        ziehPositionsArr_x_z_dVerst_ZwischenstuekZeroValues_toShowMe[i],
      ) + '\n';
  }

  return dataToWrite;
}

export async function readLastCSV_File() {
  console.log('Bin readLastCSV_File');
  // try {
  //   console.log('Bin readLastCSV_File');

  //   //FILE_STORAGE_PATH=C:\\Users\\Schmidtjo\\Work Folders\\Desktop
  //   //FOLDER_STORAGE_RECIPES_CSV=\\myRecipesAndCSVFromAPP
  //   const folderReadStorage = `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}`;
  //   const fileNameToRead = '10180003.CSV';

  //   // Create Folder (if not exist)
  //   //await fs.mkdir(folderStorage, { recursive: true });

  //   // Ungültiger Pfad, um Fehler zu testen
  //   // await fs.writeFile(
  //   //   'Z:\\NonExistentFolder\\invalidFile.csv',
  //   //   dataToWrite,
  //   // );

  //   //await fs.readFile(`${`${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}\\${fileNameToWrite}`,}`)

  //   //   fs.readFile('demo.txt', (err, data) => {
  //   //     console.log(data);
  //   // })

  //   //try {

  //   const dataLastCSV = await fs.readFile(
  //     `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}\\${fileNameToRead}`,
  //     //'C:/Users/Schmidtjo/Work Folders/Desktop/myRecipesAndCSVFromAPP/10180003.CSV',
  //     { encoding: 'utf8' },
  //   );
  //   console.log('File content:', dataLastCSV);

  //   // const dataLastCSV = await fs.readFile(
  //   //   'C:/Users/Schmidtjo/Work Folders/Desktop/myRecipesAndCSVFromAPP/10180003.CSV',
  //   //   'utf8',
  //   //   (err, data) => {
  //   //     if (err) {
  //   //       console.error(err);
  //   //       return;
  //   //     }
  //   //     console.log('data:', data);
  //   //   },
  //   // );

  //   // } catch (err) {
  //   //   console.error('Error reading file:', err);
  //   // }

  //   //readFileAsync("example.txt");

  //   // const lastCSV = await fs.writeFile(
  //   //   `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}\\${fileNameToRead}`,
  //   //   'utf8',
  //   // );
  //   // console.log('lastCSV:', lastCSV);
  //   // return lastCSV;
  //   return dataLastCSV;

  const folderMyCSVRecipesFolder = `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}`;
  await fs.mkdir(folderMyCSVRecipesFolder, { recursive: true });

  // 1. Ordnerpfad definieren
  const folderPath = `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}`;

  // const FILE_STORAGE_PATH = process.env.FILE_STORAGE_PATH;
  // const FOLDER_STORAGE_RECIPES_CSV = process.env.FOLDER_STORAGE_RECIPES_CSV;
  // FILE_STORAGE_PATH=C:\\Users\\Schmidtjo\\Work Folders\\Desktop
  // FOLDER_STORAGE_RECIPES_CSV=\\myRecipesAndCSVFromAPP

  //FILE_STORAGE_PATH=C:\\Users\\Schmidtjo\\Work Folders\\Desktop\\MyRecipesAndCSVFromAPP

  let files = []; //'';
  let csvFiles = '';
  let data = '';
  let lastCSVData = '';
  try {
    //console.log(`Lesen von Dateien im Ordner: ${folderPath}`);

    //console.log('folderPath:', folderPath);
    // 2. Dateien im Ordner auflisten
    try {
      files = await fs.readdir(folderPath);
      //console.log(`Gefundene Dateien: ${files}`);

      //console.log('foundet files: ', files);
    } catch (err) {
      console.log('err in try...: ', err);

      throw err;
    }
    //if()

    // 3. Nur Dateien mit der Endung .CSV filtern
    csvFiles = files.filter((file) => file.endsWith('.csv'));
    //console.log(`Gefilterte CSV-Dateien: ${csvFiles}`);

    // 4. Fehler werfen, wenn keine CSV-Dateien gefunden wurden
    if (csvFiles.length === 0) {
      //throw new Error('Keine CSV-Dateien im Ordner gefunden.');
      console.log('Keine CSV-Dateien im Ordner gefunden.');
      lastCSVData = 'No CSV-File found, no data exist\n\n';
      return lastCSVData;
    }

    // 5. Metadaten für jede CSV-Datei abrufen
    const filesWithStats = [];
    for (const file of csvFiles) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.stat(filePath);
      filesWithStats.push({ file, filePath, mtime: stats.mtime });
      //console.log(`Datei: ${file}, Änderungsdatum: ${stats.mtime}`);
    }

    // 6. Dateien nach dem Änderungsdatum sortieren (neueste zuerst)
    filesWithStats.sort((a, b) => b.mtime - a.mtime);
    //console.log('Sortierte Dateien:', filesWithStats);

    // 7. Die neueste Datei auswählen
    const latestFile = filesWithStats[0];
    // console.log(
    //   `Neueste Datei: ${latestFile.file} (Änderungsdatum: ${latestFile.mtime})`,
    // );

    // 8. Inhalt der neuesten Datei lesen
    data = await fs.readFile(latestFile.filePath, 'utf8');
    //console.log('Inhalt der neuesten Datei:', data);

    lastCSVData =
      `Neueste Datei: ${latestFile.file} (Änderungsdatum: ${latestFile.mtime}) \n\n` +
      data +
      '\n\n';

    return lastCSVData;
    //return data;
  } catch (err) {
    console.log('Fehler in readLastCSV_File: ', err);
    throw 'Fehler in readLastCSV_File: ' + err;
  }
}

// //-----------------------------------------------------ALT--------------------------------------------------------
// export async function readLastCSV_File() {
//   console.log('Bin readLastCSV_File');
//   // try {
//   //   console.log('Bin readLastCSV_File');

//   //   //FILE_STORAGE_PATH=C:\\Users\\Schmidtjo\\Work Folders\\Desktop
//   //   //FOLDER_STORAGE_RECIPES_CSV=\\myRecipesAndCSVFromAPP
//   //   const folderReadStorage = `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}`;
//   //   const fileNameToRead = '10180003.CSV';

//   //   // Create Folder (if not exist)
//   //   //await fs.mkdir(folderStorage, { recursive: true });

//   //   // Ungültiger Pfad, um Fehler zu testen
//   //   // await fs.writeFile(
//   //   //   'Z:\\NonExistentFolder\\invalidFile.csv',
//   //   //   dataToWrite,
//   //   // );

//   //   //await fs.readFile(`${`${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}\\${fileNameToWrite}`,}`)

//   //   //   fs.readFile('demo.txt', (err, data) => {
//   //   //     console.log(data);
//   //   // })

//   //   //try {

//   //   const dataLastCSV = await fs.readFile(
//   //     `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}\\${fileNameToRead}`,
//   //     //'C:/Users/Schmidtjo/Work Folders/Desktop/myRecipesAndCSVFromAPP/10180003.CSV',
//   //     { encoding: 'utf8' },
//   //   );
//   //   console.log('File content:', dataLastCSV);

//   //   // const dataLastCSV = await fs.readFile(
//   //   //   'C:/Users/Schmidtjo/Work Folders/Desktop/myRecipesAndCSVFromAPP/10180003.CSV',
//   //   //   'utf8',
//   //   //   (err, data) => {
//   //   //     if (err) {
//   //   //       console.error(err);
//   //   //       return;
//   //   //     }
//   //   //     console.log('data:', data);
//   //   //   },
//   //   // );

//   //   // } catch (err) {
//   //   //   console.error('Error reading file:', err);
//   //   // }

//   //   //readFileAsync("example.txt");

//   //   // const lastCSV = await fs.writeFile(
//   //   //   `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}\\${fileNameToRead}`,
//   //   //   'utf8',
//   //   // );
//   //   // console.log('lastCSV:', lastCSV);
//   //   // return lastCSV;
//   //   return dataLastCSV;
//   try {
//     // 1. Ordnerpfad definieren
//     const folderPath = `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}`;
//     //console.log(`Lesen von Dateien im Ordner: ${folderPath}`);

//     console.log('folderPath:', folderPath);
//     // 2. Dateien im Ordner auflisten
//     try {
//       const files = await fs.readdir(folderPath);
//       //console.log(`Gefundene Dateien: ${files}`);

//       console.log('foundet files: ', files);
//     } catch (err) {
//       console.log('err in try...: ', err);
//     }
//     //if()

//     // 3. Nur Dateien mit der Endung .CSV filtern
//     const csvFiles = files.filter((file) => file.endsWith('.csv'));
//     //console.log(`Gefilterte CSV-Dateien: ${csvFiles}`);

//     // 4. Fehler werfen, wenn keine CSV-Dateien gefunden wurden
//     if (csvFiles.length === 0) {
//       throw new Error('Keine CSV-Dateien im Ordner gefunden.');
//     }

//     // 5. Metadaten für jede CSV-Datei abrufen
//     const filesWithStats = [];
//     for (const file of csvFiles) {
//       const filePath = path.join(folderPath, file);
//       const stats = await fs.stat(filePath);
//       filesWithStats.push({ file, filePath, mtime: stats.mtime });
//       //console.log(`Datei: ${file}, Änderungsdatum: ${stats.mtime}`);
//     }

//     // 6. Dateien nach dem Änderungsdatum sortieren (neueste zuerst)
//     filesWithStats.sort((a, b) => b.mtime - a.mtime);
//     //console.log('Sortierte Dateien:', filesWithStats);

//     // 7. Die neueste Datei auswählen
//     const latestFile = filesWithStats[0];
//     // console.log(
//     //   `Neueste Datei: ${latestFile.file} (Änderungsdatum: ${latestFile.mtime})`,
//     // );

//     // 8. Inhalt der neuesten Datei lesen
//     const data = await fs.readFile(latestFile.filePath, 'utf8');
//     //console.log('Inhalt der neuesten Datei:', data);

//     const lastCSVData =
//       `Neueste Datei: ${latestFile.file} (Änderungsdatum: ${latestFile.mtime}) \n\n` +
//       data;

//     return lastCSVData;
//     //return data;
//   } catch (err) {
//     console.log('Fehler in readLastCSV_File: ', err);
//     throw 'Fehler in readLastCSV_File: ' + err;
//   }
// }
