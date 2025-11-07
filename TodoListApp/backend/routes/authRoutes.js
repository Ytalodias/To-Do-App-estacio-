// authRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, updateUserPassword } from "../models/user.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================
// Registro
// =====================
router.post("/register", async (req, res) => {
  const { email, password, securityQuestion, securityAnswer } = req.body;
  if (!email || !password || !securityQuestion || !securityAnswer)
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });

  const existingUser = await findUserByEmail(email);
  if (existingUser) return res.status(400).json({ message: "Usuário já existe." });

  await createUser(email, password, securityQuestion, securityAnswer);
  res.status(201).json({ message: "Usuário criado com sucesso." });
});

// =====================
// Login
// =====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email e senha obrigatórios." });

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ message: "Senha incorreta." });

  if (!process.env.JWT_SECRET)
    return res.status(500).json({ message: "JWT_SECRET não definido." });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  res.json({ message: "Login bem-sucedido", token });
});

// =====================
// Esqueci senha
// =====================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Informe seu email." });

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

  res.json({ securityQuestion: user.security_question });
});

// =====================
// Resetar senha
// =====================
router.post("/reset-password", async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;
  if (!email || !securityAnswer || !newPassword)
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

  const normalizedAnswer = securityAnswer.trim().toLowerCase();
  const isAnswerCorrect = await bcrypt.compare(normalizedAnswer, user.security_answer);
  if (!isAnswerCorrect) return res.status(401).json({ message: "Resposta incorreta." });

  await updateUserPassword(email, newPassword);
  res.json({ message: "Senha redefinida com sucesso!" });
});

// =====================
// Alterar senha (usuário logado)
// =====================
router.post("/change-password", verifyToken, async (req, res) => {
  const { newPassword } = req.body;
  const email = req.user.email;

  if (!newPassword) return res.status(400).json({ message: "Nova senha obrigatória." });

  try {
    const success = await updateUserPassword(email, newPassword);
    if (!success) return res.status(404).json({ message: "Usuário não encontrado." });

    res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno ao alterar senha." });
  }
});

export default router;
