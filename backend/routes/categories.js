const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authenticateToken = require("../middleware/auth");

// Buscar categorias do usuário
router.get("/", authenticateToken, async (req, res) => {
  try {
    const query = `
            SELECT * FROM categories 
            WHERE user_id = $1 OR user_id IS NULL 
            ORDER BY name
        `;
    const result = await db.query(query, [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    res.status(500).json({ error: error.message });
  }
});

// Criar nova categoria
router.post("/", authenticateToken, async (req, res) => {
  const { name, type } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome da categoria é obrigatório" });
  }

  try {
    const query = `
            INSERT INTO categories (name, type, user_id) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `;
    const result = await db.query(query, [
      name,
      type || "both",
      req.user.userId,
    ]);

    res.status(201).json({
      ...result.rows[0],
      message: "Categoria criada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ error: error.message });
  }
});

// Atualizar categoria
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  try {
    const query =
      "UPDATE categories SET name = $1, type = $2 WHERE id = $3 AND user_id = $4";
    const result = await db.query(query, [name, type, id, req.user.userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json({ message: "Categoria atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    res.status(500).json({ error: error.message });
  }
});

// Deletar categoria
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM categories WHERE id = $1 AND user_id = $2";
    const result = await db.query(query, [id, req.user.userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json({ message: "Categoria deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
