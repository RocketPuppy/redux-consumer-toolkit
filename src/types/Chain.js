// @flow
export type Chain<Static, In, OutA, OutB> = {
  bind: (
    (OutA) => (In, Static) => OutB,
    (In, Static) => OutA
  ) => (In, Static) => OutB,
  chain: (
    (In, Static) => OutA,
    (OutA) => (In, Static) => OutB
  ) => (In, Static) => OutB,
  expand: (
    (In, Static) => { [string]: mixed },
    (In, Static) => { [string]: mixed }
  ) => (In, Static) => { [string]: mixed },

  expandAll: (
    ...Array<(In, Static) => { [string]: mixed }>
  ) => (In, Static) => { [string]: mixed },

  combine: ({ [key: string]: (In, Static) => mixed }) => (In, Static) => mixed
};
