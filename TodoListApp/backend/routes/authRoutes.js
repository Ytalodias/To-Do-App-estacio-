import express from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, updateUserPassword } from '../models/user.js';

const router = express.Router();

// PEGAR PERGUNTA SECRETA
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Informe seu e-mail.' });

  const user = findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

  res.json({ securityQuestion: user.securityQuestion });
});

// RESETAR SENHA COM RESPOSTA
router.post('/reset-password', async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;
  if (!email || !securityAnswer || !newPassword) {
    return res.status(400).json({ message: 'E-mail, resposta e nova senha são obrigatórios.' });
  }

  const user = findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

  // Verifica resposta
  const isAnswerCorrect = await bcrypt.compare(securityAnswer, user.securityAnswer);
  if (!isAnswerCorrect) {
    return res.status(401).json({ message: 'Resposta incorreta.' });
  }

  // Atualiza senha
  await updateUserPassword(email, newPassword);
  res.json({ message: 'Senha redefinida com sucesso!' });
});

export default router;
