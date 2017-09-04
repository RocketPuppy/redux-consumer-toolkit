// @flow
import Functor from "./Functor";

import Apply from "./Apply";

import Applicative from "./Applicative";

import Profunctor from "./Profunctor";

import Chain from "./Chain";

import Monoid from "./Monoid";

import Semigroup from "./Semigroup";

const { map } = Functor;
const { apAll } = Apply;
const { constant } = Applicative;
const { mapInOut, mapIn, objectify } = Profunctor;
const { chain, expandAll, combine } = Chain;
const { identity } = Monoid;
const { concat } = Semigroup;

export {
  Functor,
  Apply,
  Applicative,
  Profunctor,
  Chain,
  Monoid,
  Semigroup,
  map,
  apAll,
  constant,
  mapInOut,
  mapIn,
  objectify,
  chain,
  expandAll,
  combine,
  identity,
  concat
};
