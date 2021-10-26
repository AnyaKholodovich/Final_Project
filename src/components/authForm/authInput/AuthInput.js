import React from 'react';

import './AuthInput.scss';

const AuthInput = ({
	inputType,
	disabled,
	inputPlaceholder,
	inputError,
	inputErrorName,
	inputValue,
	inputValueName,
	inputName,
	emptyValidationText,
	invalidValidationText,
	existsValidationText,
	matchValidationText,
	notExistsValidationText,
	handleChangeForm,
	handleCheckValidForm }) => {

	return (
		<div className='input-block'>
			<input type={inputType} placeholder={inputPlaceholder}
				name={inputName} className='registration-input'
				value={inputValue}
				onChange={event => handleChangeForm(event, inputValueName, inputErrorName)}
				onBlur={event => handleCheckValidForm(event, inputValueName, inputErrorName)}
				disabled={disabled}
			/>

			<div className='registration-error'>
				{
					inputError === 'empty' &&
					<div className='login-error'>{emptyValidationText} </div>
				}
				{
					inputError === 'notValid' &&
					<div className='login-error'> {invalidValidationText} </div>
				}
				{
					inputError === 'alreadyExist' &&
					<div className='login-error'> {existsValidationText} </div>
				}

				{
					inputError === 'notMatch' &&
					<div className='psw-error'>{matchValidationText}</div>
				}

				{
					inputError === 'notExists' &&
					<div className='login-error'>{notExistsValidationText}</div>
				}
			</div>
		</div>
	)
}

export default AuthInput