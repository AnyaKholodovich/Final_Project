import React from 'react';

import './AddTaskForm.scss';

const AddTaskForm = ({ onSubmit, onChange, value, nameInput, nameForm, placeholder, errorMessage }) => {

	return (
		<div className='tasks-list'>
				<form 
					onSubmit={onSubmit}
					name={nameForm}>

					<div>
						<input
							className='add-input'
							value={value}
							id="new-task"
							// type="text"
							onChange={onChange}
							name={nameInput}
							placeholder = {placeholder}
						/>

						<button 
								className='add-btn'
								type = "submit"
								value = "create">
								Add task
						</button>
					</div>
					<div className='warningText'> {errorMessage} </div>
				</form>
		</div >
	)
}

export default AddTaskForm