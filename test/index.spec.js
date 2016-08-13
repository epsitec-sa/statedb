'use strict';

const fs       = require ('fs');
const path     = require ('path');
const {expect} = require ('chai');
const StateDb  = require ('../lib/index');

const output = path.join (__dirname, './test');

describe ('index: new state', function () {
  let stateDb = null;

  beforeEach (function () {
    stateDb = new StateDb (output, 'myApp');
  });

  afterEach (function () {
    fs.unlinkSync (`${output}.db`);
  });

  it ('save and load state', function () {
    stateDb.saveState ('myState', {foobar: 'foobar'});
    const state = stateDb.loadState ('myState');
    expect (state).to.be.eql ({foobar: 'foobar'});
  });
});

describe ('index: existing state', function () {
  it ('current state', function () {
    const stateDb = new StateDb (path.join (__dirname, './sample'), 'myApp');
    const state = stateDb.loadState ('myState');
    expect (state).to.be.eql ({foo: 'bar'});
  });
});
