// routes/userRoutes.js
import express from "express";
import { getSettings } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { updateUserPassword } from "../models/user.js"; // importa a função de atualizar senha

const router = express.Router();

// ==============================
// 🔒 Rota protegida de configurações
// ==============================
router.get("/settings", verifyToken, getSettings);

// ==============================
// 🔐 Rota para alterar senha e enviar e-mail
// ==============================
router.post("/change-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "E-mail e nova senha são obrigatórios." });
  }

  try {
    const success = await updateUserPassword(email, newPassword);
    if (!success) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "Senha alterada e e-mail enviado com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao alterar senha:", error);
    return res.status(500).json({ message: "Erro interno ao alterar senha." });
  }
});

export default router;
