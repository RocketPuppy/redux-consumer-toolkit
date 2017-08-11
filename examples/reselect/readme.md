# Reselect README Examples

These are examples taken from the reselect README ported to use the
functions defined here. The intention is to show how the same use cases can
be fulfilled with more generic machinery.

## Example 1

The first example comes from the introductory example. It creates several
selectors to compute various parts of an order total, then composes them
together to create the final selector. Note the reselect specific composition
method.

    const shopItemsSelector = state => state.shop.items
    const taxPercentSelector = state => state.shop.taxPercent
    
    const subtotalSelector = createSelector(
      shopItemsSelector,
      items => items.reduce((acc, item) => acc + item.value, 0)
    )
    
    const taxSelector = createSelector(
      subtotalSelector,
      taxPercentSelector,
      (subtotal, taxPercent) => subtotal * (taxPercent / 100)
    )
    
    export const totalSelector = createSelector(
      subtotalSelector,
      taxSelector,
      (subtotal, tax) => ({ total: subtotal + tax })
    )

The above example used a reselect specific method to compose simple selectors
into more complicated selectors. Next I'll show how you can do the same thing
with the tools exposed by this library. Remember that these are the same tools
you will use to compose reducers together.

    const shopItemsSelector = state => state.shop.items;
    const taxPercentSelector = state => state.shop.taxPercent;
    
    const subtotalSelector = $.map(
        items => items.reduce((acc, item) => acc + item.value, 0),
        shopItemsSelector
    );
    
    const calculateTax = (subtotal, taxPercent) => subtotal * (taxPercent / 100)
    const taxSelector = $.apAll(
        $.of(calculateTax),
        subtotalSelector,
        taxPercentSelector
    );
    
    const totalSelector = $.apAll(
        $.of((subtotal, tax) => ({ total: subtotal + tax })),
        subtotalSelector,
        taxSelector
    );

Note that it is simple to transform selectors by `map`ping over them. While
`map` works for functions of one argument, `apAll` will take functions of
multiple arguments. These are the main two methods you can use to take functions
that were never intended to work with selectors and "lift" them to work in the
selector context.

## Connecting to a Redux Store

Reselect advises to call selectors inside the `mapStateToProps` function. You
could also use the selector as the `mapStateToProps` function if it returned an
object.

    const mapStateToProps = (state) => {
      return {
        todos: getVisibleTodos(state)
      }
    }
    
    connect(mapStateToProps)

With redux-reducer-toolkit there's a helper to combine selectors into a given
object shape, so you can connect them to the redux store concisely and directly.

    connect($.combine({ subtotal: subtotalSelector, total: totalSelector }));

## Accessing Props

One of the important features of reselect is that you can still access props in
your selectors. This lets you do things like pass the id of an entity into your
component and pull the full data for it from the store. Redux-reducer-toolkit
will let you do this as well! Here's how to do it in reselect. I've elided the
full definition of `getVisibleTodos` as it doesn't change between the reselect
and redux-reducer-toolkit examples.

    const getVisibilityFilter = (state, props) =>
      state.todoLists[props.listId].visibilityFilter
    
    const getTodos = (state, props) =>
      state.todoLists[props.listId].todos
    
    const getVisibleTodos = createSelector(
      [ getVisibilityFilter, getTodos ],
      (visibilityFilter, todos) => { ... }
    );

Note that in the above example every selector receives the same props values.
This is exactly how it works with redux-reducer-toolkit as well.

    const getVisibilityFilter = (state, props) => state.todoLists[props.listId].visibilityFilter;
    
    const getTodos = (state, props) => state.todoLists[props.listId].todos;
    
    const getVisibleTodos = $.apAll(
      $.of((visibilityFilter, todos) => ( ... )),
      getVisibilityFilter),
      getTodos
    );

As an alternate formulation of the example, you can extract a `todoList`
selector that is reused.

    const todoList = (state, props) => state.todoLists[props.listId];
    const getVisibilityFilter = $.map(list => list.visibilityFilter, todoList);
    const getTodos = $.map(list => list.todos, todoLists);
    
    const getVisibleTodos = $.apAll(
      $.of((visibilityFilter, todos) => ( ... )),
      getVisibilityFilter),
      getTodos
    );

This is pretty clean. It's a little more verbose with reselect.

    const todoList = (state, props) => state.todoLists[props.listId];
    
    const getVisibilityFilter = createSelector(
      todoList,
      list => list.visibilityFilter
    );
    
    const getTodos = createSelector(
      todoList,
      list => list.todos
    );
    
    const getVisibleTodos = createSelector(
      [ getVisibilityFilter, getTodos ],
      (visibilityFilter, todos) => { ... }
    );
