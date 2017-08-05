// @flow
import memoize from 'ramda/src/memoize.js';

type Reducer<action, ins, outs> = (ins, action) => outs;

// Functor<Reducer<action, ins>>
// Transform the output of a reducer

export const Functor = {
  map: (f : (state => new_state), reducer : Reducer<ins, state>) : Reducer<ins, new_state> => (
    memoize((state : state, action : action) : new_state => (
      f(reducer(state, action))
    ))
  )
};

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

// Apply<Reducer<action, ins>>
// Allow reducers to return functions that can be used with Functor.map to
// transform chains of reducers. If the function is curried, you can chain
// usages of ap to fill all the arguments.

export const Apply = {
  ap: (a : Reducer<action, ins, (outs => outs_)>, b : Reducer<action, ins, outs>) : Reducer<action, ins, outs_> => (
    memoize((state : ins, action : action) => (
      a(state, action)(b(state, action))
    ))
  )
};

/*
 * Composition:
 * ap(ap(map(f => g => x => f(g(x)), r), r'), r'') === ap(r, ap(r', r''))
 *
 * map(f => g => x => f(g(x)), r)
 * (s, a) => (f => g => x => f(g(x)))(r(s, a))
 * (s, a) => (g => x => (r(s, a))(g(x)))
 *
 * ap((s, a) => (g => x => (r(s, a))(g(x))), r')
 * (s', a') => ((s, a) => (g => x => (r(s, a))(g(x))))(s', a')(r'(s', a'))
 * (s', a') => ((g => x => (r(s', a'))(g(x)))(r'(s', a')))
 * (s', a') => (x => (r(s', a'))((r'(s', a'))(x)))
 *
 * ap((s, a) => (x => (r(s, a))((r'(s, a))(x))), r'')
 * (s', a') => ((s, a) => (x => (r(s, a))((r'(s, a))(x))))(s', a')(r''(s', a'))
 * (s', a') => (x => (r(s', a'))((r'(s', a'))(x)))(r''(s', a'))
 * (s', a') => (r(s', a'))((r'(s', a'))(r''(s', a')))
 * (s', a') => (r(s', a')) ((r'(s', a')) (r''(s', a')))
 * (s', a') => (r(s', a') (r'(s', a') (r''(s', a'))))
 *
 * ap(r, ap(r', r''))
 *
 * ap(r', r'')
 * (s, a) => r'(s, a)(r''(s, a))
 *
 * ap(r, ((s, a) => r'(s, a)(r''(s, a))))
 * (s', a') => r(s', a')((s, a) => r'(s, a)(r''(s, a)))(s', a')
 * (s', a') => r(s', a')(r'(s', a')(r''(s', a')))
 * (s', a') => (r(s', a')(r'(s', a')(r''(s', a'))))
 * (s', a') => (r(s', a') (r'(s', a') (r''(s', a'))))
 */

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

// Monoid<Reducer<action, state, state>>
// Identity for reducers. It always returns the same state that was given.
export const Monoid = {
  empty: () : Reducer<action, state, state> => (
    memoize((s : state, _ : action) => (
      s
    ))
  )
};

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

export default {
  ...Functor,
  ...Profunctor,
  ...Apply,
  ...Applicative,
  ...Semigroup,
  ...Monoid,
  ...Chain
};
