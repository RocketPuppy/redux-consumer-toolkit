import { Apply, Monoid, Applicative } from '../src/index';
import { Apply as ApplyM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties, memoizedMemoizes } from './basic';

memoizedSameProperties('Apply', Apply, ApplyM);

memoizedMemoizes(
  'Apply.ap',
  Apply.ap,
  ApplyM.ap,
  (counter) => [
    (x, y) => {
      counter.count();
      return (s) => s + x + y;
    },
    Monoid.identity
  ],
  ['foo', 'bar']
);

memoizedMemoizes(
  'Apply.apAll',
  Apply.apAll,
  ApplyM.apAll,
  (counter) => [
    (x, y, z) => {
      counter.count();
      return (s) => s + x + y + z;
    },
    Monoid.identity,
    Applicative.of(5)
  ],
  ['foo', 'bar']
);

describe('Apply', function() {
  const f = (x) => x + 4;
  const g = (x, y) => x + y;

  describe('ap', function() {
    it('applies the function to the argument', function() {
      const v = 1;
      const c = Apply.ap(Applicative.of(f), Monoid.identity);

      assert.equal(c(v, 'bar'), f(v));
    });
  });

  describe('apAll', function() {
    it('applies the function to the arguments', function() {
      const v = 1;
      const c = Apply.apAll(Applicative.of(g), Monoid.identity, Monoid.identity);

      assert.equal(c(v, 'bar'), g(v, v));
    });
  });
});
