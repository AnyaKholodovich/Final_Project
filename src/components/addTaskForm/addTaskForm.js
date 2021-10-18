import React from 'react';

import './addTaskForm.scss';

const AddTaskForm = ({ 
    onSubmit, 
    onChange, 
    value, 
    nameInput, 
	placeholder,
    nameForm 
}) => {

	return (
		<div className='tasks-list'>
				<form 
					onSubmit = { onSubmit }
					name = { nameForm }>
						<div>
							<input
								value = {value}
								id = 'new-todo'
								type="text"
								onChange = {onChange}
								name = {nameInput}
								className='add-input'
								placeholder = {placeholder}
							/>

							<button 
								className='add-btn'
								type = "submit"
								value = "create"
							>
								Add task
							</button>
						</div>
				</form>
		</div >
	)
}

export default AddTaskForm;