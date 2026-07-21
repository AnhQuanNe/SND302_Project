import axios from "axios";

const AI_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8000";

export const predictWaitTime = async (body) => {
  try {
    console.log("AI URL:", AI_URL);
    console.log("SEND TO AI:", body);

    const res = await axios.post(`${AI_URL}/predict`, body, {
      timeout: 30000,
    });

    console.log("AI RESPONSE:", res.data);

    return res.data;
  } catch (err) {
    console.log("========== AI ERROR ==========");
    console.log("Message:", err.message);
    console.log("Code:", err.code);
    console.log("URL:", err.config?.url);
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);

    return {
      predictedWaitTime: null,
    };
  }
};