import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    completed: false,
  }); //

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

  const handleSubmit = async () => {
    //e.preventDefault();
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
    //await fetchAndUpdateTodoList();
  };

  return (
    <div>
      <h1>ToDo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title} : {todo.completed ? 'Done' : 'Not done'} 
            <button type="submit" onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
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
    </div>
  );
}