import { Applicative } from '../src/index';
import { Applicative as ApplicativeM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties } from './basic';

memoizedSameProperties('Applicative', Applicative, ApplicativeM);
