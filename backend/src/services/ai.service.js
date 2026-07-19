// ==========================================
// File: src/services/ai.service.js
// Kết nối với AI Service Python để dự đoán
// ==========================================

import axios from 'axios';
import logger from '../config/logger.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const AI_TIMEOUT = parseInt(process.env.AI_SERVICE_TIMEOUT) || 30000;

// Tạo axios instance cho AI service
const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: AI_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * DỰ ĐOÁN THỜI GIAN CHỜ HÀNG ĐỢI
 * Gọi AI service để dự đoán
 */
export const predictWaitTime = async (queueData) => {
  try {
    const response = await aiClient.post('/predict', {
      serviceId: queueData.serviceId,
      currentQueueCount: queueData.currentQueueCount || 0,
      hourOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      averageServiceTime: queueData.averageServiceTime || 5,
      staffCount: queueData.staffCount || 1,
      counterCount: queueData.counterCount || 1,
    });

    logger.info(`AI dự đoán thời gian chờ: ${response.data.predictedWaitTime} phút`);

    return response.data;
  } catch (error) {
    logger.error('Lỗi kết nối AI service:', error.message);
    
    // Fallback: dùng công thức đơn giản
    return fallbackPrediction(queueData);
  }
};

/**
 * ĐỊN KIỂM SỨC KHỎE AI SERVICE
 */
export const checkAIServiceHealth = async () => {
  try {
    const response = await aiClient.get('/health');
    return {
      isHealthy: response.status === 200,
      data: response.data,
    };
  } catch (error) {
    logger.warn('AI service không khả dụng:', error.message);
    return {
      isHealthy: false,
      error: error.message,
    };
  }
};

/**
 * HỤT LUYỆN MÔ HÌNH AI
 * Gửi dữ liệu lịch sử để huấn luyện
 */
export const trainAIModel = async (serviceId, historicalData) => {
  try {
    if (!historicalData || historicalData.length === 0) {
      logger.warn('Không có dữ liệu lịch sử để huấn luyện');
      return { success: false, message: 'Không có dữ liệu' };
    }

    // Chuẩn bị dữ liệu
    const formattedData = historicalData.map((item) => ({
      serviceId,
      queueCount: item.queueCount || 0,
      hourOfDay: item.hourOfDay || 0,
      dayOfWeek: item.dayOfWeek || 0,
      averageServiceTime: item.averageServiceTime || 5,
      staffCount: item.staffCount || 1,
      counterCount: item.counterCount || 1,
      actualWaitTime: item.actualWaitTime || 0,
    }));

    const response = await aiClient.post(`/train?service_id=${serviceId}`, formattedData);

    logger.info(`Mô hình AI được huấn luyện cho dịch vụ: ${serviceId}`);

    return response.data;
  } catch (error) {
    logger.error('Lỗi huấn luyện mô hình AI:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * LẤY THÔNG TIN GIỜ CAO ĐIỂM
 */
export const getPeakHours = async (dayOfWeek) => {
  try {
    const response = await aiClient.get(`/peak-hours?day_of_week=${dayOfWeek}`);
    return response.data;
  } catch (error) {
    logger.error('Lỗi lấy thông tin giờ cao điểm:', error.message);
    return null;
  }
};

/**
 * CÔNG THỨC DỰ ĐOÁN ĐƠN GIẢN (FALLBACK)
 * Nếu AI service không khả dụng
 */
export const fallbackPrediction = (queueData) => {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();

  // Hệ số cao điểm
  let peakFactor = 1.0;
  const isPeakHour = isPeak(hour, dayOfWeek);
  if (isPeakHour) {
    peakFactor = 1.5; // +50% trong giờ cao điểm
  }

  // Công thức: (Số hàng / Số counter) * Thời gian phục vụ * Hệ số
  const counterCount = queueData.counterCount || 1;
  const baseWaitTime = (queueData.currentQueueCount / counterCount) * (queueData.averageServiceTime || 5);
  const predictedWaitTime = baseWaitTime * peakFactor;

  return {
    predictedWaitTime: Math.round(predictedWaitTime * 100) / 100,
    confidenceScore: 0.5,
    isPeakHour,
    peakHourIntensity: isPeakHour ? 0.7 : 0.0,
    recommendation: predictedWaitTime > 20 ? 'Mở thêm counter' : 'Bình thường',
  };
};

/**
 * KIỂM TRA GIỜ CAO ĐIỂM
 */
const isPeak = (hour, dayOfWeek) => {
  // Giờ cao điểm: 11-13 và 17-19 vào các ngày thường
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return (hour >= 11 && hour < 13) || (hour >= 17 && hour < 19);
  }
  // Thứ 7-8: 9-11 và 14-16
  return (hour >= 9 && hour < 11) || (hour >= 14 && hour < 16);
};

export default {
  predictWaitTime,
  checkAIServiceHealth,
  trainAIModel,
  getPeakHours,
  fallbackPrediction,
};

// ==========================================
// File: src/controllers/queue.controller.js
// Xử lý các chức năng hàng đợi
// ==========================================

import Queue from '../models/Queue.js';
import Service from '../models/Service.js';
import Counter from '../models/Counter.js';
import Staff from '../models/Staff.js';
import AIPrediction from '../models/AIPrediction.js';
import QueueHistory from '../models/QueueHistory.js';
import { sendSuccess, sendError } from '../utils/response.formatter.js';
import aiService from '../services/ai.service.js';
import logger from '../config/logger.js';
import { Types } from 'mongoose';
import { getIO } from '../config/socket.js';

/**
 * LẤY SỐ HÀNG ĐỢI MỚI
 * POST /api/queues/get-number
 * Khách hàng gọi khi muốn được cấp số thứ tự
 */
export const getQueueNumber = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const customerId = req.user._id;

    if (!serviceId) {
      return sendError(res, new Error('Service ID là bắt buộc'), 400);
    }

    // Kiểm tra dịch vụ
    const service = await Service.findById(serviceId);
    if (!service) {
      return sendError(res, new Error('Dịch vụ không tìm thấy'), 404);
    }

    // Kiểm tra hàng đợi hoạt động của khách hàng
    const activeQueue = await Queue.findOne({
      customerId,
      status: { $in: ['WAITING', 'CALLED', 'IN_PROCESS'] },
    });

    if (activeQueue) {
      return sendError(res, new Error('Bạn đã có hàng đợi đang chờ'), 409);
    }

    // Lấy số hàng đợi tiếp theo
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const serviceCode = service.code;
    const count = await Queue.countDocuments({
      serviceId,
      createdAt: { $gte: today },
    });

    const queueNumber = `${serviceCode}-${String(count + 1).padStart(3, '0')}`;

    // Lấy thông tin counter
    const counters = await Counter.find({ serviceId, isActive: true });
    const staffCount = await Staff.countDocuments({
      assignedCounterId: { $in: counters.map((c) => c._id) },
      isOnDuty: true,
    });

    // Dự đoán thời gian chờ bằng AI
    const currentQueueCount = await Queue.countDocuments({
      serviceId,
      status: { $in: ['WAITING', 'CALLED'] },
    });

    const aiPrediction = await aiService.predictWaitTime({
      serviceId: serviceId.toString(),
      currentQueueCount,
      averageServiceTime: service.estimatedDuration,
      staffCount: staffCount || 1,
      counterCount: counters.length || 1,
    });

    // Tạo hàng đợi
    const newQueue = new Queue({
      _id: new Types.ObjectId(),
      queueNumber,
      serviceId,
      customerId,
      status: 'WAITING',
      estimatedWaitTime: Math.round(aiPrediction.predictedWaitTime),
      phoneNumber: req.user.phoneNumber,
      email: req.user.email,
    });

    await newQueue.save();

    // Lưu dự đoán AI
    const prediction = new AIPrediction({
      _id: new Types.ObjectId(),
      queueId: newQueue._id,
      serviceId,
      predictedWaitTime: aiPrediction.predictedWaitTime,
      confidenceScore: aiPrediction.confidenceScore,
      isPeakHour: aiPrediction.isPeakHour,
      peakHourIntensity: aiPrediction.peakHourIntensity,
      modelVersion: '1.0',
      predictionAlgorithm: 'RandomForest',
    });

    await prediction.save();

    // Ghi lịch sử
    await QueueHistory.create({
      _id: new Types.ObjectId(),
      queueId: newQueue._id,
      newStatus: 'WAITING',
      actionType: 'QUEUE_CREATED',
      notes: `Queue ${queueNumber} được tạo`,
    });

    // Phát sự kiện real-time
    const io = getIO();
    io.emit('queue_created', {
      queueId: newQueue._id,
      queueNumber,
      serviceId,
      estimatedWaitTime: newQueue.estimatedWaitTime,
      isPeakHour: aiPrediction.isPeakHour,
    });

    logger.info(`Hàng đợi được tạo: ${queueNumber}`);

    return sendSuccess(
      res,
      {
        queueId: newQueue._id,
        queueNumber,
        estimatedWaitTime: newQueue.estimatedWaitTime,
        prediction: {
          waitTime: aiPrediction.predictedWaitTime,
          confidence: aiPrediction.confidenceScore,
          isPeakHour: aiPrediction.isPeakHour,
          recommendation: aiPrediction.recommendation,
        },
      },
      'Số hàng đợi được cấp thành công',
      201
    );
  } catch (error) {
    logger.error('Lỗi lấy số hàng đợi:', error);
    return sendError(res, error, 500);
  }
};

/**
 * LẤY TRẠNG THÁI HÀNG ĐỢI HIỆN TẠI
 * GET /api/queues/my-current
 */
export const getCurrentQueue = async (req, res) => {
  try {
    const customerId = req.user._id;

    const queue = await Queue.findOne({
      customerId,
      status: { $in: ['WAITING', 'CALLED', 'IN_PROCESS'] },
    })
      .populate('serviceId', 'name code estimatedDuration')
      .populate('assignedCounterId', 'counterNumber');

    if (!queue) {
      return sendSuccess(res, null, 'Không có hàng đợi hoạt động');
    }

    // Lấy dự đoán
    const prediction = await AIPrediction.findOne({ queueId: queue._id });

    return sendSuccess(
      res,
      {
        ...queue.toObject(),
        prediction,
      },
      'Chi tiết hàng đợi'
    );
  } catch (error) {
    logger.error('Lỗi lấy hàng đợi hiện tại:', error);
    return sendError(res, error, 500);
  }
};

/**
 * HỦY HÀng ĐỢI
 * PATCH /api/queues/:queueId/cancel
 */
export const cancelQueue = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { reason } = req.body;

    const queue = await Queue.findById(queueId);
    if (!queue) {
      return sendError(res, new Error('Hàng đợi không tìm thấy'), 404);
    }

    // Kiểm tra quyền
    if (queue.customerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return sendError(res, new Error('Bạn không có quyền hủy hàng đợi này'), 403);
    }

    const oldStatus = queue.status;
    queue.status = 'CANCELLED';
    queue.cancelledAt = new Date();
    queue.cancellationReason = reason || 'Khách hàng hủy';

    await queue.save();

    // Ghi lịch sử
    await QueueHistory.create({
      _id: new Types.ObjectId(),
      queueId,
      previousStatus: oldStatus,
      newStatus: 'CANCELLED',
      actionType: 'QUEUE_CANCELLED',
      notes: reason || 'Khách hàng hủy',
    });

    // Phát sự kiện real-time
    const io = getIO();
    io.emit('queue_cancelled', {
      queueId,
      queueNumber: queue.queueNumber,
      reason: reason || 'Khách hàng hủy',
    });

    logger.info(`Hàng đợi hủy: ${queue.queueNumber}`);

    return sendSuccess(res, queue, 'Hàng đợi được hủy thành công');
  } catch (error) {
    logger.error('Lỗi hủy hàng đợi:', error);
    return sendError(res, error, 500);
  }
};

/**
 * HẠNG ĐỢI TIẾP THEO (Staff)
 * POST /api/queues/:counterId/call-next
 */
export const callNextQueue = async (req, res) => {
  try {
    const { counterId } = req.params;

    // Lấy counter
    const counter = await Counter.findById(counterId);
    if (!counter) {
      return sendError(res, new Error('Counter không tìm thấy'), 404);
    }

    // Lấy hàng đợi tiếp theo cho dịch vụ này
    const nextQueue = await Queue.findOne({
      serviceId: counter.serviceId,
      status: 'WAITING',
    }).sort({ createdAt: 1 });

    if (!nextQueue) {
      return sendSuccess(res, null, 'Không có hàng đợi chờ');
    }

    // Cập nhật hàng đợi
    nextQueue.status = 'CALLED';
    nextQueue.calledAt = new Date();
    nextQueue.assignedCounterId = counterId;
    nextQueue.assignedStaffId = req.user._id;

    await nextQueue.save();

    // Cập nhật counter
    counter.currentQueueId = nextQueue._id;
    counter.status = 'BUSY';
    await counter.save();

    // Ghi lịch sử
    await QueueHistory.create({
      _id: new Types.ObjectId(),
      queueId: nextQueue._id,
      previousStatus: 'WAITING',
      newStatus: 'CALLED',
      actionType: 'QUEUE_CALLED',
      statusChangedBy: req.user._id,
    });

    // Phát sự kiện real-time
    const io = getIO();
    io.emit('queue_called', {
      queueId: nextQueue._id,
      queueNumber: nextQueue.queueNumber,
      counter: counter.counterNumber,
    });

    logger.info(`Gọi hàng đợi: ${nextQueue.queueNumber} - Counter: ${counter.counterNumber}`);

    return sendSuccess(res, nextQueue, 'Hàng đợi được gọi');
  } catch (error) {
    logger.error('Lỗi gọi hàng đợi:', error);
    return sendError(res, error, 500);
  }
};

/**
 * HOÀN THÀNH HÀNG ĐỢI (Staff)
 * PATCH /api/queues/:queueId/complete
 */
export const completeQueue = async (req, res) => {
  try {
    const { queueId } = req.params;

    const queue = await Queue.findById(queueId);
    if (!queue) {
      return sendError(res, new Error('Hàng đợi không tìm thấy'), 404);
    }

    // Tính thời gian chờ và phục vụ
    const waitTime = queue.calledAt
      ? Math.round((queue.calledAt - queue.createdAt) / (1000 * 60))
      : 0;
    const serviceTime = queue.startedAt
      ? Math.round((new Date() - queue.startedAt) / (1000 * 60))
      : 0;

    const oldStatus = queue.status;
    queue.status = 'COMPLETED';
    queue.startedAt = queue.startedAt || new Date();
    queue.completedAt = new Date();

    await queue.save();

    // Ghi lịch sử
    await QueueHistory.create({
      _id: new Types.ObjectId(),
      queueId,
      previousStatus: oldStatus,
      newStatus: 'COMPLETED',
      actualWaitTimeMinutes: waitTime,
      actualServiceTimeMinutes: serviceTime,
      actionType: 'QUEUE_COMPLETED',
      statusChangedBy: req.user._id,
    });

    // Cập nhật dự đoán (so sánh dự đoán vs thực tế)
    const prediction = await AIPrediction.findOne({ queueId });
    if (prediction) {
      prediction.actualWaitTime = waitTime;
      if (prediction.predictedWaitTime > 0) {
        prediction.predictionAccuracy = (1 - Math.abs(prediction.predictedWaitTime - waitTime) / prediction.predictedWaitTime) * 100;
        prediction.predictionAccuracy = Math.max(0, Math.min(100, prediction.predictionAccuracy));
      }
      await prediction.save();
    }

    // Phát sự kiện real-time
    const io = getIO();
    io.emit('queue_completed', {
      queueId,
      queueNumber: queue.queueNumber,
      waitTime,
      serviceTime,
    });

    logger.info(`Hàng đợi hoàn thành: ${queue.queueNumber} - Thời chờ: ${waitTime}m`);

    return sendSuccess(res, queue, 'Hàng đợi được hoàn thành');
  } catch (error) {
    logger.error('Lỗi hoàn thành hàng đợi:', error);
    return sendError(res, error, 500);
  }
};

export default {
  getQueueNumber,
  getCurrentQueue,
  cancelQueue,
  callNextQueue,
  completeQueue,
};