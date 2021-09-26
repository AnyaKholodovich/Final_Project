import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../SignUp/SignUp.scss';

import { AuthInput } from '../../authForm';
import { authApi } from '../../../api/authApi';
import { usersApi } from '../../../api/usersApi';
import { Routes } from '../../../utils/routes';


const SignUp = () => {
    const [signUpForm, setSignUpForm] = useState({
        userNameValue: '',
        nickNameValue: '',
        passwordValue: '',
        repeatedPasswordValue: '',
        selectRoleValue: '',
        selectAdminValue: ''
      });
     
      const [signUpFormError, setSignUpFormError] = useState({
        userNameError: '',
        nickNameError: '',
        passwordError: '',
        repeatedPasswordError: '',
        selectRoleError: '',
        selectAdminError: ''
      });
    
      const { 
          userNameValue, 
          nickNameValue, 
          passwordValue, 
          repeatedPasswordValue, 
          selectRoleValue,
          selectAdminValue
        } = signUpForm;

      const { 
          userNameError, 
          nickNameError, 
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
    
        if(!mailRegex.test(nickNameValue) && nickNameValue !== ''){
    
            signUpFormErrorCopy['nickNameError'] = 'notValid';
        } else {
            await handleCheckUserExists(signUpFormErrorCopy, 'login', userNameValue, 'nickNameError')
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

                case 'nickNameValue':
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
            login: nickNameValue,
            password: passwordValue,
            role: selectRoleValue
          }

          if(selectRoleValue === 'user') {
            newUser.admin = selectAdminValue
          }

        const response = await authApi.signUpUser(newUser)
        console.log('response', response);
      }

      const roleSelectOption = () => {
          return (
              <>
                <option value='' selected disabled>Please, choose a role</option>
                <option value='user'>User</option>
                <option value='admin'>Administrator</option>
              </>
          )
      }

    return (
    <section className='logUp'> 
        <div className='container'>
            <form className ='form-signUp' onSubmit={handleSubmitForm}>
                <h1>Sign Up</h1>

                <AuthInput inputTitle = 'Nickname'
                    disabled= {false}
                    inputValueName = 'nicknameValue'
                    inputErrorName = 'nicknameError'
                    inputValue = { userNameValue }
                    inputError = { userNameError }
                    emptyValidationText = 'enter nickname, please'
                    invalidValidationText = 'nickname format is incorrect'  
                    existsValidationText = 'This nickname has already been registered' 
                    matchValidationText = ''
                    handleChangeForm = { handleChangeSignUpForm }
                    handleCheckValidForm = { handleCheckEmptySignUpForm } 
                />

                <AuthInput inputTitle = 'Log In'
                    disabled= {false}
                    inputValueName = 'nicknameValue'
                    inputErrorName = 'nicknameError'
                    inputValue = { nickNameValue }
                    inputError = { nickNameError }
                    emptyValidationText = 'Enter login, please'
                    invalidValidationText = 'Incorrect format'  
                    matchValidationText = ''
                    existsValidationText = 'This login is already registered' 
                    handleChangeForm = { handleChangeSignUpForm }
                    handleCheckValidForm = { handleCheckEmptySignUpForm } 
                />

                {/* <div className = 'input-block'>
                    <label 
                        for='logUp' 
                        className = 'title-signUp'>
                            Log In
                    </label>

                    <input 
                        type='text' 
                        placeholder='Login or email'
                        name= 'nickNameValue'
                        value={nickNameValue}
                        onChange={ event => handleChangeSignUpForm(event, 'nickNameValue', 'nickNameError' )}
                        onBlur={event => handleCheckEmptySignUpForm(event, 'nickNameValue', 'nickNameError')}
                    />
                    {nickNameError === 'empty' && <span className='registration-error'>Enter login</span>}
                    {nickNameError === 'notValid' && <span className='registration-error'>Incorrect format</span>}
                    {nickNameError === 'alreadyExist' &&  <span className='registration-error'>This login is already registered</span>}
                </div> */}

                    <AuthInput inputTitle = 'Password'
                        disabled= {false}
                        inputValueName = 'passwordValue'
                        inputErrorName = 'passwordError'
                        inputValue = { passwordValue }
                        inputError = { passwordError }
                        emptyValidationText = 'Enter your password, please'
                        invalidValidationText = 'Password must contain at least 5 characters (at least 1 letter and 1 number)'  
                        existsValidationText = '' 
                        matchValidationText = ''
                        handleChangeForm = { handleChangeSignUpForm }
                        handleCheckValidForm = { handleCheckEmptySignUpForm } 
                />

                {/* <div className = 'input-block'>
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
                </div> */}

                        <AuthInput inputTitle = 'Repeat password'
                            disabled={passwordValue === '' ? true : false}
                            inputValueName = 'repeatedPasswordValue'
                            inputErrorName = 'repeatedPasswordError'
                            inputValue = { repeatedPasswordValue }
                            inputError = { repeatedPasswordError }
                            emptyValidationText = 'Repeated your password, please'
                            invalidValidationText = ''  
                            existsValidationText = '' 
                            matchValidationText = 'Passwords must match'
                            handleChangeForm = { handleChangeSignUpForm }
                            handleCheckValidForm = { handleCheckEmptySignUpForm } 
                />

                {/* <div className = 'input-block'>
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
                </div> */}

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

                        {roleSelectOption()}
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