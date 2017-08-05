// @flow
import memoize from 'ramda/src/memoize.js';

// Applicative<Reducer<action, ins>>
// Lifts a value into a reducer so it can be used by Apply.ap
export const Applicative = {
  of: (a : outs) : Reducer<action, ins, outs> => (
    memoize((s : ins, action : action) : outs => (
      a
    ))
  )
};

/*
 * Identity
 * ap(of(id), r) === r
 * ap((s, a) => id, r)
 * (s', a') => (((s, a) => id)(s', a'))(r(s', a'))
 * (s', a') => (id)(r(s', a'))
 * === r (from identity of Functor)
 *
 * Homomorphism
 * ap(of(f), of(x)) === of(f(x))
 * ap((s, a) => f, (s', a') => x)
 * (s'', a'') => (((s, a) => f)(s'', a'')(((s', a') => x)(s'', a'')))
 * (s'', a'') => ((f)(x))
 * (s'', a'') => (f(x))
 * (s, a) => f(x)
 *
 * of(f(x))
 * (s, a) => f(x)
 *
 * Interchange
 *
 * ap(u, of(y)) === ap(of(f => f(y)), u)
 *
 * ap(u, of(y))
 * ap(u, (s, a) => y)
 * (s', a') => u(s', a')(((s, a) => y)(s', a'))
 * (s', a') => u(s', a')(y)
 *
 * ap(of(f => f(y)), u)
 * ap((s, a) => (f => f(y)), u)
 * (s', a') => (((s, a) => (f => f(y)))(s', a'))(u(s', a'))
 * (s', a') => (f => f(y))(u(s', a'))
 * (s', a') => (u(s', a')(y))
 * (s', a') => u(s', a')(y)
 */
