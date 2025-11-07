// models/User.js
import bcrypt from 'bcryptjs';
import { sendEmail } from '../emailService.js'; // importe o serviço de e-mail

export const users = [
  { id: 1, email: 'teste@teste.com', password: bcrypt.hashSync('123456', 10) }
];

export const findUserByEmail = (email) => users.find(u => u.email === email);

export const updateUserPassword = async (email, newPassword) => {
  const user = findUserByEmail(email);
  if (!user) return false;

  user.password = bcrypt.hashSync(newPassword, 10);

  // Envia e-mail real de confirmação
  await sendEmail(
    user.email,
    'Senha alterada com sucesso',
    `Olá! Sua senha foi atualizada com sucesso em nosso sistema.`,
    `<h2>Senha alterada com sucesso</h2><p>Olá ${user.email}, sua senha foi atualizada com sucesso.</p>`
  );

  return true;
};
