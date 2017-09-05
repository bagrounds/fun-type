/**
 *
 * @module fun-type
 */
;(function () {
  'use strict'

  /* imports */
  var funArray = require('fun-array')
  var fn = require('fun-function')
  var funObject = require('fun-object')
  var guarded = require('guarded')
  var funBool = require('fun-boolean')

  var api = {
    bool: bool,
    num: num,
    string: string,
    object: object,
    pojo: pojo,
    array: array,
    vector: vector,
    matrix: matrix,
    fun: fun,
    record: record,
    hasFields: hasFields,
    tuple: tuple,
    objectOf: objectOf,
    arrayOf: arrayOf,
    vectorOf: vectorOf,
    matrixOf: matrixOf,
    regExp: regExp,
    instanceOf: instanceOf,
    any: any
  }

  var firstIsArrayOfFunctions = funArray.ap([
    fn.compose(
      funBool.all,
      funArray.map(fun)
    )
  ])

  var firstIsObjectOfFunctions = funArray.ap([
    fn.composeAll([
      funBool.all,
      funObject.values,
      funObject.map(fun)
    ])
  ])

  var anyToBool = guarded(funBool.t, bool)

  var guards = {
    bool: anyToBool,
    num: anyToBool,
    string: anyToBool,
    object: anyToBool,
    pojo: anyToBool,
    array: anyToBool,
    vector: guarded(fn.curry(tuple)([num, any]), bool),
    fun: anyToBool,
    record: guarded(firstIsObjectOfFunctions, bool),
    hasFields: guarded(firstIsObjectOfFunctions, bool),
    tuple: guarded(firstIsArrayOfFunctions, bool),
    objectOf: guarded(funArray.ap([fun]), bool),
    arrayOf: guarded(funArray.ap([fun]), bool),
    vectorOf: guarded(fn.curry(tuple)([num, fun, any]), bool),
    matrixOf: guarded(fn.curry(tuple)([fun, any]), bool),
    regExp: anyToBool,
    instanceOf: anyToBool,
    any: anyToBool
  }

  /* exports */
  module.exports = funObject.map(fn.curry, funObject.ap(guards, api))

  /**
   *
   * @function module:fun-type.instanceOf
   *
   * @param {Function} constructor - defining instance
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is instanceof constructor
   */
  function instanceOf (constructor, subject) {
    return subject instanceof constructor
  }

  /**
   *
   * @function module:fun-type.regExp
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a RegExp
   */
  function regExp (subject) {
    return instanceOf(RegExp, subject)
  }

  /**
   *
   * @function module:fun-type.hasFields
   *
   * @param {Object} fields - that subject must have
   * @param {*} subject - to check
   *
   * @return {Boolean} if fields of subject match types described in fields
   */
  function hasFields (fields, subject) {
    return object(subject) &&
      funBool.all(
        funObject.values(
          funObject.ap(
            fields,
            funObject.keep(funObject.keys(fields), subject)
          )
        )
      )
  }

  /**
   *
   * @function module:fun-type.record
   *
   * @param {Object} fields - of the record
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a record described by fields
   */
  function record (fields, subject) {
    return hasFields(fields, subject) &&
      Object.keys(fields).length === Object.keys(subject).length
  }

  /**
   *
   * @function module:fun-type.tuple
   *
   * @param {Array} elements - of the tuple
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a tuple described by elements
   */
  function tuple (elements, subject) {
    return array(subject) &&
      subject.length === elements.length &&
      funBool.all(funArray.ap(elements, subject))
  }

  /**
   *
   * @function module:fun-type.objectOf
   *
   * @param {Function} predicate - to check type of each value in subject
   * @param {*} subject - to check
   *
   * @return {Boolean} if each enumerable property of subject passes predicate
   */
  function objectOf (predicate, subject) {
    return object(subject) &&
      funBool.all(funObject.values(subject).map(predicate))
  }

  /**
   *
   * @function module:fun-type.arrayOf
   *
   * @param {Function} predicate - to check type of each value in subject
   * @param {*} subject - to check
   *
   * @return {Boolean} if each element in subject passes predicate
   */
  function arrayOf (predicate, subject) {
    return array(subject) &&
      funBool.all(funArray.map(predicate, subject))
  }

  /**
   *
   * @function module:fun-type.pojo
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a plain old JavaScript object
   */
  function pojo (subject) {
    return object(subject) &&
      Object.getPrototypeOf(subject) === Object.prototype
  }

  /**
   *
   * @function module:fun-type.object
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is an object
   */
  function object (subject) {
    return typeof subject === 'object' && subject !== null
  }

  /**
   *
   * @function module:fun-type.vectorOf
   *
   * @param {Number} length - of vector
   * @param {Function} predicate - to check type of each value in subject
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is an array
   */
  function vectorOf (length, predicate, subject) {
    return vector(length, subject) && arrayOf(predicate, subject)
  }

  /**
   *
   * @function module:fun-type.matrixOf
   *
   * @param {Function} predicate - to check type of each value in subject
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a matrix
   */
  function matrixOf (predicate, subject) {
    return array(subject) &&
      arrayOf(
        vectorOf.bind(null, subject[0].length, predicate),
        subject
      )
  }

  /**
   *
   * @function module:fun-type.matrix
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a matrix
   */
  function matrix (subject) {
    return array(subject) &&
      arrayOf(vector.bind(null, subject[0].length), subject)
  }

  /**
   *
   * @function module:fun-type.vector
   *
   * @param {Number} length - of vector
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is an array
   */
  function vector (length, subject) {
    return array(subject) && subject.length === length
  }

  /**
   *
   * @function module:fun-type.array
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is an array
   */
  function array (subject) {
    return instanceOf(Array, subject)
  }

  /**
   *
   * @function module:fun-type.fun
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a function
   */
  function fun (subject) {
    return typeof subject === 'function'
  }

  /**
   *
   * @function module:fun-type.bool
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a bool
   */
  function bool (subject) {
    return typeof subject === 'boolean'
  }

  /**
   *
   * @function module:fun-type.num
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a number
   */
  function num (subject) {
    return typeof subject === 'number'
  }

  /**
   *
   * @function module:fun-type.string
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a string
   */
  function string (subject) {
    return typeof subject === 'string'
  }

  /**
   *
   * @function module:fun-type.any
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} true
   */
  function any (subject) {
    return true
  }
})()

