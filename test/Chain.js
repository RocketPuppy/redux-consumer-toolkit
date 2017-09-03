import { Chain } from '../src/index';
import { Chain as ChainM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties } from './basic';

memoizedSameProperties('Chain', Chain, ChainM);
