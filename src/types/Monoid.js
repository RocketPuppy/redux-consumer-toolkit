// @flow
export type Monoid<Static, State> = {
  empty: () => (State, Static) => State,
  identity: (State, Static) => State
};
