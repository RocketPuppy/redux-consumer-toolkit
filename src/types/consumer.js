// @flow
export type Consumer<Static, In, Out> = (In, Static) => Out;
