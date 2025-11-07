import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, updateUserPassword } from '../models/user.js';

const router = express.Router();

// Registro de usuário com pergunta e resposta
router.post('/register', async (req, res) => {
  const { email, password, securityQuestion, securityAnswer } = req.body;
  if (!email || !password || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }

  const existing = await findUserByEmail(email);
  if (existing) return res.status(400).json({ message: 'Usuário já existe' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

  await db.query(
    "INSERT INTO users (email, password, security_question, security_answer) VALUES ($1, $2, $3, $4)",
    [email, hashedPassword, securityQuestion, hashedAnswer]
  );

  res.status(201).json({ message: 'Usuário criado com sucesso' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Preencha todos os campos' });

  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Senha incorreta' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login bem-sucedido', token });
});

// PEGAR PERGUNTA SECRETA
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Informe seu e-mail.' });

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

  res.json({ securityQuestion: user.security_question });
});

// RESETAR SENHA COM RESPOSTA
router.post('/reset-password', async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;
  if (!email || !securityAnswer || !newPassword) {
    return res.status(400).json({ message: 'E-mail, resposta e nova senha são obrigatórios.' });
  }

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

  const isAnswerCorrect = await bcrypt.compare(securityAnswer, user.security_answer);
  if (!isAnswerCorrect) return res.status(401).json({ message: 'Resposta incorreta.' });

  await updateUserPassword(email, newPassword);
  res.json({ message: 'Senha redefinida com sucesso!' });
});

export default router;
