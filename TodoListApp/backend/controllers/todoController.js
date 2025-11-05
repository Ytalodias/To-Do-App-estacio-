import { db } from "../config/db.js";

// Pegar todas as tarefas do usuário logado
export const getTodos = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT id, title, description, target_date AS \"targetDate\" FROM todos WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Pegar uma tarefa específica
export const getTodoById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT id, title, description, target_date AS \"targetDate\" FROM todos WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Tarefa não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Adicionar nova tarefa
export const addTodo = async (req, res) => {
  const userId = req.user.id;
  let { title, description, targetDate } = req.body;

  if (!title?.trim())
    return res.status(400).json({ message: "Título é obrigatório" });

  targetDate = targetDate ? new Date(targetDate).toISOString().split("T")[0] : null;

  try {
    await db.query(
      "INSERT INTO todos (user_id, title, description, target_date) VALUES ($1, $2, $3, $4)",
      [userId, title, description || "", targetDate]
    );
    res.json({ message: "Tarefa adicionada!" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Atualizar tarefa
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  let { title, description, targetDate } = req.body;

  if (!title?.trim())
    return res.status(400).json({ message: "Título é obrigatório" });

  targetDate = targetDate ? new Date(targetDate).toISOString().split("T")[0] : null;

  try {
    await db.query(
      "UPDATE todos SET title = $1, description = $2, target_date = $3 WHERE id = $4 AND user_id = $5",
      [title, description || "", targetDate, id, req.user.id]
    );
    res.json({ message: "Tarefa atualizada!" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Excluir tarefa
export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    res.json({ message: "Tarefa excluída!" });
  } catch (err) {
    res.status(500).json(err);
  }
};
