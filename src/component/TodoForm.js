// TodoForm.js
import React from 'react';

function TodoForm({ newTodo, onSubmit, onTodoChange, onCompletedChange, errorMessage}) {
  return (
    <form data-testid="add-form" onSubmit={onSubmit}>
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
      <button data-testid="add-button" type="submit">Add</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* エラーメッセージを表示 */}
    </form>
  );
}

export default TodoForm;
