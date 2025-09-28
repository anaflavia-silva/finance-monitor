const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authenticateToken = require('../middleware/auth');

// Buscar todas as transações do usuário logado
router.get('/', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC';

    db.query(query, [req.user.userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Criar nova transação
router.post('/', authenticateToken, (req, res) => {
    const { description, amount, type, category, date } = req.body;

    // Validação básica
    if (!description || amount === undefined || !type || !date) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const query = 'INSERT INTO transactions (description, amount, type, category, date, user_id) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(
        query,
        [description, amount, type, category || null, date, req.user.userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                id: result.insertId,
                description,
                amount,
                type,
                category: category || null,
                date,
                user_id: req.user.userId,
                message: 'Transação criada com sucesso!'
            });
        }
    );
});

// Deletar transação
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM transactions WHERE id = ? AND user_id = ?';

    db.query(query, [id, req.user.userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }

        res.json({ message: 'Transação deletada com sucesso!' });
    });
});

module.exports = router;