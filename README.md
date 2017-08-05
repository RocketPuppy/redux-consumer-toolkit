# Redux Reducer Toolkit

This library implements several functions that are useful for combining,
composing, and altering reducers. Each of this functions returns a memoized
reducer, similar to reselect, so data isn't re-computed unnecessarily. The
inspiration for this library was
[fantasyland-redux](https://github.com/philipnilsson/fantasyland-redux), only
instead of basing it off of the
[fantasyland](https://github.com/fantasyland/fantasy-land) specification it is
based off of the [static-land](https://github.com/rpominov/static-land)
specification. This made it simple to build this as a library instead of pinning
it to a specific redux version.

## API

The library is organized into modules corresponding to the structures defined by
the static-land spec, however you can also import all the methods at once
without importing individual structures. It assumes a traditional reducer
signature of:

```javascript
// Flow type
type Reducer<action, input, output> = (input, action) => output;

// Traditional signature
function reducer(state, action) {
  return state;
}
```

This library considers a reducer function to be parameterized on its action,
input state, and output state types. In general the action type never varies
across arguments or return values. Depending on the module, either the output
state or both the input and output state types will vary across arguments and
return values. These will be noted in each module.

### Functor

### Use case

This module provides a method for modifying the returned state from a reducer.

* Pull only the properties that a specific component requires
* Derive computed properties from a reducer's state object

```javascript
function grandTotal(receipt) {
  return receipt.shipping + receipt.tax + receipt.subtotal;
}

Functor.map(grandTotal, receiptReducer);
```

#### Parameterized Types

* Output state

#### API

```javascript
map : ((out_a => out_b), Reducer<action, input, out_a>) => Reducer<action, input, out_b>)
```

### Profunctor

#### Use case

This module provides methods for modifying both the input state and the output
state of a reducer. Note that `mapOut` is identical to `Functor.map`

* Glue reducers lower in the hierarchy to reducers higher in the hierarchy

```javascript
function grandTotal(receipt) {
  return receipt.shipping + receipt.tax + receipt.subtotal;
}

// Returns { lineItems, receipt }
const orderReducer;

// Ramda.prop gets the named property off an object
Promap.promap(Ramda.prop('receipt'), grandTotal, orderReducer);
```

#### Parameterized Types

* Input state
* Output state

#### API

```javascript
promap : ((in_a => in_b), (out_a => out_b), Reducer<action, in_b, out_a>) => Reducer<action, in_a, out_b>
mapIn : ((in_a => in_b), Reducer<action, in_b, out>) => Reducer<action, in_a, out>
mapOut : ((out_a => out_b), Reducer<action, input, out_a>) => Reducer<action, input, out_b>)
```

### Apply

#### Use case

This module provides a way to take transformation functions you would use with
`Functor.map`, but have multiple arguments, and apply them to multiple reducers.
These transformation functions must be curried in order to work properly.

```
const grandTotal = curry((shipping, tax, subtotal) => {
  return shipping + tax + subtotal;
});

Apply.ap(Apply.ap(Apply.ap(Applicative.of(grandTotal), shippingReducer), taxReducer), subtotalReducer);
```

#### Parameterized Types

* Output State

#### API

```javascript
ap : (Reducer<action, ins, (outs => outs_)>, Reducer<action, ins, outs>) => Reducer<action, ins, outs_>
```

### Applicative

#### Use case

This module applies a way to take non-reducer things like functions and values
and use them with `Apply.ap`. It essentially creates a reducer that always
returns the same value. See the Use case for `Apply` for an example.

#### Parameterized Types

* None

#### API

```javascript
of: (outs) => Reducer<action, ins, outs>
```

### Semigroup

#### Use case

This module provides a way to take two reducers and run them with the same
action, one after the other. The output of the first reducer is used as input to
the second reducer.

```javascript
// Returns line items state
const lineItemsReducer;
// Takes line items and returns a total
const subtotalReducer;

Semigroup.concat(lineItemsReducer, subtotalReducer);
```

#### Parameterized Types

* Input state
* Output state

#### API

```javascript
concat : (Reducer<action, in_a, out_a>, Reducer<action, out_a, out_b>) => Reducer<action, in_a, out_b>
```

### Monoid

#### Use case

This module provides a special reducer that can be used as an identity when
combining reducers using `Semigroup.concat`. This is handy if you have a list of
reducers you want to reduce over and need an initial value.

#### Parameterized Types

* None

#### API

```javascript
empty : () => Reducer<action, state, state>
```

### Chain

#### Use case

This module provides a way to combine reducers in such a way that the second
reducer can depend on the first. This is useful for reducers that depend on the
values of other reducers in addition to their own internal state. This is a
powerful but fairly low-level ability. Therefore some convenience functions are
specified here as well for common combinations.

```javascript
// This reducer depends on the router state to know when to load more products
const productListReducer = (router) => (state, action) => { ... };

Chain.chain((routerState) => (
  Promap.mapIn(Ramda.prop('productList'), productListReducer(router))
), Promap.mapIn(Ramda.prop('router'), routerReducer));
```

Expand handles the use case where you might want two reducers operating on the
same state to each return separate keys of a resulting object.

```javascript
// Manages user account information
const userReducer;
// Manages cart information, the cart may be anonymous or registered to a user.
const cartReducer;

// We might want to have all the cart and user information available in the same
// object
Chain.expand(userReducer, cartReducer);
```

#### Parameterized Types

* Input state
* Output state

#### API

```javascript
chain : (outs => Reducer<action, ins, outs_>, Reducer<action, ins, outs>) => Reducer<action, ins, outs_>
expand : (Reducer<action, ins, outs>, Reducer<action, ins, outs_>) => Reducer<action, ins, outs & outs_>
```

## Contributing

Requires webpack, babel, and eslint to build. You can use a Nix shell to enter a
development environment with those tools already in it or just use your own.
