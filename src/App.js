import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import DateSelector from './DateSelector';
import './App.css';

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

  const handleTodoChange = (e) => {
    setNewTodo({
      ...newTodo,
      Title: e.target.value
    });
  };

  const handleCompletedChange = (e) => {
    setNewTodo({
      ...newTodo,
      Completed: e.target.checked
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
          {todos.length > 0 ? (
            todos.map((todo) => <TodoItem key={todo.ID} todo={todo} onEdit={handleEdit} onDelete={handleDelete} onToggleComplete={handleToggleComplete} />)
          ) : (
            <li>No todos to display</li>
          )}
        </ul>
      </div>
      <TodoForm newTodo={newTodo} onSubmit={handleSubmit} onTodoChange={handleTodoChange} onCompletedChange={handleCompletedChange} />
      <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} onFetchTodos={fetchTodosByDate} todosByDate={todosByDate} />
    </div>
  );
}