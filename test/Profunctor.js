import { Profunctor, Monoid, Functor } from '../src/index';
import { Profunctor as ProfunctorM, Functor as FunctorM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties, memoizedMemoizes } from './basic';

memoizedSameProperties('Profunctor', Profunctor, ProfunctorM);

memoizedMemoizes(
  'Profunctor.promap',
  Profunctor.promap,
  ProfunctorM.promap,
  (counter) => [
    (i) => i + 1,
    (o) => o + 2,
    (x, y) => {
      counter.count();
      return x + y;
    }
  ],
  ['foo', 'bar']
);

memoizedMemoizes(
  'Profunctor.mapIn',
  Profunctor.mapIn,
  ProfunctorM.mapIn,
  (counter) => [
    (i) => i + 1,
    (x, y) => {
      counter.count();
      return x + y;
    }
  ],
  ['foo', 'bar']
);

memoizedMemoizes(
  'Profunctor.objectify',
  Profunctor.objectify,
  ProfunctorM.objectify,
  (counter) => [
    'mykey',
    (x, y) => {
      counter.count();
      return x + y;
    }
  ],
  ['foo', 'bar']
);

describe('Profunctor', function() {
  describe('mapOut', function() {
    it('is the same as Functor.map', function() {
      assert(Functor.map === Profunctor.mapOut);
      assert(FunctorM.map === ProfunctorM.mapOut);
    });
  });

  describe('mapInOut', function() {
    it('is the same as Profunctor.promap', function() {
      assert(Profunctor.promap === Profunctor.mapInOut);
      assert(ProfunctorM.promap === ProfunctorM.mapInOut);
    });
  });

  describe('promap', function() {
    it('transforms input and output', function() {
      const f = x => x+x;
      const g = (x, y) => x + y;
      const v = 1;
      const s = 3;
      const c = Profunctor.promap(f, f, g);

      assert.equal(c(v, s), f(g(f(v), s)));
      assert.notEqual(c(v, s), g(f(v), s));
      assert.notEqual(c(v, s), f(g(v, s)));
    });
  });

  describe('mapIn', function() {
    it('transforms input', function() {
      const f = x => x+x;
      const g = (x, y) => x + y;
      const v = 1;
      const s = 3;
      const c = Profunctor.mapIn(f, g);

      assert.notEqual(c(v, s), f(g(f(v), s)));
      assert.equal(c(v, s), g(f(v), s));
      assert.notEqual(c(v, s), f(g(v, s)));
    });
  });

  describe('objectify', function() {
    it('embeds consumer in object', function() {
      const k = 'foo';
      const f = (x, y) => x+y;
      const v = { [k]: 1 };
      const s = 3;
      const c = Profunctor.objectify(k, f);

      assert.deepEqual(c(v, s), { [k]: f(v[k], s) });
    });
  });
});
