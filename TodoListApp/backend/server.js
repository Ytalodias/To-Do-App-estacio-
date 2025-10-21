import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

// Configura variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite receber JSON
app.use(express.urlencoded({ extended: true })); // Permite receber dados via form

// Rotas
app.use("/api/auth", authRoutes);   // Rotas de login e registro
app.use("/api/todos", todoRoutes);  // Rotas de CRUD de tarefas protegidas por JWT

// Rota teste
app.get("/", (req, res) => {
  res.send("API rodando!");
});

// Rota de exemplo para settings do usuário
app.get("/api/user/settings", (req, res) => {
  // Aqui você pode colocar lógica real para pegar dados do usuário autenticado
  res.json({
    name: "Usuário Exemplo",
    email: "usuario@teste.com",
    theme: "dark"
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
