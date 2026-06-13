import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

//Generate Access Token
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

//Verify Token
export const verifyToken = (token) => {
    try{
        return jwt.verify(token, JWT_SECRET);
    }catch (error){
        throw new Error("Invalid or expired token");
    }
};

//Decode Token
export const decodeToken = (token) => {
    return jwt.decode(token);
};