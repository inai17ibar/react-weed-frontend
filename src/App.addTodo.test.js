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
    console.log(mockTodos);
    return res(ctx.json(mockTodos)); // モックのTodosをレスポンスとして返す
  }),
  // Todoの追加
  rest.post('http://127.0.0.1:8081/addTodo', (req, res, ctx) => {
    const newTodo = { ID: mockTodos.length + 1, Title: 'New Todo', Completed: false };
    mockTodos.push(newTodo); // 新しいTodoをモックのTodosに追加
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
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Todo' } });
  
  // 「Add」ボタンをクリックします。
  //fireEvent.click(screen.getByTestId('add-button'));
  fireEvent.submit(screen.getByTestId('add-form'));
  
  // 新しく追加された「Added Mocked Todo」が表示されるのを待ちます。
  //const newTodoElement = await screen.findByText('New Todo');
  //expect(newTodoElement).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText('New Todo')).toBeInTheDocument();
  });
});