import axios from 'axios'

export const signUpApi = {
    signUpUser: async (body) => {
        return axios.post('http:localhost:3001/signUp', body)
    }
}