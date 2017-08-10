// @flow
import memoize from 'ramda/src/memoize.js';
import mapObjIndexed from 'ramda/src/mapObjIndexed.js';
import values from 'ramda/src/values.js';
import Profunctor from './Profunctor';
import Monoid from './Monoid';

// Chain<Reducer<action, ins>>
// Capture the output of a reducer to be used as additional input to a second reducer.

export type ChainT<Static, In, OutA, OutB> = {
  chain: (OutA => ((In, Static) => OutB), (In, Static) => OutA) => (In, Static) => OutB,
  expand: ((In, Static) => OutA, (In, Static) => {[string]: mixed}) => (In, Static) => {[string]: mixed},
  expandAll: (...Array<(In, Static) => {[string]: mixed}>) => (In, Static) => {[string]: mixed},
  combine: ({[key : string]: (In, Static) => mixed }) => (In, Static) => mixed
};

const Chain : ChainT<*, *, *, *> = {
  chain: (r_, r) => (
    (state, action) => (
      r_(r(state, action))(state, action)
    )
  ),
  // Take two reducers and merge their output, biased towards the second reducer
  expand: (r, r_) => (
    Chain.chain((s_) => (s, a) => ({ ...s_, ...r_(s, a) }), r)
  ),
  expandAll: (...reducers) => (
    reducers.reduce(Chain.expand, Monoid.empty())
  ),
  combine: (reducerSpec) => (
    values(mapObjIndexed((r, k) => Profunctor.objectify(k, r), reducerSpec))
      .reduceRight(Chain.expand, Monoid.empty)
  )
};

export const ChainM : ChainT<*, *, *, *> = {
  chain: memoize(Chain.chain),
  expand: memoize(Chain.expand),
  expandAll: memoize(Chain.expandAll),
  combine: memoize(Chain.combine)
};

export default Chain;
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
