'use strict';
export default class StateDb {
  constructor (dbPath, appKey) {
    if (!dbPath) {
      throw new Error ('a database path must be provided');
    }
    if (!appKey) {
      appKey = dbPath;
    }
    this._db = require ('./storage.js')(dbPath, appKey);
    this._existingState = null;
  }

  loadState (stateKey) {
    this._existingState = this._db.getPersistedState (stateKey);
    if (!this._existingState ) {
      this._db.initDb ({
        [stateKey]: null
      });
    }
    return this._existingState;
  }

  saveState (stateKey, state) {
    return this._db.persistState (stateKey, state);
  }
}
