import React, { useState } from 'react';

import './SignIg.scss';

import { AuthInput } from '../../authForm/authInput/AuthInput';
import { authApi } from '../../../api/authApi';
import { Routes } from '../../../utils/routes';
import { Link } from "react-router-dom";

const SignIg = () => {

    const [loginForm, setLoginForm] = useState ({
        nickNameValue: '', 
        passwordValue: ''
    
    });

      //types of form errors 'empty', 'notValid', 'notExists'
	const [loginFormError, setLoginFormError] = useState({
		nickNameError:'',
		passwordError: ''
	});

    	//check inputs for empty value
	const handleCheckEmptyInput = (loginForm, loginFormError, inputName, errorName) =>{
		if (loginForm[inputName] === ''){
			loginFormError[errorName] = 'empty';
			return true;
		}
		return false;
	}


    const handleCheckEmptyForm  = (event = {}, inputName = '', errorName= '') => {

        const loginFormCopy = {...loginForm};
        const loginFormErrorCopy = {...loginFormError};
        let resultCheckEmpty = false;
        let resultCheckEmptyLogin = false;
        let resultCheckEmptyPassword = false;

        //Check some input if we provide it name
        if (inputName !=='' && errorName !== '') {
            resultCheckEmpty = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, inputName, errorName)
            setLoginFormError(loginFormErrorCopy)
        } else {
            //Ckeck all input
            resultCheckEmptyLogin = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, 'nickNameValue', 'nickNameError')
            resultCheckEmptyPassword = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, 'passwordValue', 'passwordError')
            resultCheckEmpty = resultCheckEmptyLogin || resultCheckEmptyPassword;

            setLoginFormError(loginFormErrorCopy)
        }
        return resultCheckEmpty;
	}

    const handleChangeLoginForm = (event, inputName, errorName ) => {
        const { value: inputValue } = event.target
        const loginFormCopy = {...loginForm};
        const loginFormErrorCopy = {...loginFormError};
       
        loginFormErrorCopy[errorName] = '';
		setLoginFormError(loginFormErrorCopy);

		loginFormCopy[inputName] = inputValue;
		setLoginForm(loginFormCopy);
    }

    const handleSubmitForm = async(event) => {
		event.preventDefault();

		if ((handleCheckEmptyForm())){
			return;
		}
        
        const user = {
            userName: nickNameValue,
            password: passwordValue
        }

        try {
            const res = await authApi.signInUser(user)
            console.log('res', res)
        } catch (error) {
            const loginFormErrorCopy = { ...loginFormError }
            console.log('signIn error', error.response.data.message)
            const errorMessage = error.response.data.message

            if (errorMessage === 'No user with such userName') {
                loginFormErrorCopy['nickNameError'] = 'notExists'
            } else if (errorMessage === 'SignIn error') {
                loginFormErrorCopy['passwordError'] = 'notValid'
            }

            setLoginFormError(loginFormErrorCopy)
        }
	}
  
    const { nickNameValue, passwordValue } = loginForm;
	const { nickNameError, passwordError } = loginFormError;


    return (
        <section className="logIn"> 
            <div className="container">
                <form className ='form-signIn' onSubmit={handleSubmitForm}>
                    <h1>Sign In</h1>
                    <div>

                    <AuthInput inputTitle = 'Nickname'
                    disabled= {false}
                    inputValueName = 'nicknameValue'
                    inputErrorName = 'nicknameError'
                    inputValue = { nickNameValue }
                    inputError = { nickNameError }
                    emptyValidationText = 'enter nickname, please'
                    invalidValidationText = ''  
                    existsValidationText = 'User with this nickname already exists' 
                    matchValidationText = ''
                    handleChangeForm = { handleChangeLoginForm }
                    handleCheckValidForm = { handleCheckEmptyForm } 
                />

                        {/* <label 
                            for='login' 
                            className = 'title-signIn'>
                                Nickname
                        </label>

                        <input 
                            type='text' 
                            name='nickNameValue' 
                            value = {nickNameValue} 
                            onChange ={event => handleChangeLoginForm(event,'nickNameValue', 'nickNameError')}
							onBlur={event => handleCheckEmptyForm(event, 'nickNameValue', 'nickNameError')}	
                            placeholder='Enter nickname here' 
                        />

                        {
                        nickNameError === 'empty' &&	
                        <span className='logIn-error'>Введите логин</span>
                        }

						{
                        nickNameError === 'notExists' && 
                        <span className='logIn-error'>Пользователя с таким логином не существует</span> 
                        } */}
                    </div>
                   < AuthInput inputTitle = 'Password'
                        disabled= {false}
                        inputValueName = 'passwordValue'
                        inputErrorName = 'passwordError'
                        inputValue = { passwordValue }
                        inputError = { passwordError }
                        emptyValidationText = 'Enter your password, please'
                        invalidValidationText = 'Wrong password'  
                        existsValidationText = '' 
                        matchValidationText = ''
                        handleChangeForm = { handleChangeLoginForm }
                        handleCheckValidForm = { handleCheckEmptyForm } 
                />

                    <div>
                        <label 
                            for='password' 
                            className = 'title-signIn'>
                                Password
                        </label>

                        <input 
                            type='password' 
                            value = {passwordValue} 
                            onChange ={event => handleChangeLoginForm(event,'passwordValue', 'passwordError')}
							onBlur={event => handleCheckEmptyForm(event, 'passwordValue', 'passwordError')}	
                            name='passwordValue' 
                            placeholder='Enter password here' 
                            />

                        {
                            passwordError === 'empty' && 
                            <span className='logIn-error'>Введите пароль</span>
                        }

						{
                            passwordError === 'notValid' &&
                            <span className='logIn-error'>Пароль неверный</span>
                        }
                    </div>

                    <div className='logIn-button'>
                        <input type ='submit' value='Sign In' />
                    </div>

                    <div className ='logIn-signUp'>
                        <Link to={Routes.SignUpRoute}>Sign Up</Link>
                    </div>  
                </form>
            </div>
    </section>
   
);
}

export default SignIg;