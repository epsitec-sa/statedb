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

describe('index: wait for async writes', function () {
  let stateDb = null;

  before(function () {
    stateDb = new StateDb(output, 'myApp', {
      async: true,
    });
  });

  after(function () {
    fs.unlinkSync(`${output}.db`);
  });

  it('has 1000 pending writes', function () {
    for (let i = 0; i < 1000; i++) {
      stateDb.saveState('myState3', {[i]: i});
    }
    expect(stateDb.pendingWrites).to.be.eql(1000);
  });

  it('wait and flush pending writes', function (done) {
    stateDb.waitForWrites(() => {
      expect(stateDb.pendingWrites).to.be.eql(0);
      done();
    });
  });

  it('is consistent after wait', function () {
    const state = stateDb.loadState('myState3');
    expect(state[999]).to.be.eql(999);
  });

  it('saveState () return a promise', function () {
    const promise = stateDb.saveState('myState4', {foo: 'bar'});
    expect(typeof promise.then).to.be.eql('function');
    return promise.then();
  });
});
