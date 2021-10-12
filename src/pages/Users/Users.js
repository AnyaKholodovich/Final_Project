import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './Users.scss';

import { usersApi } from '../../api/usersApi';
import UserItem from '../../components/userItem/UserItem';
import Search from '../../components/search/Search';


function Users() {
    const { token } = useSelector(state => state.authReducer);
    const [users, setUsers] = useState([]);
	const [searchText, setSearchText] = useState('')
	const [searchError, setSearchError] = useState(false)
	const [searchErrorText, setSearchErrorText] = useState('')

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
            console.error(error.message)
        })
	}


	const handleChangeSearchText = (e) => {
		setSearchError(false)
		setSearchErrorText('')
		setSearchText(e.target.value);
	};

const checkInput = () =>{
    const searchTextCopy = searchText;

    if(searchTextCopy.trim().length === 0) {
        setSearchError(true);
        setSearchErrorText('Enter text')
        return true
    }
    return false;
}

	const handleSearchSubmit = e => {
		e.preventDefault();
		checkInput();
	}

	const renderUsers = (arr) => {

			if (arr.length === 0) {
				return (
					<span className='list-empty' >No users available</span>
				)
			}

			let result;
			result = arr.map((item, index) => (
				< UserItem
					key={index}
					userNumber={index + 1}
                    id = {item._id}
					nickname={item.userName}
					login={item.login}
				/>
			));
			return result;
	};


	return (
		<>
			<section className='users'>
				<Search
					placeholder='Enter nickname'
					onChange={handleChangeSearchText}
					onSubmit={handleSearchSubmit}
					value={searchText}
					nameInput='searchUserForm'
				/>
                
				<div className="users-wraper">
					<ul className="users-list">
						{users && users.length > 0 && renderUsers(users)}
					</ul>
				</div>
			</section>
		</>
	)
}


export default Users;