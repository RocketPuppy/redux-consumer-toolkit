import { Monoid } from '../src/index';
import { Monoid as MonoidM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties } from './basic';

memoizedSameProperties('Monoid', Monoid, MonoidM);

describe('Monoid', function() {
  describe('identity', function() {
    it('returns the state it is given and ignores action/props', function() {
      const v = 1;
      const s = 3;

      assert.equal(Monoid.identity(v, s), v);
      assert.notEqual(Monoid.identity(v, s), s);
    });
  });

  describe('empty', function() {
    it('returns the state it is given and ignores action/props', function() {
      const v = 1;
      const s = 3;
      const c = Monoid.empty();

      assert.equal(c(v, s), v);
      assert.notEqual(c(v, s), s);
    });
  });
});
