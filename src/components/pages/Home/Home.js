import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Routes } from '../../../utils/routes';

import './Home.scss';

const Home = () =>{

    const history = useHistory();
    useEffect(() => {  
        history.push(Routes.SignInRoute)
    }, []);

    return (
    <h1>Домашняя страница</h1>
    );
}

export default Home;