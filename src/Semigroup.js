// @flow
import memoize from 'ramda/src/memoize.js';

export type SemigroupT<Static, In, OutA, OutB> = {
  concat: ((In, Static) => OutA, (OutA, Static) => OutB) => (In, Static) => OutB
};

// Semigroup <Reducer<action, state, state>>
// Apply the two reducers to the same action, with the output of the first
// argument being used as input to the second. Reducers must take and return
// the same type.
const Semigroup : SemigroupT<*, *, *, *> = {
  concat: (r, r_) => (
    (s, a) => (
      r_(r(s, a), a)
    )
  )
};

export const SemigroupM : SemigroupT<*, *, *, *> = {
  concat: memoize(Semigroup.concat)
};

export default Semigroup;
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
