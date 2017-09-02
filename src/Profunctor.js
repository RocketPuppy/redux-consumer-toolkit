// @flow
import Functor from "./Functor";

import type { Profunctor } from "./types/Profunctor";

const ProfunctorI: Profunctor<*, *, *, *, *> = {
  promap: (inF, outF, c) => (s, a) => outF(c(inF(s), a)),

  mapIn: (inF, c) => ProfunctorI.promap(inF, x => x, c),

  mapOut: Functor.map,

  objectify: (k, c) => ProfunctorI.promap(i => i[k], o => ({ [k]: o }), c)
};

export default ProfunctorI;
