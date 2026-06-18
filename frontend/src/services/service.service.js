import API from "./api";

const BASE = "/services";

export const getServices = () => API.get(BASE);

export const createService = (data) => API.post(BASE, data);

export const updateService = (id, data) => API.put(`${BASE}/${id}`, data);

export const deleteService = (id) => API.delete(`${BASE}/${id}`);
