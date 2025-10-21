import express from "express";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../controllers/todoController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas as rotas são protegidas pelo middleware de JWT
router.get("/", verifyToken, getTodos);         // Buscar todas as tarefas do usuário logado
router.post("/", verifyToken, addTodo);        // Adicionar nova tarefa
router.put("/:id", verifyToken, updateTodo);   // Atualizar tarefa existente
router.delete("/:id", verifyToken, deleteTodo); // Excluir tarefa

export default router;
