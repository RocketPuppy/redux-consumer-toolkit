// @flow
import memoize from 'ramda/src/memoize.js';

// Functor<Reducer<action, ins>>
// Transform the output of a reducer

export type FunctorT<Static, In, OutA, OutB> = {
  map: ((OutA => OutB), (In, Static) => OutA) => (In, Static) => OutB
};

const Functor : FunctorT<*, *, *, *> = {
  map: (f, reducer) => (
    (state, action) => (
      f(reducer(state, action))
    )
  )
};

export const FunctorM : FunctorT<*, *, *, *> = {
  map: memoize(Functor.map)
};

export default Functor;
/*
 * Identity:
 * map(id, r) === r
 * (s, a) => id(r(s, a))
 * id(S)
 * S
 *
 * Composition:
 * map((s => f(g(s))), r) === map(f, map(g, r))
 * (s, a) => (s => f(g(s)))(r(s, a)) === map(f, (s, a) => g(r(s, a)))
 * (s, a) => (s => f(g(s)))(r(s, a)) === (s', a') => f( ((s, a) => g(r(s, a)))(s', a'))
 * (s, a) => (s => f(g(s)))(r(s, a)) === f( ((s', a') => g(r(s', a')))
 * (s => f(g(s)))(S) === f( ((s', a') => g(r(s', a')))
 * f(g(S)) === f( ((s', a') => g(r(s', a')))
 * f(g(S)) === f((g(S))
 * f(g(S)) === f((g(S))
 */

