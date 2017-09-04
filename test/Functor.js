import { Functor, Monoid } from '../src/index';
import { Functor as FunctorM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties, memoizedMemoizes } from './basic';

memoizedSameProperties('Functor', Functor, FunctorM);

memoizedMemoizes(
  'Functor.map',
  Functor.map,
  FunctorM.map,
  (counter) => [
    (x) => {
      counter.count();
      return x;
    },
    Monoid.identity
  ],
  ['foo', 'bar']
);

describe('Functor', function() {
  describe('map', function() {
    it('transforms the output', function() {
      const f = x => x+x;
      const g = (x, y) => x + y;
      const v = 1;
      const s = 3;
      const c = Functor.map(f, g);

      assert.equal(c(v, s), f(g(v, s)));
      assert.notEqual(c(v, s), g(v, s));
    });
  });
});
