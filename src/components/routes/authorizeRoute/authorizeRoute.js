import React from 'react'
import { Route, Redirect } from 'react-router-dom';

import { Navigation } from '../../navigation';
import { Routes } from "../../../utils/routes";

const AuthorizeRoute = (props) =>{
    const { component: path, Component,  isAuthorized, hasPermission } = props;
    return( 
        <Route exact path={path}>
            {( isAuthorized && hasPermission) ?
                <>
                    <Navigation />
                    <Component />
                </> :
                <Redirect to={Routes.SignInRoute} />
            }
        </Route>
    )
}

export default AuthorizeRoute;