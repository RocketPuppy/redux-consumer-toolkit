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
    (In, Static) => { [string]: OutA },
    (In, Static) => { [string]: OutB }
  ) => (In, Static) => { [string]: OutA & OutB },

  expandAll: (
    ...Array<(In, Static) => { [string]: any }>
  ) => (In, Static) => { [string]: * },

  combine: ({ [key: string]: (In, Static) => mixed }) => (In, Static) => mixed
};
