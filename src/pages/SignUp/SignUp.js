import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './SignUp.scss';

import AuthInput from '../../components/authForm/authInput/AuthInput';
import { authApi } from '../../api/authApi';
import { usersApi } from '../../api/usersApi';
import { Routes } from '../../utils/routes';


const SignUp = () => {
    const [signUpForm, setSignUpForm] = useState({
        nickNameValue: '',
        loginValue: '',
        passwordValue: '',
        repeatedPasswordValue: '',
        selectRoleValue: '',
        selectAdminValue: ''
      });
     
      const [signUpFormError, setSignUpFormError] = useState({
        nickNameError: '',
        loginError: '',
        passwordError: '',
        repeatedPasswordError: '',
        selectRoleError: '',
        selectAdminError: ''
      });
    
      const { 
          nickNameValue, 
          loginValue, 
          passwordValue, 
          repeatedPasswordValue, 
          selectRoleValue,
          selectAdminValue
        } = signUpForm;

      const { 
          nickNameError, 
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
            if(!minLetters.test(nickNameValue) || !(nickNameValue.length >= 5)){
                signUpFormErrorCopy['nickNameError'] = 'notValid';
        } else {
            await handleCheckUserExists(signUpFormError, 'userName', nickNameValue, 'nickNameError')
        }
      }	

    //   const handleCheckUserExists = async (signUpFormErrorCopy, fieldName, fielValue, errorName) => {
    //       const body = {}
    //       body[fieldName] = fielValue;
    //       return usersApi.ckeckUsersExist(body) 
    //       .then(res => {
    //           const { data } = res
    //           if(data.exists) {
    //             signUpFormErrorCopy[errorName] = 'alredyExist' 
    //           }
    //       })
    //   }

    const handleCheckUserExists = async (fieldName, fieldValue) => {
		const body = {};
		body[fieldName] = fieldValue;

		return usersApi.checkUsersExist(body)
	}
    
      const handleCheckValidEmail = async (signUpFormErrorCopy) => {
    
        const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
        if(!mailRegex.test(loginValue) && loginValue !== ''){
    
            signUpFormErrorCopy['loginError'] = 'notValid';
        } else {
            await handleCheckUserExists(signUpFormErrorCopy, 'login', nickNameValue, 'loginError')
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
                case 'nickNameValue':
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
            userName: nickNameValue,
            login: loginValue,
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
            <form className ='form' onSubmit={handleSubmitForm}>
                <h1 className ='logUp-title'>Sign Up</h1>

                <AuthInput inputTitle = 'Nickname'
                    disabled= {false}
                    inputplaceholder = 'Nickname'
                    inputValueName = 'nickNameValue'
                    inputType ='text'
                    inputErrorName = 'nickNameError'
                    inputValue = { nickNameValue }
                    inputError = { nickNameError }
                    
                    emptyValidationText = 'Enter nickname, please'
                    invalidValidationText = 'Nickname format is incorrect'  
                    existsValidationText = 'This nickname has already been registered' 
                    matchValidationText = ''
                    handleChangeForm = { handleChangeSignUpForm }
                    handleCheckValidForm = { handleCheckEmptySignUpForm } 
                />

                <AuthInput inputTitle = 'Login'
                    disabled= {false}
                    inputplaceholder = 'Login'
                    inputValueName = 'loginValue'
                    inputType ='text'
                    inputErrorName = 'loginError'
                    inputValue = { loginValue }
                    inputError = { loginError }
                    emptyValidationText = 'Enter login, please'
                    invalidValidationText = 'Incorrect format'  
                    matchValidationText = ''
                    existsValidationText = 'This login is already registered' 
                    handleChangeForm = { handleChangeSignUpForm }
                    handleCheckValidForm = { handleCheckEmptySignUpForm } 
                />

                    <AuthInput inputTitle = 'Password'
                        disabled= {false}
                        inputplaceholder = 'Password'
                        inputType ='text'
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

                        <AuthInput inputTitle = 'Repeat password'
                            disabled={passwordValue === '' ? true : false}
                            inputType ='text'
                            inputplaceholder = 'Repeat password'
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

                        onBlur={event => handleCheckEmptySignUpForm(event, 'selectRoleValue', 'selectRoleError')}>

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
                        </select> </div>
                        <div className='registration-error'>{selectAdminError === 'empty' && (<span >Choose administrator</span>)}</div>
                    </div>
                )}

                <div className='button'>
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