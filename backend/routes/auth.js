const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

// Registro de usuário
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Verificar se usuário já existe
    const checkUser = "SELECT id FROM users WHERE email = ?";
    db.query(checkUser, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Usuário já existe com este email" });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserir usuário
      const insertUser =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(insertUser, [name, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Gerar token
        const token = jwt.sign(
          { userId: result.insertId, email: email },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.status(201).json({
          message: "Usuário criado com sucesso",
          token,
          user: { id: result.insertId, name, email },
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
});

module.exports = router;
