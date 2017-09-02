// @flow
import type { Applicative } from "./types/Applicative";

const of = x => (_state, _props) => x;

const ApplicativeI: Applicative<*, *, *> = {
  of: of,
  constant: of
};

export default ApplicativeI;
