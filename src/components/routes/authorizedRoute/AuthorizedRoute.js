import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Navigation } from '../../../components';
import { Routes } from '../../../utils/routes';


const AuthorizedRoute = (props) => {

	const { component: Component, path, isAuthorized, hasPermission } = props

	return (
		< Route exact path={path} >
			{(isAuthorized && hasPermission)?
				<>
					<Navigation />
					<Component />
				</> :
				<Redirect to={Routes.SignInRoute} />
			}
		</Route>
	)
};

export default AuthorizedRoute;