import { getCookie } from "../../utils/getCookies";
import jwt  from 'jsonwebtoken';

	const token = getCookie('authorization')
	const decodedData = jwt.decode(token) || { role: '', id: '' }
	const { role, id: userId } = decodedData

const initialState = { token, role, userId }

export const authReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'SIGN_IN':
			return { ...state, ...payload }
		
		default:
			return { ...state };

	}
}