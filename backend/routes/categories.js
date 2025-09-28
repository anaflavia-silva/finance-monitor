const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authenticateToken = require("../middleware/auth");

// Buscar categorias do usuário
router.get("/", authenticateToken, (req, res) => {
  const query = `
        SELECT * FROM categories 
        WHERE user_id = ? OR user_id IS NULL 
        ORDER BY name
    `;

  db.query(query, [req.user.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Criar nova categoria
router.post("/", authenticateToken, (req, res) => {
  const { name, type } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome da categoria é obrigatório" });
  }

  const query = "INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)";

  db.query(query, [name, type || "both", req.user.userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: result.insertId,
      name,
      type: type || "both",
      message: "Categoria criada com sucesso!",
    });
  });
});

// Atualizar categoria
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  const query =
    "UPDATE categories SET name = ?, type = ? WHERE id = ? AND user_id = ?";

  db.query(query, [name, type, id, req.user.userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json({ message: "Categoria atualizada com sucesso!" });
  });
});

// Deletar categoria
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM categories WHERE id = ? AND user_id = ?";

  db.query(query, [id, req.user.userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json({ message: "Categoria deletada com sucesso!" });
  });
});

module.exports = router;
