import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { Routes } from '../../utils/routes';
import './Navigation.scss';

const Navigation = () => {
    const history = useHistory();
    const [activeRoute, setActiveRoute] = useState(history.location.pathname);

    useEffect(() => {
        return history.listen((location) => { 
          setActiveRoute(location.pathname);
        })
      }, [history])

    
    return (
        <div className = 'navigation-container'>
            
                <div className={activeRoute === Routes.HomeRoute ? 'navigation-item-active' : 'navigation-item'}>
                    <Link to ={Routes.HomeRoute}>
                        Home
                    </Link>
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
                </div>
        </div>
    )
}

export default Navigation;