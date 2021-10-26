import { combineReducers } from 'redux';

import { toDoAppReducer } from './toDoAppReducer'

const rootReducer = combineReducers({ toDoAppReducer });

export default rootReducer;