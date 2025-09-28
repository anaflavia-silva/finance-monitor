const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authenticateToken = require("../middleware/auth");

// Buscar todas as transações do usuário logado
router.get("/", authenticateToken, async (req, res) => {
  try {
    const query =
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC";
    const result = await db.query(query, [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    res.status(500).json({ error: error.message });
  }
});

// Criar nova transação
router.post("/", authenticateToken, async (req, res) => {
  const { description, amount, type, category, date } = req.body;

  if (!description || !amount || !type || !date) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const query = `
            INSERT INTO transactions (description, amount, type, category, date, user_id) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;

    const result = await db.query(query, [
      description,
      amount,
      type,
      category,
      date,
      req.user.userId,
    ]);

    res.status(201).json({
      ...result.rows[0],
      message: "Transação criada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    res.status(500).json({ error: error.message });
  }
});

// Deletar transação
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM transactions WHERE id = $1 AND user_id = $2";
    const result = await db.query(query, [id, req.user.userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    res.json({ message: "Transação deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
