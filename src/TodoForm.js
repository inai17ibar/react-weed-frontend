// TodoForm.js
import React from 'react';

function TodoForm({ newTodo, onSubmit, onTodoChange, onCompletedChange }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={newTodo.Title}
        onChange={onTodoChange}
      />
      <input
        type="checkbox"
        checked={newTodo.Completed}
        onChange={onCompletedChange}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TodoForm;
