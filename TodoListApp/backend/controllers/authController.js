import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

// Registro de novo usuário
export const register = (req, res) => {
  const { email, password } = req.body;

  // Verifica se campos estão vazios
  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  // Verifica se usuário já existe
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length > 0) return res.status(400).json({ message: "Usuário já existe" });

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere novo usuário
    db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], (err) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Usuário criado com sucesso" });
    });
  });
};

// Login de usuário existente
export const login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(400).json({ message: "Usuário não encontrado" });

    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(401).json({ message: "Senha incorreta" });

    // Gera token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login bem-sucedido", token });
  });
};
