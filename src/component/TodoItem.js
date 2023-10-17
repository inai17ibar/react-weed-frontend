import React, { useState } from 'react';

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState(todo);
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

  const onToggleFavorite = () => {
    // editedTodoのお気に入りの状態を反転させる
    const updatedTodo = { ...editedTodo, Favorite: !editedTodo.Favorite };
    setEditedTodo(updatedTodo);

    // この部分では、お気に入りの状態をデータベースやバックエンドに保存するためのロジックを追加できます。
    // 例：backendAPI.updateFavoriteStatus(editedTodo.ID, updatedTodo.favorite);
    // このAPI呼び出しは、お気に入りの状態を永続的に保存するためのものです。
    //GPTのアドバイスのようにわけたほうがよい？

    // 最後に、onUpdate関数を呼び出して、親コンポーネントに更新を通知する
    onUpdate(updatedTodo);
  };

  return (
    <li>
      {/* お気に入りの星マーク */}
      <span
        data-testid={`favorite-icon-${todo.ID}`}
        style={{ cursor: 'pointer', color: todo.Favorite ? 'gold' : 'gray' }}
        onClick={() => onToggleFavorite()}
      >
         ★
      </span>
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
      <span>Added on: {todo.Created_date}</span>
    </li>
  );
}

export default TodoItem;
