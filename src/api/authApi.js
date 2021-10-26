import axios from 'axios';

export const authApi = {
	signUpUser: async (body) => {
		return axios.post('http://localhost:3001/signUp', body)
	},

	signInUser: async (body) => {
		return axios.post('http://localhost:3001/signIn', body)
	}
}