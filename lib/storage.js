'use strict';

const low     = require ('lowdb');

const store = (dbPath) => {
  return low (`${dbPath}.db`);
};

const initDb = (dbPath, appKey, initialState) => {
  const appState = Object.assign ({
    app: appKey
  }, initialState);
  return store (dbPath) ('states').push (appState).value ();
};

const getAppState = (dbPath, appKey) => {
  return store (dbPath) ('states')
    .chain ()
    .find ({ app: appKey });
};

const getPersistedState = (dbPath, appKey, stateKey) => {
  const value = getAppState (dbPath, appKey).value ();
  return value ? value[stateKey] : null;
};

const persistState = (dbPath, appKey, stateKey, state) => {
  return getAppState (dbPath, appKey)
          .assign ({ [stateKey]: state })
          .value ();
};

module.exports = (dbPath, appKey) => {
  return {
    initDb: (initialState) => initDb (dbPath, appKey, initialState),
    getPersistedState: (stateKey) => getPersistedState (dbPath, appKey, stateKey),
    persistState: (stateKey, state) => persistState (dbPath, appKey, stateKey, state)
  };
};
