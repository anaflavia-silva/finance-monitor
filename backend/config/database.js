const { Pool } = require("pg");
require("dotenv").config();

console.log("🔍 Conectando ao PostgreSQL...");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Testar conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Erro ao conectar com PostgreSQL:", err.message);
    return;
  }
  console.log("✅ Conectado ao PostgreSQL com sucesso!");
  console.log(
    "🌐 Database:",
    process.env.DATABASE_URL ? "Render PostgreSQL" : "Local/Não configurado"
  );
  release();
});

module.exports = pool;
