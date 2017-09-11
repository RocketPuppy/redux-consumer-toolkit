# Change Log

* Use custom memoize instead of Ramda's memoize. Ramda's is too slow, and the
  custom version should suffice for most use cases.
* Tweak types of Chain methods to use flow's inference

v 2.3.0

* Use latest release of ramda instead of master
* Change expandAll to start with a constant empty object consumer, instead of
  identity

v 2.2.0

Breaking
* Add and favor concatAll over concat in method API

v 2.1.2

* Add debugConsumer
* Add logConsumer

v 2.1.1

* Fix apAll function

v 2.1.0

Breaking
* Alias promap as mapInOut and expose it instead of promap in API

v 2.0.3

* Remove ramda dependency

v 2.0.2

* Fix memoization

v 2.0.0

* Flipped the arguments of Chain.chain to promote more readable code.
* Alias Monoid.empty to Monoid.identity. Identity doesn't require a function call.
* Renamed package to redux-consumer-toolkit
* Alias Applicative.of to Applicative.constant
* Update exports to use more idiomatic format
* Rewrite source in literate programming format
* Break out memoized versions of all functions into their own module so users
  can opt-in to memoization.
* Add `apAll` convenience function to apply all arguments to the first argument.

v1.2.0
