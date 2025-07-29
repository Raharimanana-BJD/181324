"use server";

import nodemailer from "nodemailer";

interface props {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: props) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true si port 465
    ignoreTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const devFrom = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`;

  try {
    const info = await transporter.sendMail({
      from: devFrom,
      to: to.toLowerCase().trim(),
      subject: subject.trim(),
      text: text.trim(),
    });

    // console.log("Email sent (dev mode)", info.messageId);
    // console.log("Preview URL: http://localhost:1080");

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.log("Error sending email...", error);
    return {
      success: false,
      message: "Failed to send email. Is your local MailDev/MailHog running?",
    };
  }
}
