import React from 'react';

import { Navigation } from '../navigation/index';
import { BrowserRouter as Router, Route } from 'react-router-dom';


import './App.css';


import { Routes } from '../../utils/routes';
// import { AuthorizeRoute, NotAuthorizeRoute } from '../routes';
import { SignIg, SignUp, Tasks, Users} from '../pages/index';



function App() {
  return (
    <Router>
      {/* <NotAuthorizeRoute path={Routes.SignInRoute} component ={SignIg} /> */}

      <Route exact path={Routes.SignInRoute}>
    		<SignIg />
    	</Route>

      {/* <NotAuthorizeRoute path={Routes.SignUpRoute} component ={SignUp}/> */}
      <Route exact path={Routes.SignUpRoute}>
    		<SignUp />
    	</Route>

      {/* <AuthorizeRoute path={Routes.TasksRoute} component ={Tasks}/> */}
      <Route exact path={Routes.TasksRoute}>
        <Navigation />
    		<Tasks />
    	</Route>

      {/* <AuthorizeRoute path={Routes.UsersRoute} component ={Users}/> */}
      <Route exact path={Routes.UsersRoute}>
        <Navigation />
    		<Users />
    	</Route>
    </Router>
    
  );
}

export default App;
