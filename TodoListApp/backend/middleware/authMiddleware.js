// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carrega variáveis de ambiente do .env
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  // Extrai token depois do "Bearer "
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // adiciona os dados do usuário à requisição
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
