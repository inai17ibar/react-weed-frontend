// TodoItem.js
import React from 'react';

function TodoItem({ todo, onEdit, onDelete, onToggleComplete }) {
  return (
    <li>
      {todo.Completed ? <strike>{todo.Title}</strike> : todo.Title}
      <button onClick={() => onEdit(todo)}>Edit</button>
      <button onClick={() => onDelete(todo.ID)}>Delete</button>
      <input
        type="checkbox"
        checked={todo.Completed}
        onChange={() => onToggleComplete(todo.ID)}
      />
    </li>
  );
}

export default TodoItem;
