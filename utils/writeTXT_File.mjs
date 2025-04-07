import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import fs from 'node:fs/promises';
import { newDateTimeNow } from './spsProcessingHelpers.mjs';

const FILE_STORAGE_PATH = process.env.FILE_STORAGE_PATH;
const FOLDER_STORAGE_RECIPES_CSV = process.env.FOLDER_STORAGE_RECIPES_CSV;

export async function writeTXT_File(fileNameToWrite, dataToWrite) {
  try {
    console.log('Bin writeTXT_File');

    const newDateTime = newDateTimeNow().replace(/:/g, '-'); // Paths without colons!
    const newFolder = `Rezepte gesichert - ${newDateTime}`;

    const folderStorage = `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}`;
    const folderPath = `${FILE_STORAGE_PATH}${FOLDER_STORAGE_RECIPES_CSV}\\${newFolder}`;

    // Create Folder (if not exist)
    await fs.mkdir(folderStorage, { recursive: true });
    await fs.mkdir(folderPath, { recursive: true });

    const filePath = `${folderPath}\\${fileNameToWrite}`;

    // Invalid path, for test error's
    //await fs.writeFile('Z:\\NonExistentFolder\\invalidFile.csv', dataToWrite);

    await fs.writeFile(filePath, dataToWrite);

    console.log(`Datei wurde erfolgreich in ${filePath} gespeichert.`);
    return true;
  } catch (err) {
    console.error('Fehler in writeTXT_File:', err);
    //return false;
    throw 'Fehler in writeTXT_File: ' + err;
  }
}
