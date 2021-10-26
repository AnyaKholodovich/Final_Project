import React from 'react';

import './CorrectButton.scss'

const CorrectButton = (props) => {

	const { onClick } = props;

	return (
		
			<button className = 'btn-correct' onClick={() => onClick()}>
				Change
			</button>
		

	)
}

export default CorrectButton;

