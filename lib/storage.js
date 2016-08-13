'use strict';

const low = require ('lowdb');

class Storage {
  constructor (dbPath, appKey, opts) {
    this._dbPath = dbPath;
    this._appKey = appKey;
    this._opts   = opts;
    this._store  = low (`${dbPath}.db`, opts && opts.async ? {
      storage: require ('lowdb/lib/file-async')
    } : {});
  }

  _getAppState () {
    return this._store
      .get ('states')
      .chain ()
      .find ({ app: this._appKey });
  }

  initDb (initialState) {
    const appState = Object.assign ({
      app: this._appKey
    }, initialState);

    return this._store
      .set ('states', [appState])
      .value ();
  }

  getPersistedState (stateKey) {
    const value = this._getAppState ().value ();
    return value ? value[stateKey] : null;
  }

  persistState (stateKey, state) {
    return this._getAppState ()
      .assign ({ [stateKey]: state })
      .value ();
  }
}

module.exports = (dbPath, appKey) => {
  const storage = new Storage (dbPath, appKey);
  return {
    initDb: (initialState) => storage.initDb (initialState),
    getPersistedState: (stateKey) => storage.getPersistedState (stateKey),
    persistState: (stateKey, state) => storage.persistState (stateKey, state)
  };
};
