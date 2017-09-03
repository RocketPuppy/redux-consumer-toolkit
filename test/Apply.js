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
