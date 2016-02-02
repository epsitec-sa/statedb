'use strict';
const low = require ('lowdb');
const storage = require ('lowdb/file-async');

const store = (appKey) => {
  return low (`${appKey}.db`, { storage });
};

const initDb = (appKey, initialState) => {
  const appState = Object.assign ({
    app: appKey
  }, initialState);
  return store (appKey) ('states').push (appState);
};

const getAppState = (appKey) => {
  return store (appKey) ('states')
    .chain ()
    .find ({ app: appKey });
};

const getPersistedState = (appKey, stateKey) => {
  const value = getAppState (appKey).value ();
  return value ? value[stateKey] : null;
};

const persistState = (appKey, stateKey, state) => {
  return getAppState (appKey)
          .assign ({ [stateKey]: state })
          .value ();
};

module.exports = (appKey) => {
  return {
    initDb: (initialState) => initDb (appKey, initialState),
    getPersistedState: (stateKey) => getPersistedState (appKey, stateKey),
    persistState: (stateKey, state) => persistState (appKey, stateKey, state)
  };
};
