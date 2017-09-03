import { Profunctor } from '../src/index';
import { Profunctor as ProfunctorM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties } from './basic';

memoizedSameProperties('Profunctor', Profunctor, ProfunctorM);
