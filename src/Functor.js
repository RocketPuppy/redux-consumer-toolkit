// @flow
import memoize from 'ramda/src/memoize.js';
import type Reducer from './types';

// Functor<Reducer<action, ins>>
// Transform the output of a reducer

const Functor = {
  map: (f : (state => new_state), reducer : Reducer<ins, state>) : Reducer<ins, new_state> => (
    memoize((state : state, action : action) : new_state => (
      f(reducer(state, action))
    ))
  )
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

