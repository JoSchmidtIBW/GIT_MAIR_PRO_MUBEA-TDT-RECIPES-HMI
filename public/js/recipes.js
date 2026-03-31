/* elint-disable */

import axios from 'axios';
import { showAlert } from './alerts.js';
import process from 'process';

const dev_Port = 8555;
const prod_Port = 8557;

const port = process.env.NODE_ENV === 'development' ? dev_Port : prod_Port;
const host = 'http://127.0.0.1:';
const strPathApiV1 = '/api/v1';
const apiUrl = host + port + strPathApiV1;

export const saveWriteAllRecipteToTXT_Files = async () => {
  console.log('Bin saveWriteAllRecipteToTXT_Files in recipes.js');
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/saveAllRecipesToTXT`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'All Recipe write successfully to TXT-files');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('Nichts beim server angekommen!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

function loadLastSelectedRecipe() {
  const savedRecipe = localStorage.getItem('selectedRecipe');
  if (savedRecipe) {
    const rowDataNormal = JSON.parse(savedRecipe);

    const dynamicContentNormal = generateDynamicContent(rowDataNormal);
    $('#rightDiv').html(dynamicContentNormal);

    const canvasNormal = document.getElementById('eckenCanvas');
    if (canvasNormal) {
      const ctxNormal = canvasNormal.getContext('2d');
      const eckenListeNormal = rowDataNormal.eckenListe;

      const paddingNormal = 120; //200; //120;
      const minXNormal = Math.min(
        ...eckenListeNormal.ecke.map((ecke) => ecke.x),
      );
      // const minYNormal = Math.min(
      //   ...eckenListeNormal.ecke.map((ecke) => ecke.z),
      // );
      // const scaleXNormal =
      //   (ctxNormal.canvas.width - 2 * paddingNormal) /
      //   (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.x)) - minXNormal);
      // const scaleYNormal =
      //   (ctxNormal.canvas.height - 2 * paddingNormal) /
      //   (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.z)) - minYNormal);
      const minZXXXNormal = Math.min(
        ...eckenListeNormal.ecke.map((ecke) => ecke.z),
      );

      const minYNormal = Math.max(
        minZXXXNormal - 0.5,
        Math.min(0, ...eckenListeNormal.ecke.map((ecke) => ecke.z)),
      );

      const scaleXNormal =
        (ctxNormal.canvas.width - 2 * paddingNormal) /
        (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.x)) - minXNormal);
      const scaleYNormal =
        (ctxNormal.canvas.height - 2 * paddingNormal) /
        (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.z)) - minYNormal);

      drawYAxis(
        ctxNormal,
        eckenListeNormal,
        paddingNormal,
        scaleXNormal,
        minYNormal,
        scaleYNormal,
      );
      drawXAxis(
        ctxNormal,
        eckenListeNormal,
        rowDataNormal.standartWerte,
        paddingNormal,
        scaleYNormal,
        minXNormal,
        minYNormal,
      );
      drawGrid(
        ctxNormal,
        eckenListeNormal,
        scaleXNormal,
        scaleYNormal,
        paddingNormal,
        minXNormal,
        minYNormal,
      );
      drawEckenListe(
        ctxNormal,
        eckenListeNormal,
        scaleXNormal,
        scaleYNormal,
        paddingNormal,
        minXNormal,
        minYNormal,
      );

      if (rowDataNormal.standartWerte) {
        drawUpperToleranceLine(
          ctxNormal,
          eckenListeNormal,
          rowDataNormal.standartWerte,
          scaleXNormal,
          scaleYNormal,
          paddingNormal,
          minXNormal,
          minYNormal,
        );
        drawLowerToleranceLine(
          ctxNormal,
          eckenListeNormal,
          rowDataNormal.standartWerte,
          scaleXNormal,
          scaleYNormal,
          paddingNormal,
          minXNormal,
          minYNormal,
        );
      }
    }
  }
}

export const updateRecipe = async (data, recipeID) => {
  console.log('bin updateRecipe und recipeID: ' + recipeID);
  console.log('JSON.stringify(data): ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/updateRecipe/${recipeID}`,
      data: {
        updateRecipeData: data,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Recipe updated successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('Nichts beim server angekommen!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteRecipe = async (recipeID) => {
  console.log('bin deleteRecipe und die id: ' + recipeID);

  try {
    const res = await axios({
      method: 'DELETE',
      url: `${apiUrl}/recipes/deleteRecipe/${recipeID}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Recipe successfully deleted');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createRecipe3_St_4_BMSMB = async (data) => {
  console.log('bin createRecipe3_St_4_BMSMB zum serverschicken');
  console.log('data: ' + data);
  console.log('JSON.stringify(data): ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/createRecipe3_St_4_BMSMB`,
      data: {
        recipeData: data,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Recipe3_St_4_BMSMB created successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('Nichts beim server angekommen!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createRecipe3_St_4_MBSBM = async (data) => {
  console.log('bin createRecipe3_St_4_MBSBM zum serverschicken');
  console.log('data: ' + data);
  console.log('JSON.stringify(data): ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/createRecipe3_St_4_MBSBM`,
      data: {
        recipeData: data,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Recipe3_St_4_MBSBM created successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('Nichts beim server angekommen!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createRecipe_ExpertJCD = async (data) => {
  console.log('bin createRecipe_ExpertJCD zum serverschicken');
  console.log('data: ' + data);
  console.log('JSON.stringify(data): ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/createRecipe_ExpertJCD`,
      data: {
        recipeData: data,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Recipe_ExpertJCD created successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('Nichts beim server angekommen!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createRecipe2_St_6_BSBSBSB = async (data) => {
  console.log('bin createRecipe2_St_6_BSBSBSB zum serverschicken');
  console.log('data: ' + data);
  console.log('JSON.stringify(data): ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/createRecipe2_St_6_BSBSBSB`,
      data: {
        recipeData: data,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Recipe2_St_6_BSBSBSB created successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('Nichts beim server angekommen!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createRecipe2_St_4_SBSBS = async (data) => {
  console.log('bin createRecipe2_St_4_SBSBS zum serverschicken');
  console.log('data: ' + data);
  console.log('JSON.stringify(data): ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/createRecipe2_St_4_SBSBS`,
      data: {
        recipeData: data,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Recipe2_St_4_SBSBS created successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('Nichts beim server angekommen!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createRecipe2_St_2_BSB = async (data) => {
  console.log('bin createRecipe2_St_2_BSB zum serverschicken');
  console.log('data: ' + data);
  console.log('JSON.stringify(data): ' + JSON.stringify(data));
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/createRecipe2_St_2_BSB`,
      data: {
        recipeData: data,
      },
    });

    console.log('res.data.status: ', res.data.status);
    if (res.data.status === 'success') {
      showAlert('success', 'Recipe2_St_2_BSB created successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('Nichts beim server angekommen!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const convertOldRecipes = async (importOldRecipes) => {
  console.log('bin convertOldRecipes in recipes.js zum serverschicken');
  console.log('importOldRecipes: ' + importOldRecipes);

  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipes/convertOldRecipesToMongoDB`,
      data: {
        importOldRecipes: importOldRecipes,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Old-Recipes confert to mongoDB successfully');
      window.setTimeout(() => {
        location.assign(`${apiUrl}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('not success!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log('Etwas ging schief, siehe Fehlermeldung oben');
    window.setTimeout(() => {
      location.assign(`${apiUrl}/txt_xml_fileuploader`);
    }, 3200);
  }
};

export const showRecipesTDToverviewTable_de_NotInlogt = async () => {
  console.log('bin showRecipesTDToverviewTable_de_NotInlogt');
  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipes/recipesTDTtoLoad`,
    });

    console.log('Response:', res);

    if (res.data && res.data.status === 'success') {
      console.log('Success in showRecipesTDToverviewTable_de_NotInlogt');

      $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        // Angenommen, der Artikelname (Spalte 2) enthält die Geschwindigkeit (z. B. "25m/min").
        const artikelName = data[2] || ''; // Index 2 für die Artikelname-Spalte
        const selectedSpeed = $('#speedFilter').val(); // Aktueller Wert des Dropdowns

        if (selectedSpeed === 'all') {
          return true; // Alle anzeigen
        }

        // Filter: Nur Zeilen, die die ausgewählte Geschwindigkeit enthalten, anzeigen
        return artikelName.includes(selectedSpeed);
      });

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        // Parse dd.mm.yyyy hh:mm to Date
        const [datePart, timePart] = data.split(' ');

        if (!datePart) return 0; // Wenn kein gültiges Datum vorliegt

        const parts = datePart.split('.');
        if (parts.length !== 3) return 0;

        const [day, month, year] = parts;

        // Falls eine Zeitangabe existiert, diese auch berücksichtigen
        if (timePart) {
          const [hours, minutes] = timePart.split(':').map(Number);
          return new Date(
            year,
            month - 1,
            day,
            hours || 0,
            minutes || 0,
          ).getTime();
        }

        // Nur das Datum ohne Zeit
        return new Date(year, month - 1, day).getTime();
      };

      const recipesArrayNormal = res.data.data.recipesTDTtoLoad.map(
        (recipe) => ({
          id: recipe._id,
          artikelNummer: recipe.kopfDaten.artikelNummer,
          artikelName: recipe.kopfDaten.artikelName,
          teileNummer: recipe.kopfDaten.teileNummer,
          zeichnungsNummer: recipe.kopfDaten.zeichnungsNummer,
          aenderungsstandZeichnung: recipe.kopfDaten.aenderungsstandZeichnung,
          aenderungsstandRezept: recipe.kopfDaten.aenderungsstandRezept,
          beschreibung: recipe.kopfDaten.beschreibung,
          ziehGeschwindigkeit: recipe.kopfDaten.ziehGeschwindigkeit,
          v_dorn_Fwd: recipe.kopfDaten.v_dorn_Fwd,
          v_dorn_Bwd: recipe.kopfDaten.v_dorn_Bwd,
          kommentar: JSON.stringify(recipe.kopfDaten.kommentar),

          lastCommentDate:
            recipe.kopfDaten.kommentar.length > 0
              ? new Date(
                  recipe.kopfDaten.kommentar[
                    recipe.kopfDaten.kommentar.length - 1
                  ].erstelltAm,
                ).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : '',
          lastCommentUser:
            recipe.kopfDaten.kommentar.length > 0
              ? recipe.kopfDaten.kommentar[
                  recipe.kopfDaten.kommentar.length - 1
                ].createdBy.firstName
              : '',
          mindestGutanteil: recipe.rohrWerte.mindestGutanteil,
          profileGekoppelt: recipe.rohrWerte.profileGekoppelt,
          rohrAussenDurchmesserLetzterZug:
            recipe.dornWerte.rohrAussenDurchmesserLetzterZug,
          rohrInnenDurchmesserLetzterZug:
            recipe.dornWerte.rohrInnenDurchmesserLetzterZug,
          angel: recipe.dornWerte.angel,
          rohrAussenDurchmesserTDTZug:
            recipe.dornWerte.rohrAussenDurchmesserTDTZug,
          dornStufen: recipe.dornWerte.dornStufen,
          mehrfachlaengenDaten: recipe.mehrfachlaengenDaten,
          standartWerte: recipe.standartWerte,
          eckenListe: recipe.eckenListe,
          rohrWerte: recipe.rohrWerte,
        }),
      );

      console.log('Recipes Array:', recipesArrayNormal);

      $('#recipesTDToverviewTable_de_NotInlogt').empty();

      const dataTableNormal = $('#recipesTDToverviewTable_de_NotInlogt')
        .DataTable({
          pagingType: 'full_numbers',
          paging: true,
          scrollX: false,
          scrollY: 500,
          language: {
            lengthMenu: 'Display _MENU_ Rezepte pro Seite', //'Display _MENU_ records per page',
            zeroRecords: 'Nothing found - sorry',
            info: 'Zeige _START_ bis _END_ von _TOTAL_ Rezepten', //'Showing page _PAGE_ of _PAGES_',
            infoEmpty: 'No records available',
            infoFiltered: '(filtered from _MAX_ total records)', //'(filtered from _MAX_ total records)',
            paginate: {
              first: 'Erste',
              last: 'Letzte',
              next: 'Nächste',
              previous: 'Vorherige',
            },
          },
          lengthChange: true,
          lengthMenu: [
            [2, 5, 10, -1],
            [2, 5, 10, 'Alle'],
          ],
          pageLength: -1, //-1=all 5,
          columns: [
            { data: 'id', visible: false },
            { data: 'artikelNummer', title: 'Artikelnummer', type: 'numeric' },
            { data: 'artikelName', title: 'Artikelname' },
            {
              data: 'lastCommentDate',
              title: 'Letztes Datum',
              type: 'date-de',
            },
            { data: 'lastCommentUser', title: 'Letzter Bearbeiter' },
            // {
            //   data: 'id', //${apiUrl}/manage_users/${data}
            //   render: function (data) {
            //     console.log('Value of data:', data);
            //     return `
            //     <a href="${apiUrl}/recipes/updateRecipe/${data}" class="edit-button">
            //       <svg class="heading-box__icon">
            //       <use xlink:href="/img/icons.svg#icon-edit-3"></use>
            //       </svg>
            //     </a>`;
            //   },
            //   orderable: false,
            // },
          ],
          data: recipesArrayNormal,
        })
        .order([1, 'asc']);
      //.draw();

      // Dropdown für Geschwindigkeit (Filter)
      $('#speedFilter').on('change', function () {
        dataTableNormal.draw(); // DataTable neu rendern
      });

      $(document).ready(function () {
        $('#recipesTDToverviewTable_de_NotInlogt tbody').on(
          'click',
          'tr',
          function () {
            const rowDataNormal = dataTableNormal.row(this).data();

            console.log(
              'rowData bei Klick in Tabelle angewählt:',
              rowDataNormal,
            );
            console.log('rowData.kommentar:', rowDataNormal.kommentar);

            localStorage.setItem(
              'selectedRecipe',
              JSON.stringify(rowDataNormal),
            );

            const eckenListeNormal = rowDataNormal.eckenListe;

            const dynamicContentNormal = generateDynamicContent(rowDataNormal);
            $('#rightDiv').html(dynamicContentNormal);

            $('#recipeToSendRowdataInput').val(JSON.stringify(rowDataNormal));

            localStorage.setItem(
              'selectedRecipe',
              JSON.stringify(rowDataNormal),
            );
            // Canvas für die Eckenliste zeichnen
            const canvasNormal = document.getElementById('eckenCanvas');
            if (!canvasNormal) {
              console.error('Canvas-Element nicht gefunden');
              return;
            }

            const ctxNormal = canvasNormal.getContext('2d');

            const paddingNormal = 120; //120;
            const minZXXXNormal = Math.min(
              ...eckenListeNormal.ecke.map((ecke) => ecke.z),
            );

            const minXNormal = Math.min(
              ...eckenListeNormal.ecke.map((ecke) => ecke.x),
            );

            const minYNormal = Math.max(
              minZXXXNormal - 0.5,
              Math.min(0, ...eckenListeNormal.ecke.map((ecke) => ecke.z)),
            );

            const scaleXNormal =
              (ctxNormal.canvas.width - 2 * paddingNormal) /
              (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.x)) -
                minXNormal);
            const scaleYNormal =
              (ctxNormal.canvas.height - 2 * paddingNormal) /
              (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.z)) -
                minYNormal);

            drawYAxis(
              ctxNormal,
              eckenListeNormal,
              paddingNormal,
              scaleXNormal,
              minYNormal,
              scaleYNormal,
            );
            drawXAxis(
              ctxNormal,
              eckenListeNormal,
              rowDataNormal.standartWerte,
              paddingNormal,
              scaleYNormal,
              minXNormal,
              minYNormal,
            );

            drawGrid(
              ctxNormal,
              eckenListeNormal,
              scaleXNormal,
              scaleYNormal,
              paddingNormal,
              minXNormal,
              minYNormal,
            );
            drawEckenListe(
              ctxNormal,
              eckenListeNormal,
              scaleXNormal,
              scaleYNormal,
              paddingNormal,
              minXNormal,
              minYNormal,
            );

            if (rowDataNormal.standartWerte) {
              drawUpperToleranceLine(
                ctxNormal,
                eckenListeNormal,
                rowDataNormal.standartWerte,
                scaleXNormal,
                scaleYNormal,
                paddingNormal,
                minXNormal,
                minYNormal,
              );
              drawLowerToleranceLine(
                ctxNormal,
                eckenListeNormal,
                rowDataNormal.standartWerte,
                scaleXNormal,
                scaleYNormal,
                paddingNormal,
                minXNormal,
                minYNormal,
              );
            }
            $('#recipesTDToverviewTable_de_NotInlogt tbody tr').removeClass(
              'highlightTableClick',
            );
            $(this).addClass('highlightTableClick');
          },
        );
      });
      loadLastSelectedRecipe();
    } else {
      console.error('Error or unsuccessful response:', res.data);
    }
  } catch (error) {
    console.error('Error in showRecipesTDToverviewTable_de_NotInlogt:', error);
    showAlert('error', err.response.data.message);
  }
};

export const showRecipesTDToverviewTable_cs_NotInlogt = async () => {
  console.log('bin showRecipesTDToverviewTable_cs_NotInlogt');
  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipes/recipesTDTtoLoad`,
    });

    console.log('Response:', res);

    if (res.data && res.data.status === 'success') {
      console.log('Success in showRecipesTDToverviewTable_cs_NotInlogt');

      $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        // Angenommen, der Artikelname (Spalte 2) enthält die Geschwindigkeit (z. B. "25m/min").
        const artikelName = data[2] || ''; // Index 2 für die Artikelname-Spalte
        const selectedSpeed = $('#speedFilter').val(); // Aktueller Wert des Dropdowns

        if (selectedSpeed === 'all') {
          return true; // Alle anzeigen
        }

        // Filter: Nur Zeilen, die die ausgewählte Geschwindigkeit enthalten, anzeigen
        return artikelName.includes(selectedSpeed);
      });

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        // Parse dd.mm.yyyy hh:mm to Date
        const [datePart, timePart] = data.split(' ');

        if (!datePart) return 0; // Wenn kein gültiges Datum vorliegt

        const parts = datePart.split('.');
        if (parts.length !== 3) return 0;

        const [day, month, year] = parts;

        // Falls eine Zeitangabe existiert, diese auch berücksichtigen
        if (timePart) {
          const [hours, minutes] = timePart.split(':').map(Number);
          return new Date(
            year,
            month - 1,
            day,
            hours || 0,
            minutes || 0,
          ).getTime();
        }

        // Nur das Datum ohne Zeit
        return new Date(year, month - 1, day).getTime();
      };

      const recipesArrayNormal = res.data.data.recipesTDTtoLoad.map(
        (recipe) => ({
          id: recipe._id,
          artikelNummer: recipe.kopfDaten.artikelNummer,
          artikelName: recipe.kopfDaten.artikelName,
          teileNummer: recipe.kopfDaten.teileNummer,
          zeichnungsNummer: recipe.kopfDaten.zeichnungsNummer,
          aenderungsstandZeichnung: recipe.kopfDaten.aenderungsstandZeichnung,
          aenderungsstandRezept: recipe.kopfDaten.aenderungsstandRezept,
          beschreibung: recipe.kopfDaten.beschreibung,
          ziehGeschwindigkeit: recipe.kopfDaten.ziehGeschwindigkeit,
          v_dorn_Fwd: recipe.kopfDaten.v_dorn_Fwd,
          v_dorn_Bwd: recipe.kopfDaten.v_dorn_Bwd,
          kommentar: JSON.stringify(recipe.kopfDaten.kommentar),

          lastCommentDate:
            recipe.kopfDaten.kommentar.length > 0
              ? new Date(
                  recipe.kopfDaten.kommentar[
                    recipe.kopfDaten.kommentar.length - 1
                  ].erstelltAm,
                ).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : '',
          lastCommentUser:
            recipe.kopfDaten.kommentar.length > 0
              ? recipe.kopfDaten.kommentar[
                  recipe.kopfDaten.kommentar.length - 1
                ].createdBy.firstName
              : '',
          mindestGutanteil: recipe.rohrWerte.mindestGutanteil,
          profileGekoppelt: recipe.rohrWerte.profileGekoppelt,
          rohrAussenDurchmesserLetzterZug:
            recipe.dornWerte.rohrAussenDurchmesserLetzterZug,
          rohrInnenDurchmesserLetzterZug:
            recipe.dornWerte.rohrInnenDurchmesserLetzterZug,
          angel: recipe.dornWerte.angel,
          rohrAussenDurchmesserTDTZug:
            recipe.dornWerte.rohrAussenDurchmesserTDTZug,
          dornStufen: recipe.dornWerte.dornStufen,
          mehrfachlaengenDaten: recipe.mehrfachlaengenDaten,
          standartWerte: recipe.standartWerte,
          eckenListe: recipe.eckenListe,
          rohrWerte: recipe.rohrWerte,
        }),
      );

      console.log('Recipes Array:', recipesArrayNormal);

      $('#recipesTDToverviewTable_cs_NotInlogt').empty();

      const dataTableNormal = $('#recipesTDToverviewTable_cs_NotInlogt')
        .DataTable({
          pagingType: 'full_numbers',
          paging: true,
          scrollX: false,
          scrollY: 500,
          language: {
            lengthMenu: 'Display _MENU_ Recepty na stránce', //'Display _MENU_ records per page',
            zeroRecords: 'Nothing found - sorry',
            info: 'Zobrazit _START_ bis _END_ von _TOTAL_ recepty', //'Showing page _PAGE_ of _PAGES_',
            infoEmpty: 'No records available',
            infoFiltered: '(filtered from _MAX_ total records)', //'(filtered from _MAX_ total records)',
            paginate: {
              first: 'První',
              last: 'Poslední',
              next: 'Další',
              previous: 'Předchozí',
            },
          },
          lengthChange: true,
          lengthMenu: [
            [2, 5, 10, -1],
            [2, 5, 10, 'Vše'],
          ],
          pageLength: -1, //-1=all 5,
          columns: [
            { data: 'id', visible: false },
            { data: 'artikelNummer', title: 'Číslo artiklu', type: 'numeric' },
            { data: 'artikelName', title: 'Název artiklu' },
            {
              data: 'lastCommentDate',
              title: 'Poslední datum vytvoření',
              type: 'date-de',
            },
            { data: 'lastCommentUser', title: 'Poslední Tvorce' },
            // {
            //   data: 'id', //${apiUrl}/manage_users/${data}
            //   render: function (data) {
            //     console.log('Value of data:', data);
            //     return `
            //     <a href="${apiUrl}/recipes/updateRecipe/${data}" class="edit-button">
            //       <svg class="heading-box__icon">
            //       <use xlink:href="/img/icons.svg#icon-edit-3"></use>
            //       </svg>
            //     </a>`;
            //   },
            //   orderable: false,
            // },
          ],
          data: recipesArrayNormal,
        })
        .order([1, 'asc']);
      //.draw();

      // Dropdown für Geschwindigkeit (Filter)
      $('#speedFilter').on('change', function () {
        dataTableNormal.draw(); // DataTable neu rendern
      });

      $(document).ready(function () {
        $('#recipesTDToverviewTable_cs_NotInlogt tbody').on(
          'click',
          'tr',
          function () {
            const rowDataNormal = dataTableNormal.row(this).data();

            console.log(
              'rowData bei Klick in Tabelle angewählt:',
              rowDataNormal,
            );
            console.log('rowData.kommentar:', rowDataNormal.kommentar);

            localStorage.setItem(
              'selectedRecipe',
              JSON.stringify(rowDataNormal),
            );

            const eckenListeNormal = rowDataNormal.eckenListe;

            const dynamicContentNormal =
              generateDynamicContent_cs(rowDataNormal);
            $('#rightDiv').html(dynamicContentNormal);

            $('#recipeToSendRowdataInput').val(JSON.stringify(rowDataNormal));

            localStorage.setItem(
              'selectedRecipe',
              JSON.stringify(rowDataNormal),
            );
            // Canvas für die Eckenliste zeichnen
            const canvasNormal = document.getElementById('eckenCanvas');
            if (!canvasNormal) {
              console.error('Canvas-Element nicht gefunden');
              return;
            }

            const ctxNormal = canvasNormal.getContext('2d');

            const paddingNormal = 120; //120;
            const minZXXXNormal = Math.min(
              ...eckenListeNormal.ecke.map((ecke) => ecke.z),
            );

            const minXNormal = Math.min(
              ...eckenListeNormal.ecke.map((ecke) => ecke.x),
            );

            const minYNormal = Math.max(
              minZXXXNormal - 0.5,
              Math.min(0, ...eckenListeNormal.ecke.map((ecke) => ecke.z)),
            );

            const scaleXNormal =
              (ctxNormal.canvas.width - 2 * paddingNormal) /
              (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.x)) -
                minXNormal);
            const scaleYNormal =
              (ctxNormal.canvas.height - 2 * paddingNormal) /
              (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.z)) -
                minYNormal);

            drawYAxis(
              ctxNormal,
              eckenListeNormal,
              paddingNormal,
              scaleXNormal,
              minYNormal,
              scaleYNormal,
            );
            drawXAxis(
              ctxNormal,
              eckenListeNormal,
              rowDataNormal.standartWerte,
              paddingNormal,
              scaleYNormal,
              minXNormal,
              minYNormal,
            );

            drawGrid(
              ctxNormal,
              eckenListeNormal,
              scaleXNormal,
              scaleYNormal,
              paddingNormal,
              minXNormal,
              minYNormal,
            );
            drawEckenListe(
              ctxNormal,
              eckenListeNormal,
              scaleXNormal,
              scaleYNormal,
              paddingNormal,
              minXNormal,
              minYNormal,
            );

            if (rowDataNormal.standartWerte) {
              drawUpperToleranceLine(
                ctxNormal,
                eckenListeNormal,
                rowDataNormal.standartWerte,
                scaleXNormal,
                scaleYNormal,
                paddingNormal,
                minXNormal,
                minYNormal,
              );
              drawLowerToleranceLine(
                ctxNormal,
                eckenListeNormal,
                rowDataNormal.standartWerte,
                scaleXNormal,
                scaleYNormal,
                paddingNormal,
                minXNormal,
                minYNormal,
              );
            }
            $('#recipesTDToverviewTable_cs_NotInlogt tbody tr').removeClass(
              'highlightTableClick',
            );
            $(this).addClass('highlightTableClick');
          },
        );
      });
      loadLastSelectedRecipe();
    } else {
      console.error('Error or unsuccessful response:', res.data);
    }
  } catch (error) {
    console.error('Error in showRecipesTDToverviewTable_cs_NotInlogt:', error);
    showAlert('error', err.response.data.message);
  }
};

export const showRecipesTDToverviewTable_de = async (user) => {
  console.log('bin showRecipesTDToverviewTable_de, user', user);
  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipes/recipesTDTtoLoad`,
      params: { user: user },
    });

    console.log('Response:', res); // Log the gesamte Antwort
    console.log('Response res.data:', res.data);
    console.log('Response res.data.data:', res.data.data);

    if (res.data && res.data.status === 'success') {
      console.log('Success in showRecipesTDToverviewTable_de');

      const userInlogt = JSON.parse(res.data.data.userInlogt);
      const userRole = userInlogt.role;
      console.log('userRole:', userRole);

      const recipesArrayNormal = res.data.data.recipesTDTtoLoad.map(
        (recipe) => ({
          //const comments = recipe.kopfDaten.kommentar;
          id: recipe._id,
          artikelNummer: recipe.kopfDaten.artikelNummer,
          artikelName: recipe.kopfDaten.artikelName,
          teileNummer: recipe.kopfDaten.teileNummer,
          zeichnungsNummer: recipe.kopfDaten.zeichnungsNummer,
          aenderungsstandZeichnung: recipe.kopfDaten.aenderungsstandZeichnung,
          aenderungsstandRezept: recipe.kopfDaten.aenderungsstandRezept,
          beschreibung: recipe.kopfDaten.beschreibung,
          ziehGeschwindigkeit: recipe.kopfDaten.ziehGeschwindigkeit,
          v_dorn_Fwd: recipe.kopfDaten.v_dorn_Fwd,
          v_dorn_Bwd: recipe.kopfDaten.v_dorn_Bwd,
          kommentar: JSON.stringify(recipe.kopfDaten.kommentar),
          lastCommentDate:
            recipe.kopfDaten.kommentar.length > 0
              ? new Date(
                  recipe.kopfDaten.kommentar[
                    recipe.kopfDaten.kommentar.length - 1
                  ].erstelltAm,
                ).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : '',
          lastCommentUser:
            recipe.kopfDaten.kommentar.length > 0
              ? recipe.kopfDaten.kommentar[
                  recipe.kopfDaten.kommentar.length - 1
                ].createdBy.firstName
              : '',
          mindestGutanteil: recipe.rohrWerte.mindestGutanteil,
          profileGekoppelt: recipe.rohrWerte.profileGekoppelt,
          rohrAussenDurchmesserLetzterZug:
            recipe.dornWerte.rohrAussenDurchmesserLetzterZug,
          rohrInnenDurchmesserLetzterZug:
            recipe.dornWerte.rohrInnenDurchmesserLetzterZug,
          angel: recipe.dornWerte.angel,
          rohrAussenDurchmesserTDTZug:
            recipe.dornWerte.rohrAussenDurchmesserTDTZug,
          dornStufen: recipe.dornWerte.dornStufen,
          mehrfachlaengenDaten: recipe.mehrfachlaengenDaten,
          standartWerte: recipe.standartWerte,
          eckenListe: recipe.eckenListe,
          rohrWerte: recipe.rohrWerte,
        }),
      );

      console.log('Recipes Array:', recipesArrayNormal);

      $('#recipesTDToverviewTable_de').empty();

      $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        // Angenommen, der Artikelname (Spalte 2) enthält die Geschwindigkeit (z. B. "25m/min").
        const artikelName = data[2] || ''; // Index 2 für die Artikelname-Spalte
        const selectedSpeed = $('#speedFilter').val(); // Aktueller Wert des Dropdowns

        if (selectedSpeed === 'all') {
          return true; // Alle anzeigen
        }

        // Filter: Nur Zeilen, die die ausgewählte Geschwindigkeit enthalten, anzeigen
        return artikelName.includes(selectedSpeed);
      });

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        // Parse dd.mm.yyyy hh:mm to Date
        const [datePart, timePart] = data.split(' ');

        if (!datePart) return 0; // Wenn kein gültiges Datum vorliegt

        const parts = datePart.split('.');
        if (parts.length !== 3) return 0;

        const [day, month, year] = parts;

        // Falls eine Zeitangabe existiert, diese auch berücksichtigen
        if (timePart) {
          const [hours, minutes] = timePart.split(':').map(Number);
          return new Date(
            year,
            month - 1,
            day,
            hours || 0,
            minutes || 0,
          ).getTime();
        }

        // Nur das Datum ohne Zeit
        return new Date(year, month - 1, day).getTime();
      };

      const dataTableNormal = $('#recipesTDToverviewTable_de')
        .DataTable({
          pagingType: 'full_numbers',
          paging: true,
          scrollX: false,
          scrollY: 450,
          language: {
            search: 'Suche:',
            lengthMenu: 'Zeige: _MENU_ Rezepte pro Seite', //'Display _MENU_ records per page',
            zeroRecords: 'Nothing found - sorry',
            info: 'Zeige _START_ bis _END_ von _TOTAL_ Rezepten', //'Showing page _PAGE_ of _PAGES_',
            infoEmpty: 'No records available',
            infoFiltered: '(Gefiltert _MAX_ von totalen Rezepten)', //'(filtered from _MAX_ total records)',
            paginate: {
              first: 'Erste',
              last: 'Letzte',
              next: 'Nächste',
              previous: 'Vorherige',
            },
          },
          lengthChange: true,
          lengthMenu: [
            [2, 5, 10, -1],
            [2, 5, 10, 'Alle'],
          ],
          pageLength: -1, //-1=all 5,
          columns: [
            { data: 'id', visible: false },
            { data: 'artikelNummer', title: 'Artikelnummer', type: 'numeric' },
            { data: 'artikelName', title: 'Artikelname' },
            {
              data: 'lastCommentDate',
              title: 'Letztes Datum',
              type: 'date-de',
            },
            { data: 'lastCommentUser', title: 'Letzter Bearbeiter' },
            {
              data: 'id',
              render: function (data) {
                console.log('Value of data:', data);
                //if (userRole === 'user') return '<a>user!!!</>';   href="#"    style="background-color: red;"
                if (userRole === 'user')
                  return `
                <a class="edit-button_blocked">
                  <svg class="heading-box__icon_blocked" >
                  <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                  </svg>
                </a>`;
                return `
                <a href="${apiUrl}/recipes/updateRecipe/${data}" class="edit-button">
                  <svg class="heading-box__icon">
                  <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                  </svg>
                </a>`;
              },
              orderable: false,
            },
          ],
          data: recipesArrayNormal,
          // drawCallback: function () {
          //   // Stellt sicher, dass die letzte ausgewählte Zeile bei jedem Zeichnen hervorgehoben wird
          //   if (lastSelectedRow) {
          //     $(lastSelectedRow.node()).addClass('highlight');
          //   }
          // },
        })
        .order([1, 'asc']);
      //.draw();

      // Dropdown für Geschwindigkeit (Filter)
      $('#speedFilter').on('change', function () {
        dataTableNormal.draw(); // DataTable neu rendern
      });

      $(document).ready(function () {
        $('#recipesTDToverviewTable_de tbody').on('click', 'tr', function () {
          const rowDataNormal = dataTableNormal.row(this).data();
          console.log('rowDataNormal: ' + JSON.stringify(rowDataNormal));

          console.log('rowData bei Klick in Tabelle angewählt:', rowDataNormal);
          console.log('rowData.kommentar:', rowDataNormal.kommentar);

          localStorage.setItem('selectedRecipe', JSON.stringify(rowDataNormal));

          const eckenListeNormal = rowDataNormal.eckenListe;

          const dynamicContentNormal = generateDynamicContent(rowDataNormal);
          $('#rightDiv').html(dynamicContentNormal);

          $('#recipeToSendRowdataInput').val(JSON.stringify(rowDataNormal));

          // Canvas für die Eckenliste zeichnen
          const canvasNormal = document.getElementById('eckenCanvas');
          if (!canvasNormal) {
            console.error('Canvas-Element nicht gefunden');
            return;
          }

          const ctxNormal = canvasNormal.getContext('2d');

          const paddingNormal = 120; //120;
          const minZXXXNormal = Math.min(
            ...eckenListeNormal.ecke.map((ecke) => ecke.z),
          );

          const minXNormal = Math.min(
            ...eckenListeNormal.ecke.map((ecke) => ecke.x),
          );

          const minYNormal = Math.max(
            minZXXXNormal - 0.5,
            Math.min(0, ...eckenListeNormal.ecke.map((ecke) => ecke.z)),
          );

          const scaleXNormal =
            (ctxNormal.canvas.width - 2 * paddingNormal) /
            (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.x)) -
              minXNormal);
          const scaleYNormal =
            (ctxNormal.canvas.height - 2 * paddingNormal) /
            (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.z)) -
              minYNormal);

          drawYAxis(
            ctxNormal,
            eckenListeNormal,
            paddingNormal,
            scaleXNormal,
            minYNormal,
            scaleYNormal,
          );
          drawXAxis(
            ctxNormal,
            eckenListeNormal,
            rowDataNormal.standartWerte,
            paddingNormal,
            scaleYNormal,
            minXNormal,
            minYNormal,
          );

          drawGrid(
            ctxNormal,
            eckenListeNormal,
            scaleXNormal,
            scaleYNormal,
            paddingNormal,
            minXNormal,
            minYNormal,
          );
          drawEckenListe(
            ctxNormal,
            eckenListeNormal,
            scaleXNormal,
            scaleYNormal,
            paddingNormal,
            minXNormal,
            minYNormal,
          );

          if (rowDataNormal.standartWerte) {
            drawUpperToleranceLine(
              ctxNormal,
              eckenListeNormal,
              rowDataNormal.standartWerte,
              scaleXNormal,
              scaleYNormal,
              paddingNormal,
              minXNormal,
              minYNormal,
            );
            drawLowerToleranceLine(
              ctxNormal,
              eckenListeNormal,
              rowDataNormal.standartWerte,
              scaleXNormal,
              scaleYNormal,
              paddingNormal,
              minXNormal,
              minYNormal,
            );
          }

          // Hervorhebung der angeklickten Zeile
          $('#recipesTDToverviewTable_de tbody tr').removeClass(
            'highlightTableClick',
          );
          $(this).addClass('highlightTableClick');

          // if (lastSelectedRow) {
          //   $(lastSelectedRow.node()).removeClass('highlight');
          // }
          // $(this).addClass('highlight');
          // lastSelectedRow = dataTableNormal.row(this);
        });
      });
      loadLastSelectedRecipe();
    } else {
      console.error('Error or unsuccessful response:', res.data);
    }
  } catch (error) {
    console.error('Error in showRecipesTDToverviewTable_de:', error);
    showAlert('error', err.response.data.message);
  }
};

export const showRecipesTDToverviewTable_cs = async (user) => {
  console.log('bin showRecipesTDToverviewTable_cs');
  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipes/recipesTDTtoLoad`,
      params: { user: user },
    });

    console.log('Response:', res); // Log the gesamte Antwort

    if (res.data && res.data.status === 'success') {
      console.log('Success in showRecipesTDToverviewTable_cs');

      const userInlogt = JSON.parse(res.data.data.userInlogt);
      const userRole = userInlogt.role;
      console.log('userRole:', userRole);

      const recipesArrayNormal = res.data.data.recipesTDTtoLoad.map(
        (recipe) => ({
          //const comments = recipe.kopfDaten.kommentar;
          id: recipe._id,
          artikelNummer: recipe.kopfDaten.artikelNummer,
          artikelName: recipe.kopfDaten.artikelName,
          teileNummer: recipe.kopfDaten.teileNummer,
          zeichnungsNummer: recipe.kopfDaten.zeichnungsNummer,
          aenderungsstandZeichnung: recipe.kopfDaten.aenderungsstandZeichnung,
          aenderungsstandRezept: recipe.kopfDaten.aenderungsstandRezept,
          beschreibung: recipe.kopfDaten.beschreibung,
          ziehGeschwindigkeit: recipe.kopfDaten.ziehGeschwindigkeit,
          v_dorn_Fwd: recipe.kopfDaten.v_dorn_Fwd,
          v_dorn_Bwd: recipe.kopfDaten.v_dorn_Bwd,
          kommentar: JSON.stringify(recipe.kopfDaten.kommentar),
          lastCommentDate:
            recipe.kopfDaten.kommentar.length > 0
              ? new Date(
                  recipe.kopfDaten.kommentar[
                    recipe.kopfDaten.kommentar.length - 1
                  ].erstelltAm,
                ).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : '',
          lastCommentUser:
            recipe.kopfDaten.kommentar.length > 0
              ? recipe.kopfDaten.kommentar[
                  recipe.kopfDaten.kommentar.length - 1
                ].createdBy.firstName
              : '',
          mindestGutanteil: recipe.rohrWerte.mindestGutanteil,
          profileGekoppelt: recipe.rohrWerte.profileGekoppelt,
          rohrAussenDurchmesserLetzterZug:
            recipe.dornWerte.rohrAussenDurchmesserLetzterZug,
          rohrInnenDurchmesserLetzterZug:
            recipe.dornWerte.rohrInnenDurchmesserLetzterZug,
          angel: recipe.dornWerte.angel,
          rohrAussenDurchmesserTDTZug:
            recipe.dornWerte.rohrAussenDurchmesserTDTZug,
          dornStufen: recipe.dornWerte.dornStufen,
          mehrfachlaengenDaten: recipe.mehrfachlaengenDaten,
          standartWerte: recipe.standartWerte,
          eckenListe: recipe.eckenListe,
          rohrWerte: recipe.rohrWerte,
        }),
      );

      console.log('Recipes Array:', recipesArrayNormal);

      $('#recipesTDToverviewTable_cs').empty();

      $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        // Angenommen, der Artikelname (Spalte 2) enthält die Geschwindigkeit (z. B. "25m/min").
        const artikelName = data[2] || ''; // Index 2 für die Artikelname-Spalte
        const selectedSpeed = $('#speedFilter').val(); // Aktueller Wert des Dropdowns

        if (selectedSpeed === 'all') {
          return true; // Alle anzeigen
        }

        // Filter: Nur Zeilen, die die ausgewählte Geschwindigkeit enthalten, anzeigen
        return artikelName.includes(selectedSpeed);
      });

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        // Parse dd.mm.yyyy hh:mm to Date
        const [datePart, timePart] = data.split(' ');

        if (!datePart) return 0; // Wenn kein gültiges Datum vorliegt

        const parts = datePart.split('.');
        if (parts.length !== 3) return 0;

        const [day, month, year] = parts;

        // Falls eine Zeitangabe existiert, diese auch berücksichtigen
        if (timePart) {
          const [hours, minutes] = timePart.split(':').map(Number);
          return new Date(
            year,
            month - 1,
            day,
            hours || 0,
            minutes || 0,
          ).getTime();
        }

        // Nur das Datum ohne Zeit
        return new Date(year, month - 1, day).getTime();
      };

      const dataTableNormal = $('#recipesTDToverviewTable_cs')
        .DataTable({
          pagingType: 'full_numbers',
          paging: true,
          scrollX: false,
          scrollY: 450,
          language: {
            search: 'Hledat:',
            lengthMenu: 'Zobrazit _MENU_ Recepty na stránce', //'Display _MENU_ records per page',
            zeroRecords: 'Nothing found - sorry',
            info: 'Zobrazit _START_ do _END_ od _TOTAL_ recepty', //'Showing page _PAGE_ of _PAGES_',
            infoEmpty: 'Žádné záznamy nejsou k dispozici.',
            infoFiltered: '(filtrováno z _MAX_ total recepty)', //'(filtered from _MAX_ total records)',
            paginate: {
              first: 'První',
              last: 'Poslední',
              next: 'Další',
              previous: 'Předchozí',
            },
          },
          lengthChange: true,
          lengthMenu: [
            [2, 5, 10, -1],
            [2, 5, 10, 'Vše'],
          ],
          pageLength: -1, //-1=all 5,
          columns: [
            { data: 'id', visible: false },
            { data: 'artikelNummer', title: 'Číslo artiklu', type: 'numeric' },
            { data: 'artikelName', title: 'Název artiklu' },
            {
              data: 'lastCommentDate',
              title: 'Poslední datum vytvoření',
              type: 'date-de',
            },
            { data: 'lastCommentUser', title: 'Poslední Tvorce' },
            {
              data: 'id',
              render: function (data) {
                console.log('Value of data:', data);
                if (userRole === 'user')
                  return `
                <a class="edit-button_blocked">
                  <svg class="heading-box__icon_blocked" >
                  <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                  </svg>
                </a>`;
                return `
                <a href="${apiUrl}/recipes/updateRecipe/${data}" class="edit-button">
                  <svg class="heading-box__icon">
                  <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                  </svg>
                </a>`;
              },
              orderable: false,
            },
          ],
          data: recipesArrayNormal,
          // drawCallback: function () {
          //   // Stellt sicher, dass die letzte ausgewählte Zeile bei jedem Zeichnen hervorgehoben wird
          //   if (lastSelectedRow) {
          //     $(lastSelectedRow.node()).addClass('highlight');
          //   }
          // },
        })
        .order([1, 'asc']);
      //.draw();

      // Dropdown für Geschwindigkeit (Filter)
      $('#speedFilter').on('change', function () {
        dataTableNormal.draw(); // DataTable neu rendern
      });

      $(document).ready(function () {
        $('#recipesTDToverviewTable_cs tbody').on('click', 'tr', function () {
          const rowDataNormal = dataTableNormal.row(this).data();
          console.log('rowDataNormal: ' + JSON.stringify(rowDataNormal));

          console.log('rowData bei Klick in Tabelle angewählt:', rowDataNormal);
          console.log('rowData.kommentar:', rowDataNormal.kommentar);

          localStorage.setItem('selectedRecipe', JSON.stringify(rowDataNormal));

          const eckenListeNormal = rowDataNormal.eckenListe;

          const dynamicContentNormal = generateDynamicContent_cs(rowDataNormal);
          $('#rightDiv').html(dynamicContentNormal);

          $('#recipeToSendRowdataInput').val(JSON.stringify(rowDataNormal));

          // Canvas für die Eckenliste zeichnen
          const canvasNormal = document.getElementById('eckenCanvas');
          if (!canvasNormal) {
            console.error('Canvas-Element nicht gefunden');
            return;
          }

          const ctxNormal = canvasNormal.getContext('2d');

          const paddingNormal = 120; //120;
          const minZXXXNormal = Math.min(
            ...eckenListeNormal.ecke.map((ecke) => ecke.z),
          );

          const minXNormal = Math.min(
            ...eckenListeNormal.ecke.map((ecke) => ecke.x),
          );

          const minYNormal = Math.max(
            minZXXXNormal - 0.5,
            Math.min(0, ...eckenListeNormal.ecke.map((ecke) => ecke.z)),
          );

          const scaleXNormal =
            (ctxNormal.canvas.width - 2 * paddingNormal) /
            (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.x)) -
              minXNormal);
          const scaleYNormal =
            (ctxNormal.canvas.height - 2 * paddingNormal) /
            (Math.max(...eckenListeNormal.ecke.map((ecke) => ecke.z)) -
              minYNormal);

          drawYAxis(
            ctxNormal,
            eckenListeNormal,
            paddingNormal,
            scaleXNormal,
            minYNormal,
            scaleYNormal,
          );
          drawXAxis(
            ctxNormal,
            eckenListeNormal,
            rowDataNormal.standartWerte,
            paddingNormal,
            scaleYNormal,
            minXNormal,
            minYNormal,
          );

          drawGrid(
            ctxNormal,
            eckenListeNormal,
            scaleXNormal,
            scaleYNormal,
            paddingNormal,
            minXNormal,
            minYNormal,
          );
          drawEckenListe(
            ctxNormal,
            eckenListeNormal,
            scaleXNormal,
            scaleYNormal,
            paddingNormal,
            minXNormal,
            minYNormal,
          );

          if (rowDataNormal.standartWerte) {
            drawUpperToleranceLine(
              ctxNormal,
              eckenListeNormal,
              rowDataNormal.standartWerte,
              scaleXNormal,
              scaleYNormal,
              paddingNormal,
              minXNormal,
              minYNormal,
            );
            drawLowerToleranceLine(
              ctxNormal,
              eckenListeNormal,
              rowDataNormal.standartWerte,
              scaleXNormal,
              scaleYNormal,
              paddingNormal,
              minXNormal,
              minYNormal,
            );
          }

          // Hervorhebung der angeklickten Zeile
          $('#recipesTDToverviewTable_cs tbody tr').removeClass(
            'highlightTableClick',
          );
          $(this).addClass('highlightTableClick');

          // if (lastSelectedRow) {
          //   $(lastSelectedRow.node()).removeClass('highlight');
          // }
          // $(this).addClass('highlight');
          // lastSelectedRow = dataTableNormal.row(this);
        });
      });
      loadLastSelectedRecipe();
    } else {
      console.error('Error or unsuccessful response:', res.data);
    }
  } catch (error) {
    console.error('Error in showRecipesTDToverviewTable_cs:', error);
    showAlert('error', err.response.data.message);
  }
};

export const showRecipesTDToverviewTable = async (user) => {
  console.log('bin showRecipesTDToverviewTable');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipes/recipesTDTtoLoad`,
      params: { user: user },
    });

    console.log('Response:', res);

    if (res.data && res.data.status === 'success') {
      console.log('Success in showRecipesTDToverviewTable');

      const userInlogt = JSON.parse(res.data.data.userInlogt);
      const userRole = userInlogt.role;
      console.log('userRole:', userRole);

      const recipesArray = res.data.data.recipesTDTtoLoad.map((recipe) => ({
        id: recipe._id,
        artikelNummer: recipe.kopfDaten.artikelNummer,
        artikelName: recipe.kopfDaten.artikelName,
        teileNummer: recipe.kopfDaten.teileNummer,
        zeichnungsNummer: recipe.kopfDaten.zeichnungsNummer,
        aenderungsstandZeichnung: recipe.kopfDaten.aenderungsstandZeichnung,
        aenderungsstandRezept: recipe.kopfDaten.aenderungsstandRezept,
        beschreibung: recipe.kopfDaten.beschreibung,
        ziehGeschwindigkeit: recipe.kopfDaten.ziehGeschwindigkeit,
        v_dorn_Fwd: recipe.kopfDaten.v_dorn_Fwd,
        v_dorn_Bwd: recipe.kopfDaten.v_dorn_Bwd,
        kommentar: JSON.stringify(recipe.kopfDaten.kommentar),
        lastCommentDate:
          recipe.kopfDaten.kommentar.length > 0
            ? new Date(
                recipe.kopfDaten.kommentar[
                  recipe.kopfDaten.kommentar.length - 1
                ].erstelltAm,
              ).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : 'bbb',
        lastCommentUser:
          recipe.kopfDaten.kommentar.length > 0
            ? recipe.kopfDaten.kommentar[recipe.kopfDaten.kommentar.length - 1]
                .createdBy.firstName
            : 'eeee',
        mindestGutanteil: recipe.rohrWerte.mindestGutanteil,
        profileGekoppelt: recipe.rohrWerte.profileGekoppelt,
        rohrAussenDurchmesserLetzterZug:
          recipe.dornWerte.rohrAussenDurchmesserLetzterZug,
        rohrInnenDurchmesserLetzterZug:
          recipe.dornWerte.rohrInnenDurchmesserLetzterZug,
        angel: recipe.dornWerte.angel,
        rohrAussenDurchmesserTDTZug:
          recipe.dornWerte.rohrAussenDurchmesserTDTZug,
        dornStufen: recipe.dornWerte.dornStufen,
        mehrfachlaengenDaten: recipe.mehrfachlaengenDaten,
        standartWerte: recipe.standartWerte,
        eckenListe: recipe.eckenListe,
        rohrWerte: recipe.rohrWerte,
      }));

      console.log('Recipes Array:', recipesArray);

      $('#recipesTDToverviewTable').empty();

      $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        // Angenommen, der Artikelname (Spalte 2) enthält die Geschwindigkeit (z. B. "25m/min").
        const artikelName = data[2] || ''; // Index 2 für die Artikelname-Spalte
        const selectedSpeed = $('#speedFilter').val(); // Aktueller Wert des Dropdowns

        if (selectedSpeed === 'all') {
          return true; // Alle anzeigen
        }

        // Filter: Nur Zeilen, die die ausgewählte Geschwindigkeit enthalten, anzeigen
        return artikelName.includes(selectedSpeed);
      });

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        // Parse dd.mm.yyyy hh:mm to Date
        const [datePart, timePart] = data.split(' ');

        if (!datePart) return 0; // Wenn kein gültiges Datum vorliegt

        const parts = datePart.split('.');
        if (parts.length !== 3) return 0;

        const [day, month, year] = parts;

        // Falls eine Zeitangabe existiert, diese auch berücksichtigen
        if (timePart) {
          const [hours, minutes] = timePart.split(':').map(Number);
          return new Date(
            year,
            month - 1,
            day,
            hours || 0,
            minutes || 0,
          ).getTime();
        }

        // Nur das Datum ohne Zeit
        return new Date(year, month - 1, day).getTime();
      };

      const dataTable = $('#recipesTDToverviewTable')
        .DataTable({
          pagingType: 'full_numbers',
          paging: true,
          scrollX: false,
          scrollY: 450,
          language: {
            lengthMenu: 'Display _MENU_ records per page', //'Display _MENU_ records per page',
            zeroRecords: 'Nothing found - sorry',
            info: 'Showing _START_ to _END_ of _TOTAL_ records', //'Showing page _PAGE_ of _PAGES_',
            infoEmpty: 'No records available',
            infoFiltered: '(filtered from _MAX_ total records)', //'(filtered from _MAX_ total records)',
            paginate: {
              first: 'First',
              last: 'Last',
              next: 'Next',
              previous: 'Previous',
            },
          },
          lengthChange: true,
          lengthMenu: [
            [2, 5, 10, -1],
            [2, 5, 10, 'All'],
          ],
          pageLength: -1, //-1=all 5,
          columns: [
            { data: 'id', visible: false },
            { data: 'artikelNummer', title: 'Item-Number', type: 'numeric' },
            { data: 'artikelName', title: 'Product-name' },
            { data: 'lastCommentDate', title: 'Last date', type: 'date-de' },
            { data: 'lastCommentUser', title: 'Last Editor' },
            {
              data: 'id',
              render: function (data) {
                console.log('Value of data:', data);
                if (userRole === 'user')
                  return `
                <a class="edit-button_blocked">
                  <svg class="heading-box__icon_blocked" >
                  <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                  </svg>
                </a>`;
                return `
                <a href="${apiUrl}/recipes/updateRecipe/${data}" class="edit-button">
                  <svg class="heading-box__icon">
                  <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                  </svg>
                </a>`;
              },
              orderable: false,
            },
          ],
          data: recipesArray,
        })
        .order([1, 'asc']);
      //.draw();

      // Dropdown für Geschwindigkeit (Filter)
      $('#speedFilter').on('change', function () {
        dataTable.draw(); // DataTable neu rendern
      });

      $(document).ready(function () {
        $('#recipesTDToverviewTable tbody').on('click', 'tr', function () {
          const rowData = dataTable.row(this).data();

          console.log('rowData bei Klick in Tabelle angewählt:', rowData);
          console.log('rowData.kommentar:', rowData.kommentar);

          localStorage.setItem('selectedRecipe', JSON.stringify(rowData));

          const eckenListe = rowData.eckenListe;

          const dynamicContent = generateDynamicContent_en(rowData);
          $('#rightDiv').html(dynamicContent);

          $('#recipeToSendRowdataInput').val(JSON.stringify(rowData));

          // Canvas für die Eckenliste zeichnen
          const canvas = document.getElementById('eckenCanvas');
          if (!canvas) {
            console.error('Canvas-Element nicht gefunden');
            return;
          }

          const ctx = canvas.getContext('2d');

          const padding = 120; //120;
          const minZXXX = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));

          // const minX = Math.max(
          //   minZXXX - 0.5,
          //   Math.min(0, ...eckenListe.ecke.map((ecke) => ecke.z)),
          // );
          const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
          //const minY = Math.min(...eckenListe.ecke.map((ecke) => ecke.z));
          const minY = Math.max(
            minZXXX - 0.5,
            Math.min(0, ...eckenListe.ecke.map((ecke) => ecke.z)),
          );
          //const minY = Math.min(0, ...eckenListe.ecke.map((ecke) => ecke.z));
          const scaleX =
            (ctx.canvas.width - 2 * padding) /
            (Math.max(...eckenListe.ecke.map((ecke) => ecke.x)) - minX);
          const scaleY =
            (ctx.canvas.height - 2 * padding) /
            (Math.max(...eckenListe.ecke.map((ecke) => ecke.z)) - minY);

          //drawXAxis(ctx, scaleY, padding, minY);

          //drawYAxis(ctx, scaleX, padding, minX);
          drawYAxis(ctx, eckenListe, padding, scaleX, minY, scaleY);
          drawXAxis(
            ctx,
            eckenListe,
            rowData.standartWerte,
            padding,
            scaleY,
            minX,
            minY,
          );
          //drawYAxis(ctx, eckenListe, padding, scaleX, minY);
          // drawYAxis(
          //   ctx,
          //   scaleX,
          //   padding,
          //   minX,
          //   rowData.standartWerte.obereToleranz,
          // );
          // drawYAxis(
          //   ctx,
          //   scaleX,
          //   padding,
          //   minX,
          //   eckenListe.ecke,
          //   //rowData.standartWerte.obereToleranz,
          //   //rowData.recipe.eckenListe,
          // );
          drawGrid(ctx, eckenListe, scaleX, scaleY, padding, minX, minY);
          drawEckenListe(ctx, eckenListe, scaleX, scaleY, padding, minX, minY);

          // //drawScaleX(ctx, eckenListe, rowData.standartWerte);
          if (rowData.standartWerte) {
            drawUpperToleranceLine(
              ctx,
              eckenListe,
              rowData.standartWerte,
              scaleX,
              scaleY,
              padding,
              minX,
              minY,
            );
            drawLowerToleranceLine(
              ctx,
              eckenListe,
              rowData.standartWerte,
              scaleX,
              scaleY,
              padding,
              minX,
              minY,
            );
          }
          $('#recipesTDToverviewTable tbody tr').removeClass(
            'highlightTableClick',
          );
          $(this).addClass('highlightTableClick');
        });
      });
      loadLastSelectedRecipe();
    } else {
      console.error('Error or unsuccessful response:', res.data);
    }
  } catch (error) {
    console.error('Error in showRecipesTDToverviewTable:', error);
    showAlert('error', err.response.data.message);
  }
};

function drawXAxis(
  ctx,
  eckenListe,
  standartWerte,
  padding,
  scaleY,
  minX,
  minY,
) {
  const xAxisY = ctx.canvas.height - padding - (0 - minY) * scaleY;

  console.log('xAxisY: ', xAxisY);

  // ctx.beginPath();
  // ctx.moveTo(padding, xAxisY);
  // ctx.lineTo(ctx.canvas.width - padding, xAxisY);
  // ctx.strokeStyle = 'black';
  // ctx.lineWidth = 20;
  // ctx.stroke();

  // // Beschriftung für die x-Länge
  // ctx.font = '10px Arial';
  // ctx.fillStyle = 'black';
  // ctx.textAlign = 'center';
  // //ctx.strokeStyle = 'red';

  const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
  const scaleX = (ctx.canvas.width - 2 * padding) / (maxX - minX);
  const yPos = ctx.canvas.height - padding + 0.2 / scaleY + 0;

  // for (let i = 0; i <= maxX; i++) {
  //   ctx.beginPath();
  //   ctx.moveTo(yPos, yPos + i);
  //   ctx.lineTo(yPos - 0.1, yPos + i);
  //   ctx.strokeStyle = 'pink';
  //   ctx.lineWidth = 3;
  //   ctx.stroke();
  // }

  for (let x = minX; x <= maxX; x += 250) {
    const xPos = padding + (x - minX) * scaleX;

    console.log('xPos: ' + xPos);

    ctx.fillText(x.toString(), xPos, yPos + 20);
  }

  const yPosXXX = ctx.canvas.height - padding + 0.2 / scaleY + 0; // gleiche yPos wie in vorherigen Funktion

  for (let i = 0; i <= ctx.canvas.width - 2 * padding; i++) {
    ctx.beginPath();
    ctx.moveTo(padding + i, yPosXXX);
    ctx.lineTo(padding + i + 1, yPosXXX); // Hier kann die Länge der Linie anpassen
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
// function drawXAxis(
//   ctx,
//   eckenListe,
//   standartWerte,
//   padding,
//   scaleY,
//   minX,
//   minY,
// ) {
//   const xAxisY = ctx.canvas.height - padding - (0 - minY) * scaleY;

//   console.log('xAxisY:', xAxisY); // Debugging-Ausgabe

//   ctx.beginPath();
//   ctx.moveTo(padding, xAxisY);
//   ctx.lineTo(ctx.canvas.width - padding, xAxisY);
//   ctx.strokeStyle = 'black';
//   ctx.stroke();
// }

//-----------------------down y funktioniert-------------------------------------------------------
function drawYAxis(ctx, eckenListe, padding, scaleX, minY, scaleY) {
  console.log('bin drawYaxis');
  // Y-Position der Y-Achse berechnen
  //const yAxisX = padding + (0 - minY) * scaleX;
  const yAxisX = padding + (0 - minY) * scaleX; //pposition 0 bei x-achse-0
  console.log('yAxisX: ' + yAxisX);
  console.log('scaleX: ' + scaleX);

  // Y-Achse zeichnen
  ctx.beginPath();
  ctx.moveTo(yAxisX, 0.5); //0.5); //padding);
  ctx.lineTo(yAxisX, ctx.canvas.height - padding);
  //ctx.lineTo(yAxisX, ctx.canvas.height - 130);
  ctx.strokeStyle = 'black';
  ctx.stroke();

  // Beschriftung für die Y-Länge
  ctx.font = '7px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'right';

  const maxY = Math.max(...eckenListe.ecke.map((ecke) => ecke.z));
  const minZ = Math.min(...eckenListe.ecke.map((ecke) => ecke.z)) - 0.5;

  const step = 0.1;
  for (let y = minZ; y <= maxY + 0.5; y += step) {
    //Schrift-bezeichnung
    //minZ - 0.2
    //const yPos = ctx.canvas.height - padding - (y - minY) * scaleY;
    const yPos = ctx.canvas.height - padding - (y - minY) * scaleY; // text unterhalb zahlen
    //ctx.fillText(y.toFixed(2), yAxisX - 10, yPos);
    ctx.fillText(y.toFixed(2), yAxisX - 10, yPos);
  }
}

function drawScaleX(ctx, eckenListe, standartWerte) {
  const padding = 210;

  // Skalierungsfaktor für die x-Länge berechnen
  const minX = Math.min(...eckenListe.ecke.map((ecke) => ecke.x));
  const maxX = Math.max(...eckenListe.ecke.map((ecke) => ecke.x));
  const scaleX = (ctx.canvas.width - 2 * padding) / (maxX - minX);

  // Minimalen und maximalen y-Wert unter Berücksichtigung von Toleranzen berechnen
  const minY = Math.min(
    ...(eckenListe.ecke.map((ecke) => ecke.z - standartWerte.untereToleranz) +
      2),
  );
  const maxY = Math.max(
    ...(eckenListe.ecke.map((ecke) => ecke.z + standartWerte.obereToleranz) +
      2),
  );

  // Skalierungsfaktor für die y-Höhe berechnen
  const scaleY = (ctx.canvas.height - 2 * padding) / (maxY - minY);

  // Y-Position der Achse anpassen, um unterhalb der Skizze zu liegen
  const yPos = ctx.canvas.height - padding + 0.2 / scaleY + 0;

  // Skala für die x-Länge zeichnen
  ctx.beginPath();
  ctx.moveTo(padding, yPos);
  ctx.lineTo(ctx.canvas.width - padding, yPos);
  ctx.stroke();

  // Beschriftung für die x-Länge
  ctx.font = '10px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';

  for (let x = minX; x <= maxX; x += 250) {
    const xPos = padding + (x - minX) * scaleX;
    ctx.fillText(x.toString(), xPos, yPos + 20);
  }
}

//----------------drawgrid und eckenliste funktioniert mit y-achse alt ---------------------
function drawGrid(ctx, eckenListe, scaleX, scaleY, padding, minX, minY) {
  ctx.beginPath();
  ctx.strokeStyle = '#ddd'; // Farbe des Rasters (z.B., grau)
  ctx.lineWidth = 1;

  // Vertikale Linien entsprechend der X-Achse
  eckenListe.ecke.forEach((ecke) => {
    const x = padding + (ecke.x - minX) * scaleX;
    ctx.moveTo(x, padding);
    ctx.lineTo(x, ctx.canvas.height - padding);
  });

  // Horizontale Linien entsprechend der Y-Wanddicke
  eckenListe.ecke.forEach((ecke) => {
    const y = ctx.canvas.height - padding - (ecke.z - minY) * scaleY;
    ctx.moveTo(padding, y);
    ctx.lineTo(ctx.canvas.width - padding, y);
  });

  ctx.stroke();
}

function drawEckenListe(ctx, eckenListe, scaleX, scaleY, padding, minX, minY) {
  // Eckenliste zeichnen
  ctx.beginPath();
  ctx.moveTo(
    padding + (eckenListe.ecke[0].x - minX) * scaleX,
    ctx.canvas.height - padding - (eckenListe.ecke[0].z - minY) * scaleY,
  );

  for (const ecke of eckenListe.ecke) {
    ctx.lineTo(
      padding + (ecke.x - minX) * scaleX,
      ctx.canvas.height - padding - (ecke.z - minY) * scaleY,
    );
  }

  ctx.strokeStyle = 'blue';
  ctx.stroke();
}

function drawUpperToleranceLine(
  ctx,
  eckenListe,
  standartWerte,
  scaleX,
  scaleY,
  padding,
  minX,
  minY,
) {
  const upperToleranceEckenListe = eckenListe.ecke.map((e) => {
    return { x: e.x, z: e.z + standartWerte.obereToleranz };
  });

  ctx.beginPath();
  ctx.strokeStyle = 'green';

  // Zeichne obere Toleranzlinie
  ctx.moveTo(
    padding + (upperToleranceEckenListe[0].x - minX) * scaleX,
    ctx.canvas.height -
      padding -
      (upperToleranceEckenListe[0].z - minY) * scaleY,
  );

  for (const ecke of upperToleranceEckenListe) {
    ctx.lineTo(
      padding + (ecke.x - minX) * scaleX,
      ctx.canvas.height - padding - (ecke.z - minY) * scaleY,
    );
  }

  ctx.stroke();
}

function drawLowerToleranceLine(
  ctx,
  eckenListe,
  standartWerte,
  scaleX,
  scaleY,
  padding,
  minX,
  minY,
) {
  const lowerToleranceEckenListe = eckenListe.ecke.map((e) => {
    return { x: e.x, z: e.z - standartWerte.untereToleranz };
  });

  ctx.beginPath();
  ctx.strokeStyle = 'darkgreen';

  // Zeichne untere Toleranzlinie
  ctx.moveTo(
    padding + (lowerToleranceEckenListe[0].x - minX) * scaleX,
    ctx.canvas.height -
      padding -
      (lowerToleranceEckenListe[0].z - minY) * scaleY,
  );

  for (const ecke of lowerToleranceEckenListe) {
    ctx.lineTo(
      padding + (ecke.x - minX) * scaleX,
      ctx.canvas.height - padding - (ecke.z - minY) * scaleY,
    );
  }

  ctx.stroke();
}

//-----------------------------------------------funktioniert-------------------------------

function generateDynamicContent(rowData) {
  const canvasWidth = 900; //550;
  const canvasHeight = 500; //550; //550; //800; //550;
  const maxX = 2000;
  const maxZ = 8;
  const tolerance = 2;

  return `

    <h1 style="margin-left:25px;">${rowData.artikelNummer}</h1>
    <h1 style="margin-left:25px;">${rowData.artikelName}</h1>

    <div id="eckenCanvasContainer" style="width: ${canvasWidth}px; height: 450px; border: 2px solid transparent; position: relative; overflow: hidden;">
      <canvas id="eckenCanvas" style="position: absolute;  border: 5px solid transparent; padding-top: 10px; margin-left: -75px; margin-top: 1px;" width="${canvasWidth}" height="${canvasHeight}"></canvas>
    </div>

    <!-- <p></p> -->
    <!-- <p></p> -->
    <!-- <p style="color: black;">Artikelnummer: ${
      rowData.artikelNummer
    }</p> -->
    <!-- <p style="color: black;">ArtikelName: ${rowData.artikelName}</p> -->
    <!-- <p>Kommentar: ${rowData.kommentar}</p> -->
    <!-- <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p> -->
    <!-- <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p> -->
    <!-- <p>StandartWerte: ${JSON.stringify(rowData.standartWerte)}</p> -->
    <!-- <p></p> -->
    <h2 style="color: black; margin-left:25px;">Zieh-Geschwindigkeit: ${rowData.ziehGeschwindigkeit}m/min &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  V-Dorn-Vor: ${JSON.stringify(rowData.v_dorn_Fwd)}% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   V-Dorn-Zurück: ${JSON.stringify(rowData.v_dorn_Bwd)}%</h2>
    <h2 style="color: black; margin-left:25px;">Profile gekoppelt: ${JSON.stringify(
      rowData.rohrWerte.profileGekoppelt,
    )}</h2>
    <h2 style="color: black; margin-left:25px;">Ausgleichstück: ${JSON.stringify(
      rowData.mehrfachlaengenDaten.ausgleichstueck,
    )}</h2>
    <!-- <br></br>  -->
    <!-- <p></p> -->
  `;
}

function generateDynamicContent_cs(rowData) {
  const canvasWidth = 900; //550;
  const canvasHeight = 500; //550; //550; //800; //550;
  const maxX = 2000;
  const maxZ = 8;
  const tolerance = 2;

  return `

    <h1 style="margin-left:25px;">${rowData.artikelNummer}</h1>
    <h1 style="margin-left:25px;">${rowData.artikelName}</h1>

    <div id="eckenCanvasContainer" style="width: ${canvasWidth}px; height: 450px; border: 2px solid transparent; position: relative; overflow: hidden;">
      <canvas id="eckenCanvas" style="position: absolute;  border: 5px solid transparent; padding-top: 10px; margin-left: -75px; margin-top: 1px;" width="${canvasWidth}" height="${canvasHeight}"></canvas>
    </div>

    <!-- <p></p> -->
    <!-- <p></p> -->
    <!-- <p style="color: black;">Artikelnummer: ${
      rowData.artikelNummer
    }</p> -->
    <!-- <p style="color: black;">ArtikelName: ${rowData.artikelName}</p> -->
    <!-- <p>Kommentar: ${rowData.kommentar}</p> -->
    <!-- <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p> -->
    <!-- <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p> -->
    <!-- <p>StandartWerte: ${JSON.stringify(rowData.standartWerte)}</p> -->
    <!-- <p></p> -->
    <h2 style="color: black; margin-left:25px;">Rychlost tažení: ${rowData.ziehGeschwindigkeit}m/min &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Rychlost trnu vpřed: ${JSON.stringify(rowData.v_dorn_Fwd)}% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Rychlost trnu zpět: ${JSON.stringify(rowData.v_dorn_Bwd)}%</h2>
    <h2 style="color: black; margin-left:25px;">Profily spojené: ${JSON.stringify(
      rowData.rohrWerte.profileGekoppelt,
    )}</h2>
    <h2 style="color: black; margin-left:25px;">Kompensátor / Mezikus: ${JSON.stringify(
      rowData.mehrfachlaengenDaten.ausgleichstueck,
    )}</h2>
    <!-- <br></br>  -->
    <!-- <p></p> -->
  `;
}

function generateDynamicContent_en(rowData) {
  const canvasWidth = 900; //550;
  const canvasHeight = 500; //550; //800; //550;
  const maxX = 2000;
  const maxZ = 8;
  const tolerance = 2;

  return `

    <h1 style="margin-left:25px;">${rowData.artikelNummer}</h1>
    <h1 style="margin-left:25px;">${rowData.artikelName}</h1>

    <div id="eckenCanvasContainer" style="width: ${canvasWidth}px; height: 450px; border: 2px solid transparent; position: relative; overflow: hidden;">
      <canvas id="eckenCanvas" style="position: absolute;  border: 5px solid transparent; padding-top: 10px; margin-left: -75px; margin-top: 1px;" width="${canvasWidth}" height="${canvasHeight}"></canvas>
    </div>

    <!-- <p></p> -->
    <!-- <p></p> -->
    <!-- <p style="color: black;">Artikelnummer: ${
      rowData.artikelNummer
    }</p> -->
    <!-- <p style="color: black;">ArtikelName: ${rowData.artikelName}</p> -->
    <!-- <p>Kommentar: ${rowData.kommentar}</p> -->
    <!-- <p>Dornstufen: ${JSON.stringify(rowData.dornstufen)}</p> -->
    <!-- <p>Eckenliste: ${JSON.stringify(rowData.eckenListe)}</p> -->
    <!-- <p>StandartWerte: ${JSON.stringify(rowData.standartWerte)}</p> -->
    <!-- <p></p> -->
    <!-- <h2 style="color: black; margin-left:25px;">Drawing-speed: ${JSON.stringify(
      rowData.ziehGeschwindigkeit,
    )}</h2> -->
    <h2 style="color: black; margin-left:25px;">Drawing-speed: ${rowData.ziehGeschwindigkeit}m/min &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Thorn-speed forward: ${JSON.stringify(rowData.v_dorn_Fwd)}% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   Thorn-speed backward: ${JSON.stringify(rowData.v_dorn_Bwd)}%</h2>
    <h2 style="color: black; margin-left:25px;">Profile-coupled: ${JSON.stringify(
      rowData.rohrWerte.profileGekoppelt,
    )}</h2>
    <h2 style="color: black; margin-left:25px;">Compensation- piece: ${JSON.stringify(
      rowData.mehrfachlaengenDaten.ausgleichstueck,
    )}</h2>
    <!-- <br></br> -->
    <!-- <p></p> -->
  `;
}

export default convertOldRecipes;
