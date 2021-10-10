import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';

import { Routes } from '../../utils/routes';
import { useSelector} from 'react-redux';
import { AuthorizeRoute, NotAuthorizeRoute } from '../routes';
import {Home, SignIg, SignUp, Tasks, Users} from '../pages/index';



function App() {

  const { token, role } = useSelector(state => state.authReducer);

  // const isAuthorized = Boolean (getCookie ('authorization'));
  // const userRole = getCookie ('role');

  return (
    <Router>

      <NotAuthorizeRoute
        path={Routes.HomeRoute} 
        component = {Home} />

			<NotAuthorizeRoute
       path={Routes.SignInRoute} 
       component = {SignIg} />
				
			<NotAuthorizeRoute 
      path={Routes.SignUpRoute} 
      component = {SignUp} />		

			<AuthorizeRoute 
      path={Routes.TasksRoute  }
      isAuthorized={Boolean(token)}
			hasPermission={role === 'user'} 
      component = {Tasks} />

			<AuthorizeRoute 
      path={Routes.UsersRoute}
      isAuthorized={Boolean(token)}
			hasPermission={role === 'admin'}
      component = {Users}/>

    </Router>
    
  );
}

export default App;
