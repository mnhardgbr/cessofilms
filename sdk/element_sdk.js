/**
 * Fallback para ambientes sem plataforma (GitHub Pages, arquivo local).
 * Persiste tema/título em localStorage.
 */
(function () {
  var STORAGE_KEY = 'cessofilms_ui_config_v1';

  window.elementSdk = {
    _defaultConfig: null,
    _config: null,
    _onConfigChange: null,

    init: function (opts) {
      this._defaultConfig = opts.defaultConfig;
      var stored = null;
      try {
        stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      } catch (e) {
        stored = null;
      }
      this._config = Object.assign({}, opts.defaultConfig, stored || {});
      this._onConfigChange = opts.onConfigChange;
      if (typeof this._onConfigChange === 'function') {
        this._onConfigChange(this._config);
      }
    },

    setConfig: function (partial) {
      this._config = Object.assign({}, this._config || this._defaultConfig || {}, partial);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._config));
      } catch (e) {}
      if (typeof this._onConfigChange === 'function') {
        this._onConfigChange(this._config);
      }
    }
  };
})();
