import api from "./api";

const loginWithPassword = async (data) => {
    try {
        const res = await api.post('auth/login-via-password', data)
        return res
    } catch (error) {
        throw error?.response
    }
}

const registerWithPassword = async (data) => {
    try {
        const res = await api.post('auth/signup', data);
        return res.data;
    } catch (error) {
        throw error?.response
    }
}

const validateToken = async () => {
    try {
        const res = await api.get('/auth/validate-token');
        return res?.data
    } catch (error) {
        console.log(error.response)
        throw error?.response
    }
}

export {
    loginWithPassword,
    registerWithPassword,
    validateToken
}