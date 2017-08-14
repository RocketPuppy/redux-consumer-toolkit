import { createSelector } from 'reselect';

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

