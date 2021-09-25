import axios from 'axios'

export const usersApi = {

    getAdmins: async()=>{
        return  axios.get('http://localhost:3001/admins')
    },
    
    ckeckUsersExists: async (body) => {
        return  axios.post('http://localhost:3001/user/exists', body)
    }
}