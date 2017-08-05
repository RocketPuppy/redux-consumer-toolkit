// @flow
import memoize from 'ramda/src/memoize.js';

// Monoid<Reducer<action, state, state>>
// Identity for reducers. It always returns the same state that was given.
const Monoid = {
  empty: () : Reducer<action, state, state> => (
    memoize((s : state, _ : action) => (
      s
    ))
  )
};

export default Monoid;
/*
 * Right identity
 *
 * concat(r, empty()) === r
 * concat(r, (s, a) => s)
 * (s', a') => ((s, a) => s)(r(s', a'), a')
 * (s', a') => r(s', a')
 * r
 *
 * Left Identity
 *
 * concat(empty(), r) === r
 * concat((s, a) => s, r)
 * (s', a') => r(((s, a) => s)(s', a'), a')
 * (s', a') => r(s', a')
 * r
 */
