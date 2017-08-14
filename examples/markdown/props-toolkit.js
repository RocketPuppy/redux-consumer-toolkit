import * as $ from 'redux-reducer-toolkit';

const getVisibilityFilter = (state, props) => state.todoLists[props.listId].visibilityFilter;

const getTodos = (state, props) => state.todoLists[props.listId].todos;

const getVisibleTodos = $.apAll(
  $.of((visibilityFilter, todos) => ( ... )),
  getVisibilityFilter),
  getTodos
);

