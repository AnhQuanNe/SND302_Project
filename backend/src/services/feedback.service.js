import Feedback from "../models/Feedback.js";

const createFeedback = async (data) => {
    try {
        return await Feedback.create(data);
    } catch (error) {
        console.log("Mongo Create Error:", error);
        throw error;
    }
};
const getAllFeedbacks = async () => {
    return await Feedback.find()
        .sort({ createdAt: -1 });
};

export {
    createFeedback,
    getAllFeedbacks
};