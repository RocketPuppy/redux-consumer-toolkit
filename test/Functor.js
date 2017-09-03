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
