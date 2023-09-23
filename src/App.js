import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    completed: false,
  }); 
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [todosByDate, setTodosByDate] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8081/todos')
    .then(response => {
      setTodos(response.data);
    });
  }, []);

  // リクエスト送信とデータの取得を行う関数
  const fetchAndUpdateTodoList = async () => {
    await axios.get('http://127.0.0.1:8081/todos') 
    .then(response => {
      setTodos(response.data);
    });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const fetchTodosByDate = async () => {
    await axios.get(`http://127.0.0.1:8081/todosByDate?created_date=${selectedDate}`)
      .then((response) => {
        setTodosByDate(response.data);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  };


  const handleSubmit = async () => {
    await axios.post('http://127.0.0.1:8081/addTodo', 
    { title: newTodo.title, completed: newTodo.completed },
    { headers: { "Content-type": "text/plain" } })
    .then(response => {
      setNewTodo({
        title: "",
        completed: false
      });
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    await fetchAndUpdateTodoList(); //errorが出てもレンダリングが走る問題
  };

  const handleEdit = (todoId, title, completed) => {
    setEditingTodo({
      id: todoId,
      title: title,
      completed: completed,
    });
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8081/todos/update?id=${editingTodo.id}`, editingTodo, {
        headers: { 'Content-type': 'application/json' },
      });
      await fetchAndUpdateTodoList();
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating TODO:', error);
    }
  };

  const handleToggleComplete = (todoId) => {
    // チェックボックスの状態をトグル（反転）させる
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
  
    // ToDoリストを更新
    setTodos(updatedTodos);

    // editTodo の completed も変更 onChangeで2つ関数を設定できないのでこうする
    if (editingTodo && editingTodo.id === todoId) {
      setEditingTodo({ ...editingTodo, completed: !editingTodo.completed });
    }
  };

  function handleDelete(todoId) {
    axios.delete(`http://127.0.0.1:8081/todos/delete?id=${todoId}`,
    { headers: { "Content-type": "text/plain" } }) // delete/1とかもあるがどっちがいいか
    .then(async (response) => {
      // リクエストが成功した場合の処理をここに追加
      console.log(response);
      // TODOリストを更新
      await fetchAndUpdateTodoList();
    })
    .catch(error => {
      console.error('There was a problem with the Axios request:', error);
    });
  };

  return (
    <div>
      <h1>ToDo List</h1>
      <div className="todo-list-container">
      <ul>
        {todos !== null && todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id}>
              {editingTodo?.id === todo.id ? (
                // 編集モード
                <div>
                  <input
                    type="text"
                    value={editingTodo.title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  />
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}/>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                // 通常表示モード
                <div>
                  {todo.completed === false ? 
                  ( todo.title ):( <strike>{todo.title}</strike> )}
                  <button onClick={() => handleEdit(todo.id, todo.title, todo.completed)}>Edit</button>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <li>No todos to display</li>
        )}
      </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo.title}
          onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          type="checkbox"
          checked={newTodo.completed}
          onChange={e => setNewTodo({ ...newTodo, completed: e.target.checked })}
        />
        <button type="submit">Add</button>
      </form>

      <div>
        <label>Select Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
        <button onClick={fetchTodosByDate}>Fetch Todos</button>
        The Date Todo Count : {todosByDate === null ? 0 : todosByDate.length}
      </div>
    </div>
  );
}