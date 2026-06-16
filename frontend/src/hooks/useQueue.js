import { useState } from "react";
import * as queueService from "../services/queueService";

export const useQueue = () => {
  const [queue, setQueue] = useState(null);
  const [waitingTime, setWaitingTime] = useState(null);

  const createNewQueue = async (serviceId) => {
    const res = await queueService.createQueue(serviceId);
    setQueue(res.data);
  };

  const fetchWaitingTime = async (serviceId) => {
    const res = await queueService.getWaitingTime(serviceId);
    setWaitingTime(res.data.predictedTime);
  };

  return {
    queue,
    waitingTime,
    createNewQueue,
    fetchWaitingTime,
  };
};