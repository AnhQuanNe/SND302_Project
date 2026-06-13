import jwt from "jsonwebtoken";

// Generate Access Token
export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn:
                process.env.JWT_EXPIRES_IN || "1d",
        }
    );
};

// Verify Token
export const verifyToken = (token) => {
    try {
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

// Decode Token
export const decodeToken = (token) => {
    return jwt.decode(token);
};