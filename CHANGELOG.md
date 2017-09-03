# Change Log

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
