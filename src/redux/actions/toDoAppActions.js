// export const restoreAuth = data => {
// 	return {
// 		type: 'RESTORE_AUTH',
// 		payload: data
// 	}
// }


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

export const addUserSearch = data => {
	return {
		type: 'ADD_USER_SEARCH',
		payload: data
	}
}

export const addUsersSearchList = data => {
	return {
		type: 'ADD_USERS_SEARCH_LIST',
		payload: data
	}
}

export const addTasksList = data => {
	return {
		type: 'ADD_TASKS_LIST',
		payload: data
	}
}