import React from 'react';
import { Link } from 'react-router-dom';

import './UserItem.scss';

const UserItem = ({ id, taskId, nickname, login }) => {

	return (
		<div className='li-task'>
			<Link to={`/tasks/${id}`}  className="link-item">

				<li className='user-item'>
					<div className="user_inf">
						<span className='user_namber'>{`${taskId}.`}</span>
						<span className='user-name'>{nickname}</span>
					</div>

					<div>
						<span className='user_login'>{login}</span>
					</div>	
				</li>

			</Link>
		</div>
	)
}

export default UserItem