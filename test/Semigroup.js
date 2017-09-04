import { Semigroup } from '../src/index';
import { Semigroup as SemigroupM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties, memoizedMemoizes } from './basic';

memoizedSameProperties('Semigroup', Semigroup, SemigroupM);

memoizedMemoizes(
  'Semigroup.concat',
  Semigroup.concat,
  SemigroupM.concat,
  (counter) => [
    (x, y) => {
      counter.count();
      return y;
    },
    (x, y) => x + y
  ],
  ['foo', 'bar']
);

memoizedMemoizes(
  'Semigroup.concatAll',
  Semigroup.concatAll,
  SemigroupM.concatAll,
  (counter) => [
    (x, y) => {
      counter.count();
      return y;
    },
    (x, y) => x + y,
    (x, y) => x + y
  ],
  ['foo', 'bar']
);

describe('Semigroup', function() {
  describe('concat', function() {
    it('passes output of first into second', function() {
      const f = (x, y) => x;
      const g = (x, y) => x + y;
      const v = 1;
      const s = 3;
      const c = Semigroup.concat(f, g);

      assert.equal(c(v, s), g(f(v, s), s));
    });
  });

  describe('concatAll', function() {
    it('passes output of first into second', function() {
      const f = (x, y) => x;
      const g = (x, y) => x + y;
      const v = 1;
      const s = 3;
      const c = Semigroup.concatAll(f, g, g);

      assert.equal(c(v, s), g(g(f(v, s), s), s));
    });
  });
});
