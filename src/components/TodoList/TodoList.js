import React from 'react';
import './ToDoList.css'

function TodoList ({item, onChange, onClick}) {
    return (
      <li className='li-task'>
        <label>
          <input
            type='checkbox'
            checked={item.completed}
            onChange={() => onChange()}
            className = 'custom-checkbox'
          />
          {item.title}
        </label>
        {item.cheked && (
          <button className='btn-deleted' onClick={() => onClick()}>
            Удалить
          </button>
        )}
      </li>
    );
}

export default TodoList;
