import React from 'react';
import { Link } from 'react-router-dom'

import './UserItem.scss';
import { Routes } from '../../utils/routes'

function UserItem({id, userNumber, nickname, login}) {

	return (
		<>
			<Link to={`${Routes.TasksRoute}/${id}`} className="link-item">
				<li className="user-item" >
					<span className="user-id">{userNumber}</span>
					<span className="user-name">{nickname}</span>
					<span className="user-login">{login}</span>
				</li>
			</Link>
		</>
	)
}

export default UserItem;