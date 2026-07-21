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

// ================= ADMIN =================
// Lấy danh sách queue (có filter, search, pagination)
export const getAllQueues = (params) =>
  API.get("/queue/admin", { params });

// Thống kê queue
export const getQueueStatistics = () =>
  API.get("/queue/admin/statistics");

// Chi tiết queue
export const getQueueDetail = (id) =>
  API.get(`/queue/admin/${id}`);

// Cập nhật trạng thái
export const updateQueueStatus = (id, status) =>
  API.patch(`/queue/admin/${id}/status`, { status });

// Chuyển queue
export const transferQueue = (id, data) =>
  API.patch(`/queue/admin/${id}/transfer`, data);

// ================= AI =================
export const getWaitingTime = (serviceId) =>
  API.get(`/ai/predict/${serviceId}`);