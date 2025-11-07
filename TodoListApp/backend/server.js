import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

// Carrega variáveis de ambiente do .env
dotenv.config();

const app = express();

// =====================
// Middlewares Globais
// =====================

// Habilita CORS para todas as rotas
app.use(cors());

// Permite receber dados JSON no body das requisições
app.use(express.json());

// Permite receber dados via form-urlencoded
app.use(express.urlencoded({ extended: true }));

// =====================
// Rotas
// =====================

// Rotas de autenticação (login, registro, esqueci a senha, etc.)
app.use("/api/auth", authRoutes);

// Rotas de CRUD de tarefas (protegidas por JWT)
app.use("/api/todos", todoRoutes);

// Rota teste simples
app.get("/", (req, res) => {
  res.send("API rodando!");
});

// Rota de exemplo para configurações do usuário
app.get("/api/user/settings", (req, res) => {
  res.json({
    name: "Usuário Exemplo",
    email: "usuario@teste.com",
    theme: "dark"
  });
});

// =====================
// Tratamento de erros genérico
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Ocorreu um erro no servidor", error: err.message });
});

// =====================
// Inicializa o servidor
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
