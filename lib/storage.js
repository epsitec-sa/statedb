'use strict';

const _ = require('lodash');

class Storage {
  constructor(dbPath, appKey, opts) {
    this._dbPath = dbPath;
    this._appKey = appKey;
    this._opts = opts || {};
  }

  _getAppState() {
    return this._store.data.states[this._appKey];
  }

  async init() {
    const {LowSync, JSONFileSync} = await import('lowdb');
    const adapter = new JSONFileSync(`${this._dbPath}.db`);
    this._store = new LowSync(adapter);
    this._store.read();
  }

  initDb(initialState) {
    const appState = Object.assign({app: this._appKey}, initialState);
    if (!this._store.data.states || Array.isArray(this._store.data.states)) {
      this._store.data = {states: {}};
      this._store.write();
    }
    this._store.data.states[this._appKey] = appState;
    this._store.write();
  }

  getPersistedState(stateKey) {
    const value = this._getAppState();
    return value ? value[stateKey] : null;
  }

  persistState(stateKey, state) {
    _.assign(this._getAppState(), {[stateKey]: state});
    this._store.write();
  }
}

module.exports = async (dbPath, appKey, opts) => {
  const storage = new Storage(dbPath, appKey, opts);
  await storage.init();
  return {
    initDb: (initialState) => storage.initDb(initialState),
    getPersistedState: (stateKey) => storage.getPersistedState(stateKey),
    persistState: (stateKey, state) => storage.persistState(stateKey, state),
  };
};
