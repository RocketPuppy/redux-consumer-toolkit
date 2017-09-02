// @flow
import mapObjIndexed from "ramda/src/mapObjIndexed.js";
import values from "ramda/src/values.js";
import Profunctor from "./Profunctor";

import Monoid from "./Monoid";

import type { Chain } from "./types/Chain";

const ChainI: Chain<*, *, *, *> = {
  bind: (r_, r) => (state, action) => r_(r(state, action))(state, action),
  chain: (r, r_) => ChainI.bind(r_, r),

  expand: (r, r_) => ChainI.bind(s_ => (s, a) => ({ ...s_, ...r_(s, a) }), r),

  expandAll: (...consumers) => consumers.reduce(ChainI.expand, Monoid.identity),

  combine: spec => {
    const objectified = mapObjIndexed(
      (r, k) => Profunctor.objectify(k, r),
      spec
    );

    return ChainI.expandAll(...values(objectified));
  }
};

export default ChainI;
