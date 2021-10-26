export const signIn = data => {
	return {
		type: 'SIGN_IN',
		payload: data
	}
}

export const addUsersList = data => {
	return {
		type: 'ADD_USERS_LIST',
		payload: data
	}
}

export const addTasksList = data => {
	return {
		type: 'ADD_TASKS_LIST',
		payload: data
	}
}