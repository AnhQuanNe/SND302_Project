import User from "../models/User.js";


export const getStaffList = async () => {

    return await User.find({
        role: "staff"
    })
    .select("fullName email");

};