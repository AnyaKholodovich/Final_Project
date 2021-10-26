import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

import '../Registration/Registration.scss';

import { AuthInput} from '../../components';
import { Routes, linkToRoute } from '../../utils/routes';
import { authApi } from '../../api/authApi';
import { usersApi } from '../../api/usersApi';

const Registration = () => {

	const history = useHistory();

	const [signUpForm, setSignUpForm] = useState({
		userNameValue: '',
		loginValue: '',
		pswValue: '',
		repeatPswValue: '',
		selectRoleValue: '',
		selectAdminValue: ''
	});

	const [signUpFormError, setSignUpFormError] = useState({
		userNameError: '',
		loginError: '',
		pswError: '',
		repeatPswError: '',
		selectRoleError: '',
		selectAdminError: ''
	});

	const [admins, setAdmins] = useState([]);

	useEffect(() => {
		getAdminsList()
	}, [])

	const getAdminsList = () => {
		usersApi.getAdmins()
			.then(res => {
				const adminsList = res.data
				setAdmins(adminsList)
			})
	}

	const { userNameValue, loginValue, pswValue, repeatPswValue, selectRoleValue, selectAdminValue } = signUpForm;
	const { userNameError, loginError, pswError, repeatPswError, selectRoleError, selectAdminError } = signUpFormError;

	const handleCheckEmptyInput = (signUpForm, signUpFormError, inputName, errorName) => {
		if (signUpForm[inputName] === '') {
			signUpFormError[errorName] = 'empty'
			return true
		}
		return false
	};

	const handleCheckUserExists = async (fieldName, fieldValue) => {
		const body = {};
		body[fieldName] = fieldValue;

		return usersApi.checkUsersExist(body)
	}

	const handleCheckValidUserName = async (signUpFormErrorCopy) => {

		const minLetters = /(?=(?:.*[a-zA-z]){5,})/
		if (userNameValue !== '') {
			if (!minLetters.test(userNameValue) && !(userNameValue.length >= 5)) {
				signUpFormErrorCopy['userNameError'] = 'notValid'
			} else {
				const response = await handleCheckUserExists('userName', userNameValue)
				const { data } = response
				if (data.exists) {
					signUpFormErrorCopy.userNameError = 'alreadyExist'
				}
			}
		}
	}

	const handleCheckValidEmail = async (signUpFormErrorCopy) => {
		const mailRegex = /^\w+([\.-]?w+)*@\w+([\.-]?w+)*(\.\w{2,3})+$/

		if (!mailRegex.test(loginValue) && loginValue !== '') {
			signUpFormErrorCopy['loginError'] = 'notValid'
		} else {

			const response = await handleCheckUserExists('login', loginValue)
			const { data } = response
			if (data.exists) {
				signUpFormErrorCopy.loginError = 'alreadyExist'
			}
		}
	}

	const handleCheckValidPsw = (signUpFormErrorCopy) => {
		const pswRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/

		if (!pswRegex.test(pswValue) && pswValue !== '') {
			signUpFormErrorCopy['pswError'] = 'notValid'
		}
	}

	const handleCheckPswMatch = (signUpFormErrorCopy) => {
		if ((repeatPswValue !== pswValue) && (repeatPswValue !== '')) {
			signUpFormErrorCopy['repeatPswError'] = 'notMatch'
		}
	}

	const handleCheckValidInput = async (inputName, signUpFormErrorCopy) => {

		if (inputName !== '') {
			switch (inputName) {
				case 'userNameValue':
					await handleCheckValidUserName(signUpFormErrorCopy)
					break

				case 'loginValue':
					await handleCheckValidEmail(signUpFormErrorCopy)
					break

				case 'pswValue':
					handleCheckValidPsw(signUpFormErrorCopy)
					break

				case 'repeatPswValue':
					handleCheckPswMatch(signUpFormErrorCopy)
					break
			}
		}
	}

	const handleCheckEmptyFormSignUp = async (event = {}, inputName = '', errorName = '') => {
		const signUpFormCopy = { ...signUpForm };
		const signUpFormErrorCopy = { ...signUpFormError };

		let resultCheckEmpty = false;

		await handleCheckValidInput(inputName, signUpFormErrorCopy);

		if (inputName !== '' && errorName !== '') {
			handleCheckEmptyInput(signUpFormCopy, signUpFormErrorCopy, inputName, errorName)
			setSignUpFormError(signUpFormErrorCopy)

		} else {

			const valuesNameForm = Object.keys(signUpFormCopy);
			const errorsNameForm = Object.keys(signUpFormErrorCopy);

			if (selectRoleValue === 'admin') {
				valuesNameForm.pop()
				errorsNameForm.pop()
			}

			const checkEmptyArray = Array(valuesNameForm.length).fill(false);

			for (let i = 0; i < valuesNameForm.length; i++) {
				checkEmptyArray[i] = handleCheckEmptyInput(
					signUpFormCopy,
					signUpFormErrorCopy,
					valuesNameForm[i],
					errorsNameForm[i]
				)
			}
			resultCheckEmpty = checkEmptyArray.some(check => check === true)

			setSignUpFormError(signUpFormErrorCopy)
		}
		return resultCheckEmpty
	}

	const handleChangeRole = (event, inputName, errorName) => {
		const { value } = event.target
		const signUpFormErrorCopy = { ...signUpFormError }
		const signUpFormCopy = { ...signUpForm }
		if (value === 'admin') {
			signUpFormErrorCopy['selectAdminError'] = ''
			signUpFormCopy['selectAdminValue'] = ''
		}

		handleChangeSignUpForm(event, inputName, errorName, signUpFormCopy, signUpFormErrorCopy)
	}

	const handleChangeSignUpForm = (event, inputName, errorName, signUpFormCopyArg = undefined, signUpFormErrorCopyArg = undefined) => {

		const signUpFormCopy = signUpFormCopyArg || { ...signUpForm };
		const signUpFormErrorCopy = signUpFormErrorCopyArg || { ...signUpFormError };
		const { value: inputValue } = event.target;
		signUpFormErrorCopy[errorName] = '';
		setSignUpFormError(signUpFormErrorCopy);
		signUpFormCopy[inputName] = inputValue;
		setSignUpForm(signUpFormCopy);
	};

	const handleSubmitForm = async (event) => {

		event.preventDefault()
		const isFormValid = await handleCheckEmptyFormSignUp()
		if (isFormValid) {
			return
		}

		let newUser = {
			userName: userNameValue,
			login: loginValue,
			password: pswValue,
			role: selectRoleValue
		}
		if (selectRoleValue === 'user') {
			newUser.adminId = selectAdminValue
		}
		linkToRoute(history, Routes.SignInRoute)

		const response2 = await authApi.signUpUser(newUser)
	}

	const roleSelectOption = () => {
		return (
			<>
			  	<option value='' selected disabled>Please, choose a role</option>
				<option value="user">User</option>
				<option value="admin">Admin</option>
			</>
		)
	}

	return (
		 <section className='logUp'> 
			<div className='container'>

				<form className='form' onSubmit={handleSubmitForm}>
					<h1 className ='logUp-title'>Sign Up</h1>
					<div className = 'span-txt'><span >Create an account to enjoy all the services without any ads for free!</span></div>

					<AuthInput
						inputTitle='Nickname'
						inputType='text'
						disabled={false}
						inputPlaceholder='Enter username'
						inputError={userNameError}
						inputErrorName='userNameError'
						inputValue={userNameValue}
						inputValueName='userNameValue'
						inputName='userNameValue'
						emptyValidationText='Enter nickname, please'
						invalidValidationText='Username format is not correct'
						existsValidationText='User with this nickname already exists'
						matchValidationText=''
						handleChangeForm={handleChangeSignUpForm}
						handleCheckValidForm={handleCheckEmptyFormSignUp}
					/>

					<AuthInput
						inputTitle='Login'
						inputType='text'
						disabled={false}
						inputPlaceholder='Enter login'
						inputError={loginError}
						inputErrorName='loginError'
						inputValue={loginValue}
						inputValueName='loginValue'
						inputName='loginValue'
						emptyValidationText='Enter login, please'
						invalidValidationText='Incorrect format'
						existsValidationText='This login is already registered'
						matchValidationText=''
						handleChangeForm={handleChangeSignUpForm}
						handleCheckValidForm={handleCheckEmptyFormSignUp}
					/>

					<AuthInput
						inputTitle='Password'
						inputType='password'
						disabled={false}
						inputPlaceholder='Enter password'
						inputError={pswError}
						inputErrorName='pswError'
						inputValue={pswValue}
						inputValueName='pswValue'
						inputName='pswValue'
						emptyValidationText='Enter your password, please'
						invalidValidationText='Password must contain at least 5 characters (at least 1 letter and 1 number)'
						existsValidationText=''
						matchValidationText=''
						handleChangeForm={handleChangeSignUpForm}
						handleCheckValidForm={handleCheckEmptyFormSignUp}
					/>

					<AuthInput
						inputTitle='Repeat password:'
						inputType='password'
						disabled={pswValue === '' ? true : pswError === 'notValid' ? true : false}
						inputPlaceholder='Repeat password'
						inputError={repeatPswError}
						inputErrorName='repeatPswError'
						inputValue={repeatPswValue}
						inputValueName='repeatPswValue'
						inputName='repeatPswValue'
						emptyValidationText='Repeat your password, please'
						invalidValidationText=''
						existsValidationText=''
						matchValidationText='Password mismatch'
						handleChangeForm={handleChangeSignUpForm}
						handleCheckValidForm={handleCheckEmptyFormSignUp}
					/>

				<div className='registration-input'>
                    <div className = 'title-signUp'>
                        <label 
                            for='password' 
					        htmlFor='role-select'>
                                Choose a role
                        </label>
                    </div>

                    <select 
                        className='registration-value'
                        name='selectRoleValue'
                        id='role-select'
                        value={selectRoleValue}
                        onChange={ (event) => 
                            handleChangeRole (event, 'selectRoleValue', 'selectRoleError' )
                        }

                        onBlur={event => handleCheckEmptyFormSignUp(event, 'selectRoleValue', 'selectRoleError')}>

                        {roleSelectOption()}
                    </select>
                    <div className='registration-error'>{selectRoleError === 'empty' && (<span>Choose a role</span>)}</div>
                </div>

                {selectRoleValue === 'user' && (
                    <div className='registration-input'>
                        <div className='title-signUp'>
                            <label
                                htmlFor='administrator'>
                                Choose administrator
                            </label>
                        </div>
                      

                        <div><select
                            className={selectAdminValue}
                            name='selectAdminValue'
                            id='role-select'
                            value={selectAdminValue}
                            onChange={ event => handleChangeSignUpForm(event, 'selectAdminValue', 'selectAdminError' )}
                            onBlur={event => handleCheckEmptyFormSignUp(event, 'selectAdminValue', 'selectAdminError')}>    
                                <option value='' disabled>
                                    Please, choose administrator
                                </option>

                            {
                                admins.map(admin => {
                                    const {_id, userName, login } = admin
                                    return <option value = {_id}>{`${userName}, ${login}`}</option> 
                                })
                            }
                        </select> </div>
                        <div className='registration-error'>{selectAdminError === 'empty' && (<span >Choose administrator</span>)}</div>
                    </div>
                )}

					<input type='submit' value='Sign Up' className='sub-btn' />

					<div className ='logIn-signUp'>
                    <Link to={Routes.SignInRoute}>Sign In</Link>
                	</div>

			</form >
		</div >
	</section>
		
	)
}

export default Registration;