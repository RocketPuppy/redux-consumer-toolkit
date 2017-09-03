import { Monoid } from '../src/index';
import { Monoid as MonoidM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties } from './basic';

memoizedSameProperties('Monoid', Monoid, MonoidM);
