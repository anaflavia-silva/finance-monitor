const express = require("express");
const cors = require("cors");
const setupDatabase = require("./scripts/setup-database");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar CORS
const corsOptions = {
  origin: [
    "http://localhost:3000", // desenvolvimento
    "https://finance-monitor-henna.vercel.app" // produção vercel
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware para preflight requests
app.options("*", cors(corsOptions));

// Executar setup do banco automaticamente em produção
const initializeDatabase = async () => {
  if (process.env.DATABASE_URL) {
    try {
      console.log("🚀 Inicializando setup do banco de dados...");
      await setupDatabase();
    } catch (error) {
      console.error("❌ Erro crítico no setup do banco:", error.message);
      // Em produção, não parar o servidor se o banco já estiver configurado
      if (!error.message.includes("already exists")) {
        process.exit(1);
      }
    }
  } else {
    console.log("⚠️ DATABASE_URL não encontrada - pulando setup automático");
  }
};

// Routes
const transactionRoutes = require("./routes/transactions");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");

app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

// Rota de teste com info do banco
app.get("/", async (req, res) => {
  const { Pool } = require("pg");

  let dbStatus = "Não conectado";
  let tablesCount = 0;

  if (process.env.DATABASE_URL) {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
      });

      await pool.query("SELECT NOW()");
      dbStatus = "Conectado ✅";

      const tables = await pool.query(`
                SELECT COUNT(*) FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('users', 'categories', 'transactions')
            `);
      tablesCount = parseInt(tables.rows[0].count);

      await pool.end();
    } catch (error) {
      dbStatus = `Erro: ${error.message}`;
    }
  }

  res.json({
    message: "API do Monitor de Finanças está funcionando!",
    database: dbStatus,
    tables: `${tablesCount}/3 tabelas configuradas`,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Inicializar banco e depois iniciar servidor
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌐 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `🗄️ Banco: ${
          process.env.DATABASE_URL
            ? "PostgreSQL Conectado"
            : "Local/Não configurado"
        }`
      );
    });
  })
  .catch((error) => {
    console.error("❌ Falha crítica na inicialização:", error);
    process.exit(1);
  });
