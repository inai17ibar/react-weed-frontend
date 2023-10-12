import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axiosをインポート
import { fetchTodos, fetchCommits, fetchCommitDataByDate, fetchContributions } from './api'; // api関数をインポート
import TodoListComponent from '../component/TodoListComponent';
import CommitListComponent from '../component/CommitListComponent';
import ErrorPage from '../component/ErrorPage';
import CommitsGraph from '../component/CommitsGraph';
import './App.css'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ContributionsGraph from '../component/ContributionsGraph';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    Title: '',
    Completed: false,
  }); 
  const [selectedDate, setSelectedDate] = useState('');
  const [todosByDate, setTodosByDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(null); // エラーハンドリング
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージのステートを追加

  const [showCompleted, setShowCompleted] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');
  const [commits, setCommits] = useState([]);
  const [commitData, setCommitData] = useState([]);
  const [contributionDays, setContributionDays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const todosData = await fetchTodos();
            setTodos(todosData.data);
            const commitsData = await fetchCommits();
            setCommits(commitsData.data);
            const commitsDataByDate = await fetchCommitDataByDate();
            setCommitData(commitsDataByDate.data);
            const contributionsData = await fetchContributions();
            setContributionDays(contributionsData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error);
            //課題1つのAPIが死ぬと全体がエラーになる
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
}, []);

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
    e.preventDefault(); // フォームのデフォルトの動作を停止

    // バリデーションチェック
    if (!newTodo.Title.trim()) {
      setErrorMessage("Text cannot be empty!");
      return;
    }

    // エラーメッセージをクリア
    setErrorMessage("");

    await axios.post('/addTodo', 
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
        // MyCommit データのリストをここにレンダリング
        <div>
        <CommitListComponent commits={commits}/>
        <BarChart width={500} height={200} data={commitData}>
          <XAxis dataKey="Date" />
          <YAxis domain={[0, 1000]}/>
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar dataKey="Total" fill="#ff7300" />
        </BarChart>
        <div className="weed-contribution-container">
          <h1>Contributions Graph</h1>
          {contributionDays && contributionDays.length > 0 ? (
          <ContributionsGraph data={contributionDays} />
          ): (<p>No contributions to display</p>)}
        </div>
        <div className="weed-commits-container">
          <h1>Commits Graph</h1>
          {commitData && commitData.length > 0 ? (
          <CommitsGraph data={commitData} />
          ):( <p>No commits to display</p> )}
        </div>
        </div>
      )}
      </div>
      </div>);
    }
}