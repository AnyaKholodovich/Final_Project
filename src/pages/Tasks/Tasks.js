import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'

import './Tasks.scss';

import { tasksApi } from '../../api/tasks';
import { addTasksList } from '../../redux/actions/toDoAppActions';
import TaskUser from '../../components/taskUser/TaskUser';
import Search from '../../components/search/Search';
import AddTaskForm from '../../components/addTaskForm/addTaskForm';


const Tasks = () => {

  const { user_Id } = useParams();
  const dispatch = useDispatch();
//   const [tasks, setTasks] = useState([])
  let [items, setItems] = useState([]);
  const [textForm, setTextForm] = useState({
	text: ''
})
const appState = useSelector(state => state.authReducer);
const { token, role, tasksList } = appState;
//   const { token, role } = useSelector(state => state.authReducer);

  useEffect(() => {
    if (role === 'admin'){
      getTasksForAdmin()
    } else {
      getTasks()
    }
	}, [])

	useEffect(() => {
		fetch('https://jsonplaceholder.typicode.com/todos')
		  .then((response) => response.json())
		  .then((json) =>  setItems(json.slice(0, 10)))
	  }, []);

	const getTasks = () => {

		tasksApi.getTasks(token)
			.then(res => {
				dispatch(addTasksList(res.data))
			})
			.catch(error => {
				console.error(error.message)
			})
	}

	// const getTasks = () => {

	// 	tasksApi.getTasks(token)
	// 	.then(res => {
			
	// 		const tasksList = res.data
	// 		setTasks(tasksList)
	// 		console.log('tasks', tasks)

	// 	})
	// 	.catch(error => {
	// 		console.error(error.message)
	// 	})
	// }

	const getTasksForAdmin = () => {

		tasksApi.getTasksForAdmin(token, user_Id)
			.then(res => {
				dispatch(addTasksList(res.data))
			})
			.catch(error => {
				console.error(error.message)
			})
	}

	const handleChange = (e) => {
		const textFormCopy = { ...textForm }
		textFormCopy[e.target.name] = e.target.value
		setTextForm(textFormCopy)
	}

	const handleTaskSubmit = e => {
		e.preventDefault();
		if (role === 'admin') {
			createTaskByAdmin()
		}
	}

	const createTaskByAdmin = () => {

		const taskListCopy = [...tasksList]
		const user_Id_Copy = user_Id;
		const textFormCopy = { ...textForm }
		const copyText = textForm.text;


		tasksApi.createTaskForUser(copyText, user_Id_Copy, token)
			.then((response) => {

				if (response.statusText === 'Created') {

					dispatch(addTasksList(taskListCopy.concat(response.data)))
					textFormCopy.text = ''
					setTextForm(textFormCopy)
				}
			})
			.catch(error => {
				console.log(error)
			})
	}

	const handleCheckbox = (id) => {
		const taskListCopy = [...tasksList]
		const delId = taskListCopy.findIndex((n) => n._id === id);
		taskListCopy[delId].checked = !taskListCopy[delId].checked;
		setItems(taskListCopy);
	}

	const handleRemove = (id) => {
		let taskListCopy = [...tasksList]
		const delId = taskListCopy.findIndex((n) => n._id === id);
		taskListCopy.splice(delId, 1);
		dispatch(addTasksList(taskListCopy))
	}

	// const handleRemove = (id) => {
	// 	let newItems = items.slice();
	// 	const delId = newItems.findIndex((n) => n.id === id);
	// 	newItems.splice(delId, 1);
	// 	setItems(newItems);
	//   }
  
  const renderTasks = (arr) => {
			let result;
			result = arr.map((item, index) => {
				const { _id, name, checked } = item;
				return (
				< TaskUser
					key={index}
					id={_id}
					taskName={name}
					value = {textForm}
					taskNumber={arr.indexOf(item) + 1}
					onChange={() => handleCheckbox(_id)}
					onClick={() => handleRemove(_id)}
					item={item}
					checked={checked}
				/>
			)});
			return result;
	}

    return (
		<>
		<section className='tasks'>
			<div className='container'>
				<div className='toDoBlock card first'>
				   <div className='textTitle'>
		 				<h2>Tasks</h2>
 	   				</div>

					<div className = 'search'>
						<Search
							placeholder = 'Search task'
						/>
					</div>
				</div>

				<div className='toDoBlock'>
					{role === 'admin' && < AddTaskForm
						value={textForm.text}
						onChange={handleChange}
						onSubmit={handleTaskSubmit}
						nameInput='text'
						nameForm='text'
						placeholder = 'Enter a new task'
					/>}
					
					<div className = 'list'>
							{tasksList && tasksList.length > 0 && renderTasks(tasksList)}
					</div>
				</div>
			</div>
		</section>
	</>
	);
}


export default Tasks;