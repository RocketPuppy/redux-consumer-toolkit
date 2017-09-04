import { Applicative } from '../src/index';
import { Applicative as ApplicativeM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties } from './basic';

memoizedSameProperties('Applicative', Applicative, ApplicativeM);

describe('Applicative', function() {
  describe('constant', function() {
    it('is the same as of', function() {
      assert(Applicative.of === Applicative.constant);
    });

    it('always returns the provided value', function() {
      const v = 1;
      const c = Applicative.constant(v);

      assert.equal(c('foo', 'bar'), v);
    });
  });
});
