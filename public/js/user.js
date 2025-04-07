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

export const showUsers_de = async () => {
  console.log('bin showUsers_de');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/users`,
    });

    if (res.data.status === 'success') {
      console.log('success in ShowUsers_de');
      // console.log(
      //   'JSON.stringify(res.data.data.data): ' +
      //     JSON.stringify(res.data.data.data),
      // );

      $('#manageUsersTable_de').DataTable().destroy();

      $('#manageUsersTable_de').DataTable({
        data: res.data.data.data,
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true,
        //scrollY: 400,
        language: {
          lengthMenu: 'Display _MENU_ Nutzer pro Seite',
          zeroRecords: 'Nothing found - sorry',
          info: 'Zeige _START_ to _END_ of _TOTAL_ Nutzer',
          infoEmpty: 'No records available',
          infoFiltered: '(filtered from _MAX_ total records)',
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
        pageLength: 5,
        columns: [
          {
            data: '_id',
            visible: false,
          },
          { data: 'employeeNumber' },
          { data: 'lastName' },
          { data: 'firstName' },
          { data: 'language' },
          { data: 'professional' },
          { data: 'photo', visible: false },
          { data: 'email' },
          { data: 'role' },
          { data: 'department' },
          { data: 'password', visible: false },
          {
            data: 'createdAt',
            render: function (data) {
              const date = new Date(data);
              const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              };
              return date.toLocaleDateString('de-DE', options);
            },
          },
          {
            data: '_id',
            render: function (data) {
              console.log('Value of data:', data);
              return `
              <a href="${apiUrl}/manage_users/${data}" class="edit-button">
                <svg class="heading-box__icon">
                <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                </svg>
              </a>`;
            },
            orderable: false,
          },
        ],
      });

      $('#manageUsersTable_de').DataTable().order([1, 'asc']).draw();

      const $employeeNumSortAscBtn = $(
        '#manageUsersTable_de th.employee-number button-upDown.spam.arrow-up',
      );
      const $employeeNumSortDescBtn = $(
        '#manageUsersTable_de th.employee-number button-upDown.spam.arrow-down',
      );

      $employeeNumSortAscBtn.on('click', function () {
        $('#manageUsersTable_de').DataTable().order([1, 'asc']).draw();
      });

      $employeeNumSortDescBtn.on('click', function () {
        $('#manageUsersTable_de').DataTable().order([1, 'desc']).draw();
      });

      const totalRecords = $('#manageUsersTable_de')
        .DataTable()
        .page.info().recordsTotal;
      $('#totalUsers').text(`Total Users: ${totalRecords}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const showUsers_cs = async () => {
  console.log('bin showUsers_cs');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/users`,
    });

    if (res.data.status === 'success') {
      console.log('success in ShowUsers_cs');
      // console.log(
      //   'JSON.stringify(res.data.data.data): ' +
      //     JSON.stringify(res.data.data.data),
      // );

      $('#manageUsersTable_cs').DataTable().destroy();

      $('#manageUsersTable_cs').DataTable({
        data: res.data.data.data,
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true,
        //scrollY: 400,
        language: {
          search: 'Hledat:',
          lengthMenu: 'Zobrazit _MENU_ Uživatelé na stránku',
          zeroRecords: 'Nothing found - sorry',
          info: 'Zobrazit _START_ to _END_ of _TOTAL_ uživatele',
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
            data: '_id',
            visible: false,
          },
          { data: 'employeeNumber' },
          { data: 'lastName' },
          { data: 'firstName' },
          { data: 'language' },
          { data: 'professional' },
          { data: 'photo', visible: false },
          { data: 'email' },
          { data: 'role' },
          { data: 'department' },
          { data: 'password', visible: false },
          {
            data: 'createdAt',
            render: function (data) {
              const date = new Date(data);
              const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              };
              return date.toLocaleDateString('de-DE', options);
            },
          },
          {
            data: '_id',
            render: function (data) {
              console.log('Value of data:', data);
              return `
              <a href="${apiUrl}/manage_users/${data}" class="edit-button">
                <svg class="heading-box__icon">
                <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                </svg>
              </a>`;
            },
            orderable: false,
          },
        ],
      });

      $('#manageUsersTable_cs').DataTable().order([1, 'asc']).draw();

      const $employeeNumSortAscBtn = $(
        '#manageUsersTable_cs th.employee-number button-upDown.spam.arrow-up',
      );
      const $employeeNumSortDescBtn = $(
        '#manageUsersTable_cs th.employee-number button-upDown.spam.arrow-down',
      );

      $employeeNumSortAscBtn.on('click', function () {
        $('#manageUsersTable_cs').DataTable().order([1, 'asc']).draw();
      });

      $employeeNumSortDescBtn.on('click', function () {
        $('#manageUsersTable_cs').DataTable().order([1, 'desc']).draw();
      });

      const totalRecords = $('#manageUsersTable_cs')
        .DataTable()
        .page.info().recordsTotal;
      $('#totalUsers').text(`Total Users: ${totalRecords}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const showUsers = async () => {
  console.log('bin showUsers');

  try {
    const res = await axios({
      method: 'GET',
      url: `${apiUrl}/users`,
    });

    if (res.data.status === 'success') {
      console.log('success in ShowUsers');
      //console.log('res.data.data.data: ' + res.data.data.data._id);

      $('#manageUsersTable').DataTable().destroy();

      $('#manageUsersTable').DataTable({
        data: res.data.data.data,
        dom: 'l<"toolbar">frtip',
        pagingType: 'full_numbers',
        paging: true,
        //scrollY: 400,
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
          [2, 5, 10, 'All'],
        ],
        pageLength: 5,
        columns: [
          {
            data: '_id',
            visible: false,
          },
          { data: 'employeeNumber' },
          { data: 'lastName' },
          { data: 'firstName' },
          { data: 'language' },
          { data: 'professional' },
          { data: 'photo', visible: false },
          { data: 'email' },
          { data: 'role' },
          { data: 'department' },
          { data: 'password', visible: false },
          {
            data: 'createdAt',
            render: function (data) {
              const date = new Date(data);
              const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              };
              return date.toLocaleDateString('de-DE', options);
            },
          },
          {
            data: '_id',
            render: function (data) {
              console.log('Value of data:', data);
              return `
              <a href="${apiUrl}/manage_users/${data}" class="edit-button">
                <svg class="heading-box__icon">
                <use xlink:href="/img/icons.svg#icon-edit-3"></use>
                </svg>
              </a>`;
            },
            orderable: false,
          },
        ],
      });

      $('#manageUsersTable').DataTable().order([1, 'asc']).draw();

      const $employeeNumSortAscBtn = $(
        '#manageUsersTable th.employee-number button-upDown.spam.arrow-up',
      );
      const $employeeNumSortDescBtn = $(
        '#manageUsersTable th.employee-number button-upDown.spam.arrow-down',
      );

      $employeeNumSortAscBtn.on('click', function () {
        $('#manageUsersTable').DataTable().order([1, 'asc']).draw();
      });

      $employeeNumSortDescBtn.on('click', function () {
        $('#manageUsersTable').DataTable().order([1, 'desc']).draw();
      });

      const totalRecords = $('#manageUsersTable')
        .DataTable()
        .page.info().recordsTotal;
      $('#totalUsers').text(`Total Users: ${totalRecords}`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateUser = async (data, id) => {
  console.log('bin updateUser in user.js');
  console.log('JSON.stringify(data): ' + JSON.stringify(data));
  console.log('id: ' + id);
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/users/` + id,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User successfully updated');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_users`); //
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteUser = async (id) => {
  console.log('bin deleteUser und id: ' + id);
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${apiUrl}/users/${id}`,
    });

    if (res.status === 204) {
      showAlert('success', 'User successfully deleted');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_users`);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createNewUser = async (
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
) => {
  console.log('bin createNewUser zum serverschicken');
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/users/createNewUser`,
      data: {
        employeeNumber: employeeNumber,
        firstName: firstname,
        lastName: lastname,
        language: language,
        professional: professional,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        role: role,
        department: department,
        active: true,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User signed up successfully');
      window.setTimeout(() => {
        location.assign(`${strPathApiV1}/manage_users`);
      }, 1200);
    } else {
      console.log('not success!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
