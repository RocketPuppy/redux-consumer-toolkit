// @flow
import R from "./ramda";
import FunctorI from "./Functor";
import ApplyI from "./Apply";
import ChainI from "./Chain";
import ProfunctorI from "./Profunctor";
import SemigroupI from "./Semigroup";
import Monoid from "./Monoid";

import Applicative from "./Applicative";

const { memoize } = R;
const { identity } = Monoid;
const { constant } = Applicative;

const map = (...args: *) => memoize(FunctorI.map(...args));
const ap = (...args: *) => memoize(ApplyI.ap(...args));
const apAll = (...args: *) => memoize(ApplyI.apAll(...args));
const promap = (...args: *) => memoize(ProfunctorI.promap(...args));
const mapInOut = promap;
const mapIn = (...args: *) => memoize(ProfunctorI.mapIn(...args));
const mapOut = map;
const objectify = (...args: *) => memoize(ProfunctorI.objectify(...args));
const bind = (...args: *) => memoize(ChainI.bind(...args));
const chain = (...args: *) => memoize(ChainI.chain(...args));
const expand = (...args: *) => memoize(ChainI.expand(...args));
const expandAll = (...args: *) => memoize(ChainI.expandAll(...args));
const combine = (...args: *) => memoize(ChainI.combine(...args));
const concat = (...args: *) => memoize(SemigroupI.concat(...args));

const Functor = {
  map
};

const Apply = {
  ap,
  apAll
};

const Profunctor = {
  promap,
  mapInOut,
  mapIn,
  mapOut,
  objectify
};

const Chain = {
  bind,
  chain,
  expand,
  expandAll,
  combine
};

const Semigroup = {
  concat
};

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
