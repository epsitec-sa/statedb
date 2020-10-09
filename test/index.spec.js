'use strict';

const fs = require('fs');
const path = require('path');
const {expect} = require('chai');
const StateDb = require('../lib/index');

const output = path.join(__dirname, './test');

describe('index: new state', function () {
  let stateDb = null;

  beforeEach(function () {
    stateDb = new StateDb(output, 'myApp');
  });

  afterEach(function () {
    fs.unlinkSync(`${output}.db`);
  });

  it('save and load state', function () {
    stateDb.saveState('myState1', {foo: 'foo'});
    stateDb.saveState('myState2', {bar: 'bar'});

    const state1 = stateDb.loadState('myState1');
    expect(state1).to.be.eql({foo: 'foo'});
    const state2 = stateDb.loadState('myState2');
    expect(state2).to.be.eql({bar: 'bar'});
  });
});

describe('index: new two states', function () {
  let stateDb1 = null;
  let stateDb2 = null;

  beforeEach(function () {
    stateDb1 = new StateDb(output, 'myApp1');
    stateDb2 = new StateDb(output, 'myApp2');
  });

  afterEach(function () {
    fs.unlinkSync(`${output}.db`);
  });

  it('save and load state', function () {
    stateDb1.saveState('myState1', {foo: 'foo'});
    stateDb2.saveState('myState2', {bar: 'bar'});

    const state1 = stateDb1.loadState('myState1');
    expect(state1).to.be.eql({foo: 'foo'});
    const state2 = stateDb2.loadState('myState2');
    expect(state2).to.be.eql({bar: 'bar'});
  });
});

describe('index: existing state', function () {
  it('current state myApp', function () {
    const stateDb = new StateDb(path.join(__dirname, './sample'), 'myApp');
    const state = stateDb.loadState('myState');
    expect(state).to.be.eql({foo: 'bar'});
  });

  it('current state mySecondApp', function () {
    const stateDb = new StateDb(
      path.join(__dirname, './sample'),
      'mySecondApp'
    );
    const state = stateDb.loadState('myState');
    expect(state).to.be.eql({al: 'bert'});
  });
});
