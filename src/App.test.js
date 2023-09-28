import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';
import '@testing-library/jest-dom';

// サーバーをセットアップして、エンドポイントをモックします。
let mockTodos = []; // モックのTodosを保持する配列

const server = setupServer(
  rest.get('http://127.0.0.1:8081/todos', (req, res, ctx) => {
    return res(ctx.json(mockTodos)); // モックのTodosをレスポンスとして返す
  }),
  rest.post('http://127.0.0.1:8081/addTodo', (req, res, ctx) => {
    const newTodo = { ID: mockTodos.length + 1, Title: 'Added Mocked Todo', Completed: false };
    mockTodos.push(newTodo); // 新しいTodoをモックのTodosに追加
    return res(ctx.json(newTodo));
  }),
);

// テストが終了したら、モックのTodosをリセット
afterEach(() => {
  mockTodos = [];
});

// const server = setupServer(
//   rest.get('http://127.0.0.1:8081/todos', (req, res, ctx) => {
//     console.log('GET /todos Request', req) // リクエストのログ
//     const response = res(ctx.json([]));
//     console.log('GET /todos Response', response) // レスポンスのログ
//     return response;
//   }),
//   rest.post('http://127.0.0.1:8081/addTodo', (req, res, ctx) => {
//     console.log('POST /addTodo Request', req) // リクエストのログ
//     const response = res(ctx.json({ Title: 'Added Mocked Todo', Completed: false }));
//     console.log('POST /addTodo Response', response) // レスポンスのログ
//     return response;
//   }),
// );

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('can add a new todo', async () => {
  render(<App />);

  // 新しいToDoのタイトルを入力します。
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Todo' } });
  
  // 「Add」ボタンをクリックします。
  fireEvent.click(screen.getByTestId('add-button'));
  
  // 新しく追加された「Added Mocked Todo」が表示されるのを待ちます。
  await waitFor(() => {
    expect(screen.getByText('Added Mocked Todo')).toBeInTheDocument();
  });
});