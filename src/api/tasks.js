import axios from 'axios';

export const tasksApi = {
	getTasks: async (accsesstoken) => {
		return axios.get('http://localhost:3001/tasks', {
			headers: {
				authorization: `Bearer ${accsesstoken}`
			}
		})
	},

	getTasksForAdmin: async (accsesstoken, id) => {
		return axios.get(`http://localhost:3001/tasks/${id}`, {
			headers: {
				authorization: `Bearer ${accsesstoken}`
			}
		})
	}
}