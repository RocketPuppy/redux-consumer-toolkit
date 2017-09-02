// @flow
import * as $ from "../../index";

const todoList = (state, props) => state.todoLists[props.listId];
const getVisibilityFilter = $.map(list => list.visibilityFilter, todoList);
const getTodos = $.map(list => list.todos, todoList);

const getVisibleTodos = $.apAll(
  $.constant((visibilityFilter, todos) => {
    /* ... */
  }),
  getVisibilityFilter,
  getTodos
);
