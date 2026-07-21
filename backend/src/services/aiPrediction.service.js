import axios from "axios";

export const predictWaitTime = async (body) => {
    try {

        console.log("SEND TO AI:");
        console.log(body);

        const res = await axios.post(
            "http://localhost:8000/predict",
            body
        );

        console.log("AI RESPONSE:");
        console.log(res.data);

        return res.data;

    } catch (err) {

        console.log("AI ERROR");
        console.log(err.response?.data);
        console.log(err.response?.status);
        console.log(err.message);

        return {
            predictedWaitTime: null
        };
    }
};