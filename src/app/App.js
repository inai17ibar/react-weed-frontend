import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axiosをインポート
import { fetchTodos, fetchCommits, fetchCommitDataByDate, fetchContributions } from './api'; // api関数をインポート
import TodoListComponent from '../component/TodoListComponent';
import ErrorPage from '../component/ErrorPage';
import './App.css'
import CommitsView from '../component/CommitsView';

function useTodos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    Title: '',
    Completed: false,
  });
  // ... その他のTodo関連の状態とロジック

  return {
    todos,
    newTodo,
    setTodos,
    setNewTodo,
  };
}

function useError() {
  const [error, setError] = useState(null); // エラーハンドリング
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージのステートを追加

  return {
    error,
    setError,
    errorMessage,
    setErrorMessage,
  };
}

export default function App() {
  const {
    todos,
    newTodo,
    setTodos,
    setNewTodo,
  } = useTodos();

  const {
    error,
    setError,
    errorMessage,
    setErrorMessage,
  } = useError();

  const [selectedDate, setSelectedDate] = useState('');
  const [todosByDate, setTodosByDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  
  const [showCompleted, setShowCompleted] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');
  const [commits, setCommits] = useState([]);
  const [commitData, setCommitData] = useState([]);
  const [contributionDays, setContributionDays] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
        try {
            const [todosData, commitsData, commitsDataByDate, contributionsData] = await Promise.all([
                fetchTodos(),
                fetchCommits(),
                fetchCommitDataByDate(),
                fetchContributions()
            ]);

            if (isMounted) {
                setTodos(todosData.data);
                setCommits(commitsData.data);
                setCommitData(commitsDataByDate.data);
                setContributionDays(contributionsData.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage("Failed to fetch data.");
        } finally {
            if (isMounted) {
                setIsLoading(false);
            }
        }
    };

    fetchAllData();

    return () => {
        isMounted = false; // cleanup function to handle unmounting
    }
});

  // リクエスト送信とデータの取得を行う関数
  const fetchAndUpdateTodoList = async () => {
    await axios.get('/todos') 
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
    await axios.get(`/todosByDate?Created_date=${selectedDate}`)
      .then((response) => {
        setTodosByDate(response.data);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.Title.trim()) {
      setErrorMessage("Text cannot be empty!");
      return;
    }
    setErrorMessage("");
    
    await axios.post('/addTodo', 
        { Title: newTodo.Title, Completed: newTodo.Completed },
        { headers: { "Content-type": "text/plain" } }
    )
    .then(response => {
      setTodos(prevTodos => {
        const updatedTodos = [...prevTodos, response.data];
        console.log("Updated todos:", updatedTodos);  // こちらでログ出力
        return updatedTodos; //returnが必要
      });
      setNewTodo({
        Title: "",
        Completed: false
      });
    })
    .catch(error => {
      console.error("Error adding todo:", error);
      setErrorMessage("Failed to add todo.");  
    })
    await fetchAndUpdateTodoList();//これがないとテストのときにレンダリングされない、GPTに聞いても謎
  };

  const handleUpdate = async (editedTodo) => {
    try {
      console.log(`Sending PUT request to: /todos/update?ID=${editedTodo.ID} with data:`, editedTodo);
      await axios.put(`/todos/update?ID=${editedTodo.ID}`, editedTodo, {
        headers: { 'Content-type': "application/json" },
      });
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

  function handleDelete(todoId) {
    axios.delete(`/todos/delete?ID=${todoId}`,
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
        <button data-testid="todos-button" onClick={() => setActiveTab('todos')}>Todos</button>
        <button data-testid="commits-button" onClick={() => setActiveTab('commits')}>Commits</button>
      </div>
      {activeTab === 'todos' ? (
        // TodoList の UI をここにレンダリング
        <TodoListComponent 
          todos={todos}
          isLoading={isLoading}
          error={error}
          errorMessage={errorMessage}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
          newTodo={newTodo}
          handleSubmit={handleSubmit}
          handleTodoChange={handleTodoChange}
          handleCompletedChange={handleCompletedChange}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          fetchTodosByDate={fetchTodosByDate}
          todosByDate={todosByDate}
        />
      ) : (
        <CommitsView
          commits={commits}
          commitData={commitData}
          contributionDays={contributionDays}></CommitsView>
      )}
      </div>
      </div>);
    }
}