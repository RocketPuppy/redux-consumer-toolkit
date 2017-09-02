// @flow
import { connect } from "react-redux";

import * as $ from "../../index";

const getVisibilityFilter = (state, props) =>
  state.todoLists[props.listId].visibilityFilter;

const getTodos = (state, props) => state.todoLists[props.listId].todos;

const getVisibleTodos = $.apAll(
  $.of((visibilityFilter, todos) => {
    /* ... */
  }),
  getVisibilityFilter,
  getTodos
);

connect($.combine({ todos: getVisibleTodos }));
