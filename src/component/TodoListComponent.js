import React from 'react';
import TodoItem from './TodoItem'; // 必要に応じてパスを調整してください。
import TodoForm from './TodoForm'; // 必要に応じてパスを調整してください。
import DateSelector from './DateSelector'; // 必要に応じてパスを調整してください。
import {TailSpin} from 'react-loader-spinner'; 

function TodoListComponent({
  todos,
  isLoading,
  error,
  showCompleted,
  setShowCompleted,
  newTodo,
  handleSubmit,
  handleTodoChange,
  handleCompletedChange,
  handleEdit,
  handleUpdate,
  handleDelete,
  handleToggleComplete,
  selectedDate,
  handleDateChange,
  fetchTodosByDate,
  todosByDate
}) {
  return (
    <div className="todo-list-container">
      {isLoading ? (
        <div className="loader-container">
          <TailSpin type="TailSpin" color="#00BFFF" height={80} width={80} />
        </div>
      ) : error ? (
        <p>Error loading todos!</p>
      ) : (
        <ul>
          {todos.length > 0 ? (
            todos.filter((todo) => showCompleted || !todo.Completed).map((todo) => (
              <TodoItem
                key={todo.ID}
                todo={todo}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))
          ) : (
            <li>No todos to display</li>
          )}
        </ul>
      )}
      <label>
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={() => setShowCompleted(!showCompleted)}
        />
        Show Completed Todos
      </label>
      <TodoForm newTodo={newTodo} onSubmit={handleSubmit} onTodoChange={handleTodoChange} onCompletedChange={handleCompletedChange} />
      <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} onFetchTodos={fetchTodosByDate} todosByDate={todosByDate} />
    </div>
  );
}

export default TodoListComponent;
