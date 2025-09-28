const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';

// Registro de usuário
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    try {
        // Verificar se usuário já existe
        const checkUser = 'SELECT id FROM users WHERE email = $1';
        const userExists = await db.query(checkUser, [email]);
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Usuário já existe com este email' });
        }
        
        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Inserir usuário
        const insertUser = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id';
        const result = await db.query(insertUser, [name, email, hashedPassword]);
        
        // Gerar token
        const token = jwt.sign(
            { userId: result.rows[0].id, email: email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: { id: result.rows[0].id, name, email }
        });
        
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;