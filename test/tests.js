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

  var adHocTests = [
    function degenerateMatrixOf (subject, callback) {
      var result, error
      try {
        result = subject.matrixOf(subject.num, []) === false
      } catch (e) {
        error = e
      }

      callback(error, result)
    },
    function nestedVectorOf (subject, callback) {
      var result, error
      try {
        result = subject.vectorOf(
          2,
          subject.vectorOf(
            1,
            subject.num
          )
        )([[1], [2]]) === true
      } catch (e) {
        error = e
      }

      callback(error, result)
    }
  ]

  var tests = [
    [
      [[isNum, [[0, '0'], [0, 1]]], false],
      [[isNum, [[0, 0], [0, 1]]], true],
      [[isNum, [[0], [0, 1]]], false],
      [[isNum, [[], [1]]], false],
      [[isNum, [[], []]], true],
      [[isNum, [[]]], true]
    ].map(array.append('matrixOf')),
    [
      [[[[0, 0], [0, 1]]], true],
      [[[[0], [0, 1]]], false],
      [[[[], [1]]], false],
      [[[[], []]], true],
      [[[[]]], true]
    ].map(array.append('matrix')),
    [
      [[2, isNum, [4, 3]], true],
      [[3, isNum, [4, 3]], false],
      [[3, isNum, [4, 3, -4.3]], true],
      [[3, isNum, [4, '3', -4.3]], false],
      [[3, isStr, ['4', 'hi']], false],
      [[2, isStr, ['4', 'hi']], true],
      [[2, isStr, [4, 'hi']], false]
    ].map(array.append('vectorOf')),
    [
      [[isNum, [4, 3]], true],
      [[isNum, [4, 3, -4.3]], true],
      [[isNum, [4, '3', -4.3]], false],
      [[isStr, ['4', 'hi']], true],
      [[isStr, [4, 'hi']], false]
    ].map(array.append('arrayOf')),
    [
      [[isNum, { a: 4, b: 4 }], true],
      [[isNum, { a: 4, b: '4' }], false],
      [[isBool, { a: true, b: false, c: true }], true],
      [[isBool, { a: 'true', b: false, c: true }], false]
    ].map(array.append('objectOf')),
    [
      [[abNumString, { a: 4, b: '4' }], true],
      [[abNumString, { a: 4, b: '4', c: 'xtra' }], true],
      [[abNumString, { a: '4', b: '4' }], false]
    ].map(array.append('hasFields')),
    [
      [[boolNumStr, [true, 4, '4']], true],
      [[boolNumStr, [true, 4, '4', '5']], false],
      [[boolNumStr, [true, '4', '4']], false]
    ].map(array.append('tuple')),
    [
      [[abNumString, { a: 4, b: '4' }], true],
      [[abNumString, { a: 4, b: '4', c: 'xtra' }], false],
      [[abNumString, { a: '4', b: '4' }], false]
    ].map(array.append('record')),
    [
      [[true], true],
      [[false], true],
      [[4], false],
      [[{}], false],
      [[null], false],
      [[], false],
      [['true'], false]
    ].map(array.append('bool')),
    [
      [[0], true],
      [[1], true],
      [[-100.4], true],
      [['1'], false],
      [[null], false],
      [[], false],
      [['true'], false]
    ].map(array.append('num')),
    [
      [[true], false],
      [[4], false],
      [[{}], false],
      [[null], false],
      [[], false],
      [['true'], true]
    ].map(array.append('string')),
    [
      [[0], false],
      [['1'], false],
      [[null], false],
      [[], false],
      [[{}], true],
      [[new Error()], true]
    ].map(array.append('object')),
    [
      [[0], false],
      [['1'], false],
      [[null], false],
      [[], false],
      [[{}], true],
      [[new Error()], false]
    ].map(array.append('pojo')),
    [
      [[0], false],
      [['1'], false],
      [[null], false],
      [[], false],
      [[[]], true],
      [[{}], false],
      [[new Error()], false]
    ].map(array.append('array')),
    [
      [[RegExp('[0-9]+', 'g')], true],
      [[/[0-9]+/g], true],
      [[0], false],
      [['1'], false],
      [[null], false],
      [[], false],
      [[[]], false],
      [[{}], false],
      [[new Error()], false]
    ].map(array.append('regExp')),
    [
      [[Array, 0], false],
      [[String, '1'], false],
      [[Date, null], false],
      [[RegExp, undefined], false],
      [[Array, []], true],
      [[Error, {}], false],
      [[RegExp, /[0-9]+/g], true],
      [[RegExp, RegExp('e')], true],
      [[Error, RegExp('e')], false],
      [[Error, Error()], true],
      [[RegExp, Error()], false]
    ].map(array.append('instanceOf')),
    [
      [[Array, 0], true],
      [[String, '1'], true],
      [[Date, null], true],
      [[RegExp, undefined], true],
      [[Array, []], true],
      [[Error, {}], true],
      [[RegExp, /[0-9]+/g], true],
      [[RegExp, RegExp('e')], true],
      [[Error, RegExp('e')], true],
      [[Error, Error()], true],
      [[RegExp, Error()], true]
    ].map(array.append('any'))
  ].reduce(array.concat, [])
    .map(arrange({ inputs: 0, predicate: 1, contra: 2 }))
    .map(object.ap({
      predicate: predicate.equalDeep,
      contra: object.get
    }))

  /* exports */
  module.exports = tests.map(funTest.sync).concat(adHocTests)
})()

