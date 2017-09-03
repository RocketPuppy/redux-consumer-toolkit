import { Semigroup } from '../src/index';
import { Semigroup as SemigroupM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties } from './basic';

memoizedSameProperties('Semigroup', Semigroup, SemigroupM);
