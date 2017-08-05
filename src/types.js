// @flow

export type Reducer<action, ins, outs> = (ins, action) => outs;
