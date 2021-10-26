import React from 'react';
import { Link } from 'react-router-dom';

import './TimeOverWindow.scss'

import { Routes } from '../../utils/routes';

function TimeOverWindow(props) {

	const { text, link } = props;

	return (
		<>
			<div className='popup'>
				<div className='popup__body'>
					<div className='popup__content'>
						<div className='time-text'><p className='time-text'>{text}</p></div>
							<div className='time-btn'>
								<Link to={Routes[link]}>
									<button className='btn'>SignIn</button>
								</Link>
							</div>
					</div>	
				</div>
			</div>
		</>
	)
}

export default TimeOverWindow;