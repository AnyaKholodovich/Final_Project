import React from 'react';

import './TaskUser.scss';

function TaskUser(props) {

	const { taskNumber, taskName, checked, onChange, onClick, role, item } = props;
	
	return (
		<div className='li-task'>
			<li className='li-tasks'>
				<input
					className = 'custom-checkbox'
					type ='checkbox'
					id = {taskNumber}
					name = {taskNumber}
					checked = {checked}
					onChange = {onChange}
				/>

				<label htmlFor={taskNumber}>
						{taskName}
				</label>

				{role === 'admin' && item.checked && (
					<button className='btn-deleted' onClick={() => onClick()}>
					Deleted
				  </button>
				)}

			</li>

			
		</div>
	)
}

export default TaskUser;