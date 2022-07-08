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

    this._initialized = false;
    this._opts = opts;
    this._dbPath = dbPath;
    this._appKey = appKey;
  }

  async init() {
    this._db = await require('./storage.js')(
      this._dbPath,
      this._appKey,
      this._opts,
      false
    );
  }

  async initEmpty() {
    this._db = await require('./storage.js')(
      this._dbPath,
      this._appKey,
      this._opts,
      true
    );
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
