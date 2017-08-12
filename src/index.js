/**
 *
 * @module fun-type
 */
;(function () {
  'use strict'

  /* imports */
  var array = require('fun-array')
  var fn = require('fun-function')
  var object = require('fun-object')
  var guarded = require('guarded')
  var bool = require('fun-boolean')

  var api = {
    isBoolean: isBoolean,
    isNumber: isNumber,
    isString: isString,
    isObject: isObject,
    isPojo: isPojo,
    isArray: isArray,
    isFunction: isFunction,
    isRecord: isRecord,
    hasFields: hasFields,
    isTuple: isTuple,
    isObjectOf: isObjectOf,
    isArrayOf: isArrayOf,
    isRegExp: isRegExp,
    instanceOf: instanceOf
  }

  var firstIsArrayOfFunctions = array.ap([
    fn.compose(
      bool.all,
      array.map(isFunction)
    )
  ])

  var firstIsObjectOfFunctions = array.ap([
    fn.composeAll([
      bool.all,
      object.values,
      object.map(isFunction)
    ])
  ])

  var anyToBool = guarded(bool.t, isBoolean)

  var guards = {
    isBoolean: anyToBool,
    isNumber: anyToBool,
    isString: anyToBool,
    isObject: anyToBool,
    isPojo: anyToBool,
    isArray: anyToBool,
    isFunction: anyToBool,
    isRecord: guarded(firstIsObjectOfFunctions, isBoolean),
    hasFields: guarded(firstIsObjectOfFunctions, isBoolean),
    isTuple: guarded(firstIsArrayOfFunctions, isBoolean),
    isObjectOf: guarded(array.ap([isFunction]), isBoolean),
    isArrayOf: guarded(array.ap([isFunction]), isBoolean),
    isRegExp: anyToBool,
    instanceOf: anyToBool
  }

  /* exports */
  module.exports = object.map(fn.curry, object.ap(guards, api))

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
   * @function module:fun-type.isRegExp
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a RegExp
   */
  function isRegExp (subject) {
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
    return isObject(subject) &&
      bool.all(
        object.values(
          object.ap(
            fields,
            object.keep(object.keys(fields), subject)
          )
        )
      )
  }

  /**
   *
   * @function module:fun-type.isRecord
   *
   * @param {Object} fields - of the record
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a record described by fields
   */
  function isRecord (fields, subject) {
    return hasFields(fields, subject) &&
      Object.keys(fields).length === Object.keys(subject).length
  }

  /**
   *
   * @function module:fun-type.isTuple
   *
   * @param {Array} elements - of the tuple
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a tuple described by elements
   */
  function isTuple (elements, subject) {
    return isArray(subject) &&
      subject.length === elements.length &&
      bool.all(array.ap(elements, subject))
  }

  /**
   *
   * @function module:fun-type.isObjectOf
   *
   * @param {Function} predicate - to check type of each value in subject
   * @param {*} subject - to check
   *
   * @return {Boolean} if each enumerable property of subject passes predicate
   */
  function isObjectOf (predicate, subject) {
    return isObject(subject) &&
      bool.all(object.values(subject).map(predicate))
  }

  /**
   *
   * @function module:fun-type.isArrayOf
   *
   * @param {Function} predicate - to check type of each value in subject
   * @param {*} subject - to check
   *
   * @return {Boolean} if each element in subject passes predicate
   */
  function isArrayOf (predicate, subject) {
    return isArray(subject) && bool.all(subject.map(predicate))
  }

  /**
   *
   * @function module:fun-type.isPojo
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a plain old JavaScript object
   */
  function isPojo (subject) {
    return isObject(subject) &&
      Object.getPrototypeOf(subject) === Object.prototype
  }

  /**
   *
   * @function module:fun-type.isObject
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is an object
   */
  function isObject (subject) {
    return typeof subject === 'object' && subject !== null
  }

  /**
   *
   * @function module:fun-type.isArray
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is an array
   */
  function isArray (subject) {
    return instanceOf(Array, subject)
  }

  /**
   *
   * @function module:fun-type.isFunction
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a function
   */
  function isFunction (subject) {
    return typeof subject === 'function'
  }

  /**
   *
   * @function module:fun-type.isBoolean
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a boolean
   */
  function isBoolean (subject) {
    return typeof subject === 'boolean'
  }

  /**
   *
   * @function module:fun-type.isNumber
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a number
   */
  function isNumber (subject) {
    return typeof subject === 'number'
  }

  /**
   *
   * @function module:fun-type.isString
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a string
   */
  function isString (subject) {
    return typeof subject === 'string'
  }
})()

