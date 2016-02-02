'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StateDb = function () {
  function StateDb(appKey) {
    _classCallCheck(this, StateDb);

    this._db = require('./storage.js')(appKey);
    this._existingState = null;
  }

  _createClass(StateDb, [{
    key: 'loadState',
    value: function loadState(stateKey) {
      this._existingState = this._db.getPersistedState(stateKey);
      if (!this._existingState) {
        this._db.initDb(_defineProperty({}, stateKey, null));
      }
      return this._existingState;
    }
  }, {
    key: 'saveState',
    value: function saveState(stateKey, state) {
      return this._db.persistState(stateKey, state);
    }
  }]);

  return StateDb;
}();

exports.default = StateDb;