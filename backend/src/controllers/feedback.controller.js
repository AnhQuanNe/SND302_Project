import mongoose from "mongoose";
import { createFeedback, getAllFeedbacks } from "../services/feedback.service.js";

const createFeedbacks = async (req, res) => {
    try {
        const { userId, name, email, rating, subject, comment } = req.body;

        // 1. Validate bắt buộc
        if (!name || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields (name, rating, comment)"
            });
        }

        // 2. Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // 3. Validate ObjectId (userId nếu có)
        if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid userId"
            });
        }

        const feedback = await createFeedback({
            userId: userId || null,
            name,
            email,
            rating,
            subject,
            comment
        });

        return res.status(201).json({
            success: true,
            data: feedback
        });

    } catch (error) {
        console.log("🔥 Feedback Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllFeedback = async(req, res) => {
    try{
        const feedbacks = await getAllFeedbacks();

        res.status(200).json({
            success: true,
            data: feedbacks
        });
    }catch (error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {createFeedbacks, getAllFeedback};