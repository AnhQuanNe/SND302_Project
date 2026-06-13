import api from "../api/api";

const register = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
}

const login = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
}

export default {register, login};