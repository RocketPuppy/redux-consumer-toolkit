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

describe('Profunctor.mapOut', function() {
  it('is the same as Functor.map', function() {
    assert(Functor.map === Profunctor.mapOut);
    assert(FunctorM.map === ProfunctorM.mapOut);
  });
});

describe('Profunctor.mapInOut', function() {
  it('is the same as Profunctor.promap', function() {
    assert(Profunctor.promap === Profunctor.mapInOut);
    assert(ProfunctorM.promap === ProfunctorM.mapInOut);
  });
});

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
