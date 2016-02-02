'use strict';
export default class StateDb {
  constructor (appKey) {
    this._db = require ('./storage.js')(appKey);
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
