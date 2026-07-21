import axios from "axios";

const AI_URL = "http://localhost:8000";

export const predictWaitTime = async (data) => {
    const res = await axios.post(`${AI_URL}/predict`, data);
    return res.data;
};