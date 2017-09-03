import assert from 'assert';

export function memoizedSameProperties(name, nonmemo, memo) {
  return describe(`${name}/${name}M`, function() {
    it('should have the same properties', function() {
      assert.deepEqual(Object.getOwnPropertyNames(nonmemo), Object.getOwnPropertyNames(memo));
    });
  });
}

class Counter {
  constructor() {
    this.counter = 0;
  }

  count() {
    this.counter++;
  }
};

export function memoizedMemoizes(name, method, methodM, args, testArgs) {
  return describe(name, function() {
    describe('unmemoized', function() {
      it('recomputes', function() {
        let counter = new Counter();
        const subject = method(...args(counter));
        subject(...testArgs);
        subject(...testArgs);
        assert.equal(counter.counter, 2);
      });
    });
    describe('memoized', function() {
      it('memoizes', function() {
        let counter = new Counter();
        const subject = methodM(...args(counter));
        subject(...testArgs);
        subject(...testArgs);
        assert.equal(counter.counter, 1);
      });
    });
    describe('both', function() {
      it('returns the same results', function() {
        let counter = new Counter();
        const subject = method(...args(counter));
        const subjectM = method(...args(counter));

        assert.deepEqual(subject(...testArgs), subjectM(...testArgs));
      });
    });
  });
};
