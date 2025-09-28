const mysql = require('mysql2');
require('dotenv').config();

// O mysql2 pode se conectar diretamente usando a string completa
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

module.exports = connection;