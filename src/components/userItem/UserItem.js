import React from 'react';
import { Link } from 'react-router-dom'

import './UserItem.scss';
import { Routes } from '../../utils/routes'

function UserItem({id, userNumber, nickname, login}) {

	return (
		<div className='li-task'>
			<Link to={`${Routes.TasksRoute}/${id}`} className="link-item">
				<li className="user-item" >
					<div className="user_inf">
						<span className="user_namber">{userNumber}</span>
						<span className="user_name">{nickname}</span>
					</div>

					<div>
						<span className="user_login">{login}</span>
					</div>
				</li>
			</Link>
		</div>
	)
}

export default UserItem;