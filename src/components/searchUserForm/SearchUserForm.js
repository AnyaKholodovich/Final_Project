import React from 'react';

import './SearchUserForm.scss';

const SearchUserForm = ({ onSubmit, placeholder, onChange, value }) => {

	return (

			<form
				className='search-form'
				onSubmit={onSubmit}
			>

				<input
					className='search-input'
					id="search-task"
					type='text'
					placeholder={placeholder}
					value={value}
					onChange={onChange}
				/>

				<button 
					className = 'add-btn'
					type = 'submit'
					value={'search'}>
						SEARCH
				</button>

			</form>
	)
}

export default SearchUserForm;