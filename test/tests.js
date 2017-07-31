;(function () {
  'use strict'

  /* imports */
  var predicate = require('fun-predicate')
  var object = require('fun-object')
  var funTest = require('fun-test')
  var arrange = require('fun-arrange')
  var array = require('fun-array')

  function isNum (x) {
    return typeof x === 'number'
  }

  function isStr (x) {
    return typeof x === 'string'
  }

  function isBool (x) {
    return typeof x === 'boolean'
  }

  var abNumString = {
    a: isNum,
    b: isStr
  }

  var boolNumStr = [isBool, isNum, isStr]

  var tests = [
    [
      [[isNum, [4, 3]], true],
      [[isNum, [4, 3, -4.3]], true],
      [[isNum, [4, '3', -4.3]], false],
      [[isStr, ['4', 'hi']], true],
      [[isStr, [4, 'hi']], false]
    ].map(array.append('isArrayOf')),
    [
      [[isNum, { a: 4, b: 4 }], true],
      [[isNum, { a: 4, b: '4' }], false],
      [[isBool, { a: true, b: false, c: true }], true],
      [[isBool, { a: 'true', b: false, c: true }], false]
    ].map(array.append('isObjectOf')),
    [
      [[abNumString, { a: 4, b: '4' }], true],
      [[abNumString, { a: 4, b: '4', c: 'xtra' }], true],
      [[abNumString, { a: '4', b: '4' }], false]
    ].map(array.append('hasFields')),
    [
      [[boolNumStr, [true, 4, '4']], true],
      [[boolNumStr, [true, 4, '4', '5']], false],
      [[boolNumStr, [true, '4', '4']], false]
    ].map(array.append('isTuple')),
    [
      [[abNumString, { a: 4, b: '4' }], true],
      [[abNumString, { a: 4, b: '4', c: 'xtra' }], false],
      [[abNumString, { a: '4', b: '4' }], false]
    ].map(array.append('isRecord')),
    [
      [[true], true],
      [[false], true],
      [[4], false],
      [[{}], false],
      [[null], false],
      [[], false],
      [['true'], false]
    ].map(array.append('isBoolean')),
    [
      [[0], true],
      [[1], true],
      [[-100.4], true],
      [['1'], false],
      [[null], false],
      [[], false],
      [['true'], false]
    ].map(array.append('isNumber')),
    [
      [[true], false],
      [[4], false],
      [[{}], false],
      [[null], false],
      [[], false],
      [['true'], true]
    ].map(array.append('isString')),
    [
      [[0], false],
      [['1'], false],
      [[null], false],
      [[], false],
      [[{}], true],
      [[new Error()], true]
    ].map(array.append('isObject')),
    [
      [[0], false],
      [['1'], false],
      [[null], false],
      [[], false],
      [[{}], true],
      [[new Error()], false]
    ].map(array.append('isPojo')),
    [
      [[0], false],
      [['1'], false],
      [[null], false],
      [[], false],
      [[[]], true],
      [[{}], false],
      [[new Error()], false]
    ].map(array.append('isArray'))
  ].reduce(array.concat, [])
    .map(arrange({ inputs: 0, predicate: 1, contra: 2 }))
    .map(object.ap({
      predicate: predicate.equalDeep,
      contra: object.get
    }))

  /* exports */
  module.exports = tests.map(funTest.sync)
})()

