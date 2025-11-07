import express from "express";
import { register, login } from "../controllers/authController.js";
import { users, findUserByEmail } from "../models/user.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "../models/emailService.js"; // <- já configurado no models

const router = express.Router();

// =====================
// ROTAS DE LOGIN E REGISTRO
// =====================
router.post("/register", register);
router.post("/login", login);

// =====================
// ESQUECI A SENHA
// =====================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Informe seu e-mail." });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  // Gera token temporário e define expiração
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hora

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    // Envia e-mail real usando o serviço centralizado
    await sendEmail(
      email,
      "Redefinição de senha",
      "Clique no link abaixo para redefinir sua senha:",
      `
        <p>Você solicitou redefinição de senha.</p>
        <p>Clique <a href="${resetLink}">aqui</a> para criar uma nova senha.</p>
        <p>O link expira em 1 hora.</p>
      `
    );

    res.json({ message: "E-mail enviado com sucesso!" });
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    res.status(500).json({ message: "Erro ao enviar e-mail", error: err.message });
  }
});

// =====================
// REDEFINIR SENHA
// =====================
router.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = users.find(
    (u) => u.resetToken === token && u.resetTokenExpiry > Date.now()
  );

  if (!user) {
    return res.status(400).json({ message: "Token inválido ou expirado." });
  }

  // Atualiza senha com hash seguro
  user.password = bcrypt.hashSync(newPassword, 10);
  delete user.resetToken;
  delete user.resetTokenExpiry;

  res.json({ message: "Senha redefinida com sucesso!" });
});

export default router;
