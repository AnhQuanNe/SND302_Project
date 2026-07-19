import API from "./api";


// ==============================
// Counter Management (Admin)
// ==============================


// Lấy danh sách tất cả quầy
export const getCounters = () =>
  API.get("/counters");


// Lấy thông tin chi tiết một quầy
export const getCounterDetail = (counterId) =>
  API.get(`/counters/${counterId}`);


// Tạo quầy mới
export const createCounter = (data) =>
  API.post("/counters/newCounter", data);


// Cập nhật thông tin quầy
export const updateCounter = (counterId, data) =>
  API.put(`/counters/${counterId}`, data);


// Phân công nhân viên vào quầy
export const assignStaff = (counterId, staffId) =>
  API.put(`/counters/${counterId}/assign-staff`, {
    staffId
  });


// Khóa quầy (Soft delete)
export const disableCounter = (counterId) =>
  API.delete(`/counters/${counterId}`);