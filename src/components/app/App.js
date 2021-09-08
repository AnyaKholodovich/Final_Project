import React from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import './App.css';


import SignIg from '../pages/SignIg/SignIg';
import SignUp from '../pages/SignUp/SignUp';
import Tasks from '../pages/Tasks/Tasks';
import Users from '../pages/Users/Users';


function App() {
  return (
    <Router>
      <Route exact path="/">
              <h1>Корневой путь</h1>
      </Route>

      <Route path="/signIg">
              <SignIg />
      </Route>

      <Route path="/signUp">
              <SignUp />
      </Route>

      <Route path="/tasks">
              <Tasks />
      </Route>

      <Route path="/users">
              <Users />
      </Route>

    </Router>
    
  );
}

export default App;
