import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Routes, linkToRoute } from '../../../utils/routes';
import './Home.scss';

const Home = () =>{
    const history = useHistory();
    const {token, role } = useSelector(state => state.authReducer)

    useEffect(() => {  
        if (token) {
			linkToStartPage(role)
		} else {
			// history.push(Routes.SignInRoute)
            linkToRoute(history, Routes.SignInRoute)
		}
    }, []);

    const linkToStartPage = (role) => {
		if (role === 'admin') {
			linkToRoute(history, Routes.UsersRoute)
		} else {
			linkToRoute(history, Routes.TasksRoute)
		}
	}

    return (
    <h1>Домашняя страница</h1>
    );
}

export default Home;