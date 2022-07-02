'use strict';

class StateDb {
  constructor(dbPath, appKey, opts, callback) {
    if (!dbPath) {
      throw new Error('a database path must be provided');
    }

    if (typeof opts !== 'object') {
      opts = {};
    }

    if (!appKey) {
      appKey = dbPath;
    }

    this._initialized = false;
    this._opts = opts;
    require('./storage.js')(dbPath, appKey, opts, (err, res) => {
      this._db = res;
      callback(err, this);
    });
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
