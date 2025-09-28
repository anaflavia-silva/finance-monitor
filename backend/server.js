const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const transactionRoutes = require("./routes/transactions");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");

app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.json({ message: "API do Monitor de Finanças está funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
