// @flow
import type { Apply } from "./types/Apply";

const ApplyI: Apply<*, *, *, *> = {
  ap: (transformerConsumer, valueConsumer) => (state, props) =>
    transformerConsumer(state, props)(valueConsumer(state, props)),

  apAll: (transformerConsumer, ...argsConsumers) => (state, props) =>
    transformerConsumer(state, props)(
      ...argsConsumers.map(argConsumer => argConsumer(state, props))
    )
};

export default ApplyI;
