import { createSelector } from 'reselect';

import { connect } from 'react-redux';

import { createSelector } from 'reselect';

const getVisibilityFilter = (state, props) =>
  state.todoLists[props.listId].visibilityFilter

const getTodos = (state, props) =>
  state.todoLists[props.listId].todos

const getVisibleTodos = createSelector(
  [ getVisibilityFilter, getTodos ],
  (visibilityFilter, todos) => { ... }
);

const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state)
  }
}

connect(mapStateToProps)

