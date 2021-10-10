import React from 'react';

import './AuthForm.scss';

const AuthInput = ( 
    {inputTitle,
    disabled,
    inputError, 
    matchValidationText,
    inputErrorName, 
    emptyValidationText, 
    invalidValidationText, 
    existsValidationText,  
    inputValue, 
    inputValueName,
    inputType,
    inputplaceholder, 
    handleChangeForm, 
    handleCheckValidForm}  ) => {

    return (
        <div className = 'input-block'>
            {/* <label 
            for='logUp' 
            className = 'title-sign'>
                { inputTitle }
            </label> */}

            <input 
                type = { inputType }
                placeholder= { inputplaceholder }
                value = { inputValue }
                name = { inputValueName }
                onChange={ event => handleChangeForm(event, inputValueName, inputErrorName )}
                onBlur={ event => handleCheckValidForm(event, inputValueName, inputErrorName)}
                disabled = {disabled}
            />
            <div className='registration-error'>
            {inputError === 'empty' && (<span>  { emptyValidationText } </span>)}
            {inputError === 'notValid' && (<span> { invalidValidationText } </span>)}
            {inputError === 'alreadyExist' &&  (<span> { existsValidationText } </span>)}
            {inputError === 'notMatch' && (
            <span className='registration-error'> { matchValidationText } </span>)}
            </div>
            
        </div>
    )
}

export default AuthInput;