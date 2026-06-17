// import axios from "axios";

// const API =
//   "http://localhost:5000/api/auth";

// export const login = (data) =>
//   axios.post(`${API}/login`, data);

// export const register = (data) =>
//   axios.post(`${API}/register`, data);
import API from "./api";

const BASE = "/auth";

export const login = (data) =>
  API.post(`${BASE}/login`, data);

export const register = (data) =>
  API.post(`${BASE}/register`, data);
