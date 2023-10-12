import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../app/App';
import '@testing-library/jest-dom';

// テストが始まる前にmockTodosをセットアップ

let mockTodos = [
    { ID: 1, Title: 'Mock Todo 1', Completed: false },
];
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

// eslint-disable-next-line no-const-assign
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
  rest.put(`${API_BASE_URL}/update`, (req, res, ctx) => {
    const updateTodo = { Title: 'Update Todo', Completed: false };
    mockTodos.Title = updateTodo.Title;
    mockTodos.Completed = updateTodo.Completed;
    return res(ctx.json(mockTodos));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


test('renders initial list of todos correctly', async () => {
  render(<App />);
  
  const todoElement = await screen.findByText('Mock Todo 1', {}, { timeout: 5000 });//レンダリングが遅いのでこれが必須
  expect(todoElement).toBeInTheDocument();
});

test('can delete an existing todo', async () => {
  console.log(mockTodos);
  render(<App />);

  await screen.findByText('Mock Todo 1', {}, { timeout: 5000 }); //レンダリングが遅いのでこれが必須
  expect(screen.getByTestId('edit-button-1')).toBeInTheDocument(); // この行で対象のボタンが存在するか確認します
  fireEvent.click(screen.getByTestId('edit-button-1')); // IDに基づく編集ボタンをクリック
  
  fireEvent.change(screen.getByTestId('update-textbox-1'), { target: { value: 'Update Todo' } });
  fireEvent.change(screen.getByTestId('update-checkbox-1'), { target: { checked: !mockTodos.Completed } });
  fireEvent.click(screen.getByTestId('update-button-1')); // IDに基づく更新ボタンをクリック

  await waitFor(() => {
    expect(screen.queryByText('Update Todo')).not.toBeInTheDocument();
  });
});