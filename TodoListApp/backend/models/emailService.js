// emailService.js
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

// Configura a API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Envia um e-mail
 * @param {string} to - destinatário
 * @param {string} subject - assunto
 * @param {string} text - texto plano
 * @param {string|null} html - HTML opcional
 */
export async function sendEmail(to, subject, text, html = null) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    text,
    html: html || text,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ E-mail enviado para ${to}`);
  } catch (err) {
    console.error('❌ Erro ao enviar e-mail:', err.response?.body || err.message);
    throw err;
  }
}
