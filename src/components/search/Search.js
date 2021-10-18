import React from 'react';

import './Search.scss';

function Search(props) {

	const {
		placeholder,
		onSubmit,
		onChange,
		value,
		nameInput,
	} = props

	return (
			<form
				className='search-form'
				onSubmit={onSubmit}
			>
				<div>
					<input
						className = 'search-input'
						name = { nameInput }
						type='text'
						value = { value }
						placeholder = { placeholder }
						onChange = { onChange }
					/>
				</div>

				{/* <input
					className='search-button'
					type='submit'
					value={'\u25B6'}
				/> */}
				<div>
					<button 
						className = 'add-btn'
						type = 'submit'
					>
						SEARCH
					</button>
				</div>
			</form>
	)
}

export default Search;