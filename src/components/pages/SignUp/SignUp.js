import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import '../SignUp/SignUp.scss';

import { signUpApi } from '../../../api/signUpApi';
import { Routes } from '../../../utils/routes';


const SignUp = () => {
    const [signUpForm, setSignUpForm] = useState({
        nicknameValue: '',
        loginValue: '',
        passwordValue: '',
        repeatedPasswordValue: '',
        selectValue: '',
      });
     
      const [signUpFormError, setSignUpFormError] = useState({
        nicknameError: '',
        loginError: '',
        passwordError: '',
        repeatedPasswordError: '',
        selectError: ''
      });
    
      const { 
          nicknameValue, 
          loginValue, 
          passwordValue, 
          repeatedPasswordValue, 
          selectValue 
        } = signUpForm;

      const { 
          nicknameError, 
          loginError, 
          passwordError, 
          repeatedPasswordError, 
          selectError 
        } = signUpFormError;
    
      const handleChangeSignUpForm = (event, inputName, errorName) => {
    
        const signUpFormCopy = {...signUpForm};
        const signUpFormErrorCopy = {...signUpFormError};
    
        signUpFormErrorCopy[errorName] = '';
        setSignUpFormError(signUpFormErrorCopy);
    
        signUpFormCopy[inputName] = event.target.value;
        setSignUpForm(signUpFormCopy);
      };
    
      const handleCheckInput = (signUpForm, signUpFormError, inputName, errorName) => {
    
        if(signUpForm[inputName] === ''){
            signUpFormError[errorName] = 'empty';
            return true;
        }
        return false;
      }
    
      const handleCheckPasswordMatch = (signUpFormError) => {
    
        if (repeatedPasswordValue !== passwordValue && repeatedPasswordValue !== ''){
            signUpFormError['repeatedPasswordError'] = 'notMatch'
        }
      }
    
      const handleCheckEmptySignUpForm = (
          event = {}, 
          inputName = '', 
          errorName =''
        ) => {
        const signUpFormCopy = {...signUpForm};
        const signUpFormErrorCopy = {...signUpFormError};
    
        let resultCheckEmpty = false;
        handleCheckPasswordMatch(signUpFormErrorCopy);
    
        if(inputName !== '' && errorName !== ''){
            resultCheckEmpty = handleCheckInput(
                signUpFormCopy, 
                signUpFormErrorCopy, 
                inputName, 
                errorName
            );
            setSignUpFormError(signUpFormErrorCopy);
    
        }else{

            const valuesNameForm = Object.keys(signUpFormCopy)
            const errorNameForm = Object.keys(signUpFormErrorCopy)
            const checkEmptyArray = Array(valuesNameForm.length).fill(false)

            for (let i = 0; i < valuesNameForm.length; i++){
                checkEmptyArray[i] = handleCheckInput(
                    signUpFormCopy,
                    signUpFormErrorCopy,
                    valuesNameForm[i],
                    errorNameForm[i]
                )
            }
    
            resultCheckEmpty = checkEmptyArray.some(check => check === true)
            setSignUpFormError(signUpFormErrorCopy);
    
        }
        return resultCheckEmpty;
      }
    
      const handleSubmitForm = async (event) => {
    
        event.preventDefault();
    
          if(handleCheckEmptySignUpForm()){
              return;
          }
          let newUser;

          //Here we send request for create new user
          //role: 'admin' || 'user'
          //for admin 
          //newUser = {
        //       userName: '...',
        //       password: '...',
        //       role: '...'
        //   }

        //for user 
          //newUser = {
        //       userName: '...',
        //       password: '...',
        //       role: '...',
        // adminId: '...'
        //   }

        const response = await signUpApi.signUpUser(newUser)
        console.log('response', response);
      }

    return (
    <section className='logUp'> 
        <div className='container'>
            <form className ='form-signUp' onSubmit={handleSubmitForm}>
                <h1>Sign Up</h1>
                <div className = 'input-block'>
                    <label 
                    for='logUp' 
                    className = 'title-signUp'>
                        Nickname
                    </label>

                    <input 
                        type='text' 
                        placeholder='Nickname' 
                        value={nicknameValue}
                        name='nicknameValue'
                        onChange={ event => handleChangeSignUpForm(event, 'nicknameValue', 'nicknameError' )}
                        onBlur={ event => handleCheckEmptySignUpForm(event, 'nicknameValue', 'nicknameError')}
                    />
                    {nicknameError === 'empty' && <span className='registration-error'>Enter a nickname</span>}
                    {nicknameError === 'notValid' && <span className='registration-error'>At least 5 symbols and at least 3 letters</span>}
                    {nicknameError === 'alreadyExist' &&  <span className='registration-error'>This nickname is already registered</span>}
                </div>

                <div className = 'input-block'>
                    <label 
                        for='logUp' 
                        className = 'title-signUp'>
                            Log In
                    </label>

                    <input 
                        type='email' 
                        placeholder='Login or email'
                        name= 'loginValue'
                        value={loginValue}
                        onChange={ event => handleChangeSignUpForm(event, 'loginValue', 'loginError' )}
                        onBlur={event => handleCheckEmptySignUpForm(event, 'loginValue', 'loginError')}
                    />
                    {loginError === 'empty' && <span className='registration-error'>Enter login</span>}
                    {loginError === 'notValid' && <span className='registration-error'>Incorrect format</span>}
                    {loginError === 'alreadyExist' &&  <span className='registration-error'>This login is already registered</span>}
                </div>

                <div className = 'input-block'>
                    <label 
                    for='password' 
                    className = 'title-signUp'>
                        Password
                    </label>

                    <input  
                    placeholder='Password' 
                    type= 'text'
				    name='passwordValue'
				    value={passwordValue}
				    onChange={ event => handleChangeSignUpForm(event, 'passwordValue', 'passwordError' )}
				    onBlur={event => handleCheckEmptySignUpForm(event, 'passwordValue', 'passwordError')}
                    />

                    {passwordError === 'empty' && <span className='registration-error'>Enter your password</span>}
				    {passwordError === 'notValid' && <span className='registration-error'>Password must contain at least 5 characters (at least 1 letter and 1 number)</span>}
                </div>

                <div className = 'input-block'>
                    <label 
                        for='password'
                        className = 'title-signUp'>
                            Repeat password
                    </label>

                    <input 
                        placeholder='Password'
                        name='repeatedPasswordValue'
                        type='text'
                        value={repeatedPasswordValue}
                        onChange={ event => handleChangeSignUpForm(event, 'repeatedPasswordValue', 'repeatedPasswordError' )}
                        onBlur={event => handleCheckEmptySignUpForm(event, 'repeatedPasswordValue', 'repeatedPasswordError')}
                        disabled={passwordValue === '' ? true : false}
                    />
                    {repeatedPasswordError === 'empty' && <span className='registration-error'>Repeated passwor</span>}
					{repeatedPasswordError === 'notMatch' && <span className='registration-error'>Passwords must match</span>}
                </div>

                <div className='registration-input'>
                    <div>
                        <label 
                            for='password' 
                            className = 'title-signUp'
					        htmlFor='role-select'>
                                Choose a role
                        </label>
                    </div>

                    <select 
                        className='registration-value'
                        name='selectValue'
                        id='role-select'
                        value={selectValue}
                        onChange={ event => handleChangeSignUpForm(event, 'selectValue', 'selectError' )}
                        onBlur={event => handleCheckEmptySignUpForm(event, 'selectValue', 'selectError')}>

                            <option value='' selected disabled>Please, choose a role</option>
                            <option value='user'>User</option>
                            <option value='administrator'>Administrator</option>

                    </select>
                    {selectError === 'empty' && <span className='registration-error'>Choose a role</span>}
                </div>

                {selectValue === 'administrator' && (
                    <div className='registration'>
                        <label
                            className='title-signUp'
                            htmlFor='administrators'>
                            Choose administrator
                        </label>

                        <select
                            name='administrators'
                            id='role-select'
                            className='registration-value'>
                                <option value='administrator' disabled>
                                    Please, choose administrator
                                </option>
                        </select>
                    </div>
                )}

                <div className='logUp-button'>
                    <input type='submit' value='Sign Up'></input>
                </div>

                <div className ='logIn-signUp'>
                    <Link to={Routes.SignInRoute}>Sign In</Link>
                </div>  
            </form>
        </div>
</section>
)}

export default SignUp;