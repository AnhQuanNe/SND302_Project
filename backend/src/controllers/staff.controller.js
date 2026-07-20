import {
  callNextQueue,
  completeQueue,
  getCurrentQueue,
  skipQueue,
  recallQueue,
  updateCounterStatus,
  getCounterInfo,
  getSkippedQueues,
  getQueueHistory,
} from "../services/staff.service.js";

/**
 * Gọi khách tiếp theo
 * POST /api/staff/next
 */
export const nextQueue = async (req, res) => {
  try {
    // ID của staff lấy từ middleware xác thực
    const staffId = req.user.id;

    const queue = await callNextQueue(staffId);

    return res.status(200).json({
      success: true,
      message: "Gọi khách tiếp theo thành công.",
      data: queue,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Hoàn thành hàng chờ
 * PUT /api/staff/complete/:queueId
 */
export const completeCurrentQueue = async (req, res) => {
  try {
    const { queueId } = req.params;

    const queue = await completeQueue(queueId, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Hoàn thành phục vụ thành công.",
      data: queue,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy hàng chờ đang phục vụ
 * GET /api/staff/current
 */
export const currentQueue = async (req, res) => {
  try {
    const queue = await getCurrentQueue(req.user.id);

    return res.status(200).json({
      success: true,
      message: queue
        ? "Lấy hàng chờ hiện tại thành công."
        : "Hiện tại chưa có khách đang phục vụ.",
      data: queue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Bỏ qua hàng chờ hiện tại
 * PUT /api/staff/skip/:queueId
 */
export const skipCurrentQueue = async (req, res) => {
  try {
    const { queueId } = req.params;

    const queue = await skipQueue(queueId, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Đã bỏ qua hàng chờ.",
      data: queue,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gọi lại hàng chờ đã Skip
 * PUT /api/staff/recall/:queueId
 */
export const recallSkippedQueue = async (req, res) => {
  try {
    const { queueId } = req.params;

    const queue = await recallQueue(queueId, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Gọi lại hàng chờ thành công.",
      data: queue,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Cập nhật trạng thái quầy
 * PUT /api/staff/counter/status
 */
export const updateCounter = async (req, res) => {
  try {
    const { status } = req.body;

    const counter = await updateCounterStatus(
      req.user.id,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái quầy thành công.",
      data: counter,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy thông tin quầy của nhân viên
 * GET /api/staff/counter
 */
export const getCounter = async (req, res) => {
  try {
    const counter = await getCounterInfo(req.user.id);

    return res.status(200).json({
      success: true,
      data: counter,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSkippedQueuesList = async (req, res) => {
  try {
    const queues = await getSkippedQueues(req.user.id);

    return res.status(200).json({
      success: true,
      data: queues,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await getQueueHistory(req.user.id);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};