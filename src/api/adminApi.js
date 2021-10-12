import axios from 'axios'

export const adminApi = {

	getUsersForAdmin: (options) => {
		return axios.get('http://localhost:3001/users', options)
	},

	GetTasksUserForAdmin: (url, options) => {
		return axios.get(url, options)
	}
}