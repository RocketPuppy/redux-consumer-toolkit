// @flow
import memoize from 'ramda/src/memoize.js';

// Apply<Reducer<action, ins>>
// Allow reducers to return functions that can be used with Functor.map to
// transform chains of reducers. If the function is curried, you can chain
// usages of ap to fill all the arguments.

export type ApplyT<Static, In, OutA, OutB> = {
  ap: ((In, Static) => (OutA => OutB), (In, Static) => OutA) => (In, Static) => OutB,
  apAll: ((In, Static) => (mixed => OutB), ...Array<(In, Static) => mixed>) => (In, Static) => OutB
};

const Apply : ApplyT<*, *, *, *> = {
  ap: (a, b) => (
    (state, action) => (
      a(state, action)(b(state, action))
    )
  ),
  apAll: (a, ...args) => (
    (state, action) => (
      a(state, action).apply(args.map(arg => arg(state, action)))
    )
  )
};

export const ApplyM : ApplyT<*, *, *, *> = {
  ap: memoize(Apply.ap),
  apAll: memoize(Apply.apAll)
};

export default Apply;
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
