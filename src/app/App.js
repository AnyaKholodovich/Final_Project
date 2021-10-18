import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector} from 'react-redux';

import './App.css';

import { Routes } from '../utils/routes';
import { AuthorizeRoute, NotAuthorizeRoute } from '../components/routes';
import { Home, SignIg, SignUp, Tasks, Users } from '../pages';



function App() {

  const { token, role } = useSelector(state => state.authReducer);

  // const isAuthorized = Boolean (getCookie ('authorization'));
  // const userRole = getCookie ('role');
console.log('role', role, role === 'admin');
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
        path={Routes.UsersRoute}
        isAuthorized={Boolean(token)}
        hasPermission={role === 'admin'}
        // expectedRole = 'admin'
        role = { role }
        component = {Users}/>

			<AuthorizeRoute 
        path={Routes.TasksRoute  }
        isAuthorized={Boolean(token)}
        // expectedRole = 'user'
        hasPermission={role === 'user'}
        role = { role }
        component = {Tasks} />

      <AuthorizeRoute 
        // path={`${Routes.TasksRoute}/:id`}
        path='/tasks/:user_Id'
        isAuthorized={Boolean(token)}
        hasPermission={role === 'admin'}
        // expectedRole = 'admin'
        role = { role }
        component = {Tasks}
      />

    </Router>
    
  );
}

export default App;
