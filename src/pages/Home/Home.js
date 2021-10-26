import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { linkToRoute, Routes } from '../../utils/routes';

const Home = () => {
	const history = useHistory();
	const { token, role } = useSelector(state => state.toDoAppReducer)

	useEffect(() => {
		if (token) {
			linkToStartPage(role)
		} else {
			history.push(Routes.SignInRoute)
		}
	}, []);

	const linkToStartPage = (role) => {
		if (role === 'admin') {
			linkToRoute(history, Routes.UsersRoute)
		} else {
			linkToRoute(history, Routes.TasksRoute)
		}
	}

	return <h1>
		Home page
	</h1>
};

export default Home;