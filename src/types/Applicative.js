// @flow
export type Applicative<Static, In, Out> = {
  of: Out => (In, Static) => Out
};
