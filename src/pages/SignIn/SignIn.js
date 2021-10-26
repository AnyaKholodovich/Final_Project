import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Jwt from 'jsonwebtoken';

import '../SignIn/SignIn.scss';

import { AuthInput } from '../../components';
import { authApi } from '../../api/authApi';
import { Routes } from '../../utils/routes';
import { linkToRoute } from '../../utils/routes';
import { signIn } from '../../redux/actions/toDoAppActions';
import { setCookie } from '../../utils/getCookies';

const SignIn = () => {

	const history = useHistory()
	const dispatch = useDispatch()

	const [loginForm, setLoginForm] = useState({ userNameValue: '', pswValue: '' });
	const [loginFormError, setLoginFormError] = useState({ userNameError: '', pswError: '' });

	const { userNameValue, pswValue } = loginForm;
	const { userNameError, pswError } = loginFormError;

	const handleChangeLoginForm = (event, inputName, errorName) => {
		const loginFormCopy = { ...loginForm };
		const loginFormErrorCopy = { ...loginFormError };

		const { value: inputValue } = event.target;
		loginFormErrorCopy[errorName] = '';
		setLoginFormError(loginFormErrorCopy);

		loginFormCopy[inputName] = inputValue;
		setLoginForm(loginFormCopy);
	}

	const handleCheckEmptyInput = (loginForm, loginFormError, inputName, errorName) => {
		if (loginForm[inputName] === '') {
			loginFormError[errorName] = 'empty'
			return true
		}
		return false
	}

	const handleCheckEmptyForm = (event = {}, inputName = '', errorName = '') => {
		const loginFormCopy = { ...loginForm };
		const loginFormErrorCopy = { ...loginFormError };

		let resultCheckEmpty = false;
		let resultCheckEmptyLogin = false;
		let resultCheckEmptyPsw = false;

		if (inputName !== '' && errorName !== '') {
			resultCheckEmpty = handleCheckEmptyInput(
				loginFormCopy,
				loginFormErrorCopy,
				inputName,
				errorName
			)

			setLoginFormError(loginFormErrorCopy)

		} else {

			resultCheckEmptyLogin = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, 'userNameValue', 'userNameError')
			resultCheckEmptyPsw = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, 'pswValue', 'pswError')
			resultCheckEmpty = resultCheckEmptyLogin || resultCheckEmptyPsw

			setLoginFormError(loginFormErrorCopy)
		}
		return resultCheckEmpty
	}


	const handleSubmitForm = async (event) => {
		try {
			event.preventDefault()
			if (handleCheckEmptyForm()) {
				return
			}
			const user = {
				userName: userNameValue,
				password: pswValue
			}

			const res = await authApi.signInUser(user)
			const { token } = res.data

			setCookie('authorization', token)

			const decodedData = Jwt.decode(token)
			const { role, id: userId } = decodedData

			dispatch(signIn({ role, token, userId }))

			if (role === 'admin') {
				linkToRoute(history, Routes.UsersRoute)
			} else {
				linkToRoute(history, Routes.TasksRoute)
			}

		} catch (error) {
			console.log('why dont go', error)

			const loginFormErrorCopy = { ...loginFormError };
			const errorMessage = error.response.data.message

			if (errorMessage === 'No user with such userName') {
				loginFormErrorCopy['userNameError'] = 'notExists'
			} else if (errorMessage === 'Passwords did not match') {
				loginFormErrorCopy['pswError'] = 'notValid'
			}
			setLoginFormError(loginFormErrorCopy)
		}
	}


	return (
		<section className="log In"> 
			<div className="container">
				<form className ='form' onSubmit={handleSubmitForm}>
					<h1 className ='login-title'>Sign In</h1>
                    <div className = 'span-txt'><span >Create an account to enjoy all the services without any ads for free!</span></div>

					<AuthInput
						inputTitle='Nickname'
						inputType='text'
						disabled={false}
						inputPlaceholder='Nickname'
						inputError={userNameError}
						inputErrorName='userNameError'
						inputValue={userNameValue}
						inputValueName='userNameValue'
						inputName='userNameValue'
						emptyValidationText='Enter nickname, please'
						invalidValidationText=''
						existsValidationText=''
						notExistsValidationText='User with this nickname already exists'
						matchValidationText=''
						handleChangeForm={handleChangeLoginForm}
						handleCheckValidForm={handleCheckEmptyForm}
					/>

					<AuthInput
						inputTitle='Password'
						inputType='password'
						disabled={false}
						inputPlaceholder='Password'
						inputError={pswError}
						inputErrorName='pswError'
						inputValue={pswValue}
						inputValueName='pswValue'
						inputName='pswValue'
						emptyValidationText='Enter your password, please'
						invalidValidationText='Wrong password'
						existsValidationText=''
						notExistsValidationText=''
						matchValidationText=''
						handleChangeForm={handleChangeLoginForm}
						handleCheckValidForm={handleCheckEmptyForm}
					/>

					<div className='button'>
                        <input type ='submit' value='Create Account' />
                    </div>

					<div className ='logIn-signUp'>
                    	Already Have An Account?<Link to={Routes.SignUpRoute}>Sign Up</Link>
                    </div> 
				</form>
			</div>
		</section>
	)
};

export default SignIn;