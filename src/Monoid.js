// @flow
import type { Monoid } from "./types/Monoid";

const MonoidI: Monoid<*, *> = {
  empty: () => MonoidI.identity,
  identity: (s, _) => s
};

export default MonoidI;
