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

export const updateUserPassword = (email, newPassword) => {
  const user = findUserByEmail(email);
  if (!user) return false;

  user.password = bcrypt.hashSync(newPassword, 10);
  return true;
};
