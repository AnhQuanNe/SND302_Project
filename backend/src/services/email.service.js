import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

// Không log mật khẩu email ra console
console.log("EMAIL_USER configured:", Boolean(process.env.EMAIL_USER));
console.log("EMAIL_PASS configured:", Boolean(process.env.EMAIL_PASS));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

transporter.verify((error) => {
  if (error) {
    console.error("SMTP VERIFY ERROR:", error.message);
  } else {
    console.log("SMTP server is ready");
  }
});

export const sendVerificationEmail = async (email, code) => {
  try {
    const info = await transporter.sendMail({
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

    console.log("Verification email sent:", info.messageId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("SEND EMAIL ERROR:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};