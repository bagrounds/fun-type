/**
 *
 * @module fun-type
 */
;(() => {
  'use strict'

  /* imports */
  const curry = require('fun-curry')
  const { keys, values, keep, ap: oAp, map: oMap } = require('fun-object')
  const { inputs, output } = require('guarded')

  const all = as => as.reduce((a, b) => a && b, true)
  const compose = f => g => x => f(g(x))
  const typeOf = t => x => typeof x === t

  /**
   *
   * @function module:fun-type.any
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} true
   */
  const any = () => true

  /**
   *
   * @function module:fun-type.bool
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a bool
   */
  const bool = typeOf('boolean')

  /**
   *
   * @function module:fun-type.integer
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a finite integer
   */
  const integer = subject => num(subject) && Math.floor(subject) === subject &&
    Math.abs(subject) !== Infinity

  /**
   *
   * @function module:fun-type.num
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a number
   */
  const num = typeOf('number')

  /**
   *
   * @function module:fun-type.string
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a string
   */
  const string = typeOf('string')

  /**
   *
   * @function module:fun-type.fun
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a function
   */
  const fun = typeOf('function')

  /**
   *
   * @function module:fun-type.instanceOf
   *
   * @param {Function} constructor - defining instance
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is instanceof constructor
   */
  const instanceOf = (constructor, subject) => subject instanceof constructor

  /**
   *
   * @function module:fun-type.array
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is an array
   */
  const array = curry(instanceOf)(Array)

  /**
   *
   * @function module:fun-type.arrayOf
   *
   * @param {Function} predicate - to check type of each value in subject
   * @param {*} subject - to check
   *
   * @return {Boolean} if each element in subject passes predicate
   */
  const arrayOf = (predicate, subject) => array(subject) &&
    all(subject.map(x => predicate(x)))

  /**
   *
   * @function module:fun-type.vector
   *
   * @param {Number} length - of vector
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is an array
   */
  const vector = (length, subject) =>
    array(subject) && subject.length === length

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
  const vectorOf = (length, predicate, subject) =>
    vector(length, subject) && arrayOf(predicate, subject)

  /**
   *
   * @function module:fun-type.tuple
   *
   * @param {Array} elements - of the tuple
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a tuple described by elements
   */
  const tuple = (elements, subject) => vector(elements.length, subject) &&
    all(elements.map((p, i) => p(subject[i])))

  /**
   *
   * @function module:fun-type.matrix
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a matrix
   */
  const matrix = subject => array(subject) &&
    subject.length > 0 &&
    arrayOf(curry(vector)(subject[0].length), subject)

  /**
   *
   * @function module:fun-type.matrixOf
   *
   * @param {Function} predicate - to check type of each value in subject
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a matrix
   */
  const matrixOf = (predicate, subject) => matrix(subject) &&
    arrayOf(curry(vectorOf)(subject[0].length, predicate), subject)

  /**
   *
   * @function module:fun-type.object
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is an object
   */
  const object = subject => typeOf('object')(subject) && subject !== null

  /**
   *
   * @function module:fun-type.objectOf
   *
   * @param {Function} predicate - to check type of each value in subject
   * @param {*} subject - to check
   *
   * @return {Boolean} if each enumerable property of subject passes predicate
   */
  const objectOf = (predicate, subject) => object(subject) &&
    all(values(subject).map(v => predicate(v)))

  /**
   *
   * @function module:fun-type.hasFields
   *
   * @param {Object} fields - that subject must have
   * @param {*} subject - to check
   *
   * @return {Boolean} if fields of subject match types described in fields
   */
  const hasFields = (fields, subject) => object(subject) &&
    all(values(oAp(fields, keep(keys(fields), subject))))

  /**
   *
   * @function module:fun-type.record
   *
   * @param {Object} fields - of the record
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a record described by fields
   */
  const record = (fields, subject) => hasFields(fields, subject) &&
    vector(keys(fields).length, keys(subject))

  /**
   *
   * @function module:fun-type.pojo
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a plain old JavaScript object
   */
  const pojo = subject => object(subject) &&
    Object.getPrototypeOf(subject) === Object.prototype

  /**
   *
   * @function module:fun-type.regExp
   *
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a RegExp
   */
  const regExp = curry(instanceOf)(RegExp)

  /**
   *
   * @function module:fun-type.member
   *
   * @param {Function} equal - (a, b) -> bool
   * @param {Array} set - that subject should be a member of
   * @param {*} subject - to check
   *
   * @return {Boolean} if subject is a member of set based on equal function
   */
  const member = (equal, set, subject) =>
    set.reduce((a, b) => a || equal(b, subject), false)

  /**
   *
   * @function module:fun-type.distinct
   *
   * @param {Function} equal - (a, b) -> bool
   * @param {Array} subject - to check
   *
   * @return {Boolean} if all elements in subject are unique
   */
  const distinct = (equal, subject) => subject.length < 2 ||
    !member(equal, subject.slice(1), subject[0]) &&
    distinct(equal, subject.slice(1))

  /**
   *
   * @function module:fun-type.subset
   *
   * @param {Function} equal - (a, b) -> bool
   * @param {Array} set - that subject should be a member of
   * @param {Array} subject - to check
   *
   * @return {Boolean} if all elements in subject are unique
   */
  const subset = (equal, set, subject) => !subject.length ||
    (subject.length <= set.length) &&
    !member(equal, subject.slice(1), subject[0]) &&
    member(equal, set, subject[0]) &&
    subset(equal, set, subject.slice(1))

  /**
   *
   * @function module:fun-type.partition
   *
   * @param {Function} equal - (a, b) -> bool
   * @param {Array} set - that subject should be a member of
   * @param {Array<Array>} subject - to check
   *
   * @return {Boolean} if all elements in subject are unique
   */
  const partition = (equal, set, subject) =>
    subject.reduce((a, b) => a.concat(b), []).length === set.length &&
    subset(equal, set, subject.reduce((a, b) => a.concat(b), []))

  /**
   *
   * @function module:fun-type.nPartition
   *
   * @param {Function} equal - (a, b) -> bool
   * @param {Number} n - number of groups set is partitioned into
   * @param {Array} set - that subject should be a member of
   * @param {Array<Array>} subject - to check
   *
   * @return {Boolean} if all elements in subject are unique
   */
  const nPartition = (equal, n, set, subject) => subject.length === n &&
    partition(equal, set, subject)

  const api = { bool, num, string, object, pojo, array, vector, matrix, fun,
    record, hasFields, tuple, objectOf, arrayOf, vectorOf, matrixOf, regExp,
    instanceOf, any, member, integer, distinct, subset, partition, nPartition }

  const cVector = curry(vector)
  const cTuple = curry(tuple)
  const cArrayOf = curry(arrayOf)
  const cObjectOf = curry(objectOf)

  const guards = oMap(compose(output(bool)), oMap(inputs, {
    bool: cVector(1),
    num: cVector(1),
    integer: cVector(1),
    string: cVector(1),
    object: cVector(1),
    pojo: cVector(1),
    array: cVector(1),
    vector: cTuple([num, any]),
    fun: cVector(1),
    record: cTuple([cObjectOf(fun), any]),
    hasFields: cTuple([cObjectOf(fun), any]),
    tuple: cTuple([cArrayOf(fun), any]),
    objectOf: cTuple([fun, any]),
    arrayOf: cTuple([fun, any]),
    vectorOf: cTuple([num, fun, any]),
    matrixOf: cTuple([fun, any]),
    regExp: cVector(1),
    instanceOf: cTuple([fun, any]),
    any: cVector(1),
    member: cTuple([fun, array, any]),
    distinct: cTuple([fun, array]),
    subset: cTuple([fun, array, array]),
    partition: cTuple([fun, array, cArrayOf(array)]),
    nPartition: cTuple([fun, num, array, cArrayOf(array)])
  }))

  /* exports */
  module.exports = oMap(curry, oAp(guards, api))
})()

