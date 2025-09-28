const { Pool } = require('pg');
require('dotenv').config();

const setupDatabase = async () => {
    console.log('🔄 Iniciando setup do banco de dados...');
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        // Testar conexão
        await pool.query('SELECT NOW()');
        console.log('✅ Conexão com PostgreSQL estabelecida!');

        // Verificar se tabelas já existem
        const checkTables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('users', 'categories', 'transactions')
        `);

        if (checkTables.rows.length >= 3) {
            console.log('✅ Tabelas já existem! Pulando setup...');
            return;
        }

        console.log('📝 Criando tabelas...');

        // 1. Criar tabela de usuários primeiro
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela users criada');

        // 2. Criar tipos ENUM separadamente
        try {
            await pool.query(`CREATE TYPE transaction_type AS ENUM ('income', 'expense')`);
            console.log('✅ Tipo transaction_type criado');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('✅ Tipo transaction_type já existe');
            } else {
                throw error;
            }
        }

        try {
            await pool.query(`CREATE TYPE category_type AS ENUM ('income', 'expense', 'both')`);
            console.log('✅ Tipo category_type criado');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('✅ Tipo category_type já existe');
            } else {
                throw error;
            }
        }

        // 3. Criar tabela de categorias
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                type category_type DEFAULT 'both',
                user_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela categories criada');

        // 4. Criar tabela de transações
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                description VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                type transaction_type NOT NULL,
                category VARCHAR(100),
                date DATE NOT NULL,
                user_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela transactions criada');

        // 5. Criar índices
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id)`);
        console.log('✅ Índices criados');

        // 6. Verificar se categorias padrão já existem
        const existingCategories = await pool.query('SELECT COUNT(*) FROM categories WHERE user_id IS NULL');
        
        if (parseInt(existingCategories.rows[0].count) === 0) {
            // Inserir categorias padrão uma por uma para evitar erros
            const categoriesData = [
                ['Alimentação', 'expense'],
                ['Transporte', 'expense'],
                ['Contas', 'expense'],
                ['Lazer', 'expense'],
                ['Saúde', 'expense'],
                ['Educação', 'expense'],
                ['Salário', 'income'],
                ['Freelance', 'income'],
                ['Investimentos', 'income'],
                ['Outros', 'both']
            ];

            for (const [name, type] of categoriesData) {
                await pool.query(
                    'INSERT INTO categories (name, type, user_id) VALUES ($1, $2, NULL)',
                    [name, type]
                );
            }
            console.log('✅ Categorias padrão inseridas (10 categorias)');
        } else {
            console.log('✅ Categorias padrão já existem');
        }

        // 7. Verificação final
        const finalCheck = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users') as users_table,
                (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'categories') as categories_table,
                (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'transactions') as transactions_table,
                (SELECT COUNT(*) FROM categories WHERE user_id IS NULL) as default_categories
        `);

        const result = finalCheck.rows[0];
        console.log('📊 Verificação final:');
        console.log(`   - Tabela users: ${result.users_table > 0 ? '✅' : '❌'}`);
        console.log(`   - Tabela categories: ${result.categories_table > 0 ? '✅' : '❌'}`);
        console.log(`   - Tabela transactions: ${result.transactions_table > 0 ? '✅' : '❌'}`);
        console.log(`   - Categorias padrão: ${result.default_categories} inseridas`);

        console.log('🎉 Setup do banco de dados concluído com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao configurar banco de dados:');
        console.error('   Erro:', error.message);
        console.error('   Código:', error.code || 'N/A');
        
        // Log mais detalhado para debug
        if (error.position) {
            console.error('   Posição do erro:', error.position);
        }
        if (error.query) {
            console.error('   Query problemática:', error.query);
        }
        
        throw error;
    } finally {
        await pool.end();
    }
};

// Permitir executar diretamente
if (require.main === module) {
    setupDatabase()
        .then(() => {
            console.log('✅ Setup executado com sucesso!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro no setup:', error.message);
            process.exit(1);
        });
}

module.exports = setupDatabase;