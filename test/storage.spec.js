'use strict';

const fs       = require ('fs');
const path     = require ('path');
const {expect} = require ('chai');
const storage  = require ('../lib/storage');

const output = path.join (__dirname, './test');

describe ('storage', function () {
  let state = null;

  beforeEach (function () {
    state = storage (output, 'theKey');
    state.initDb ({});
  });

  afterEach (function () {
    fs.unlinkSync (`${output}.db`);
  });

  it ('state 1', function () {
    state.persistState ('foo', {foo: 'bar'});
    expect (state.getPersistedState ('foo')).to.be.eql ({foo: 'bar'});
  });

  it ('state 2', function () {
    state.persistState ('bar', {bar: 'foo'});
    expect (state.getPersistedState ('bar')).to.be.eql ({bar: 'foo'});
  });
});
