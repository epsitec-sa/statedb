'use strict';

const low = require ('lowdb');

class Storage {
  constructor (dbPath, appKey, opts) {
    this._dbPath = dbPath;
    this._appKey = appKey;
    this._opts   = opts || {};
    this._store  = low (`${dbPath}.db`, this._opts.async ? {
      storage: require ('lowdb/lib/file-async'),
      writeOnChange: false
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
    const result = this._getAppState ()
      .assign ({ [stateKey]: state })
      .value ();

    if (this._opts.async) {
      return this._store.write ();
    }

    return result;
  }

}

module.exports = (dbPath, appKey, opts) => {
  const storage = new Storage (dbPath, appKey, opts);
  return {
    initDb: (initialState) => storage.initDb (initialState),
    getPersistedState: (stateKey) => storage.getPersistedState (stateKey),
    persistState: (stateKey, state) => storage.persistState (stateKey, state)
  };
};
