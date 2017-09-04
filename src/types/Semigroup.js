// @flow
export type Semigroup<Static, In, OutA, OutB> = {
  concat: (
    (In, Static) => OutA,
    (OutA, Static) => OutB
  ) => (In, Static) => OutB,
  concatAll: (...(In, Static) => In) => (In, Static) => In
};
