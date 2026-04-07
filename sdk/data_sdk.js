/**
 * Fallback: CRUD em localStorage (mesmo formato esperado pelo app).
 */
(function () {
  var STORAGE_KEY = 'cessofilms_data_v1';

  function loadRows() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveRows(rows) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch (e) {}
    if (handler && typeof handler.onDataChanged === 'function') {
      handler.onDataChanged(rows);
    }
  }

  var handler = null;

  function newId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'id_' + Date.now() + '_' + Math.floor(Math.random() * 1e9);
  }

  window.dataSdk = {
    init: function (h) {
      handler = h;
      if (handler && typeof handler.onDataChanged === 'function') {
        handler.onDataChanged(loadRows());
      }
    },
    create: function (data) {
      var rows = loadRows();
      var row = Object.assign({}, data, { __backendId: newId() });
      rows.push(row);
      saveRows(rows);
      return { isOk: true };
    },
    update: function (item) {
      var rows = loadRows();
      var id = item.__backendId;
      var i = rows.findIndex(function (r) {
        return r.__backendId === id;
      });
      if (i === -1) return { isError: true };
      rows[i] = Object.assign({}, rows[i], item);
      saveRows(rows);
      return { isOk: true };
    },
    delete: function (item) {
      var id = item.__backendId;
      var rows = loadRows().filter(function (r) {
        return r.__backendId !== id;
      });
      saveRows(rows);
      return { isOk: true };
    }
  };
})();
