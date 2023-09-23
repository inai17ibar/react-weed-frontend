import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    Title: '',
    Completed: false,
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
    await axios.get(`http://127.0.0.1:8081/todosByDate?Created_date=${selectedDate}`)
      .then((response) => {
        setTodosByDate(response.data);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  };


  const handleSubmit = async () => {
    await axios.post('http://127.0.0.1:8081/addTodo', 
    { Title: newTodo.Title, Completed: newTodo.Completed },
    { headers: { "Content-type": "text/plain" } })
    .then(response => {
      setNewTodo({
        Title: "",
        Completed: false
      });
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    await fetchAndUpdateTodoList(); //errorが出てもレンダリングが走る問題
  };

  const handleEdit = (todoId, Title, Completed) => {
    setEditingTodo({
      ID: todoId,
      Title: Title,
      Completed: Completed,
    });
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8081/todos/update?ID=${editingTodo.ID}`, editingTodo, {
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
      todo.ID === todoId ? { ...todo, Completed: !todo.Completed } : todo
    );
  
    // ToDoリストを更新
    setTodos(updatedTodos);

    // editTodo の Completed も変更 onChangeで2つ関数を設定できないのでこうする
    if (editingTodo && editingTodo.ID === todoId) {
      setEditingTodo({ ...editingTodo, Completed: !editingTodo.Completed });
    }
  };

  function handleDelete(todoId) {
    axios.delete(`http://127.0.0.1:8081/todos/delete?ID=${todoId}`,
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
            <li key={todo.ID}>
              {editingTodo?.ID === todo.ID ? (
                // 編集モード
                <div>
                  <input
                    type="text"
                    value={editingTodo.Title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, Title: e.target.value })}
                  />
                  <input
                    type="checkbox"
                    checked={todo.Completed}
                    onChange={() => handleToggleComplete(todo.ID)}/>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                // 通常表示モード
                <div>
                  {todo.Completed === false ? 
                  ( todo.Title ):( <strike>{todo.Title}</strike> )}
                  <button onClick={() => handleEdit(todo.ID, todo.Title, todo.Completed)}>Edit</button>
                  <button onClick={() => handleDelete(todo.ID)}>Delete</button>
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
          value={newTodo.Title}
          onChange={e => setNewTodo({ ...newTodo, Title: e.target.value })}
        />
        <input
          type="checkbox"
          checked={newTodo.Completed}
          onChange={e => setNewTodo({ ...newTodo, Completed: e.target.checked })}
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