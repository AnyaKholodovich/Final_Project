import jwt  from 'jsonwebtoken';

import { getCookie } from "../../utils/getCookies";


	const token = getCookie('authorization')
	const decodedData = jwt.decode(token) || { role: '', id: '' }
	const { role, id: userId } = decodedData

const initialState = { 
	token: token,
	 role: role, 
	 userId: userId, 
	 tasksList: [], 
	 usersList: []
};

export const authReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'SIGN_IN':
			return { ...state, ...payload }

		case 'ADD_USERS_LIST':
			return { ...state, usersList: payload }
	
		case 'ADD_TASKS_LIST':
			console.log('ADD_TASKS_LIST', action.payload)
			return { ...state, tasksList: payload }

		default:
			return { ...state };

	}
}