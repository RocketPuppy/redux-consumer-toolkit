import assert from 'assert';

export function memoizedSameProperties(name, nonmemo, memo) {
  return describe(`${name}/${name}M`, function() {
    it('should have the same properties', function() {
      assert.deepEqual(Object.getOwnPropertyNames(nonmemo), Object.getOwnPropertyNames(memo));
    });
  });
}
