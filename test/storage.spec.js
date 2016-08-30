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


describe ('async storage', function () {
  let state = null;

  beforeEach (function () {
    state = storage (output, 'theKey', {
      async: true
    });
    state.initDb ({});
  });

  afterEach (function () {
    fs.unlinkSync (`${output}.db`);
  });

  it ('persis state return a promise', function () {
    const promise = state.persistState ('yo', {yo: 'ba'});
    expect (typeof promise.then).to.be.eql ('function');
    return promise.then ();
  });

  it ('state 1', function () {
    return state.persistState ('foo', {foo: 'bar'})
      .then (() => expect (state.getPersistedState ('foo')).to.be.eql ({foo: 'bar'}));
  });

  it ('state 2', function () {
    return state.persistState ('bar', {bar: 'foo'})
      .then (() => expect (state.getPersistedState ('bar')).to.be.eql ({bar: 'foo'}));
  });

});
