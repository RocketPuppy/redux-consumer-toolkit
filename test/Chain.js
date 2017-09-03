import { Chain, Monoid } from '../src/index';
import { Chain as ChainM } from '../src/memoized';
import assert from 'assert';
import { memoizedSameProperties, memoizedMemoizes } from './basic';

memoizedSameProperties('Chain', Chain, ChainM);

memoizedMemoizes(
  'Chain.bind',
  Chain.bind,
  ChainM.bind,
  (counter) => [
    (z) => {
      counter.count();
      return (x, y) => {
        x + y + z;
      };
    },
    Monoid.identity
  ],
  ['foo', 'bar']
);

memoizedMemoizes(
  'Chain.chain',
  Chain.chain,
  ChainM.chain,
  (counter) => [
    Monoid.identity,
    (z) => {
      counter.count();
      return (x, y) => {
        x + y + z;
      };
    }
  ],
  ['foo', 'bar']
);

memoizedMemoizes(
  'Chain.expand',
  Chain.expand,
  ChainM.expand,
  (counter) => [
    (x, y) => {
      counter.count();
      return { foo: x };
    },
    (x, y) => ({ bar: y })
  ],
  ['foo', 'bar']
);

memoizedMemoizes(
  'Chain.expandAll',
  Chain.expandAll,
  ChainM.expandAll,
  (counter) => [
    (x, y) => {
      counter.count();
      return { foo: x };
    },
    (x, y) => ({ bar: y }),
    (x, y) => ({ baz: y + x })
  ],
  ['foo', 'bar']
);

memoizedMemoizes(
  'Chain.combine',
  Chain.combine,
  ChainM.combine,
  (counter) => [{
    foo: (x, y) => {
      counter.count();
      return x;
    },
    bar: (x, y) => y
  }],
  ['foo', 'bar']
);
