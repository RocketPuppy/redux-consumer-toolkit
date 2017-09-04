// @flow
import type { Semigroup } from "./types/Semigroup";

import Monoid from "./Monoid";

const SemigroupI: Semigroup<*, *, *, *> = {
  concat: (c, c_) => (s, a) => c_(c(s, a), a),

  concatAll: (...cs) => cs.reduce(SemigroupI.concat, Monoid.identity)
};

export default SemigroupI;
