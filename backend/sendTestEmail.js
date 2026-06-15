import dotenv from "dotenv";
dotenv.config();


import { sendVerificationEmail } from "./src/services/email.service.js";

await sendVerificationEmail(
    "cuuthangnguyen1210@gmail.com",
    "123456"
);

console.log("Email sent!");