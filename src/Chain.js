// @flow
import memoize from 'ramda/src/memoize.js';

// Chain<Reducer<action, ins>>
// Capture the output of a reducer to be used as additional input to a second reducer.

export const Chain = {
  chain: (r_ : outs => Reducer<action, ins, outs_>, r : Reducer<action, ins, outs>) : Reducer<action, ins, outs_> => (
    memoize((state : ins, action : action) => (
      r_(r(state, action))(state, action)
    ))
  ),
  // Take two reducers and merge their output, biased towards the second reducer
  expand: (r : Reducer<action, ins, outs>, r_ : Reducer<action, ins, outs_>) : Reducer<action, ins, outs & outs_> => (
    Chain.chain((s_) => (s, a) => ({ ...s_, ...r_(s, a) }), r)
  )
};
/*
 * Associativity
 * chain(g, chain(f, u)) === chain(x => chain(g, f(x)), u)
 *
 * chain(g, chain(f, u))
 *
 * chain(g, (s, a) => (f(u(s, a)))(s, a))
 * chain(g, (s, a) => (f(S))(s, a))
 * chain(g, (s, a) => ((s', a') => R(s', a'))(s, a))
 * chain(g, (s, a) => R(s, a))
 * (s', a') => g(((s, a) => R(s, a))(s', a'))(s', a')
 * (s', a') => g((R(s', a')))(s', a')
 * (s', a') => g(S)(s', a')
 * (s', a') => ((s, a) => R(s, a))(s', a')
 * (s', a') => R(s', a')
 *
 * chain(x => chain(g, f(x)), u)
 *
 * (s, a) => (x => chain(g, f(x)))(u(s, a))(s, a)
 * (s, a) => (chain(g, f(u(s,a))))(s, a)
 * (s, a) => (chain(g, f(S)))(s, a)
 * (s, a) => (chain(g, (s', a') => R(s', a')))(s, a)
 * (s, a) => ((s'', a'') => g(((s', a') => R(s', a'))(s'', a''))(s'', a''))(s, a)
 * (s, a) => ((s'', a'') => g((R(s'', a'')))(s'', a''))(s, a)
 * (s, a) => ((s', a') => g((R(s', a')))(s', a'))(s, a)
 * (s, a) => ((s', a') => g(S)(s', a'))(s, a)
 * (s, a) => ((s', a') => ((s'', a'') => R(s'', a''))(s', a'))(s, a)
 * (s, a) => ((s', a') => (R(s', a')))(s, a)
 * (s, a) => ((R(s, a)))
 * (s, a) => R(s, a)
 */
