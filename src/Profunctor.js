// @flow
import memoize from 'ramda/src/memoize.js';

// Profunctor<Reducer<action>>
// Transform the input and output of a reducer.
// Promap transforms both at the same time
// MapIn transforms only the input.
// MapOut transforms only the output, identical to Functor.map
export const Profunctor = {
  promap: (inF : new_in => old_in, outF : old_out => new_out, r : Reducer<action, old_in, old_out>) : Reducer<action, new_in, new_out> => (
    memoize((s : new_in, a : action) : new_out => (
      outF(r(in_f(s), a))
    ))
  ),
  mapIn: (inF, r) => Profunctor.promap(inF, x => x, r),
  mapOut: Functor.map
};

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
