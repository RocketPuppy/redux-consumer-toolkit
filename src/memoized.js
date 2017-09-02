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
let { of } = ApplicativeI;
let { promap, mapIn, mapOut, objectify } = ProfunctorI;
let { bind, chain, expand, expandAll, combine } = ChainI;
let { concat } = SemigroupI;
const { identity } = Monoid;

map = memoize(map);
ap = memoize(ap);
apAll = memoize(apAll);
of = memoize(of);
promap = memoize(promap);
mapIn = memoize(mapIn);
mapOut = memoize(mapOut);
objectify = memoize(objectify);
bind = memoize(bind);
chain = memoize(chain);
expand = memoize(expand);
expandAll = memoize(expandAll);
combine = memoize(combine);
concat = memoize(concat);

const Functor = {
  map
};

const Apply = {
  ap,
  apAll
};

const Applicative = {
  of
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
  of,
  promap,
  mapIn,
  objectify,
  chain,
  expandAll,
  combine,
  identity,
  concat
};
