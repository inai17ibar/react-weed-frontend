// DateSelector.js
import React from 'react';

function DateSelector({ selectedDate, onDateChange, onFetchTodos, todosByDate }) {
  return (
    <div>
      <label>Select Date: </label>
      <input
        type="date"
        value={selectedDate}
        onChange={onDateChange}
      />
      <button onClick={onFetchTodos}>Fetch Todos</button>
      {selectedDate === "" || selectedDate == null ? (
        <p>日付が未指定です</p>
      ) : (
        <p>今日のTODOの件数 : {todosByDate === null ? 0 : todosByDate.length}</p>
      )}
    </div>
  );
}

export default DateSelector;
