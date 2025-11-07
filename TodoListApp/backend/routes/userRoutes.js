import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { updateUserPassword } from "../models/user.js";

const router = express.Router();

// Alterar senha (usuário logado)
router.post("/change-password", verifyToken, async (req, res) => {
  const { newPassword } = req.body;
  const email = req.user.email; // pega do token

  if (!newPassword) return res.status(400).json({ message: "Nova senha obrigatória." });

  try {
    const success = await updateUserPassword(email, newPassword);
    if (!success) return res.status(404).json({ message: "Usuário não encontrado." });

    res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno ao alterar senha." });
  }
});

export default router;
