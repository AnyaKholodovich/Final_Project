import React from 'react';

import './CorrectForm.scss';

function CorrectForm({ onChange, onClick, value, nameInput, nameButton, onSubmit, formName }) {

	return (
		<>
			<div className='correct-wrapper'>

				<form
					className='correct-form'
					onSubmit={onSubmit}
					name={formName}
				>

					<input
						className='correct-input'
						id='new-todo'
						value={value}
						onChange={onChange}
						name={nameInput}
					/>

					<div className='correct-btns'>

						<input
							className='correct-button'
							type='submit'
							name={nameButton}
							value='Correct'
						/>

						<button
							className='correct-button'							
							onClick={onClick}>
								Close					
						</button>

					</div>
				</form>
			</div>
			
		</>
	)
}

export default CorrectForm;