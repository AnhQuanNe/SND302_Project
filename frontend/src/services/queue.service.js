import API from "./api";

export const getServices = () => API.get("/services?isActive=true");

export const createQueue = (serviceId) =>
  API.post("/queue", { serviceId });

// 🔥 SỬA Ở ĐÂY
export const getMyQueue = () =>
  API.get("/queue/my");

// 🔥 SỬA Ở ĐÂY
export const cancelQueue = (queueId) =>
  API.delete(`/queue/${queueId}`);

export const getWaitingTime = (serviceId) =>
  API.get(`/ai/predict/${serviceId}`);