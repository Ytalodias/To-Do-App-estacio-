import { db } from "../config/db.js";
import bcrypt from "bcrypt";

// Cria usuário com normalização da resposta secreta
export const createUser = async (email, password, securityQuestion, securityAnswer) => {
  const normalizedAnswer = securityAnswer.trim().toLowerCase(); // <--- normaliza
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedAnswer = await bcrypt.hash(normalizedAnswer, 10);

  await db.query(
    "INSERT INTO users (email, password, security_question, security_answer) VALUES ($1, $2, $3, $4)",
    [email, hashedPassword, securityQuestion, hashedAnswer]
  );
};

// Busca usuário pelo email
export const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

// Atualiza a senha
export const updateUserPassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await db.query(
    "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
    [hashedPassword, email]
  );
  return result.rowCount > 0;
};
