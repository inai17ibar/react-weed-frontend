import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';
import '@testing-library/jest-dom';

// サーバーをセットアップして、エンドポイントをモックします。
let mockTodos = [
    { ID: 1, Title: 'Todo 1', Completed: false },
    { ID: 2, Title: 'Todo 2', Completed: true },
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

const server = setupServer(
  rest.get('http://127.0.0.1:8081/todos', (req, res, ctx) => {
    console.log(mockTodos);
    return res(ctx.json(mockTodos)); // モックのTodosをレスポンスとして返す
  }),
  rest.get('http://127.0.0.1:8081/commits', (req, res, ctx) => {
      console.log('GET /commits request received'); // ここでリクエストを受け取ったことを確認
      return res(ctx.json(mockCommits)); // モックのTodosをレスポンスとして返す
    }),
  rest.get('http://127.0.0.1:8081/commitDataByDate', (req, res, ctx) => {
    console.log('GET /commitDataByDate request received'); // ここでリクエストを受け取ったことを確認
    return res(ctx.json(mockCommitData)); // モックのTodosをレスポンスとして返す
  }),
);

// テストが終了したら、モックのTodosをリセット
afterEach(() => {
  mockTodos = [];
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Get todos', async () => {
  render(<App />);

  await screen.findByText('Todos', {}, { timeout: 1000 }); //レンダリングが遅いのでこれが必須
  expect(screen.getByTestId('commits-button')).toBeInTheDocument(); // この行で対象のボタンが存在するか確認します
  fireEvent.click(screen.getByTestId('commits-button')); // IDに基づく編集ボタンをクリック

  await waitFor(() => {
    expect(screen.getByText('Message1', {}, { timeout: 5000 })).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByText('Message2', {}, { timeout: 5000 })).toBeInTheDocument();
  });
});