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
      The Date Todo Count : {todosByDate === null ? 0 : todosByDate.length}
    </div>
  );
}

export default DateSelector;
