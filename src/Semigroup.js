// @flow
import type { Semigroup } from "./types/Semigroup";

const SemigroupI: Semigroup<*, *, *, *> = {
  concat: (c, c_) => (s, a) => c_(c(s, a), a)
};

export default SemigroupI;
