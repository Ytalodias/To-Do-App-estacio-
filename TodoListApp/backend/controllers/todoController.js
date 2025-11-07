import { db } from "../config/db.js";

// ===== Pegar todas as tarefas do usuário logado =====
export const getTodos = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT 
         id, 
         title, 
         description, 
         to_char(target_date, 'YYYY-MM-DD"T"HH24:MI:SS') AS "targetDate"
       FROM todos
       WHERE user_id = $1
       ORDER BY id DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err);
    res.status(500).json({ message: "Erro ao buscar tarefas" });
  }
};

// ===== Pegar uma tarefa específica =====
export const getTodoById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT 
         id, 
         title, 
         description, 
         to_char(target_date, 'YYYY-MM-DD"T"HH24:MI:SS') AS "targetDate"
       FROM todos
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar tarefa:", err);
    res.status(500).json({ message: "Erro ao buscar tarefa" });
  }
};

// ===== Adicionar nova tarefa =====
export const addTodo = async (req, res) => {
  const { title, description, targetDate } = req.body;
  const userId = req.user.id;

  try {
    await db.query(
      `INSERT INTO todos (user_id, title, description, target_date)
       VALUES ($1, $2, $3, $4)`,
      [userId, title, description || "", targetDate]
    );
    res.status(201).json({ message: "Tarefa adicionada com sucesso!" });
  } catch (err) {
    console.error("Erro ao adicionar tarefa:", err);
    res.status(500).json({ message: "Erro ao adicionar tarefa" });
  }
};

// ===== Atualizar tarefa =====
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, targetDate } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `UPDATE todos
       SET title = $1, description = $2, target_date = $3
       WHERE id = $4 AND user_id = $5`,
      [title, description || "", targetDate, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    res.json({ message: "Tarefa atualizada com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
    res.status(500).json({ message: "Erro ao atualizar tarefa" });
  }
};

// ===== Excluir tarefa =====
export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM todos WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    res.json({ message: "Tarefa excluída com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir tarefa:", err);
    res.status(500).json({ message: "Erro ao excluir tarefa" });
  }
};
