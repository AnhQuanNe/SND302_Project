import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer"

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
}); 

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("SMTP server is ready");
    }
});

export const sendVerificationEmail = async (email, code) => {
    await transporter.sendMail({
        from: `"Smart Queue" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Smart Queue Email Verification",
        html: `
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1>${code}</h1>
            <p>This code will expire in 10 minutes.</p>
        `,
    });
};