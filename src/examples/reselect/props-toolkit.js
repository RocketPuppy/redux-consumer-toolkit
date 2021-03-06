// @flow
import * as $ from "../../index";

const getVisibilityFilter = (state, props) =>
  state.todoLists[props.listId].visibilityFilter;

const getTodos = (state, props) => state.todoLists[props.listId].todos;

const getVisibleTodos = $.apAll(
  $.constant((visibilityFilter, todos) => {
    /* ... */
  }),
  getVisibilityFilter,
  getTodos
);
