'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var low = require('lowdb');
var storage = require('lowdb/file-async');

var store = function store(appKey) {
  return low(appKey + '.db', { storage: storage });
};

var _initDb = function _initDb(appKey, initialState) {
  var appState = Object.assign({
    app: appKey
  }, initialState);
  return store(appKey)('states').push(appState);
};

var getAppState = function getAppState(appKey) {
  return store(appKey)('states').chain().find({ app: appKey });
};

var _getPersistedState = function _getPersistedState(appKey, stateKey) {
  var value = getAppState(appKey).value();
  return value ? value[stateKey] : null;
};

var _persistState = function _persistState(appKey, stateKey, state) {
  return getAppState(appKey).assign(_defineProperty({}, stateKey, state)).value();
};

module.exports = function (appKey) {
  return {
    initDb: function initDb(initialState) {
      return _initDb(appKey, initialState);
    },
    getPersistedState: function getPersistedState(stateKey) {
      return _getPersistedState(appKey, stateKey);
    },
    persistState: function persistState(stateKey, state) {
      return _persistState(appKey, stateKey, state);
    }
  };
};