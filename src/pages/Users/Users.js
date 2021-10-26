import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './Users.scss';

import { usersApi } from '../../api/usersApi';
import UserItem from '../../components/userItem/UserItem';
import SearchUserForm from '../../components/searchUserForm/SearchUserForm';
import TimeOverWindow from '../../components/timeOverWindow/TimeOverWindow';

const Users = () => {

	const appState = useSelector(state => state.toDoAppReducer);
	const { token } = appState;
	const [users, setUsers] = useState([])
	const [searchText] = useState('')
	const [timeOver, setTimeOver] = useState(false);

	useEffect(() => {
		getUsers()
	}, [])

	const getUsers = () => {
		usersApi.getUsers(token)
			.then(res => {
				const usersList = res.data
				setUsers(usersList)

			})
			.catch(error => {
				if (error.response.status === 401) {
					setTimeOver(true)
				}
				console.error(error.message)
			})
	}

	const renderUsers = (arr) => {
		if (arr.length === 0) {
			return (
				<span className='no-users' >No users available</span>
			)
		}

		let result;
		result = arr.map((item) => (
			< UserItem
				id={item._id}
				nickname={item.userName}
				taskId={arr.indexOf(item) + 1}
				login={item.login}
			/>
		));
		return result;
	};

	return (
		<>
			<section className='users'>
				<div className='container'>
					<div className='toDoBlock card first'>
						<div className='textTitle'>
							<h2>Users</h2>
						</div>

						<div className = 'search'>
							<SearchUserForm
								placeholder='Search task'
								value={searchText}
							/>
						</div>
					</div>

					<div className='toDoBlock'>
						<ul className='users-list'>
							{users && users.length > 0 && renderUsers(users)}
						</ul>
					</div>

					{timeOver && <TimeOverWindow
						text='Your time is over!'
						onClick={() => setTimeOver(false)}
						link='SignInRoute'
					/>}
				</div>
			</section>
		</>
	)
}

export default Users;