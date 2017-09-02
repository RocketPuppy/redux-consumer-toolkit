// @flow
import type { Functor } from "./types/Functor";

const FunctorI: Functor<*, *, *, *> = {
  map: function(transformer, context) {
    return (state, props) => transformer(context(state, props));
  }
};

export default FunctorI;
