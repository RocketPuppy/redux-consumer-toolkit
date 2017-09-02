// @flow
import type { Consumer } from "./consumer";

export type Functor<Static, In, OutA, OutB> = {
  map: (
    (OutA) => OutB,
    Consumer<Static, In, OutA>
  ) => Consumer<Static, In, OutB>
};
