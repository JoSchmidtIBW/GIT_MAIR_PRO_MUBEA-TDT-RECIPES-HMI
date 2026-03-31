/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts.js';
import process from 'process';

const dev_Port = 8555;
const prod_Port = 8557;

const port = process.env.NODE_ENV === 'development' ? dev_Port : prod_Port;
const host = 'http://127.0.0.1:';
const strPathApiV1 = '/api/v1';
const apiUrl = host + port + strPathApiV1;

export const createRecipeSendSPSLog = async (
  recipeSendDataParse,
  userSendData,
  fa_Nummer,
) => {
  console.log(
    'bin createRecipeSendSPSLog: zum serverschicken und habe bekommen: ',
    recipeSendDataParse,
    userSendData,
    fa_Nummer,
  );

  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipeSendSPSLog/createRecipeSendSPSLog`,
      data: {
        recipeData: recipeSendDataParse,
        userSendData: userSendData,
        fa_NummerData: fa_Nummer,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'RecipeSendSPSLog successfully created');

      // window.setTimeout(() => {
      //   location.assign(`${strPathApiV1}/overviewInlogt`); // über local funktioniert, weil user mit JWT angemeldet bleibt
      // }, 1200);
      console.log('bin js  res.config.data: ', res.config.data);
      return res;
    } else {
      console.log('RecipeSendSPSLog: Nichts beim server angekommen!');
      return res;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    throw err;
  }
};

export const createRecipeSendSPSLog_noInlogt = async (
  recipeSendDataParse,
  userSendData,
  fa_Nummer,
) => {
  console.log(
    'bin createRecipeSendSPSLog_noInlogt: zum serverschicken und habe bekommen: ',
    recipeSendDataParse,
    userSendData,
    fa_Nummer,
  );

  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipeSendSPSLog/createRecipeSendSPSLog`,
      data: {
        recipeData: recipeSendDataParse,
        userSendData: userSendData,
        fa_NummerData: fa_Nummer,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'RecipeSendSPSLog successfully created');

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Executed after 1 seconds');

      // window.setTimeout(() => {
      //   location.assign(`${strPathApiV1}/overview`); // über local funktioniert, weil user mit JWT angemeldet bleibt
      // }, 1200);
      console.log('bin js  res.config.data: ', res.config.data);
      return res;
    } else {
      console.log('RecipeSendSPSLog: Nichts beim server angekommen!');
      return res;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    throw err;
  }
};

export const showRecipesSendSPSLogTable = async () => {
  console.log('bin showRecipesSendSPSLogTable');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipeSendSPSLog`,
    });

    if (res.data.status === 'success') {
      console.log('success in showRecipesSendSPSLogTable');
      console.log('res.data.data: ', res.data.data);

      if ($.fn.DataTable.isDataTable('#recipesSendSPSLogTable')) {
        $('#recipesSendSPSLogTable').DataTable().destroy();
      }

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        // Parse dd.mm.yyyy to Date
        const parts = data.split('.');
        return parts.length === 3
          ? new Date(parts[2], parts[1] - 1, parts[0]).getTime()
          : 0;
      };

      const table = $('#recipesSendSPSLogTable').DataTable({
        data: res.data.data,
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true,
        language: {
          lengthMenu: 'Display _MENU_ records per page',
          zeroRecords: 'Nothing found - sorry',
          info: 'Showing _START_ to _END_ of _TOTAL_ records',
          infoEmpty: 'No records available',
          infoFiltered: '(filtered from _MAX_ total records)',
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
          [2, 5, 10, 'Alle'],
        ],
        pageLength: 5,
        columns: [
          {
            title: 'Order-<br>Number (FA)',
            data: 'fa_number',
            width: '8%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Item-<br>Number',
            data: 'recipeDataSend.kopfDaten.artikelNummer',
            width: '8%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'User-<br>Lastname',
            data: 'employeeSendBy.userOriginalID.lastName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Lastname',
            data: 'employeeSendBy.lastName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Firstname',
            data: 'employeeSendBy.firstName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Send-<br>date',
            data: 'createdSendAt',
            width: '7%',
            type: 'date-de',
            render: function (data) {
              return data
                ? new Date(data).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-';
            },
          },
          {
            title: 'Send-<br>time',
            data: 'createdSendAt',
            width: '7%',
            render: function (data) {
              return data
                ? new Date(data).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : '-';
            },
          },
          {
            title: 'Recipe-view',
            data: null,
            width: '40%',
            render: function (data, type, row, meta) {
              if (!row) return '-';
              const index = meta.row;

              return `
                <button class="btn btn--info toggle-RecipeEye-button" type="button" 
                  data-index="${index}" style="margin-left: 20px;">
                  <svg class="heading-box__icon" style="margin-bottom: -4px; height: 15px; width: 15px;">
                    <use xlink:href="/img/icons.svg#icon-eye" style="color: green;"></use>
                  </svg>
                  <a style="color: green; margin-bottom: 4px; margin-left: 5px;">Info</a>
                </button>
                <div id="exampleImg-RecipeEye-container-${index}" 
                     class="exampleImg-RecipeEye-container" style="display: none; margin-top: 10px;">
                  <pre>${JSON.stringify(row.recipeDataSend, null, 2)}</pre>
                </div>
              `;
            },
            // orderable: false, // Falls der Button nicht sortiert werden soll
            // searchable: false, // Falls der Button nicht durch die Suche gefunden werden soll
          },
        ],
        drawCallback: function () {
          console.log(
            'DataTable draw complete! Seite muss ev. 2x aktualisiert werden!',
          );
        },
        initComplete: function () {
          $('#recipesSendSPSLogTable thead th').each(function () {
            $(this).append(
              '<div class="arrowUpDown"><span class="arrow-up"></span><span class="arrow-down"></span></div>',
              //'<span class="arrow-up">↑</span><span class="arrow-down">↓</span>',
              //'<div class="button-upDown"><span class="arrow-up">↑j</span></div> <button class="button-upDown"><span class="arrow-down">↓j</span></button>',
            );
          });
        },
      });

      $('#recipesSendSPSLogTable')
        .off('click')
        .on('click', '.toggle-RecipeEye-button', function () {
          const index = $(this).data('index');
          const container = $(`#exampleImg-RecipeEye-container-${index}`);
          if (container.length) {
            container.toggle();
            const link = $(this).find('a');
            if (container.is(':visible')) {
              link.text('Close').css('color', 'red');
            } else {
              link.text('Info').css('color', 'green');
            }
          } else {
            console.error(
              `Container mit ID exampleImg-RecipeEye-container-${index} wurde nicht gefunden.`,
            );
          }
        });

      $('#recipesSendSPSLogTable').DataTable().order([1, 'asc']).draw();
    }
  } catch (error) {
    console.error('Fehler in showRecipesSendSPSLogTable:', error);
  }
};

export const showRecipesSendSPSLogTable_de = async () => {
  console.log('bin showRecipesSendSPSLogTable_de');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipeSendSPSLog`,
    });

    if (res.data.status === 'success') {
      console.log('success in showRecipesSendSPSLogTable_de');
      console.log('res.data.data: ', res.data.data);

      if ($.fn.DataTable.isDataTable('#recipesSendSPSLogTable_de')) {
        $('#recipesSendSPSLogTable_de').DataTable().destroy();
      }

      // $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
      //   // Parse dd.mm.yyyy to Date
      //   const parts = data.split('.');
      //   return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime(); // yyyy-mm-dd
      // };

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        // Parse dd.mm.yyyy to Date
        const parts = data.split('.');
        return parts.length === 3
          ? new Date(parts[2], parts[1] - 1, parts[0]).getTime()
          : 0;
      };

      const table = $('#recipesSendSPSLogTable_de').DataTable({
        data: res.data.data,
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true,
        language: {
          lengthMenu: 'Display _MENU_ Einträge pro Seite',
          zeroRecords: 'Nothing found - sorry',
          info: 'Zeige _START_ to _END_ of _TOTAL_ Einträge',
          infoEmpty: 'No records available',
          infoFiltered: '(filtered from _MAX_ total records)',
          paginate: {
            first: 'Erste',
            last: 'Letzte',
            next: 'Weiter',
            previous: 'Vorherige',
          },
        },
        lengthChange: true,
        lengthMenu: [
          [2, 5, 10, -1],
          [2, 5, 10, 'Alle'],
        ],
        pageLength: 5,
        columns: [
          {
            title: 'FA-Nummer',
            data: 'fa_number',
            width: '8%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Material-<br>Number',
            data: 'recipeDataSend.kopfDaten.artikelNummer',
            width: '8%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Benutzer-<br>Nachname',
            data: 'employeeSendBy.userOriginalID.lastName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Nachname',
            data: 'employeeSendBy.lastName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Vorname',
            data: 'employeeSendBy.firstName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          // {
          //   title: 'Sende-Datum',
          //   data: 'createdSendAt',
          //   width: '8%',
          //   render: function (data) {
          //     if (!data) return '-';
          //     const dateObj = new Date(data);
          //     const isoDate = dateObj.toISOString().split('T')[0]; // ISO-Format: yyyy-MM-dd
          //     const formattedDate = dateObj.toLocaleDateString('de-DE', {
          //       day: '2-digit',
          //       month: '2-digit',
          //       year: 'numeric',
          //     });
          //     return `<span data-sort="${isoDate}">${formattedDate}</span>`;
          //   },
          // },
          {
            title: 'Sende-<br>Datum',
            data: 'createdSendAt',
            width: '7%',
            type: 'date-de', // Custom type for sorting
            render: function (data) {
              return data
                ? new Date(data).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-';
            },
          },
          {
            title: 'Sende-<br>Uhrzeit',
            data: 'createdSendAt',
            width: '7%',
            render: function (data) {
              return data
                ? new Date(data).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : '-';
            },
          },
          {
            title: 'Rezept-Ansicht',
            data: null,
            width: '40%',
            render: function (data, type, row, meta) {
              if (!row) return '-';
              const index = meta.row;

              return `
                <button class="btn btn--info toggle-RecipeEye-button" type="button" 
                  data-index="${index}" style="margin-left: 20px;">
                  <svg class="heading-box__icon" style="margin-bottom: -4px; height: 15px; width: 15px;">
                    <use xlink:href="/img/icons.svg#icon-eye" style="color: green;"></use>
                  </svg>
                  <a style="color: green; margin-bottom: 4px; margin-left: 5px;">Info</a>
                </button>
                <div id="exampleImg-RecipeEye-container-${index}" 
                     class="exampleImg-RecipeEye-container" style="display: none; margin-top: 10px;">
                  <pre>${JSON.stringify(row.recipeDataSend, null, 2)}</pre>
                </div>
              `;
            },
            // orderable: false, // Falls der Button nicht sortiert werden soll
            // searchable: false, // Falls der Button nicht durch die Suche gefunden werden soll
          },
        ],
        drawCallback: function () {
          console.log(
            'DataTable draw complete! Seite muss ev. 2x aktualisiert werden!',
          );
        },
        initComplete: function () {
          $('#recipesSendSPSLogTable_de thead th').each(function () {
            $(this).append(
              '<div class="arrowUpDown"><span class="arrow-up"></span><span class="arrow-down"></span></div>',
              //'<span class="arrow-up">↑</span><span class="arrow-down">↓</span>',
              //'<div class="button-upDown"><span class="arrow-up">↑j</span></div> <button class="button-upDown"><span class="arrow-down">↓j</span></button>',
            );
          });
        },
      });

      $('#recipesSendSPSLogTable_de')
        .off('click')
        .on('click', '.toggle-RecipeEye-button', function () {
          const index = $(this).data('index');
          console.log('Click!');
          const container = $(`#exampleImg-RecipeEye-container-${index}`);
          if (container.length) {
            container.toggle();
            const link = $(this).find('a');
            if (container.is(':visible')) {
              link.text('Schließen').css('color', 'red');
            } else {
              link.text('Info').css('color', 'green');
            }
          } else {
            console.error(
              `Container mit ID exampleImg-RecipeEye-container-${index} wurde nicht gefunden.`,
            );
          }
        });

      $('#recipesSendSPSLogTable_de').DataTable().order([1, 'asc']).draw();
      //$('#recipesSendSPSLogTable_de').DataTable().order([4, 'asc']).draw(); // 4 ist der Index der Sende-Datum-Spalte
      // 1 for asc and -1 for desc
    }
  } catch (error) {
    console.error('Fehler in showRecipesSendSPSLogTable_de:', error);
  }
};

export const showRecipesSendSPSLogTable_cs = async () => {
  console.log('bin showRecipesSendSPSLogTable_de');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipeSendSPSLog`,
    });

    if (res.data.status === 'success') {
      console.log('success in showRecipesSendSPSLogTable_cs');
      console.log('res.data.data: ', res.data.data);

      if ($.fn.DataTable.isDataTable('#recipesSendSPSLogTable_cs')) {
        $('#recipesSendSPSLogTable_cs').DataTable().destroy();
      }

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        const parts = data.split('.');
        return parts.length === 3
          ? new Date(parts[2], parts[1] - 1, parts[0]).getTime()
          : 0;
      };

      const table = $('#recipesSendSPSLogTable_cs').DataTable({
        data: res.data.data,
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true,
        language: {
          search: 'Hledat:',
          lengthMenu: 'Zobrazit _MENU_ záznamy na stránku',
          zeroRecords: 'Nothing found - sorry',
          info: 'Zobrazit _START_ to _END_ of _TOTAL_ záznamy',
          infoEmpty: 'No records available',
          infoFiltered: '(filtered from _MAX_ total records)',
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
        pageLength: 5,
        columns: [
          {
            title: 'Číslo<br>objednávky',
            data: 'fa_number',
            width: '8%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Číslo<br>materiálu',
            data: 'recipeDataSend.kopfDaten.artikelNummer',
            width: '8%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Příjmení<br>uživatele',
            data: 'employeeSendBy.userOriginalID.lastName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Příjmení',
            data: 'employeeSendBy.lastName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Jméno',
            data: 'employeeSendBy.firstName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Datum<br>odeslání',
            data: 'createdSendAt',
            width: '7%',
            type: 'date-de',
            render: function (data) {
              return data
                ? new Date(data).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-';
            },
          },
          {
            title: 'Čas<br>odeslání',
            data: 'createdSendAt',
            width: '7%',
            render: function (data) {
              return data
                ? new Date(data).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : '-';
            },
          },
          {
            title: 'Zobrazení receptu',
            data: null,
            width: '40%',
            render: function (data, type, row, meta) {
              if (!row) return '-';
              const index = meta.row;

              return `
                <button class="btn btn--info toggle-RecipeEye-button" type="button" 
                  data-index="${index}" style="margin-left: 20px;">
                  <svg class="heading-box__icon" style="margin-bottom: -4px; height: 15px; width: 15px;">
                    <use xlink:href="/img/icons.svg#icon-eye" style="color: green;"></use>
                  </svg>
                  <a style="color: green; margin-bottom: 4px; margin-left: 5px;">Info</a>
                </button>
                <div id="exampleImg-RecipeEye-container-${index}" 
                     class="exampleImg-RecipeEye-container" style="display: none; margin-top: 10px;">
                  <pre>${JSON.stringify(row.recipeDataSend, null, 2)}</pre>
                </div>
              `;
            },
          },
        ],
        drawCallback: function () {
          console.log(
            'DataTable draw complete! Seite muss ev. 2x aktualisiert werden!',
          );
        },
        initComplete: function () {
          $('#recipesSendSPSLogTable_cs thead th').each(function () {
            $(this).append(
              '<div class="arrowUpDown"><span class="arrow-up"></span><span class="arrow-down"></span></div>',
            );
          });
        },
      });

      $('#recipesSendSPSLogTable_cs')
        .off('click')
        .on('click', '.toggle-RecipeEye-button', function () {
          const index = $(this).data('index');
          console.log('Click!');
          const container = $(`#exampleImg-RecipeEye-container-${index}`);
          if (container.length) {
            container.toggle();
            const link = $(this).find('a');
            if (container.is(':visible')) {
              link.text('Zavřít').css('color', 'red');
            } else {
              link.text('Info').css('color', 'green');
            }
          } else {
            console.error(
              `Container mit ID exampleImg-RecipeEye-container-${index} wurde nicht gefunden.`,
            );
          }
        });

      $('#recipesSendSPSLogTable_cs').DataTable().order([1, 'asc']).draw();
    }
  } catch (error) {
    console.error('Fehler in showRecipesSendSPSLogTable_cs:', error);
  }
};

export const showMyRecipeSendTable_de = async (userID) => {
  console.log('bin showMyRecipeSendTable_de + userID', userID);

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipeSendSPSLog/${userID}`,
    });

    if (res.data.status === 'success') {
      console.log('success in showMyRecipeSendTable_de');
      console.log('res.data.data: ', res.data.data);
      console.log('res.data.data: ', JSON.stringify(res.data.data));

      if ($.fn.DataTable.isDataTable('#myRecipeSendTable_de')) {
        $('#myRecipeSendTable_de').DataTable().destroy();
        $('#myRecipeSendTable_de').empty();
      }

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        // Parse dd.mm.yyyy to Date
        const parts = data.split('.');
        return parts.length === 3
          ? new Date(parts[2], parts[1] - 1, parts[0]).getTime()
          : 0;
      };

      const table = $('#myRecipeSendTable_de').DataTable({
        data: res.data.data,
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true,
        language: {
          lengthMenu: 'Zeige _MENU_ Einträge pro Seite',
          zeroRecords: 'Nothing found - sorry',
          info: 'Zeige _START_ to _END_ of _TOTAL_ Einträge',
          infoEmpty: 'Keine Einträge verfügbar',
          infoFiltered: '(filtered from _MAX_ total records)',
          paginate: {
            first: 'Erste',
            last: 'Letzte',
            next: 'Weiter',
            previous: 'Vorherige',
          },
        },
        lengthChange: true,
        lengthMenu: [
          [2, 5, 10, -1],
          [2, 5, 10, 'Alle'],
        ],
        pageLength: 5,
        columns: [
          {
            title: 'FA-Nummer',
            data: 'fa_number',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'ArtikelNummer',
            data: 'recipeDataSend.kopfDaten.artikelNummer',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'ArtikelName',
            data: 'recipeDataSend.kopfDaten.artikelName',
            width: '40%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Nachname',
            data: 'employeeSendBy.lastName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Vorname',
            data: 'employeeSendBy.firstName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Sende-Datum',
            data: 'createdSendAt',
            width: '10%',
            type: 'date-de', // Custom type for sorting
            render: function (data) {
              return data
                ? new Date(data).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-';
            },
          },
          {
            title: 'Sende- Uhrzeit',
            data: 'createdSendAt',
            width: '20%',
            render: function (data) {
              return data
                ? new Date(data).toLocaleString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : '-';
            },
          },
        ],

        initComplete: function () {
          $('#myRecipeSendTable_de thead th').each(function () {
            $(this).append(
              '<div class="arrowUpDown"><span class="arrow-up"></span><span class="arrow-down"></span></div>',
              //'<span class="arrow-up">↑</span><span class="arrow-down">↓</span>',
              //'<div class="button-upDown"><span class="arrow-up">↑j</span></div> <button class="button-upDown"><span class="arrow-down">↓j</span></button>',
            );
          });
        },
      });

      $('#myRecipeSendTable_de').DataTable().order([1, 'asc']).draw();
    }
  } catch (error) {
    console.error('Fehler in showMyRecipeSendTable_de:', error);
  }
};

export const showMyRecipeSendTable_cs = async (userID) => {
  console.log('bin showMyRecipeSendTable_cs + userID', userID);

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipeSendSPSLog/${userID}`,
    });

    if (res.data.status === 'success') {
      console.log('success in showMyRecipeSendTable_cs');
      console.log('res.data.data: ', res.data.data);
      console.log('res.data.data: ', JSON.stringify(res.data.data));

      if ($.fn.DataTable.isDataTable('#myRecipeSendTable_cs')) {
        $('#myRecipeSendTable_cs').DataTable().destroy();
        $('#myRecipeSendTable_cs').empty();
      }

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        // Parse dd.mm.yyyy to Date
        const parts = data.split('.');
        return parts.length === 3
          ? new Date(parts[2], parts[1] - 1, parts[0]).getTime()
          : 0;
      };

      const table = $('#myRecipeSendTable_cs').DataTable({
        data: res.data.data,
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true,
        language: {
          search: 'Hledat:',
          lengthMenu: 'Zobrazit _MENU_ záznamy na stránku',
          zeroRecords: 'Nothing found - sorry',
          info: 'Zobrazit _START_ to _END_ of _TOTAL_ záznamy',
          infoEmpty: 'Žádné záznamy nejsou k dispozici',
          infoFiltered: '(filtered from _MAX_ total records)',
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
        pageLength: 5,
        columns: [
          {
            title: 'Číslo zakázky',
            data: 'fa_number',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Číslo artiklu',
            data: 'recipeDataSend.kopfDaten.artikelNummer',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Název artiklu',
            data: 'recipeDataSend.kopfDaten.artikelName',
            width: '40%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Příjmení',
            data: 'employeeSendBy.lastName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Jméno',
            data: 'employeeSendBy.firstName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Datum odeslání',
            data: 'createdSendAt',
            width: '10%',
            type: 'date-de', // Custom type for sorting
            render: function (data) {
              return data
                ? new Date(data).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-';
            },
          },
          {
            title: '	Čas odeslání',
            data: 'createdSendAt',
            width: '20%',
            render: function (data) {
              return data
                ? new Date(data).toLocaleString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : '-';
            },
          },
        ],

        initComplete: function () {
          $('#myRecipeSendTable_cs thead th').each(function () {
            $(this).append(
              '<div class="arrowUpDown"><span class="arrow-up"></span><span class="arrow-down"></span></div>',
              //'<span class="arrow-up">↑</span><span class="arrow-down">↓</span>',
              //'<div class="button-upDown"><span class="arrow-up">↑j</span></div> <button class="button-upDown"><span class="arrow-down">↓j</span></button>',
            );
          });
        },
      });

      $('#myRecipeSendTable_cs').DataTable().order([1, 'asc']).draw();
    }
  } catch (error) {
    console.error('Fehler in showMyRecipeSendTable_cs:', error);
  }
};

export const showMyRecipeSendTable = async (userID) => {
  console.log('bin  showMyRecipeSendTable + userID', userID);

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipeSendSPSLog/${userID}`,
    });

    if (res.data.status === 'success') {
      console.log('success in showMyRecipeSendTable');
      console.log('res.data.data: ', res.data.data);
      console.log('res.data.data: ', JSON.stringify(res.data.data));

      if ($.fn.DataTable.isDataTable('#myRecipeSendTable')) {
        $('#myRecipeSendTable').DataTable().destroy();
        $('#myRecipeSendTable').empty();
      }

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        // Parse dd.mm.yyyy to Date
        const parts = data.split('.');
        return parts.length === 3
          ? new Date(parts[2], parts[1] - 1, parts[0]).getTime()
          : 0;
      };

      const table = $('#myRecipeSendTable').DataTable({
        data: res.data.data,
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true,
        language: {
          lengthMenu: 'Display _MENU_ records per page',
          zeroRecords: 'Nothing found - sorry',
          info: 'Showing _START_ to _END_ of _TOTAL_ records',
          infoEmpty: 'No records available',
          infoFiltered: '(filtered from _MAX_ total records)',
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
          [2, 5, 10, 'Alle'],
        ],
        pageLength: 5,
        columns: [
          {
            title: 'Ordernumber (FA)',
            data: 'fa_number',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Itemnumber',
            data: 'recipeDataSend.kopfDaten.artikelNummer',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Itemname',
            data: 'recipeDataSend.kopfDaten.artikelName',
            width: '40%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Lastname',
            data: 'employeeSendBy.lastName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Firstname',
            data: 'employeeSendBy.firstName',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Send- date',
            data: 'createdSendAt',
            width: '10%',
            type: 'date-de', // Custom type for sorting
            render: function (data) {
              return data
                ? new Date(data).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-';
            },
          },
          {
            title: 'Send- time',
            data: 'createdSendAt',
            width: '20%',
            render: function (data) {
              return data
                ? new Date(data).toLocaleString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : '-';
            },
          },
        ],

        initComplete: function () {
          $('#myRecipeSendTable thead th').each(function () {
            $(this).append(
              '<div class="arrowUpDown"><span class="arrow-up"></span><span class="arrow-down"></span></div>',
              //'<span class="arrow-up">↑</span><span class="arrow-down">↓</span>',
              //'<div class="button-upDown"><span class="arrow-up">↑j</span></div> <button class="button-upDown"><span class="arrow-down">↓j</span></button>',
            );
          });
        },
      });

      $('#myRecipeSendTable').DataTable().order([1, 'asc']).draw();
    }
  } catch (error) {
    console.error('Fehler in showMyRecipeSendTable:', error);
  }
};
