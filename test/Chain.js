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

describe('Chain', function() {
  const independent = (x, y) => x + y;
  const dependent = (c) => (x, y) => c + x + y;

  describe('bind', function() {
    it('the dependent consumer depends on value from the independent consumer', function () {
      const v = 1;
      const s = 3;
      const c = Chain.bind(dependent, independent);

      assert.equal(c(v, s), dependent(independent(v, s))(v, s));
    });
  });

  describe('chain', function() {
    it('is a flipped bind', function() {
      const v = 1;
      const s = 3;
      const c = Chain.bind(dependent, independent);
      const c2 = Chain.chain(independent, dependent);

      assert.equal(c(v, s), c2(v, s));
    });
  });

  describe('expand', function() {
    it('expands the results of the consumers into the same object', function() {
      const f = (x, y) => ({ foo: x });
      const g = (x, y) => ({ bar: y });
      const v = 1;
      const s = 3;
      const c = Chain.expand(f, g);

      assert.deepEqual(c(v, s), { ...f(v, s), ...g(v, s) });
    });

    it('is biased towards the later consumer', function() {
      const f = (x, y) => ({ foo: x });
      const g = (x, y) => ({ foo: y });
      const v = 1;
      const s = 3;
      const c = Chain.expand(f, g);

      assert.equal(c(v, s).foo, s);
      assert.notEqual(c(v, s).foo, v);
    });
  });

  describe('expandAll', function() {
    it('expands the results of the consumers into the same object', function() {
      const f = (x, y) => ({ foo: x });
      const g = (x, y) => ({ bar: y });
      const h = (x, y) => ({ baz: x + y });
      const v = 1;
      const s = 3;
      const c = Chain.expandAll(f, g, h);

      assert.deepEqual(c(v, s), { ...f(v, s), ...g(v, s), ...h(v, s) });
    });

    it('is biased towards the later consumer', function() {
      const f = (x, y) => ({ foo: x });
      const g = (x, y) => ({ foo: y });
      const h = (x, y) => ({ foo: x + y });
      const v = 1;
      const s = 3;
      const c = Chain.expandAll(f, g, h);

      assert.equal(c(v, s).foo, v + s);
      assert.notEqual(c(v, s).foo, v);
      assert.notEqual(c(v, s).foo, s);
    });
  });

  describe('combine', function() {
    it('includes all keys in result', function() {
      const f = (x, y) => x;
      const g = (x, y) => y;
      const v = { foo: 1 };
      const s = 3;
      const c = Chain.combine({
        foo: f,
        bar: g
      });

      const ret = c(v, s);
      console.log(ret);
      console.log(f(v, s));
      assert(ret.foo);
      assert(ret.bar);
    });
  });
});
