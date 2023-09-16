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

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8081/todos', { title: newTodo.title, completed: newTodo.completed })
    .then(response => {
      //setTodos([...todos, response.data]);
      setNewTodo({
        title: "",
        completed: false
      });
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });;
  };

  return (
    <div>
      <h1>ToDo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.title}>
            {todo.title} : {todo.done ? 'Done' : 'Not done'}
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