// @flow

import { FunctorM as Functor } from './Functor';
import { ProfunctorM as Profunctor } from './Profunctor';
import { ApplyM as Apply } from './Apply';
import { ApplicativeM as Applicative } from './Applicative';
import { SemigroupM as Semigroup } from './Semigroup';
import { MonoidM as Monoid } from './Monoid';
import { ChainM as Chain } from './Chain';

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
  ...Chain
};
