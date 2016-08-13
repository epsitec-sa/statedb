'use strict';

class StateDb {
  constructor (dbPath, appKey) {
    if (!dbPath) {
      throw new Error ('a database path must be provided');
    }
    if (!appKey) {
      appKey = dbPath;
    }
    this._db = require ('./storage.js') (dbPath, appKey);
    this._initialized = false;
  }

  loadState (stateKey) {
    const existingState = this._db.getPersistedState (stateKey);
    if (!existingState) {
      this._db.initDb ({
        [stateKey]: null
      });
      this._initialized = true;
    }
    return existingState;
  }

  saveState (stateKey, state) {
    if (!this._initialized) {
      this.loadState (stateKey);
    }
    return this._db.persistState (stateKey, state);
  }
}

module.exports = StateDb;
