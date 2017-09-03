// @flow
import memoize from "ramda/src/memoize.js";
import FunctorI from "./Functor";
import ApplyI from "./Apply";
import ApplicativeI from "./Applicative";
import ChainI from "./Chain";
import ProfunctorI from "./Profunctor";
import SemigroupI from "./Semigroup";
import Monoid from "./Monoid";

let { map } = FunctorI;
let { ap, apAll } = ApplyI;
let { of, constant } = ApplicativeI;
let { promap, mapIn, mapOut, objectify } = ProfunctorI;
let { bind, chain, expand, expandAll, combine } = ChainI;
let { concat } = SemigroupI;
const { identity } = Monoid;

map = () => memoize(map(...arguments));
ap = () => memoize(ap(...arguments));
apAll = () => memoize(apAll(...arguments));
of = () => memoize(of(...arguments));
constant = () => memoize(constant(...arguments));
promap = () => memoize(promap(...arguments));
mapIn = () => memoize(mapIn(...arguments));
mapOut = () => memoize(mapOut(...arguments));
objectify = () => memoize(objectify(...arguments));
bind = () => memoize(bind(...arguments));
chain = () => memoize(chain(...arguments));
expand = () => memoize(expand(...arguments));
expandAll = () => memoize(expandAll(...arguments));
combine = () => memoize(combine(...arguments));
concat = () => memoize(concat(...arguments));

const Functor = {
  map
};

const Apply = {
  ap,
  apAll
};

const Applicative = {
  of,
  constant
};

const Profunctor = {
  promap,
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
  promap,
  mapIn,
  objectify,
  chain,
  expandAll,
  combine,
  identity,
  concat
};
