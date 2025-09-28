const mysql = require("mysql2");
require("dotenv").config();

console.log("🔍 Conectando ao banco...");
console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Database:", process.env.DB_NAME);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: false,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar com MySQL:");
    console.error("Código:", err.code);
    console.error("Mensagem:", err.message);
    console.error("Host tentativa:", process.env.DB_HOST);
    return;
  }
  console.log("✅ Conectado ao MySQL com sucesso!");
  console.log("🏠 Host:", process.env.DB_HOST);
  console.log("📦 Database:", process.env.DB_NAME);
});

module.exports = connection;
