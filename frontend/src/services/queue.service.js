import axios from "axios";

export const getServices = () =>
  axios.get("http://localhost:5000/api/services"); // ❌ không dùng api

export const createQueue = (serviceId) =>
  axios.post("http://localhost:5000/api/queue", { serviceId });

export const getWaitingTime = (serviceId) =>
  axios.get(`http://localhost:5000/api/ai/predict/${serviceId}`);