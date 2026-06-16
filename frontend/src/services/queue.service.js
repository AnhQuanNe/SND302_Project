import API from "./api";

export const getServices = () => API.get("/services");

export const createQueue = (serviceId) =>
  API.post("/queue", { serviceId });

export const getWaitingTime = (serviceId) =>
  API.get(`/ai/predict/${serviceId}`);