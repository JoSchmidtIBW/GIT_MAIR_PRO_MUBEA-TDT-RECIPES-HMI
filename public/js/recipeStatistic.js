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

export const createRecipeStatistic = async (
  recipeSendSPSLogID,
  userSendData,
  fa_Nummer,
) => {
  console.log(
    'bin createRecipeStatistic zum serverschicken und habe bekommen: ',
    recipeSendSPSLogID,
    userSendData,
    fa_Nummer,
  );

  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipeStatistic/createRecipeStatistic`,
      data: {
        recipeSendSPSLogID: recipeSendSPSLogID,
        userSendData: userSendData,
        fa_NummerData: fa_Nummer,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'RecipeStatistic successfully created or updated');

      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Executed after 2 seconds');

      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overviewInlogt`);
      }, 1200);
    } else {
      console.log('Failed to create or update recipeStatistic!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createRecipeStatistic_noInlogt = async (
  recipeSendSPSLogID,
  userSendData,
  fa_Nummer,
) => {
  console.log(
    'bin createRecipeStatistic_noInlogt zum serverschicken und habe bekommen: ',
    recipeSendSPSLogID,
    userSendData,
    fa_Nummer,
  );

  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/recipeStatistic/createRecipeStatistic`,
      data: {
        recipeSendSPSLogID: recipeSendSPSLogID,
        userSendData: userSendData,
        fa_NummerData: fa_Nummer,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'RecipeStatistic successfully created or updated');

      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // console.log('Executed after 2 seconds');

      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/overview`);
      }, 1200);
    } else {
      console.log('Failed to create or update recipeStatistic!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const showRecipeStatisticTable_de = async () => {
  console.log('bin showRecipeStatisticTable_de');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipeStatistic`,
    });

    if (res.data.status === 'success') {
      console.log('success in showRecipeStatisticTable_de');
      console.log('res.data.data: ', res.data.data);
      console.log('res.data.data: ', JSON.stringify(res.data.data));

      if ($.fn.DataTable.isDataTable('#recipeStatisticTable_de')) {
        $('#recipeStatisticTable_de').DataTable().destroy();
        $('#recipeStatisticTable_de').empty();
      }

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

      const table = $('#recipeStatisticTable_de').DataTable({
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
            title: 'Artikelnummer',
            data: 'artikelNummer',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Total-<br>Gesendet',
            data: 'totalSends',
            width: '6%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'FA-Nummer(n)',
            // title:
            //   'FA-Nummer(n) <div class="button-upDown"><span class="arrow-up">↑j</span></div> <button class="button-upDown"><span class="arrow-down">↓j</span></button>',
            data: 'faNumbers',
            width: '10%',
            render: function (data) {
              return Array.isArray(data) ? data.join('<br>') : data || '-';
            },
          },
          {
            title: 'Sendungen',
            data: 'sendData', // Referenz auf das gesamte Array
            width: '10%',
            render: function (data) {
              // Überprüfen, ob `sendData` ein Array ist
              if (Array.isArray(data)) {
                return data
                  .map((item) =>
                    item.sendDate
                      ? new Date(item.sendDate).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })
                      : '-',
                  )
                  .join('<br>'); // Zeilenumbruch zwischen den Daten
              } else {
                return '-';
              }
            },
          },
          // {
          //   title: 'Sendungeeeen',
          //   data: 'sendData.sendDate',
          //   width: '10%',
          //   // render: function (data) {
          //   //   return Array.isArray(data)
          //   //     ? new Date(data).toLocaleDateString('de-DE', {
          //   //         day: '2-digit',
          //   //         month: '2-digit',
          //   //         year: 'numeric',
          //   //         hour: '2-digit',
          //   //         minute: '2-digit',
          //   //         hour12: false,
          //   //       })
          //   //     : '-';
          //   // },
          //   // render: function (data) {
          //   //   return data || '-';
          //   // },
          //   // render: function (data) {
          //   //   return Array.isArray(data) ? data.join('<br>') : data || '-';
          //   // },
          //   render: function (data) {
          //     // Überprüfen, ob `sendData` ein Array ist
          //     //if (Array.isArray(data)) {
          //     return (
          //       Array.isArray(data)
          //         //return data
          //         .map((item) =>
          //           item.sendDate
          //             ? new Date(item.sendDate).toLocaleDateString('de-DE', {
          //                 day: '2-digit',
          //                 month: '2-digit',
          //                 year: 'numeric',
          //                 hour: '2-digit',
          //                 minute: '2-digit',
          //                 hour12: false,
          //               })
          //             : '-',
          //         )
          //         .join('<br>')
          //     );
          //     //);
          //     // } else {
          //     //   return '-';
          //     // }
          //   },
          // },
          {
            title: 'Zieh-<br>Geschwindigkeit(en)',
            data: 'ziehGeschwindigkeiten',
            width: '10%',
            render: function (data) {
              return Array.isArray(data) ? data.join('<br>') : data || '-';
            },
          },
          // {
          //   title: 'Letzte-<br>Sendungen',
          //   data: 'lastSendAt',
          //   width: '10%',
          //   type: 'date-de', // Custom type for sorting
          //   render: function (data) {
          //     return data
          //       ? new Date(data).toLocaleDateString('de-DE', {
          //           day: '2-digit',
          //           month: '2-digit',
          //           year: 'numeric',
          //           hour: '2-digit',
          //           minute: '2-digit',
          //           hour12: false,
          //         })
          //       : '-';
          //   },
          // },
          {
            title: 'Dorn-<br>Geschwindigkeit(en)',
            data: 'dornGeschwindigkeiten',
            width: '10%',
            render: function (data) {
              if (Array.isArray(data) && data.length > 0) {
                return data
                  .map(
                    (item) =>
                      `vFwd: ${item.dVFwd || '-'}%, vBwd: ${item.dVBwd || '-'}%`,
                  )
                  .join('<br>'); // Zeilenumbruch zwischen den Einträgen
              } else {
                return '-';
              }
            },
          },
          {
            title: 'Letzte-<br>Sendungen',
            data: 'lastSendAt',
            width: '10%',
            type: 'date-de', // Custom type for sorting
            render: function (data) {
              return data
                ? new Date(data).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }) +
                    ' ' +
                    new Date(data).toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                : '-';
            },
          },
          {
            title: 'Artikelname(n)',
            data: 'artikelRealName',
            width: '34%',
            render: function (data) {
              return Array.isArray(data)
                ? data.join('<br>')
                : JSON.stringify(data) || '-';
            },
          },
        ],
        //ordering: true, // Aktiviert Sortierung
        initComplete: function () {
          $('#recipeStatisticTable_de thead th').each(function () {
            $(this).append(
              '<div class="arrowUpDown"><span class="arrow-up"></span><span class="arrow-down"></span></div>',
              //'<span class="arrow-up">↑</span><span class="arrow-down">↓</span>',
              //'<div class="button-upDown"><span class="arrow-up">↑j</span></div> <button class="button-upDown"><span class="arrow-down">↓j</span></button>',
            );
          });
        },
      });

      // $('#recipeStatisticTable_de').DataTable().order([1, 'asc']).draw();

      // $(document).on('click', '.arrow-up', function () {
      //   table.order([1, 'asc']).draw(); // Sortiere nach der zweiten Spalte (Index 1) aufsteigend
      // });

      // // Event für "arrow-down"
      // $(document).on('click', '.arrow-down', function () {
      //   table.order([1, 'desc']).draw(); // Sortiere nach der zweiten Spalte (Index 1) absteigend
      // });
    }
  } catch (error) {
    console.error('Fehler in showRecipeStatisticTable_de:', error);
  }
};

export const showRecipeStatisticTable_cs = async () => {
  console.log('bin showRecipeStatisticTable_cs');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipeStatistic`,
    });

    if (res.data.status === 'success') {
      console.log('success in showRecipeStatisticTable_cs');
      console.log('res.data.data: ', res.data.data);
      console.log('res.data.data: ', JSON.stringify(res.data.data));

      if ($.fn.DataTable.isDataTable('#recipeStatisticTable_cs')) {
        $('#recipeStatisticTable_cs').DataTable().destroy();
        $('#recipeStatisticTable_cs').empty();
      }

      $.fn.dataTable.ext.type.order['date-de-pre'] = function (data) {
        const [datePart, timePart] = data.split(' ');

        if (!datePart) return 0;

        const parts = datePart.split('.');
        if (parts.length !== 3) return 0;

        const [day, month, year] = parts;

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

        return new Date(year, month - 1, day).getTime();
      };

      const table = $('#recipeStatisticTable_cs').DataTable({
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
            title: 'Číslo<br>artiklu',
            data: 'artikelNummer',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Celkem-<br>odesláno',
            data: 'totalSends',
            width: '6%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Číslo(čísla)<br>objednávky',
            data: 'faNumbers',
            width: '10%',
            render: function (data) {
              return Array.isArray(data) ? data.join('<br>') : data || '-';
            },
          },
          {
            title: 'Odeslání',
            data: 'sendData',
            width: '10%',
            render: function (data) {
              if (Array.isArray(data)) {
                return data
                  .map((item) =>
                    item.sendDate
                      ? new Date(item.sendDate).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })
                      : '-',
                  )
                  .join('<br>');
              } else {
                return '-';
              }
            },
          },
          {
            title: 'Rychlost<br>tažení',
            data: 'ziehGeschwindigkeiten',
            width: '10%',
            render: function (data) {
              return Array.isArray(data) ? data.join('<br>') : data || '-';
            },
          },
          {
            title: 'Rychlost<br>trnu',
            data: 'dornGeschwindigkeiten',
            width: '10%',
            render: function (data) {
              if (Array.isArray(data) && data.length > 0) {
                return data
                  .map(
                    (item) =>
                      `vFwd: ${item.dVFwd || '-'}%, vBwd: ${item.dVBwd || '-'}%`,
                  )
                  .join('<br>');
              } else {
                return '-';
              }
            },
          },
          {
            title: 'Poslední<br>odeslání',
            data: 'lastSendAt',
            width: '10%',
            type: 'date-de', // Custom type for sorting
            render: function (data) {
              return data
                ? new Date(data).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }) +
                    ' ' +
                    new Date(data).toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                : '-';
            },
          },
          {
            title: 'Název(názvy)<br>artiklu',
            data: 'artikelRealName',
            width: '34%',
            render: function (data) {
              return Array.isArray(data)
                ? data.join('<br>')
                : JSON.stringify(data) || '-';
            },
          },
        ],
        initComplete: function () {
          $('#recipeStatisticTable_cs thead th').each(function () {
            $(this).append(
              '<div class="arrowUpDown"><span class="arrow-up"></span><span class="arrow-down"></span></div>',
            );
          });
        },
      });
    }
  } catch (error) {
    console.error('Fehler in showRecipeStatisticTable_cs:', error);
  }
};

export const showRecipeStatisticTable = async () => {
  console.log('bin showRecipeStatisticTable');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/recipeStatistic`,
    });

    if (res.data.status === 'success') {
      console.log('success in showRecipeStatisticTable');
      console.log('res.data.data: ', res.data.data);
      console.log('res.data.data: ', JSON.stringify(res.data.data));

      if ($.fn.DataTable.isDataTable('#recipeStatisticTable')) {
        $('#recipeStatisticTable').DataTable().destroy();
        $('#recipeStatisticTable').empty();
      }

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

      const table = $('#recipeStatisticTable').DataTable({
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
            title: 'Itemnumber',
            data: 'artikelNummer',
            width: '10%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Total-<br>Sends',
            data: 'totalSends',
            width: '6%',
            render: function (data) {
              return data || '-';
            },
          },
          {
            title: 'Ordernumber(s) (FA)',
            data: 'faNumbers',
            width: '10%',
            render: function (data) {
              return Array.isArray(data) ? data.join('<br>') : data || '-';
            },
          },
          {
            title: 'Sent',
            data: 'sendData', // Referenz auf das gesamte Array
            width: '10%',
            render: function (data) {
              // Überprüfen, ob `sendData` ein Array ist
              if (Array.isArray(data)) {
                return data
                  .map((item) =>
                    item.sendDate
                      ? new Date(item.sendDate).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })
                      : '-',
                  )
                  .join('<br>'); // Zeilenumbruch zwischen den Daten
              } else {
                return '-';
              }
            },
          },
          {
            title: 'Draw-<br>Speed(s)',
            data: 'ziehGeschwindigkeiten',
            width: '10%',
            render: function (data) {
              return Array.isArray(data) ? data.join('<br>') : data || '-';
            },
          },
          {
            title: 'Thorn-<br>Speed(s)',
            data: 'dornGeschwindigkeiten',
            width: '10%',
            render: function (data) {
              if (Array.isArray(data) && data.length > 0) {
                return data
                  .map(
                    (item) =>
                      `vFwd: ${item.dVFwd || '-'}%, vBwd: ${item.dVBwd || '-'}%`,
                  )
                  .join('<br>'); // Zeilenumbruch zwischen den Einträgen
              } else {
                return '-';
              }
            },
          },
          // {
          //   title: 'Last- Send',
          //   data: 'lastSendAt',
          //   width: '10%',
          //   render: function (data) {
          //     return data
          //       ? new Date(data).toLocaleDateString('de-DE', {
          //           day: '2-digit',
          //           month: '2-digit',
          //           year: 'numeric',
          //           hour: '2-digit',
          //           minute: '2-digit',
          //           hour12: false,
          //         })
          //       : '-';
          //   },
          // },
          {
            title: 'Last- Send',
            data: 'lastSendAt',
            width: '10%',
            type: 'date-de', // Custom type for sorting
            render: function (data) {
              return data
                ? new Date(data).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }) +
                    ' ' +
                    new Date(data).toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                : '-';
            },
          },
          {
            title: 'Itemname(s)',
            data: 'artikelRealName',
            width: '34%',
            render: function (data) {
              return Array.isArray(data) ? data.join('<br>') : data || '-';
            },
          },
        ],
        //});

        //$('#recipeStatisticTable').DataTable().order([1, 'asc']).draw();

        initComplete: function () {
          $('#recipeStatisticTable thead th').each(function () {
            $(this).append(
              '<div class="arrowUpDown"><span class="arrow-up"></span><span class="arrow-down"></span></div>',
              //'<span class="arrow-up">↑</span><span class="arrow-down">↓</span>',
              //'<div class="button-upDown"><span class="arrow-up">↑j</span></div> <button class="button-upDown"><span class="arrow-down">↓j</span></button>',
            );
          });
        },
      });
      //}
    }
  } catch (error) {
    console.error('Fehler in showRecipeStatisticTable:', error);
  }
};
