import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0,
});

(async () => {
try {
const connection = await db.getConnection();
console.log("✅ Conectado ao MySQL/MariaDB!");
connection.release();
} catch (err) {
console.error("Erro ao conectar ao banco:", err);
}
})();
