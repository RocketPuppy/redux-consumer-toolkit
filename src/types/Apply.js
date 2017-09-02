// @flow
export type Apply<Static, In, OutA, OutB> = {
  ap: (
    (In, Static) => OutA => OutB,
    (In, Static) => OutA
  ) => (In, Static) => OutB,
  apAll: (
    (In, Static) => mixed => OutB,
    ...Array<(In, Static) => mixed>
  ) => (In, Static) => OutB
};
