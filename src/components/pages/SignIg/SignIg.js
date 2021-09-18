import React, { useState } from 'react';

import './SignIg.scss';

import { Routes } from '../../../utils/routes';
import { Link } from "react-router-dom";

const SignIg = () => {

    const [loginForm, setLoginForm] = useState ({
        loginValue: '', 
        passwordValue: ''
    
    });

      //types of form errors 'empty', 'notValid', 'notExists'
	const [loginFormError, setLoginFormError] = useState({
		loginError:'',
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
            resultCheckEmptyLogin = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, 'loginValue', 'loginError')
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

    const handleSubmitForm = (event) => {
		event.preventDefault();

        //If form is empty return from this function
		if ((handleCheckEmptyForm())){
			return;
		}
	}
  
    const { loginValue, passwordValue } = loginForm;
	const { loginError, passwordError } = loginFormError;


    return (
        <section className="logIn"> 
            <div className="container">
                <form className ='form-signIn' onSubmit={handleSubmitForm}>
                    <h1>Sign In</h1>
                    <div>
                        <label 
                            for='login' 
                            className = 'title-signIn'>
                                Nickname
                        </label>

                        <input 
                            type='email' 
                            name='loginValue' 
                            value = {loginValue} 
                            onChange ={event => handleChangeLoginForm(event,'loginValue', 'loginError')}
							onBlur={event => handleCheckEmptyForm(event, 'loginValue', 'loginError')}	
                            placeholder='Enter nickname here' 
                        />

                        {
                        loginError === 'empty' &&	
                        <span className='logIn-error'>Введите логин</span>
                        }

						{
                        loginError === 'notValid' &&
                        <span className='logIn-error'>Формат логина неверный</span>
                        }

						{
                        loginError === 'notExists' && 
                        <span className='logIn-error'>Пользователя с таким логином не существует</span> 
                        }
                    </div>

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