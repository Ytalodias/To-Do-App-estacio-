// routes/userRoutes.js
import express from "express";
import { getSettings } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rota protegida
router.get("/settings", verifyToken, getSettings);

export default router;