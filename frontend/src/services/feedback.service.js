import api from "./api";

const BASE = "/feedback";

export const submitFeedback = async (data) => {
    const response = await api.post(BASE, data);
    return response.data;
};

export const getAllFeedback = async() => {
    const response = await api.get(BASE);
    return response.data;
}

