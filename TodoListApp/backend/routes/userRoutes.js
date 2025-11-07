import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getSettings } from "../controllers/userController.js";
import { updateUserPassword } from "../models/user.js";

const router = express.Router();

// Rota protegida de configurações
router.get("/settings", verifyToken, getSettings);

// Alterar senha
router.post("/change-password", verifyToken, async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "E-mail e nova senha são obrigatórios." });
  }

  try {
    const success = await updateUserPassword(email, newPassword);
    if (!success) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao alterar senha:", error);
    return res.status(500).json({ message: "Erro interno ao alterar senha." });
  }
});

export default router;
