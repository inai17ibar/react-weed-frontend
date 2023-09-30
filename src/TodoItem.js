import React, { useState } from 'react';

function TodoItem({ todo, onEdit, onUpdate, onDelete, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState(null);
  //const [editedCompetedBefore, setEditedCompetedBefore] = useState(false);

  const handleEdit = () => {
    setEditedTodo({ ...todo });
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setEditedTodo({ ...todo });
    setIsEditing(false);
  };  

  const handleUpdate = () => {
    onUpdate(editedTodo);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <>
          <input
            type="text"
            data-testid={`update-textbox-${todo.ID}`}
            value={editedTodo.Title}
            onChange={(e) => setEditedTodo({ ...editedTodo, Title: e.target.value})}
          />
          {isEditing && (
        <input
          type="checkbox"
          data-testid={`update-checkbox-${todo.ID}`}
          checked={editedTodo.Completed}
          onChange={() => setEditedTodo({ ...editedTodo, Completed: !editedTodo.Completed })}
        />
      )}
          <button data-testid={`update-button-${todo.ID}`} onClick={handleUpdate}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          {todo.Completed ? <strike>{todo.Title}</strike> : todo.Title}
          <button data-testid={`edit-button-${todo.ID}`} onClick={handleEdit}>Edit</button>
        </>
      )}
      <button data-testid={`delete-button-${todo.ID}`} onClick={() => onDelete(todo.ID)}>Delete</button>
    </li>
  );
}

export default TodoItem;
