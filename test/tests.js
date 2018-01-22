;(() => {
  'use strict'

  /* imports */
  const { equalDeep } = require('fun-predicate')
  const { ap, get } = require('fun-object')
  const { sync } = require('fun-test')
  const arrange = require('fun-arrange')
  const { flatten, update, map, prepend, append, range, of } =
    require('fun-array')
  const { compose } = require('fun-function')

  const isNum = x => typeof x === 'number'
  const isStr = x => typeof x === 'string'
  const isBool = x => typeof x === 'boolean'

  const abNumString = {
    a: isNum,
    b: isStr
  }

  const boolNumStr = [isBool, isNum, isStr]

  const adHocTests = [
    function degenerateMatrixOf (subject, callback) {
      try {
        callback(null, subject.matrixOf(subject.num, []) === false)
      } catch (e) {
        callback(e)
      }
    },
    function nestedVectorOf (subject, callback) {
      try {
        callback(null, subject.vectorOf(
          2,
          subject.vectorOf(
            1,
            subject.num
          )
        )([[1], [2]]) === true)
      } catch (e) {
        callback(e)
      }
    }
  ]

  const tests = map(
    compose(
      ap({ predicate: equalDeep, contra: get }),
      arrange({ inputs: 0, predicate: 1, contra: 2 })
    ),
    flatten([
      map(append('matrixOf'), [
        [[isNum, [[0, '0'], [0, 1]]], false],
        [[isNum, [[0, 0], [0, 1]]], true],
        [[isNum, [[0], [0, 1]]], false],
        [[isNum, [[], [1]]], false],
        [[isNum, [[], []]], true],
        [[isNum, [[]]], true]
      ]),
      map(append('matrix'), [
        [[[[0, 0], [0, 1]]], true],
        [[[[0], [0, 1]]], false],
        [[[[], [1]]], false],
        [[[[], []]], true],
        [[[[]]], true]
      ]),
      map(append('vectorOf'), [
        [[2, isNum, [4, 3]], true],
        [[3, isNum, [4, 3]], false],
        [[3, isNum, [4, 3, -4.3]], true],
        [[3, isNum, [4, '3', -4.3]], false],
        [[3, isStr, ['4', 'hi']], false],
        [[2, isStr, ['4', 'hi']], true],
        [[2, isStr, [4, 'hi']], false]
      ]),
      map(append('arrayOf'), [
        [[isNum, [4, 3]], true],
        [[isNum, [4, 3, -4.3]], true],
        [[isNum, [4, '3', -4.3]], false],
        [[isStr, ['4', 'hi']], true],
        [[isStr, [4, 'hi']], false]
      ]),
      map(append('objectOf'), [
        [[isNum, { a: 4, b: 4 }], true],
        [[isNum, { a: 4, b: '4' }], false],
        [[isBool, { a: true, b: false, c: true }], true],
        [[isBool, { a: 'true', b: false, c: true }], false]
      ]),
      map(append('hasFields'), [
        [[abNumString, { a: 4, b: '4' }], true],
        [[abNumString, { a: 4, b: '4', c: 'xtra' }], true],
        [[abNumString, { a: '4', b: '4' }], false]
      ]),
      map(append('tuple'), [
        [[boolNumStr, [true, 4, '4']], true],
        [[boolNumStr, [true, 4, '4', '5']], false],
        [[boolNumStr, [true, '4', '4']], false]
      ]),
      map(append('record'), [
        [[abNumString, { a: 4, b: '4' }], true],
        [[abNumString, { a: 4, b: '4', c: 'xtra' }], false],
        [[abNumString, { a: '4', b: '4' }], false]
      ]),
      map(append('bool'), [
        [[true], true],
        [[false], true],
        [[4], false],
        [[{}], false],
        [[null], false],
        [[], false],
        [['true'], false]
      ]),
      map(append('num'), [
        [[0], true],
        [[1], true],
        [[-100.4], true],
        [['1'], false],
        [[null], false],
        [[], false],
        [['true'], false]
      ]),
      map(append('string'), [
        [[true], false],
        [[4], false],
        [[{}], false],
        [[null], false],
        [[], false],
        [['true'], true]
      ]),
      map(append('object'), [
        [[0], false],
        [['1'], false],
        [[null], false],
        [[], false],
        [[{}], true],
        [[new Error()], true]
      ]),
      map(append('pojo'), [
        [[0], false],
        [['1'], false],
        [[null], false],
        [[], false],
        [[{}], true],
        [[new Error()], false]
      ]),
      map(append('array'), [
        [[0], false],
        [['1'], false],
        [[null], false],
        [[], false],
        [[[]], true],
        [[{}], false],
        [[new Error()], false]
      ]),
      map(append('regExp'), [
        [[RegExp('[0-9]+', 'g')], true],
        [[/[0-9]+/g], true],
        [[0], false],
        [['1'], false],
        [[null], false],
        [[], false],
        [[[]], false],
        [[{}], false],
        [[new Error()], false]
      ]),
      map(append('instanceOf'), [
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
      ]),
      map(append('any'), [
        [[0], true],
        [['1'], true],
        [[null], true],
        [[undefined], true],
        [[[]], true],
        [[{}], true],
        [[/[0-9]+/g], true],
        [[RegExp('e')], true],
        [[Error()], true]
      ]),
      map(append('member'), [
        [[equalDeep, range(1, 8), 0], false],
        [[equalDeep, range(1, 8), 1], true],
        [[equalDeep, range(1, 8), 2], true],
        [[equalDeep, range(1, 8), 8], true],
        [[equalDeep, range(1, 8), 9], false],
        [[equalDeep, [{ a: 1 }, { b: 2 }], { a: 1 }], true],
        [[equalDeep, [{ a: 1 }, { b: 2 }], { a: 2 }], false]
      ]),
      map(append('distinct'), [
        [[equalDeep, []], true],
        [[equalDeep, [1]], true],
        [[equalDeep, [1, 1]], false],
        [[equalDeep, [2, 1]], true],
        [[equalDeep, [{ a: 1 }, { a: 1 }]], false],
        [[equalDeep, [{ a: 1 }, { a: 2 }]], true]
      ]),
      map(compose(update(0, prepend(equalDeep)), append('subset')), flatten([
        map(compose(append(true), of), [
          [[1], []],
          [[1], [1]],
          [[1, 2], [1]],
          [[1, 2], [2]],
          [[1, 2], [1, 2]],
          [[1, 2], [2, 1]],
          [[[1], [2]], []],
          [[[1], [2]], [[1]]],
          [[[1], [2]], [[2], [1]]]
        ]),
        map(compose(append(false), of), [
          [[1, 2], [2, 1, 3]],
          [[1, 2], [3, 1, 2]],
          [[1, 2], [2, 3]],
          [[1, 2], [3, 2]],
          [[1, 2], [3]],
          [[1, 2], [1, 1]],
          [[1, 2, 3], [1, 1, 2]]
        ])
      ])),
      map(compose(update(0, prepend(equalDeep)), append('partition')), flatten([
        map(compose(append(true), of), [
          [[1], [[1]]],
          [[1, 2], [[1, 2]]],
          [[1, 2], [[2, 1]]],
          [[1, 2], [[1], [2]]],
          [[1, 2, 3], [[1, 2, 3]]],
          [[1, 2, 3], [[1, 2], [3]]],
          [[1, 2, 3], [[1], [2, 3]]],
          [[1, 2, 3], [[1, 3], [2]]],
          [[1, 2, 3], [[1], [2], [3]]]
        ]),
        map(compose(append(false), of), [
          [[1], [[]]],
          [[1], [[2]]],
          [[1, 2], [[1]]],
          [[1, 2], [[2]]],
          [[1, 2], [[1], [1]]],
          [[1, 2], [[2], [2]]]
        ])
      ])),
      map(
        compose(
          update(0, prepend(equalDeep)),
          append('nPartition')
        ),
        flatten([map(compose(append(true), of), [
          [1, [1], [[1]]],
          [1, [1, 2], [[1, 2]]],
          [2, [1, 2], [[1], [2]]],
          [1, [1, 2, 3], [[1, 2, 3]]],
          [2, [1, 2, 3], [[1, 2], [3]]],
          [2, [1, 2, 3], [[1], [2, 3]]],
          [2, [1, 2, 3], [[1, 3], [2]]],
          [3, [1, 2, 3], [[1], [2], [3]]]
        ]),
        map(compose(append(false), of), [
          [1, [1], [[]]],
          [1, [1], [[2]]],
          [1, [1, 2], [[1]]],
          [1, [1, 2], [[2]]],
          [2, [1, 2], [[1], [1]]],
          [2, [1, 2], [[2], [2]]],
          [2, [1, 2], [[1, 2]]],
          [1, [1, 2], [[1], [2]]],
          [2, [1, 2, 3], [[1, 2, 3]]],
          [1, [1, 2, 3], [[1, 2], [3]]],
          [1, [1, 2, 3], [[1], [2, 3]]],
          [3, [1, 2, 3], [[1, 3], [2]]]
        ])
        ])),
      map(append('integer'), [
        [[1], true],
        [[1.00], true],
        [[123], true],
        [[-123], true],
        [[0], true],
        [[0.1], false],
        [[-0.1], false],
        [[Infinity], false],
        [[-Infinity], false],
        [[NaN], false]
      ])
    ]))

  /* exports */
  module.exports = flatten([map(sync, tests), adHocTests])
})()

