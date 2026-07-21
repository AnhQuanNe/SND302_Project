import mongoose from "mongoose";
import dotenv from "dotenv";
import QueueHistory from "./src/models/QueueHistory.js";

dotenv.config();

const seedQueueHistory = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const data = [];

    for (let i = 0; i < 3000; i++) {
      const queueLength = Math.floor(Math.random() * 30) + 1;
      const averageServiceTime = Math.floor(Math.random() * 16) + 5;
      const staffCount = Math.floor(Math.random() * 5) + 1;
      const counterCount = Math.floor(Math.random() * 4) + 1;
      const hourOfDay = Math.floor(Math.random() * 24);
      const dayOfWeek = Math.floor(Math.random() * 7);

      const isPeakHour =
        (hourOfDay >= 11 && hourOfDay <= 13) ||
        (hourOfDay >= 17 && hourOfDay <= 19);

      const peakIntensity = isPeakHour ? 1 : 0;

      const baseWaitTime =
        (queueLength * averageServiceTime) /
        Math.max(staffCount, counterCount);

      const peakExtra = isPeakHour
        ? Math.random() * 15 + 5
        : Math.random() * 5;

      const noise = Math.random() * 8 - 4;

      const actualWaitTime = Math.max(
        1,
        baseWaitTime + peakExtra + noise
      );

      data.push({
        queueId: new mongoose.Types.ObjectId(),
        serviceId: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        staffId: new mongoose.Types.ObjectId(),
        counterId: new mongoose.Types.ObjectId(),

        queueNumber: i + 1,

        queueLength,
        currentQueueCount: queueLength,
        averageServiceTime,
        staffCount,
        counterCount,
        hourOfDay,
        dayOfWeek,
        isPeakHour,
        peakIntensity,
        actualWaitTime: Number(actualWaitTime.toFixed(2)),
      });
    }

    await QueueHistory.insertMany(data);

    console.log(`Inserted ${data.length} QueueHistory records`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedQueueHistory();