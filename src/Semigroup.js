// @flow
import memoize from 'ramda/src/memoize.js';

// Semigroup <Reducer<action, state, state>>
// Apply the two reducers to the same action, with the output of the first
// argument being used as input to the second. Reducers must take and return
// the same type.
export const Semigroup = {
  concat: (r : Reducer<action, in_a, out_a>, r_ : Reducer<action, out_a, out_b>) : Reducer<action, in_a, out_b> => (
    memoize((s : state, a : action) : state => (
      r_(r(s, a), a)
    ))
  )
};

/*
 * Associativity
 *
 * concat(concat(r, r'), r'') === concat(r, concat(r', r''))
 *
 * concat(r, r')
 * (s, a) => r'(r(s, a), a) *
 * concat((s, a) => r'(r(s, a), a), r'')
 *
 * (s', a') => r''(((s, a) => r'(r(s, a), a))(s', a'), a')
 * (s', a') => r''((r'(r(s', a'), a')), a')
 * (s', a') => r''(r'(r(s', a'), a'), a')
 *
 * concat(r', r'')
 *
 * (s, a) => r''(r'(s, a), a)
 *
 * concat(r, (s, a) => r''(r'(s, a), a))
 *
 * (s', a') => ((s, a) => r''(r'(s, a), a))(r(s', a'), a')
 * (s', a') => r''(r'((r(s', a')), a'), a')
 * (s', a') => r''(r'(r(s', a'), a'), a')
 */
