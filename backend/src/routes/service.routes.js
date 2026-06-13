import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json([
        {
            id: 1,
            name: "General Consultation"
        },
        {
            id: 2,
            name: "Blood Test"
        },
        {
            id: 3,
            name: "Vaccination"
        }
    ]);
});

export default router;