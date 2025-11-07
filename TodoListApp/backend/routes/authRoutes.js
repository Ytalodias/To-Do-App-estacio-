import express from "express";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail, updateUserPassword } from "../models/user.js";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { email, password, securityQuestion, securityAnswer } = req.body;
  if (!email || !password || !securityQuestion || !securityAnswer)
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });

  const existingUser = await findUserByEmail(email);
  if (existingUser) return res.status(400).json({ message: "Usuário já existe." });

  await createUser(email, password, securityQuestion, securityAnswer);
  res.status(201).json({ message: "Usuário criado com sucesso." });
});

// Esqueci senha (retorna pergunta secreta)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Informe seu email." });

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

  res.json({ securityQuestion: user.security_question });
});

// Resetar senha
router.post("/reset-password", async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;
  if (!email || !securityAnswer || !newPassword)
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

  const normalizedAnswer = securityAnswer.trim().toLowerCase(); // <--- normaliza
  const isAnswerCorrect = await bcrypt.compare(normalizedAnswer, user.security_answer);

  if (!isAnswerCorrect) return res.status(401).json({ message: "Resposta incorreta." });

  await updateUserPassword(email, newPassword);
  res.json({ message: "Senha redefinida com sucesso!" });
});

export default router;
