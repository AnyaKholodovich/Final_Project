import React, { useState, useEffect } from 'react'
import { Link, useHistory} from 'react-router-dom';
import { useSelector } from 'react-redux';


import './Navigation.scss';

import { Routes } from '../../utils/routes.js'
import { deleteCookie } from "../../utils/getCookies";

function Navigation () {

  const history = useHistory();
  const { role } = useSelector(state => state.toDoAppReducer)
  const [activeRoute, setActiveRoute] = useState(history.location.pathname);

  useEffect(() => {
	  return history.listen((location) => { 
		setActiveRoute(location.pathname);
	  })
	}, [history])

	const handleDeleteToken = () => {
		console.log('handleDeleteToken')
		deleteCookie('authorization');
	  }

	return (
		<div className = 'navigation-container'>

			{/* <div className={activeRoute === Routes.UsersRoute ? 'navigation-item-active' : 'navigation-item'}>
			{ role === 'admin' && <Link to ={Routes.UsersRoute}>
					Users
				</Link>}
			</div>
			<div className={activeRoute === Routes.TasksRoute ? 'navigation-item-active' : 'navigation-item'}>
				<Link to ={Routes.TasksRoute}>
					tasks
				</Link>
			</div>
			<div className={activeRoute === Routes.SignInRoute ? 'navigation-item-active' : 'navigation-item'}>
				<Link to ={Routes.SignInRoute}>
				LogIn
				</Link>
			</div>
			<div className={activeRoute === Routes.SignUpRoute ? 'navigation-item-active' : 'navigation-item'}>
				<Link to ={Routes.SignUpRoute}>
				logUp
				</Link>
			</div> */}


			<div className={activeRoute === Routes.UsersRoute ? 'navigation-item-active' : 'navigation-item'}>
				{ role === 'admin' && <Link to={Routes.UsersRoute} >
						Users
				</Link>}
			</div>
          
			<div className={activeRoute === Routes.SignInRoute ? 'navigation-item-active' : 'navigation-item'}>
					<Link to ={Routes.SignInRoute} onClick={() => handleDeleteToken()}>
						Log out
					</Link>
			</div>
	
		</div>
	)
	
}

export default Navigation;