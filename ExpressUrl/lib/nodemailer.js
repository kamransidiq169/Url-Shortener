import nodemailer from "nodemailer";
// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "katarina37@ethereal.email",
    pass: "vN7yaQwGbkvZDkRYJn",
  },
  tls: {
    rejectUnauthorized: false, // 👈 Bypass self-signed cert error (dev only)
  },
});

// Exported function to send email




export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"URL Shortener" <katarina37@ethereal.email>',
      to,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("Email sent:", info.messageId);
    console.log("Preview URL:", previewUrl);
  } catch (err) {
    console.error("Email sending failed:", err);
  }
};