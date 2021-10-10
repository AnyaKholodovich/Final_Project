import React, { useState } from 'react';
import jwt  from 'jsonwebtoken';
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';

import './SignIg.scss';

import  AuthInput  from '../../authForm/authInput/AuthInput';
import { authApi } from '../../../api/authApi';
import { Routes, linkToRoute } from '../../../utils/routes';
import { signIn } from '../../../redux/actions/toDoAppActions';
import { setCookie } from '../../../utils/getCookies';

const SignIg = () => {

    const dispatch = useDispatch();
    const history = useHistory();

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
            
            const { token } = res.data
            setCookie('authorization', token)
            const decodedData = jwt.decode(token)
            const { role, id: userId } = decodedData
            dispatch(signIn({ role, token, userId}))

            if ( res.data.role === 'admin'){
                linkToRoute(history, Routes.UsersRoute)
            }else{
                linkToRoute(history, Routes.TasksRoute)
            }

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
        <section className="log In"> 
            <div className="container">
                <form className ='form' onSubmit={handleSubmitForm}>
                    <h1 className ='login-title'>Sign In</h1>
                    <div className = 'span-txt'><span >Create an account to enjoy all the services without any ads for free!</span></div>
                    

                    <AuthInput inputTitle = 'Nickname'
                    disabled= {false}
                    inputValueName = 'nickNameValue'
                    inputErrorName = 'nickNameError'
                    inputplaceholder = 'Nickname'
                    inputType ='text'
                    inputValue = { nickNameValue }
                    inputError = { nickNameError }
                    emptyValidationText = 'Enter nickname, please'
                    invalidValidationText = ''  
                    existsValidationText = 'User with this nickname already exists' 
                    matchValidationText = ''
                    handleChangeForm = { handleChangeLoginForm }
                    handleCheckValidForm = { handleCheckEmptyForm } 
                />
                  
                   < AuthInput inputTitle = 'Password'
                        disabled= {false}
                        inputValueName = 'passwordValue'
                        inputErrorName = 'passwordError'
                        inputplaceholder = 'Password'
                        inputType ='text'
                        inputValue = { passwordValue }
                        inputError = { passwordError }
                        emptyValidationText = 'Enter your password, please'
                        invalidValidationText = 'Wrong password'  
                        existsValidationText = '' 
                        matchValidationText = ''
                        handleChangeForm = { handleChangeLoginForm }
                        handleCheckValidForm = { handleCheckEmptyForm } 
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
);
}

export default SignIg;