import { db } from "../config/db.js";

// Pegar todas as tarefas do usuário logado
export const getTodos = (req, res) => {
  const userId = req.user.id;

  // Renomeia o campo no SELECT (target_date → targetDate)
  db.query(
    "SELECT id, title, description, target_date AS targetDate FROM todos WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

// Pegar uma tarefa específica
export const getTodoById = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.query(
    "SELECT id, title, description, target_date AS targetDate FROM todos WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(404).json({ message: "Tarefa não encontrada" });
      res.json(result[0]);
    }
  );
};

// Adicionar nova tarefa
export const addTodo = (req, res) => {
  const userId = req.user.id;
  let { title, description, targetDate } = req.body;

  if (!title?.trim())
    return res.status(400).json({ message: "Título é obrigatório" });

  // Converter targetDate (YYYY-MM-DD ou null)
  if (targetDate) {
    try {
      const d = new Date(targetDate);
      targetDate = d.toISOString().split("T")[0];
    } catch {
      targetDate = null;
    }
  } else {
    targetDate = null;
  }

  console.log("ADD TODO:", { userId, title, description, targetDate });

  db.query(
    "INSERT INTO todos (user_id, title, description, target_date) VALUES (?, ?, ?, ?)",
    [userId, title, description || "", targetDate],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Tarefa adicionada!" });
    }
  );
};

// Atualizar tarefa
export const updateTodo = (req, res) => {
  const { id } = req.params;
  let { title, description, targetDate } = req.body;

  if (!title?.trim())
    return res.status(400).json({ message: "Título é obrigatório" });

  if (targetDate) {
    try {
      const d = new Date(targetDate);
      targetDate = d.toISOString().split("T")[0];
    } catch {
      targetDate = null;
    }
  } else {
    targetDate = null;
  }

  console.log("UPDATE TODO:", { id, title, description, targetDate });

  db.query(
    "UPDATE todos SET title = ?, description = ?, target_date = ? WHERE id = ? AND user_id = ?",
    [title, description || "", targetDate, id, req.user.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Tarefa atualizada!" });
    }
  );
};

// Excluir tarefa
export const deleteTodo = (req, res) => {
  const { id } = req.params;
  db.query(
    "DELETE FROM todos WHERE id = ? AND user_id = ?",
    [id, req.user.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Tarefa excluída!" });
    }
  );
};
