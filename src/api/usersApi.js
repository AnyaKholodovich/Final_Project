import axios from 'axios';


export const usersApi = {
	getUsers: async (accsesstoken) => {			
		return axios.get('http://localhost:3001/users', {
			headers: {
				authorization: `Bearer ${accsesstoken}`
			}
		})
	},

	getAdmins: async () => {
		return axios.get('http://localhost:3001/admins')
	},

	checkUsersExist: async (body) => {
		return axios.post('http://localhost:3001/user/exists', body)
	}
}