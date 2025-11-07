import { db } from "../config/db.js";
import bcrypt from "bcrypt";

export const createUser = async (email, password, securityQuestion, securityAnswer) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

  await db.query(
    "INSERT INTO users (email, password, security_question, security_answer) VALUES ($1, $2, $3, $4)",
    [email, hashedPassword, securityQuestion, hashedAnswer]
  );
};

export const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const updateUserPassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await db.query(
    "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
    [hashedPassword, email]
  );
  return result.rowCount > 0;
};
