// @flow

import Memoized, * as MemMod from './memoized';

import Functor from './Functor';
import Profunctor from './Profunctor';
import Apply from './Apply';
import Applicative from './Applicative';
import Semigroup from './Semigroup';
import Monoid from './Monoid';
import Chain from './Chain';

export {
  Functor,
  Profunctor,
  Apply,
  Applicative,
  Semigroup,
  Monoid,
  Chain
};

export default {
  ...Functor,
  ...Profunctor,
  ...Apply,
  ...Applicative,
  ...Semigroup,
  ...Monoid,
  ...Chain,
  Memoized: {
    ...Memoized,
    ...MemMod
  }
};
