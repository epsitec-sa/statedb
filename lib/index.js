'use strict';

class StateDb {
  constructor (dbPath, appKey, opts) {
    if (!dbPath) {
      throw new Error ('a database path must be provided');
    }

    if (typeof opts !== 'object') {
      opts = {
        async: false
      };
    }

    if (!appKey) {
      appKey = dbPath;
    }

    this._db = require ('./storage.js') (dbPath, appKey, opts);
    this._initialized = false;
    this._opts = opts;
    this._writePromises = [];
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
    if (this._opts.async) {
      const promise = this._db.persistState (stateKey, state);
      // add for wait
      this._writePromises.push (promise);
      return promise;
    } else {
      return this._db.persistState (stateKey, state);
    }
  }

  waitForWrites (done) {
    Promise.all (this._writePromises).then (() => {
      // clear promises
      this._writePromises = [];
      // give feedback
      done ();
    });
  }

  get pendingWrites () {
    return this._writePromises.length;
  }
}

module.exports = StateDb;
