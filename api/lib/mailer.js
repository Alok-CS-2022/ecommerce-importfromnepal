// Simple mailer utility using nodemailer
import nodemailer from 'nodemailer';

// Configure your SMTP or use a service like Gmail (for production, use env vars)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER || 'your_gmail@gmail.com',
    pass: process.env.MAIL_PASS || 'your_gmail_app_password'
  }
});

export async function sendOrderEmail({ to, subject, text, html, attachmentName, attachmentContent }) {
  const mailOptions = {
    from: process.env.MAIL_USER || 'your_gmail@gmail.com',
    to,
    subject,
    text,
    html,
    attachments: attachmentName && attachmentContent ? [
      {
        filename: attachmentName,
        content: attachmentContent
      }
    ] : []
  };
  return transporter.sendMail(mailOptions);
}
