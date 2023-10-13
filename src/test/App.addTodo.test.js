import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../app/App';
import '@testing-library/jest-dom';

// サーバーをセットアップして、エンドポイントをモックします。
let mockTodos = [
  { ID: 1, Title: 'Mock', Completed: false }
]; // モックのTodosを保持する配列
let mockCommits = [
  { ID: 1, Sha: "aaaaa", Message: "Message1", Date: "2023-10-01", Additions: 0, Deletions: 0, Total: 1 },
  { ID: 2, Sha: "bbbbb", Message: "Message2", Date: "2023-10-02", Additions: 1, Deletions: 1, Total: 2 },
  { ID: 3, Sha: "ccccc", Message: "Message3", Date: "2023-10-03", Additions: 2, Deletions: 2, Total: 4 },
  { ID: 4, Sha: "ddddd", Message: "Message4", Date: "2023-10-04", Additions: 3, Deletions: 3, Total: 6 },
  { ID: 5, Sha: "eeeee", Message: "Message5", Date: "2023-10-05", Additions: 4, Deletions: 4, Total: 8 },
];

let mockCommitData = [
  {
      Date:      "2023-10-01",
      Count:     5,
      Additions: 10,
      Deletions: 2,
      Total:     12,
  },
  {
      Date:      "2023-10-02",
      Count:     3,
      Additions: 8,
      Deletions: 1,
      Total:     9,
  },
  {
      Date:      "2023-10-03",
      Count:     2,
      Additions: 4,
      Deletions: 0,
      Total:     4,
  },
]

const mockContributionData = [
  {
      Date: '2023-10-05',
      ContributionCount: 5
  },
  {
      Date: '2023-10-06',
      ContributionCount: 3
  },
]

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';  // デフォルト値としてlocalhostのURLを指定

const server = setupServer(
  rest.get(`${API_BASE_URL}/todos`, (req, res, ctx) => {
    console.log('GET /todos request received');
    return res(ctx.json(mockTodos));
  }),
  rest.get(`${API_BASE_URL}/commits`, (req, res, ctx) => {
      console.log('GET /commits request received'); // ここでリクエストを受け取ったことを確認
      return res(ctx.json(mockCommits)); // モックのTodosをレスポンスとして返す
    }),
  rest.get(`${API_BASE_URL}/commitDataByDate`, (req, res, ctx) => {
      console.log('GET /commitDataByDate request received'); // ここでリクエストを受け取ったことを確認
      return res(ctx.json(mockCommitData)); // モックのTodosをレスポンスとして返す
    }),
  rest.get(`${API_BASE_URL}/contributionDays`, (req, res, ctx) => {
      console.log('GET /contributionDays request received'); // ここでリクエストを受け取ったことを確認
      return res(ctx.json(mockContributionData)); // モックのTodosをレスポンスとして返す
    }),
  // Todoの追加
  rest.post(`${API_BASE_URL}/addTodo`, (req, res, ctx) => {
    const newTodo = { ID: mockTodos.length + 1, Title: 'New Todo', Completed: false };
    mockTodos.push(newTodo); // 新しいTodoをモックのTodosに追加
    
    console.log("Added Todo:", newTodo);  // このログを追加
    console.log("Request body:", req.body); 
    console.log("Response:", newTodo);
    return res(ctx.json(newTodo));
  }),
);

// テストが終了したら、モックのTodosをリセット
afterEach(() => {
  mockTodos = [];
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Add a new todo', async () => {
  render(<App />);

  // 新しいToDoのタイトルを入力します。
  const inputElement = screen.getByRole('textbox');
  fireEvent.change(inputElement, { target: { value: 'New Todo' } });

  // 「Add」ボタンをクリックします
  fireEvent.click(screen.getByText('Add'));
  // const newTodoElement = await screen.findByText('New Todo');
  // expect(newTodoElement).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText('New Todo')).toBeInTheDocument();
  }, { timeout: 2000 });
});