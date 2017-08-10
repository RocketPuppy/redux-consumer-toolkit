// @flow
import memoize from 'ramda/src/memoize.js';
import Functor from './Functor';

export type ProfunctorT<Static, InA, InB, OutA, OutB> = {
  promap: ((InB => InA), (OutA => OutB), (InA, Static) => OutA) => (InB, Static) => OutB,
  mapIn: ((InB => InA), (InA, Static) => OutA) => (InB, Static) => OutB,
  mapOut: ((OutA => OutB), (InA, Static) => OutA) => (InA, Static) => OutB,
  objectify: (string, (InA, Static) => OutA) => ({[string]: InA}, Static) => {[string]: OutA}
};

// Profunctor<Reducer<action>>
// Transform the input and output of a reducer.
// Promap transforms both at the same time
// MapIn transforms only the input.
// MapOut transforms only the output, identical to Functor.map
const Profunctor : ProfunctorT<*, *, *, *, *> = {
  promap: (inF, outF, r) => (
    (s, a) => (
      outF(r(inF(s), a))
    )
  ),
  mapIn: (inF, r) => Profunctor.promap(inF, x => x, r),
  mapOut: Functor.map,
  objectify: (k, r) => (
    Profunctor.promap((s) => s[k], (s) => ({ [k]: s }), r)
  )
};

export const ProfunctorM : ProfunctorT<*, *, *, *, *> = {
  promap: memoize(Profunctor.promap),
  mapIn: memoize(Profunctor.mapIn),
  mapOut: memoize(Profunctor.mapOut),
  objectify: memoize(Profunctor.objectify)
};

export default Profunctor;
/*
 * Identity
 * promap(id, id, r) === r
 * (s, a) => id(r(id(s), a))
 * (s, a) => id(r(s, a))
 * id(S)
 * S
 *
 * Composition:
 * promap(x => f(g(x)), y => h(i(y)), r) = promap(g, h, promap(f, i, r))
 * (s, a) => (y => h(i(y)))(r((x => f(g(x)))(s), a))
 * (s, a) => (y => h(i(y)))(r(f(g(s)), a))
 * (s, a) => h(i(r(f(g(s)), a)))
 *
 * promap(f, i, r)
 * (s, a) => i(r(f(s), a))
 *
 * promap(g, h, (s, a) => i(r(f(s), a)))
 * (s', a') => h((R)(g(s'), a'))
 * (s', a') => h(((s, a) => i(r(f(s), a)))(g(s'), a'))
 * (s', a') => h((i(r(f(g(s')), a'))))
 * (s', a') => h(i(r(f(g(s')), a')))
 */
