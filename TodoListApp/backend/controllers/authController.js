import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

// Registro de novo usuário
export const register = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  try {
    const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);

    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    console.error("Erro no register:", err);
    res.status(500).json({ message: "Erro interno do servidor", error: err.message });
  }
};

// Login de usuário existente
export const login = async (req, res) => {
  console.log("======== NOVO LOGIN ========");
  
  // Forçar leitura do body caso express.json() falhe
  let body = req.body;
  if (!body || !body.email || !body.password) {
    try {
      body = JSON.parse(req.rawBody || "{}"); // caso venha vazio
    } catch {
      return res.status(400).json({ message: "Body inválido" });
    }
  }

  console.log("Body recebido:", body);

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [body.email]);
    console.log("Resultado da query:", result.rows);

    if (result.rows.length === 0) {
      console.warn("Usuário não encontrado:", body.email);
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(body.password, user.password);
    console.log("Senha válida?", validPassword);

    if (!validPassword) {
      console.warn("Senha incorreta para:", body.email);
      return res.status(401).json({ message: "Senha incorreta" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET não definido!");
      return res.status(500).json({ message: "Erro interno: JWT_SECRET não definido" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Token gerado:", token);

    res.json({ message: "Login bem-sucedido", token });
  } catch (err) {
    console.error("Erro capturado no login:", err);
    res.status(500).json({ message: "Erro interno do servidor", error: err.message });
  }
};
