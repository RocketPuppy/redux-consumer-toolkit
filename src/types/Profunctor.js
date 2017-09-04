// @flow
export type Profunctor<Static, InA, InB, OutA, OutB> = {
  promap: (
    (InB) => InA,
    (OutA) => OutB,
    (InA, Static) => OutA
  ) => (InB, Static) => OutB,
  mapInOut: (
    (InB) => InA,
    (OutA) => OutB,
    (InA, Static) => OutA
  ) => (InB, Static) => OutB,
  mapIn: ((InB) => InA, (InA, Static) => OutA) => (InB, Static) => OutA,

  mapOut: ((OutA) => OutB, (InA, Static) => OutA) => (InA, Static) => OutB,

  objectify: (
    string,
    (InA, Static) => OutA
  ) => ({ [string]: InA }, Static) => { [string]: OutA }
};
