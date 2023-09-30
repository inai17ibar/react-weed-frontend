import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';
import '@testing-library/jest-dom';

// テストが始まる前にmockTodosをセットアップ

let mockTodos = [
    { ID: 1, Title: 'Mock Todo 1', Completed: false },
];

// eslint-disable-next-line no-const-assign
const server = setupServer(
  rest.get('http://127.0.0.1:8081/todos', (req, res, ctx) => {
    console.log('GET /todos request received'); // ここでリクエストを受け取ったことを確認
    return res(ctx.json(mockTodos)); // モックのTodosをレスポンスとして返す
}),

rest.put('http://127.0.0.1:8081/todos/update', (req, res, ctx) => {
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
  
  const todoElement = await screen.findByText('Mock Todo 1', {}, { timeout: 2000 });//レンダリングが遅いのでこれが必須
  expect(todoElement).toBeInTheDocument();
});

test('can delete an existing todo', async () => {
  console.log(mockTodos);
  render(<App />);

  await screen.findByText('Mock Todo 1', {}, { timeout: 2000 }); //レンダリングが遅いのでこれが必須
  expect(screen.getByTestId('edit-button-1')).toBeInTheDocument(); // この行で対象のボタンが存在するか確認します
  fireEvent.click(screen.getByTestId('edit-button-1')); // IDに基づく編集ボタンをクリック
  
  fireEvent.change(screen.getByTestId('update-textbox-1'), { target: { value: 'Update Todo' } });
  fireEvent.change(screen.getByTestId('update-checkbox-1'), { target: { checked: !mockTodos.Completed } });
  fireEvent.click(screen.getByTestId('update-button-1')); // IDに基づく更新ボタンをクリック

  await waitFor(() => {
    expect(screen.queryByText('Update Todo')).not.toBeInTheDocument();
  });
});