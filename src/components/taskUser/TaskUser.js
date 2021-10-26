import React from 'react';

import './TaskUser.scss';

import CorrectButton from '../../components/correctButton/CorrectButton';

function TaskUser(props) {

	const { taskNumber, taskName, checked, onChange, item, onClick, role } = props;

	return (
		<div className='li-task'>
			<li className='li-tasks'>
				<div className='li-taskss'>
					<input
							className = 'custom-checkbox'
							type='checkbox'
							id={taskNumber}
							name={taskNumber}
							checked={checked}
							onChange={() => onChange()}/>

					<div>
						<label className='item-name' htmlFor={taskNumber}>
							{taskName}
						</label>
					</div>
				</div>
				<div className='btns'>
					{role === 'admin' && item.checked && (
						<button className='btn-correct' onClick={() => onClick()}>
							Deleted
						</button>
					)}
					{role === 'user' && item.checked && <CorrectButton
						onClick={() =>onClick()}
						
					/>}
				</div>
			</li>
			
		</div>

	)
}

export default TaskUser;