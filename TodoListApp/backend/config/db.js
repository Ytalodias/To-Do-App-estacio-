import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // carrega variáveis do .env

// Cria a conexão com o banco
export const db = mysql.createConnection({
  host: process.env.DB_HOST,       // geralmente localhost
  user: process.env.DB_USER,       // root
  password: process.env.DB_PASSWORD || '', // se vazio, passa ''
  database: process.env.DB_NAME
});

// Testa a conexão
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
  } else {
    console.log("✅ Conectado ao MariaDB sem senha!");
  }
});
