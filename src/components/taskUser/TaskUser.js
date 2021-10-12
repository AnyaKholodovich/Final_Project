import React from 'react';

import './TaskUser.scss';


function TaskUser(props) {

	const { taskNumber, taskName, checked, onChange } = props;
	
	return (
		<li className='task-item'>
			<span className='item-id'>{taskNumber}</span>

			<label className='item-name' htmlFor={taskNumber}>
				{taskName}
			</label>

			<input
				className='item-check'
				type='checkbox'
				id={taskNumber}
				name={taskNumber}
				checked={checked}
				onChange={onChange}
			/>

		</li>
	)
}

export default TaskUser;