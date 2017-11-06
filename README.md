# Redux Consumer Toolkit

## Decouple your business logic!

Redux consumer toolkit allows you to write your business logic and then embed it
in a reducer or selector. The underlying business logic need not know anything about
the reducer or selector it's embedded in. For example, here's one way to
encapsulate how to get the currently signed in user.

```javascript
const reducerState  = {
  authInfo: {
    currentUserId: 1,
    lastSignedInAt: '2017-09-17'
  },
  userData: {
    1: { /* user id 1 data */ },
    4: { /* user id 2 data */ },
    10: { /* user id 10 data */ }
  }
};

// Encapsulated from the knowledge of selectors!
const getUser = (userId, userData) => {
  return userData[userId];
};

// Generic selector
const currentUserIdSelector = (state) => {
  return state.authInfo.currentUserId;
};

// Generic selector
const userDataSelector = (state) => {
  return state.userData;
};

// Just take the business logic and give it its data dependencies!
const currentUserSelector =
  apAll(getUser, currentUserIdSelector, userDataSelector);
```

The benefits of this decoupling come into play when you consider reusability.
Now I need to get a user id from component props. I can simply reuse the
`getCurrentUser` function with a different selector!

```javascript
const userIdSelector = (state, props) => {
  return props.userId;
};

const userFromPropsSelector =
  apAll(getUser, userIdSelector, userDataSelector);
```

## Encapsulate reducer responsibilities!

Write reducers that have well isolated responsibilities and then combine them
together seamlessly. Even isolate reducers that depend on the value of other
reducers! Disentangle your monolithic reducers and make them easier to test and
maintain. For example, here's how I might encapsulate entangled responsibilities
of a reducer that handles form data.

```javascript
const initialState = {
  name: {
    dirty: false,
    value: null
  },
  email: {
    dirty: false,
    value: null
  }
};

const originalReducer = (state, action) {
  switch(action.type) {
  case FIELD_CHANGED:
    const newField = {
      value: action.value,
      dirty: true
    };
    return {
      ...state,
      [action.fieldName]: newField
    };
  case FIELD_CLEARED:
    const newField = {
      value: null,
      dirty: false
    };
    return {
      ...state,
      [action.fieldName]: newField
    };
  }
}
```

The reducer is conflating three logical responsibilities by handling field
values, dirty status, and state setting at the same time. Those can easily be
encapsulated and recombined with a few functions from the toolkit.

```javascript
const dirtyHandler = (state, action) => {
  switch(action.type) {
  case FIELD_CHANGED:
    return true;
  case FIELD_CLEARED:
    return false;
  }
}

const valueHandler = (state, action) => {
  switch(action.type) {
  case FIELD_CHANGED:
    return action.value;
  case FIELD_CLEARED:
    return null;
}

const newFieldReducer = combine({
  dirty: dirtyHandler,
  value: valueHandler
});

const formReducer = chain(
  newFieldReducer,
  (newField) => (state, action) => {
    return {
      ...state,
      [action.fieldName]: newField
    };
  }
);
```

## Focus on one thing at a time!

All of this decoupling and encapsulation makes it so you can focus on one thing
at a time. Write your business logic without needing to focus on the details of
reducers. Combine your selectors without needing to focus on the underlying
business logic. Even write a reducer without needing to focus on tangential
responsibilities because you've isolated them from each other.

Make your reducers, and selectors, more testable and easier to reason about and
maintain with Redux Consumer Toolkit!

## Inspiration

The inspiration for this library was
[fantasyland-redux](https://github.com/philipnilsson/fantasyland-redux), only
instead of basing it off of the
[fantasyland](https://github.com/fantasyland/fantasy-land) specification it is
based off of the [static-land](https://github.com/rpominov/static-land)
specification. This made it simple to build this as a library instead of pinning
it to a specific redux version.

See the [Github Pages
site](https://rocketpuppy.github.io/redux-consumer-toolkit/index.html) for more
usage examples and documentation on the library. It is a literate program from
which this library's source code is constructed.

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

### MapInOut

#### Use case

Modifying both the input state and the output state of a consumer.

* Glue consumers lower in the hierarchy to reducers higher in the hierarchy
* Embed consumers in a context like an object key or reversible transformation

```javascript
import { mapInOut } from 'redux-consumer-toolkit';
import Ramda from 'ramda';

function grandTotal(receipt) {
  return receipt.shipping + receipt.tax + receipt.subtotal;
}

// Returns { lineItems, receipt }
const orderReducer;

// Ramda.prop gets the named property off an object
mapInOut(Ramda.prop('receipt'), grandTotal, orderReducer);
```

#### API

```
mapInOut : ((InA => InB), (OutA => OutB), Consumer<Static, InB, OutA>) => Consumer<Static, InA, OutB>
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

Like mapInOut, but only change the input of a consumer.


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

### ConcatAll

#### Use case

Provides a way to take two (or more) consumers and run them with the same
action/props, one after the other. The output of the first consumer is used as
input to the second consumer.

```javascript
import { concatAll } from 'redux-consumer-toolkit';

// Returns line items state
const lineItemsReducer;
// Takes line items and returns a total
const subtotalReducer;

concatAll(lineItemsReducer, subtotalReducer);
```

#### API

```javascript
concatAll : (Consumer<Static, In, OutA>, Consumer<Static, OutA, OutB>) => Consumer<Static, In, OutB>
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

## Utilities

There are some utility functions to help debug consumers.

### LogConsumer

Log the output of the consumer before returning it.

```javascript
logConsumer('message', consumer)
```

### DebugConsumer

Enters a breakpoint before returning the output of the consumer for easy
examination.

```javascript
debugConsumer(consumer)
```

## Contributing

Requires webpack, babel, and eslint to build. You can use a Nix shell to enter a
development environment with those tools already in it or just use your own.
