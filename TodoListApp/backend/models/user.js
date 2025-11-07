import { db } from "../config/db.js";
import bcrypt from "bcrypt";

// Busca usuário pelo email
export const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

// Atualiza senha do usuário
export const updateUserPassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await db.query(
    "UPDATE users SET password = $1 WHERE email = $2 RETURNING id",
    [hashedPassword, email]
  );
  return result.rows.length > 0;
};
