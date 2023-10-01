import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoListComponent from './TodoListComponent';
import CommitListComponent from './CommitListComponent';
import ErrorPage from './ErrorPage';
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
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(null); // エラーハンドリング
  const [showCompleted, setShowCompleted] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8081/todos')
    .then(response => {
      console.log(response.data); // ここで応答データをログに出力
      setTodos(response.data);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
      setError(error); // エラーをセット
    })
    .finally(() => {
      setIsLoading(false); // ロードが完了したら、ローディング状態をfalseに設定
    });

    axios.get('http://127.0.0.1:8081/commits')
    .then(response => {
      console.log(response.data); // ここで応答データをログに出力
      setCommits(response.data);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
      setError(error); // エラーをセット
    })
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

  const handleUpdate = async (editedTodo) => {
    try {
      //if(!editedTodo) return;
      console.log(`Sending PUT request to: http://127.0.0.1:8081/todos/update?ID=${editedTodo.ID} with data:`, editedTodo);
      await axios.put(`http://127.0.0.1:8081/todos/update?ID=${editedTodo.ID}`, editedTodo, {
        headers: { 'Content-type': "application/json" },
      });
      
      setEditingTodo(null);
      await fetchAndUpdateTodoList();
    } catch (error) {
      console.error('Axios encountered an error:', error); // エラーオブジェクト全体を出力
      if (error.response) {
          // サーバからのレスポンスがある場合
          console.error('Response data:', error.response.data); // サーバからのレスポンスボディ
          console.error('Response status:', error.response.status); // HTTPステータスコード
      } else if (error.request) {
          // リクエストは作成されたが、レスポンスがない場合
          console.error('No response received:', error.request);
      } else {
          // リクエストの作成時に何かが問題になった場合
          console.error('Error message:', error.message);
      }
  }
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

  const handleRetry = () => {
    setError(false); // エラーステートをリセット
    // 何らかのアクション、例えば再度 API を呼び出す等
  };

  if(error) {
    return (
      <ErrorPage onRetry={handleRetry} />
    );
  }else{

  return (
    <div>
      {activeTab === 'todos' ? (<h1>ToDo List</h1>) : (<h1>Commits List</h1>)}
     <div>
      <div className="tab-container">
        <button onClick={() => setActiveTab('todos')}>Todos</button>
        <button onClick={() => setActiveTab('commits')}>Commits</button>
      </div>
      {activeTab === 'todos' ? (
        // TodoList の UI をここにレンダリング
        <TodoListComponent 
          todos={todos}
          isLoading={isLoading}
          error={error}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
          newTodo={newTodo}
          handleSubmit={handleSubmit}
          handleTodoChange={handleTodoChange}
          handleCompletedChange={handleCompletedChange}
          handleEdit={handleEdit}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          handleToggleComplete={handleToggleComplete}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          fetchTodosByDate={fetchTodosByDate}
          todosByDate={todosByDate}
        />
      ) : (
        // MyCommit データのリストをここにレンダリング
        <CommitListComponent commits={commits}/>
      )}
      </div>
    </div>
  );
  }
}