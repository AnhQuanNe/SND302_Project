import API from "./api";

// ==============================
// Queue
// ==============================

// Gọi khách tiếp theo
export const callNextQueue = () =>
  API.post("/staff/next");

// Lấy hàng chờ đang phục vụ
export const getCurrentQueue = () =>
  API.get("/staff/current");

// Hoàn thành hàng chờ
export const completeQueue = (queueId) =>
  API.put(`/staff/complete/${queueId}`);

// Bỏ qua hàng chờ
export const skipQueue = (queueId) =>
  API.put(`/staff/skip/${queueId}`);

// Gọi lại hàng chờ đã Skip
export const recallQueue = (queueId) =>
  API.put(`/staff/recall/${queueId}`);

// Lấy danh sách hàng chờ đã skip
export const getSkippedQueues = () =>
  API.get("/staff/skipped");

// Lấy lịch sử phục vụ của staff
export const getStaffHistory = () =>
  API.get("/staff/history");

// Lấy danh sách khách Waiting/Cancelled
export const getWaitingQueues = () =>
  API.get("/staff/waiting");

// ==============================
// Counter
// ==============================

// Lấy thông tin quầy của Staff
export const getCounterInfo = () =>
  API.get("/staff/counter");

// Cập nhật trạng thái quầy
export const updateCounterStatus = (status) =>
  API.put("/staff/counter/status", { status });