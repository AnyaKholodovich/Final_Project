import React, { useState, useEffect } from 'react';
import TodoList from '../TodoList/TodoList';
import './toDoApp.scss'

function TodoApp() {
    const [items, setItems] = useState([]);
    const [text, setText] = useState('');
    const [search, setSearch] = useState('');
    const [warningText, setWarningText] = useState('');

    useEffect(() => {
      fetch('https://jsonplaceholder.typicode.com/todos')
        .then((response) => response.json())
        .then((json) =>  setItems(json.slice(0, 10)))
    }, []);

  const handleСheckbox = (id) => {
    let newItems = items.slice();
    const delId = newItems.findIndex((n) => n.id === id);
    newItems[delId].cheked = !newItems[delId].cheked;
    setItems(newItems);
  }

  const handleRemove = (id) => {
    let newItems = items.slice();
    const delId = newItems.findIndex((n) => n.id === id);
    newItems.splice(delId, 1);
    setItems(newItems);
  }

  const changeTask = (filterList) => {
    return (
      <ul>
        {filterList.map((item) => (
          <TodoList
            key={item.id}
            item={item}
            onClick={() => handleRemove(item.id)}
            onChange={() => handleСheckbox(item.id)}
          />
        ))}
      </ul>
    );
  }

 const handleChange = (event) => {
    setText(event.target.value);
  }

  const findDuplicate = () => {
    let result = false;
    let copyItems = [...items];
    let copyText = text.replace(/\s/g, '');
    copyItems.forEach((item) => {
      item.title = item.title.replace(/\s/g, '');
      if (item.title === copyText) {
        result = true;
        return false;
      }
    });
    return result;
  }

  const warningLineTength = () => {
		return setWarningText('Введите более 4-х символов')
	}

	const warningError = () => {
		return setWarningText('Ошибка!')
	}
  const handleSubmit = (event) => {
    event.preventDefault();
    if (text.length === 0 || findDuplicate()) {
      warningError();
      return;
    } else if ((text.length < 4)  || (text.length === 0)) {
			warningLineTength()
			return
		} else {
      const newItem = {
        title: text,
        id: Date.now(),
        cheked: false
      };
      setItems(items.concat(newItem));
      setText('');
    }
    
  }

  const sortTop = () => {
		let copyItemsSort = items.slice();
		console.log(items);
		setText('');
		setItems(copyItemsSort.sort((a, b) => a.title.length - b.title.length));
	}

  const filterList = items.filter(item => {
    return item.title.toLowerCase().includes(search.toLowerCase());
  });

    return (
      <section className='tasks'>
         <div className="container">
          <div className='toDoBlock card first'> 

            <div className='textTitle'>
              <h2>Tasks</h2>
            </div>

            <div>
            <form className = 'search-form'>
                <div><input
                    type = 'text'
                    placeholder = 'Search task'
                    className = 'search-input'
                    onChange = {(event) => setSearch(event.target.value)}
                /></div>

                <div><button className='add-btn'>SEARCH</button></div>
              </form>
          </div>

            <button
              onClick={() => sortTop()} className='btn'>
              SORT
            </button>
          </div> 

          <div className='toDoBlock'>
            <div className='tasks-list'>
            
              <form onSubmit={handleSubmit}>
                  <input
                    id='new-todo'
                    onChange={handleChange}
                    value={text}
                    className='add-input'
                    placeholder = 'Enter a new task'
                  />

                <button className='add-btn'>
                  Add task №{items.length + 1}
                </button>
              </form>
            </div>

            <div className='warningText'>
            {warningText}
            </div>

            {changeTask(filterList)}

          </div>
      </div>
      </section>
    );
}

export default TodoApp;
