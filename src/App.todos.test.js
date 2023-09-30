import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';
import '@testing-library/jest-dom';

// サーバーをセットアップして、エンドポイントをモックします。
let mockTodos = [
    { ID: 1, Title: 'Todo 1', Completed: false },
    { ID: 2, Title: 'Todo 2', Completed: true },
];

const server = setupServer(
  rest.get('http://127.0.0.1:8081/todos', (req, res, ctx) => {
    console.log(mockTodos);
    return res(ctx.json(mockTodos)); // モックのTodosをレスポンスとして返す
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

  await waitFor(() => {
    expect(screen.getByText('Todo 1', {}, { timeout: 2000 })).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByText('Todo 2', {}, { timeout: 1000 })).toBeInTheDocument();
  });
});