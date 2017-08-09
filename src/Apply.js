// @flow
import memoize from 'ramda/src/memoize.js';

// Apply<Reducer<action, ins>>
// Allow reducers to return functions that can be used with Functor.map to
// transform chains of reducers. If the function is curried, you can chain
// usages of ap to fill all the arguments.

const Apply = {
  ap: (a : Reducer<action, ins, (outs => outs_)>, b : Reducer<action, ins, outs>) : Reducer<action, ins, outs_> => (
    (state : ins, action : action) => (
      a(state, action)(b(state, action))
    )
  )
};

export const ApplyM = {
  ap: memoize(Apply.ap)
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
