import bcrypt from 'bcryptjs';

export const users = [
  { 
    id: 1, 
    email: 'teste@teste.com', 
    password: bcrypt.hashSync('123456', 10),
    securityQuestion: 'Qual seu animal de estimação?',
    securityAnswer: bcrypt.hashSync('gato', 10) // resposta criptografada
  },
  { 
    id: 2, 
    email: 'ytalod47@gmail.com', 
    password: bcrypt.hashSync('123456', 10),
    securityQuestion: 'Qual sua cidade natal?',
    securityAnswer: bcrypt.hashSync('rio', 10)
  }
];

export const findUserByEmail = (email) => users.find(u => u.email === email);

// Atualiza senha de forma assíncrona (para manter padrão async/await)
export const updateUserPassword = async (email, newPassword) => {
  const user = findUserByEmail(email);
  if (!user) return false;

  user.password = await bcrypt.hash(newPassword, 10);
  return true;
};
