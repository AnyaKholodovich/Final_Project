import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../SignUp/SignUp.scss';

import { authApi } from '../../../api/authApi';
import { usersApi } from '../../../api/usersApi';
import { Routes } from '../../../utils/routes';


const SignUp = () => {
    const [signUpForm, setSignUpForm] = useState({
        userNameValue: '',
        loginValue: '',
        passwordValue: '',
        repeatedPasswordValue: '',
        selectRoleValue: '',
        selectAdminValue: ''
      });
     
      const [signUpFormError, setSignUpFormError] = useState({
        userNameError: '',
        loginError: '',
        passwordError: '',
        repeatedPasswordError: '',
        selectRoleError: '',
        selectAdminError: ''
      });
    
      const { 
          userNameValue, 
          loginValue, 
          passwordValue, 
          repeatedPasswordValue, 
          selectRoleValue,
          selectAdminValue
        } = signUpForm;

      const { 
          userNameError, 
          loginError, 
          passwordError, 
          repeatedPasswordError, 
          selectRoleError,
          selectAdminError
        } = signUpFormError;
    

        const [admins, setAdmins] = useState([])

        useEffect(()=> {
            getAdminsList()
        }, [])

        const getAdminsList = () => {
            usersApi.getAdmins()
            .then(res => {
                const adminsList = res.data
                setAdmins(adminsList)

            })
        }

        const handleChangeRole = (event, inputName, errorName) => {
        const { value } = event.target
        if(value === 'admin') {
            const signUpFormErrorCopy = {...signUpFormError}
            signUpFormErrorCopy['selectAdminError'] = ''
            setSignUpFormError(signUpFormErrorCopy)
        }
        handleChangeSignUpForm (event, inputName, errorName)
        }

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

      const handleCheckValidNickname = async (signUpFormErrorCopy) => {
        const minLetters = /(?=(?:.*[a-zA-Z]){3,})/;
            if(!minLetters.test(userNameValue) || !(userNameValue.length >= 5)){
                signUpFormErrorCopy['userNameError'] = 'notValid';
        } else {
            await handleCheckUserExists(signUpFormError, 'userName', userNameValue, 'userNameError')
        }
      }	

      const handleCheckUserExists = async (signUpFormErrorCopy, fieldName, fielValue, errorName) => {
          const body = {}
          body[fieldName] = fielValue;
          console.log('handleCheckUserExists', body);
          return usersApi.ckeckUsersExists(body)
          .then(res => {
              const { data } = res
              if(data.exists) {
                signUpFormErrorCopy[errorName] = 'alredyExist' 
              }
          })
      }
    
      const handleCheckValidEmail = async (signUpFormErrorCopy) => {
    
        const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
        if(!mailRegex.test(loginValue) && loginValue !== ''){
    
            signUpFormErrorCopy['loginError'] = 'notValid';
        } else {
            await handleCheckUserExists(signUpFormErrorCopy, 'login', userNameValue, 'loginError')
        }
      }
    
      const handleCheckValidPassword = (signUpFormErrorCopy) => {
    
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    
        if (!passwordRegex.test(passwordValue) && passwordValue !== ''){
            signUpFormErrorCopy['passwordError'] = 'notValid'
        }
      }
    
    
      const handleCheckPasswordMatch = (signUpFormErrorCopy) => {
    
        if (repeatedPasswordValue !== passwordValue && repeatedPasswordValue !== ''){
            signUpFormErrorCopy['repeatedPasswordError'] = 'notMatch'
        }
      }

      const handleCheckValidInput = async (inputName, signUpFormErrorCopy) => {
          if (inputName !== ''){
              switch(inputName){
                case 'userNameValue':
                    await handleCheckValidNickname(signUpFormErrorCopy);
                    break

                case 'loginValue':
                    await handleCheckValidEmail(signUpFormErrorCopy);
                break

                case 'passwordValue':
                    handleCheckValidPassword(signUpFormErrorCopy);
                    break

                case 'repeatedPasswordValue':
                    handleCheckPasswordMatch(signUpFormErrorCopy);
                break

                    default:
                        console.log('Input with this name is not exists');
              }
          }
      }
    
      const handleCheckEmptySignUpForm = async (
          event = {}, 
          inputName = '', 
          errorName =''
        ) => {
        const signUpFormCopy = {...signUpForm};
        const signUpFormErrorCopy = {...signUpFormError};
    
        let resultCheckEmpty = false;
        
        await handleCheckValidInput(inputName, signUpFormErrorCopy)
    
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

            if(selectRoleValue === 'admin') {
                valuesNameForm.pop()
                errorNameForm.pop()
            }

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
        const isFormInValid = await handleCheckEmptySignUpForm()
    
          if(isFormInValid){
              console.log('isFormInValid', isFormInValid);
              return;
          }

          const newUser ={
            userName: userNameValue,
            login: loginValue,
            password: passwordValue,
            role: selectRoleValue
          }

        const response = await authApi.signUpUser(newUser)
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
                        value={userNameValue}
                        name='userNameValue'
                        onChange={ event => handleChangeSignUpForm(event, 'userNameValue', 'userNameError' )}
                        onBlur={ event => handleCheckEmptySignUpForm(event, 'userNameValue', 'userNameError')}
                    />
                    {userNameError === 'empty' && <span className='registration-error'>Enter a nickname</span>}
                    {userNameError === 'notValid' && <span className='registration-error'>At least 5 symbols and at least 3 letters</span>}
                    {userNameError === 'alreadyExist' &&  <span className='registration-error'>This nickname is already registered</span>}
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
                        name='selectRoleValue'
                        id='role-select'
                        value={selectRoleValue}
                        onChange={ (event) => 
                            handleChangeRole (event, 'selectRoleValue', 'selectRoleError' )
                        }

                        onBlur={event => handleCheckEmptySignUpForm(event, 'selectRoleValue', 'selectRoleError')}>

                            <option value='' selected disabled>Please, choose a role</option>
                            <option value='user'>User</option>
                            <option value='admin'>Administrator</option>

                    </select>
                    {selectRoleError === 'empty' && (<span className='registration-error'>Choose a role</span>)}
                </div>

                {selectRoleValue === 'user' && (
                    <div className='registration'>
                        <label
                            className='title-signUp'
                            htmlFor='administrator'>
                            Choose administrator
                        </label>

                        <select
                            className={selectAdminValue}
                            name='selectAdminValue'
                            id='role-select'
                            value={selectAdminValue}
                            onChange={ event => handleChangeSignUpForm(event, 'selectAdminValue', 'selectAdminError' )}
                            onBlur={event => handleCheckEmptySignUpForm(event, 'selectAdminValue', 'selectAdminError')}>    
                                <option value='' disabled>
                                    Please, choose administrator
                                </option>

                            {
                                admins.map(admin => {
                                    const {_id, userName, login } = admin
                                    return <option value = {_id}>{`${userName}, ${login}`}</option> 
                                })
                            }
                        </select>
                        {selectAdminError === 'empty' && (<span className='registration-error'>Choose administrator</span>)}
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