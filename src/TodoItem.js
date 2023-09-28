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
            value={editedTodo.Title}
            onChange={(e) => setEditedTodo({ ...editedTodo, Title: e.target.value})}
          />
          {isEditing && (
        <input
          type="checkbox"
          checked={editedTodo.Completed}
          onChange={() => setEditedTodo({ ...editedTodo, Completed: !editedTodo.Completed })}
        />
      )}
          <button onClick={handleUpdate}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          {todo.Completed ? <strike>{todo.Title}</strike> : todo.Title}
          <button onClick={handleEdit}>Edit</button>
        </>
      )}

      <button onClick={() => onDelete(todo.ID)}>Delete</button>
    </li>
  );
}

export default TodoItem;
