import * as $ from 'redux-reducer-toolkit';

const todoList = (state, props) => state.todoLists[props.listId];
const getVisibilityFilter = $.map(list => list.visibilityFilter, todoList);
const getTodos = $.map(list => list.todos, todoLists);

const getVisibleTodos = $.apAll(
  $.of((visibilityFilter, todos) => ( ... )),
  getVisibilityFilter),
  getTodos
);

