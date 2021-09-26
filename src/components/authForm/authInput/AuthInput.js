import React from 'react';

import '../AuthForm.scss';

const AuthInput = ( 
    inputTitle,
    disabled,
    inputError, 
    matchValidationText,
    inputErrorName, 
    emptyValidationText, 
    invalidValidationText, 
    existsValidationText,  
    inputValue, 
    inputValueName, 
    handleChangeForm, 
    handleCheckEmptySignForm  ) => {

    return (
        <div className = 'input-block'>
        <label 
        for='logUp' 
        className = 'title-signUp'>
            { inputTitle }
        </label>

        <input 
            type='text' 
            placeholder='Nickname' 
            value={inputValue}
            name= { inputValueName }
            onChange={ event => handleChangeForm(event, inputValueName, inputErrorName )}
            onBlur={ event => handleCheckEmptySignForm(event, inputValueName, inputErrorName)}
            disabled = {disabled}
        />
        {inputError === 'empty' && (<span className='registration-error'>  { emptyValidationText } </span>)}
        {inputError === 'notValid' && (<span className='registration-error'> { invalidValidationText } </span>)}
        {inputError === 'alreadyExist' &&  (<span className='registration-error'> { existsValidationText } </span>)}
        {inputError === 'notMatch' && (
        <span className='registration-error'> 
        { matchValidationText } </span>)}
    </div>
    )
}

export default AuthInput;