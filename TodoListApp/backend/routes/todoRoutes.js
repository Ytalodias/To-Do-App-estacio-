import express from "express";
import { getTodos, getTodoById, addTodo, updateTodo, deleteTodo } from "../controllers/todoController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas as rotas são protegidas pelo middleware de JWT
router.use(verifyToken);

router.get("/", getTodos);           // Buscar todas as tarefas do usuário logado
router.get("/:id", getTodoById);    // Buscar tarefa específica por ID
router.post("/", addTodo);           // Adicionar nova tarefa
router.put("/:id", updateTodo);      // Atualizar tarefa existente
router.delete("/:id", deleteTodo);   // Excluir tarefa

export default router;
