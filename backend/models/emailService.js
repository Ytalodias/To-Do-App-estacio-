// emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou 'hotmail', 'outlook', 'yahoo'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função genérica para enviar e-mails
export async function sendEmail(to, subject, text, html = null) {
  const mailOptions = {
    from: `"Suporte" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html: html || text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ E-mail enviado para ${to}`);
  } catch (err) {
    console.error('❌ Erro ao enviar e-mail:', err);
    throw err;
  }
}
