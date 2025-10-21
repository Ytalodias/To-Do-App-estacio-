import { db } from "../config/db.js";

// Pegar todas as tarefas do usuário logado
export const getTodos = (req, res) => {
  const userId = req.user.id;
  db.query("SELECT * FROM todos WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Adicionar nova tarefa
export const addTodo = (req, res) => {
  const userId = req.user.id;
  const { title, description } = req.body;

  if (!title) return res.status(400).json({ message: "Título é obrigatório" });

  db.query(
    "INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)",
    [userId, title, description || ""],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Tarefa adicionada!" });
    }
  );
};

// Atualizar tarefa
export const updateTodo = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title) return res.status(400).json({ message: "Título é obrigatório" });

  db.query(
    "UPDATE todos SET title = ?, description = ? WHERE id = ?",
    [title, description || "", id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Tarefa atualizada!" });
    }
  );
};

// Excluir tarefa
export const deleteTodo = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM todos WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Tarefa excluída!" });
  });
};
