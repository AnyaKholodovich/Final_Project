import React, { useState, useEffect } from 'react';
import TodoApp from '../../components/toDoApp/toDoApp';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'

import { tasksApi } from '../../api/tasks';
import TaskUser from '../../components/taskUser/TaskUser';

const Tasks = () => {
  const { id } = useParams()
  const [tasks, setTasks] = useState([])
  const { token, role } = useSelector(state => state.authReducer);

  useEffect(() => {
    if (role === 'admin'){
      getTasksForAdmin()
    } else {
      getTasks()
    }
	}, [])

  const getTasksForAdmin = () => {
		tasksApi.getTasksForAdmin(token, id)
		.then(res => {
			const tasksList = res.data
			setTasks(tasksList)
			console.log('tasks', tasks)

		})
		.catch(error => {
			console.error(error.message)
		})
	}

	const getTasks = () => {

		tasksApi.getTasks(token)
		.then(res => {
			
			const tasksList = res.data
			setTasks(tasksList)
			console.log('tasks', tasks)

		})
		.catch(error => {
			console.error(error.message)
		})
	}

  
  const renderTasks = (arr) => {
			let result;
			result = arr.map((item, index) => {
				const { _id, name, checked } = item;
				return (
				< TaskUser
					key={index}
					id={_id}
					taskName={name}
					taskNumber={arr.indexOf(item) + 1}
					checked={checked}
				/>
			)});
			return result;
	}

    return (
      <div className='App'>
         <TodoApp />
        </div>
      );
}


export default Tasks;