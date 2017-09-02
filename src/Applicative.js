// @flow
import type { Applicative } from "./types/Applicative";

const ApplicativeI: Applicative<*, *, *> = {
  of: x => (_state, _props) => x
};

export default ApplicativeI;
