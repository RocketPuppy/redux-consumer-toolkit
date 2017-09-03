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
