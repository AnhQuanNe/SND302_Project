import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, code) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { data, error } = await resend.emails.send({
      from: "Smart Queue <SmartQueue@resend.dev>",
      to: [email],
      subject: "Smart Queue Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h2>Smart Queue Email Verification</h2>

          <p>Your verification code is:</p>

          <div
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 16px 0;
            "
          >
            ${code}
          </div>

          <p>This code will expire in 10 minutes.</p>

          <p>
            If you did not create a Smart Queue account,
            you can ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return {
        success: false,
        error: error.message || "Cannot send verification email",
      };
    }

    console.log("Verification email sent:", data?.id);

    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    console.error("SEND EMAIL ERROR:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};