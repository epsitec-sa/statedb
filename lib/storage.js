'use strict';

const _ = require('lodash');
const lowdb = import('lowdb');
class Storage {
  constructor(dbPath, appKey, opts, callback) {
    this._dbPath = dbPath;
    this._appKey = appKey;
    this._opts = opts || {};

    lowdb
      .then((lowdb) => {
        const {LowSync, JSONFileSync} = lowdb;
        const adapter = new JSONFileSync(`${dbPath}.db`);
        this._store = new LowSync(adapter);
        this._store.read();
        callback();
      })
      .catch(callback);
  }

  _getAppState() {
    return this._store.data.states[this._appKey];
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

module.exports = (dbPath, appKey, opts, callback) => {
  const storage = new Storage(dbPath, appKey, opts, (err) => {
    callback(err, {
      initDb: (initialState) => storage.initDb(initialState),
      getPersistedState: (stateKey) => storage.getPersistedState(stateKey),
      persistState: (stateKey, state) => storage.persistState(stateKey, state),
    });
  });
};
