import { Apply } from '../src/index';
import { Apply as ApplyM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties } from './basic';

memoizedSameProperties('Apply', Apply, ApplyM);
