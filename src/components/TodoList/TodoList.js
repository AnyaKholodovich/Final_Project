import React from 'react';
import './ToDoList.scss'

function TodoList ({item, onChange, onClick}) {
    return (
      <div className='li-task'>
        <li>
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
              Deleted
            </button>
          )}
        </li>
      </div>
      
    );
};

export default TodoList;
