'use strict';

class StateDb {
  constructor(dbPath, appKey, opts) {
    if (!dbPath) {
      throw new Error('a database path must be provided');
    }

    if (typeof opts !== 'object') {
      opts = {};
    }

    if (!appKey) {
      appKey = dbPath;
    }

    this._db = require('./storage.js')(dbPath, appKey, opts);
    this._initialized = false;
    this._opts = opts;
  }

  loadState(stateKey) {
    const existingState = this._db.getPersistedState(stateKey);
    if (!existingState) {
      this._db.initDb({
        [stateKey]: null,
      });
      this._initialized = true;
    }
    return existingState;
  }

  saveState(stateKey, state) {
    if (!this._initialized) {
      this.loadState(stateKey);
    }
    this._db.persistState(stateKey, state);
  }
}

module.exports = StateDb;
