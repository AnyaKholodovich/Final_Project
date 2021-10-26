import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import './Tasks.scss';

import { tasksApi } from '../../api/tasksApi';
import SearchTaskForm from '../../components/SearchTaskForm/SearchTaskForm';
import TaskUser from '../../components/taskUser/TaskUser';
import AddTaskForm from '../../components/addTaskForm/AddTaskForm';
import CorrectForm from '../../components/correctForm/CorrectForm';
import { addTasksList } from '../../redux/actions/toDoAppActions';
import TimeOverWindow from '../../components/timeOverWindow/TimeOverWindow';

const Tasks = () => {

	const { user_Id } = useParams();
	const dispatch = useDispatch();

	const appState = useSelector(state => state.toDoAppReducer);
	const { token, role, tasksList } = appState;
	const [textForm, setTextForm] = useState({
		text: '',
		correctText: ''
	})

	let [items, setItems] = useState([]);
	let [correctId, setCorrectId] = useState('');
	const [isCorrect, setIsCorrect] = useState(false);
	const [timeOver, setTimeOver] = useState(false);
	const [errorMessage, setErrorMessage] = useState({
		text: '',
		correctText: ''
	});

	useEffect(() => {
		setTimeOver(false)

		if (role === 'admin') {
			getTasksForAdmin()
		} else {
			getTasks()
		}
	}, [])

	const getTasksForAdmin = () => {

		tasksApi.getTasksForAdmin(token, user_Id)
			.then(res => {
				dispatch(addTasksList(res.data))
			})
			.catch(error => {
				if (error.response.status === 401) {
					setTimeOver(true)
				}
				console.error(error.message)
			})
	}

	const getTasks = () => {

		tasksApi.getTasks(token)
			.then(res => {
				dispatch(addTasksList(res.data))
			})
			.catch(error => {
				if (error.response.status === 401) {
					setTimeOver(true)
				}
				console.error(error.message)
			})
	}

	const handleChange = (e) => {
		const textFormCopy = { ...textForm }
		textFormCopy[e.target.name] = e.target.value
		setTextForm(textFormCopy)
		setErrorMessage({})
	}

	const handleTaskSubmit = e => {
		e.preventDefault();
		const errorMessageCopy = { ...errorMessage }
		if (textForm[e.target.name].trim().length < 5) {
			console.log('errorMessage', errorMessageCopy)
			errorMessageCopy[e.target.name] = 'The task must contain at least 5 characters'
			setErrorMessage(errorMessageCopy)			
			return;
		}

		if (e.target.name === 'text') {
			createTaskByAdmin()
		} else {
			correctTask()
		}

		if (e.target.name === 'text') {
			createTaskByAdmin()
		} else {
			correctTask()
		}
	}

	const createTaskByAdmin = () => {

		const taskListCopy = [...tasksList];
		const user_Id_Copy = user_Id;
		const textFormCopy = { ...textForm };
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
				if (error.response.status === 401) {
					setTimeOver(true)
				}
				console.log(error)
			})
	}

	const handleCheckbox = (id) => {
		const taskListCopy = [...tasksList]
		const delId = taskListCopy.findIndex((n) => n._id === id);
		taskListCopy[delId].checked = !taskListCopy[delId].checked;
		setItems(taskListCopy);
		patchTasksOfUsers(id, taskListCopy, taskListCopy[delId].userId, 'checked', taskListCopy[delId].checked)

		if (isCorrect === true) {
			setIsCorrect(!isCorrect);
		}

		console.log('handleCheckbox---', isCorrect)
	}

	const patchTasksOfUsers = (taskID, taskListCopy, userId, typeBody = '', IDchecked = '', taskName = '') => {
		let body = {}
		const accsesstoken = token;
		if (typeBody === 'checked') {
			body = {
				id: taskID,
				userId: userId,
				checked: IDchecked
			}
		} else {
			body = {
				id: taskID,
				userId: userId,
				name: taskName
			}
		}

		tasksApi.patchTasks(accsesstoken, body)
			.then((response) => {
				if (response.data === 'OK') {
					dispatch(addTasksList(taskListCopy))
				}
			})
			.catch(error => {
				if (error.response.status === 401) {
					setTimeOver(true)
				}
				console.log(error)
			})
	}

	const removeTask = (id) => {
		let taskListCopy = [...tasksList];
		const accsesstoken = token;
		let Id_Copy = user_Id;
		const delId = taskListCopy.findIndex((n) => n._id === id);
		taskListCopy.splice(delId, 1);

		tasksApi.deleteTask(id, Id_Copy, accsesstoken)
			.then((response) => {
				if (response.status === 204) {
					dispatch(addTasksList(taskListCopy))
				}
			})
			.catch(error => {
				console.log(error)
			})
	}


	const showCorrectForm = (id) => {
		const taskListCopy = [...tasksList];
		const textFormCopy = { ...textForm };
		setTextForm(textFormCopy);
		let correctItem = taskListCopy.find((item) => item._id === id);
		setCorrectId(id);
		textFormCopy.correctText = correctItem.name;

		if (isCorrect === false) {
			setIsCorrect(!isCorrect);
		}
	}

	const correctTask = () => {
		console.log('correctTask---',);
		const taskListCopy = [...tasksList];
		const textFormCopy = { ...textForm };
		let correctItem = taskListCopy.find((item) => item._id === correctId);
		correctItem.name = textFormCopy.correctText;

		patchTasksOfUsers(correctId, taskListCopy, correctItem.userId, 'name', '', textFormCopy.correctText)

		if (isCorrect === true) {
			setIsCorrect(!isCorrect);
		}
		console.log('correctTask---', isCorrect)
	}


	const renderTasks = (arr) => {
		let result;

		result = arr.map((item, index) => {
			const { _id, name, checked } = item;

			return (
				<>
					{role === 'admin' && < TaskUser
						key={index}
						id={_id}
						taskName={name}
						taskNumber={arr.indexOf(item) + 1}
						onChange={() => handleCheckbox(_id)}
						onClick={() => removeTask(_id) }
						item={item}
						checked={checked}
						role={role}
					/>
					}

					{role === 'user' && < TaskUser
						key={index}
						id={_id}
						taskName={name}
						taskNumber={arr.indexOf(item) + 1}
						onChange={() => handleCheckbox(_id)}
						onClick={() => showCorrectForm(_id) }
						item={item}
						checked={checked}
						role={role}
						
					/>
					}
					
				</>
			)
		});
		return result;
	}

	return (
			<section className='tasks'>
				<div className='container'>
					<div className='toDoBlock card first'>
						<div className='textTitle'>
							<h2>Tasks</h2>
						</div>

						<div className = 'search'>
							<SearchTaskForm 
							placeholder='Search task'
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
							errorMessage={errorMessage.text}
						/>}

						{isCorrect &&
							<CorrectForm
								onChange={handleChange}
								onSubmit={handleTaskSubmit}
								value={textForm.correctText}
								formName='correctText'
								nameInput='correctText'
								nameButton='correctButton'
							/>}

						<div className='tasks-wrapper'>
							<ul className='tasks-list'>
								{tasksList && tasksList.length > 0 && renderTasks(tasksList)}
							</ul>
						</div>
					</div>

					{timeOver && <TimeOverWindow
						text='Your time is over'
						onClick={() => setTimeOver(false)}
						link='SignInRoute'
					/>}
				</div>
			</section>
	)
}



export default Tasks;
