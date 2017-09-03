import { Functor } from '../src/index';
import { Functor as FunctorM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties } from './basic';

memoizedSameProperties('Functor', Functor, FunctorM);
