# Redux Consumer Toolkit

This library implements several functions that are useful for combining,
composing, and altering reducers and selectors (consumers). Each of this functions returns a memoized
consumer, similar to reselect, so data isn't re-computed unnecessarily. The
inspiration for this library was
[fantasyland-redux](https://github.com/philipnilsson/fantasyland-redux), only
instead of basing it off of the
[fantasyland](https://github.com/fantasyland/fantasy-land) specification it is
based off of the [static-land](https://github.com/rpominov/static-land)
specification. This made it simple to build this as a library instead of pinning
it to a specific redux version.

See the [Github Pages
site](https://rocketpuppy.github.io/redux-consumer-toolkit/index.html) for
usage examples and documentation on the library. It is a literate program from
which is constructed this library's source code.

## API

The library is organized internally into modules corresponding to the structures
defined by the static-land spec. However it exposes a more idiomatic Javascript
API than what is specified in static-land. This overview will go over the
idiomatic API.

The library assumes a traditional reducer signature of:

```javascript
// Flow type
type Reducer<action, input, output> = (input, action) => output;

// Traditional signature
function reducer(state, action) {
  return state;
}
```

and a traditional selector signature of:

```javascript
// Flow type
type Selector<props, input, output> = (input, props) => output;

// Traditional signature
function selector(state, props) {
  return state;
}
```

It unifies them into a single type called a consumer:

```javascript
// Flow type
type Consumer<Static, Input Output> = (input, static) => output;

// Traditional signature
function consumer(input, static) {
  const output = input;
  return output;
}
```

Flow types are exported.

Both memoized and non-memoized versions of these modules are exported. Memoized
versions can be accessed by importing from `'redux-consumer-toolkit/memoized'`
instead of `'redux-consumer-toolkit'`.

### Map

#### Use case

Modifying the returned state from a consumer.

* Pull only the properties that a specific component requires
* Derive computed properties from a reducer's state object

```javascript
import { map } from 'redux-consumer-toolkit';

function grandTotal(receipt) {
  return receipt.shipping + receipt.tax + receipt.subtotal;
}

map(grandTotal, receiptReducer);
```

#### API

```javascript
map : ((OutA => OutB), Consumer<Static, In, OutA>) => Consumer<Static, In, OutB>)
```

### Promap

#### Use case

Modifying both the input state and the output state of a consumer.

* Glue consumers lower in the hierarchy to reducers higher in the hierarchy
* Embed consumers in a context like an object key or reversible transformation

```javascript
import { promap } from 'redux-consumer-toolkit';
import Ramda from 'ramda';

function grandTotal(receipt) {
  return receipt.shipping + receipt.tax + receipt.subtotal;
}

// Returns { lineItems, receipt }
const orderReducer;

// Ramda.prop gets the named property off an object
promap(Ramda.prop('receipt'), grandTotal, orderReducer);
```

#### API

```
promap : ((InA => InB), (OutA => OutB), Consumer<Static, InB, OutA>) => Consumer<Static, InA, OutB>
```

### Objectify

#### Use case

Embed a consumer in an object.

`objectify` takes a key and a consumer and generates a consumer which can take
an object with that key and return an object with that key. You can reimplement
`combineReducers` this way.

```javascript
import { objectify, identity, expandAll } from 'redux-consumer-toolkit';

const combineReducers = (reducerSpec) => (
  reducerSpec.map((r, k) => objectify(k, r))
    .reduce(expandAll, identity)
)
```

#### API

```javascript
objectify : (string, Consumer<Static, In, Out>) => Consumer<Static, { string: In }, { string: Out }>
```

### MapIn

#### Use case

Like Promap, but only change the input of a consumer.


#### API

```
mapIn : ((InA => InB), Consumer<Static, InB, Out>) => Consume<Static, InA, Out>
```

### ApAll

#### Use case

Take transformation functions you would use with `map`, but have multiple
arguments, and apply them to multiple consumer. Each consumer gets the same
action/props and input state.

```
import { apAll } from 'redux-consumer-toolkit';

const grandTotal = (shipping, tax, subtotal) => {
  return shipping + tax + subtotal;
};

apAll(of(grandTotal), shippingReducer, taxReducer, subtotalReducer);
```

#### API

```javascript
apAll : (Consumer<Static, In, (mixed  => Out)>, ...Array<Consumer<Static, In, mixed>>) => Consumer<Static, In, Out>
```

### Constant

#### Use case

Provides a way to take non-consumer things like functions and values and use
them with `apAll`. It essentially creates a consumer that always returns the
same value. See the use case for `apAll` for an example.

#### API

```javascript
constant: (Out) => Consumer<Static, In, Out>
```

### Concat

#### Use case

Provides a way to take two consumers and run them with the same action/props,
one after the other. The output of the first consumer is used as input to the
second consumer.

```javascript
import { concat } from 'redux-consumer-toolkit';

// Returns line items state
const lineItemsReducer;
// Takes line items and returns a total
const subtotalReducer;

concat(lineItemsReducer, subtotalReducer);
```

#### API

```javascript
concat : (Consumer<Static, In, OutA>, Consumer<Static, OutA, OutB>) => Consumer<Static, In, OutB>
```

### Identity

#### Use case

Provides a special consumer that can be used as an identity when combining
reducers using `concat`. This is handy if you have a list of reducers you want
to reduce over and need an initial value.

#### API

```javascript
identity : Consumer<Static, In, In>
```

### Chain

#### Use case

Provides a way to combine consumers in such a way that the second consumer's
behavior can depend on the output of the first. Both consumers receive the same
input and static values. This is useful for consumers that depend on the values
of other consumers in addition to their own internal state. This is a powerful
but fairly low-level ability. Therefore some convenience functions are specified
here as well for common combinations.

```javascript
import { chain, mapIn } from 'redux-consumer-toolkit';
import Ramda from 'ramda';

// This consumer depends on the router state to know when to load more products
const productListReducer = (router) => (state, action) => { ... };

chain((routerState) => (
  mapIn(Ramda.prop('productList'), productListReducer(router))
), mapIn(Ramda.prop('router'), routerReducer));
```

#### API

```javascript
chain : (Consumer<Static, In, OutA>, OutA => Consumer<Static, In, OutB>) => Consumer<Static, In, OutB>
```

### ExpandAll

#### Use case
`expandAll` handles the use case where you might want consumers operating on the
same state to each return separate keys of a resulting object.

```javascript
import { expandAll } from 'redux-consumer-toolkit';

// Manages user account information
const userReducer;
// Manages cart information, the cart may be anonymous or registered to a user.
const cartReducer;

// We might want to have all the cart and user information available in the same
// object
expandAll(userReducer, cartReducer);
```

#### API

```javascript
expandAll : (...Consumer<Static, In, *>) => Consumer<Static, In, Out>
```

### Combine

#### Use case

`combine` works just like the traditional `combineReducers` function, but it can
also operate on selectors. It also lacks the beginner-friendly runtime checks
that `combineReducers` provides. It accepts an object whose values are
consumers, and returns a consumer that will generate an object with the same
keys whose values are the state returned from the individual consumers.

#### API

```javascript
combine : (Object<string, Consumer<Static, In, *>>) => Consumer<Static, In, Out>
```

## Contributing

Requires webpack, babel, and eslint to build. You can use a Nix shell to enter a
development environment with those tools already in it or just use your own.
