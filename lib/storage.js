'use strict';

const low = require('lowdb');

class Storage {
  constructor(dbPath, appKey, opts) {
    this._dbPath = dbPath;
    this._appKey = appKey;
    this._opts = opts || {};
    this._store = low(new (require('lowdb/adapters/FileSync'))(`${dbPath}.db`));
  }

  _getAppState() {
    return this._store.get(`states.${this._appKey}`);
  }

  initDb(initialState) {
    const appState = Object.assign({app: this._appKey}, initialState);
    if (
      !this._store.getState().states ||
      Array.isArray(this._store.getState().states)
    ) {
      this._store.setState({states: {}}).write();
    }
    this._store.set(`states.${this._appKey}`, appState).write();
  }

  getPersistedState(stateKey) {
    const value = this._getAppState().value();
    return value ? value[stateKey] : null;
  }

  persistState(stateKey, state) {
    this._getAppState()
      .assign({[stateKey]: state})
      .write();
  }
}

module.exports = (dbPath, appKey, opts) => {
  const storage = new Storage(dbPath, appKey, opts);
  return {
    initDb: (initialState) => storage.initDb(initialState),
    getPersistedState: (stateKey) => storage.getPersistedState(stateKey),
    persistState: (stateKey, state) => storage.persistState(stateKey, state),
  };
};
