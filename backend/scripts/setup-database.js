const { Pool } = require("pg");
require("dotenv").config();

const setupDatabase = async () => {
  console.log("🔄 Iniciando setup do banco de dados...");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  try {
    // Testar conexão
    await pool.query("SELECT NOW()");
    console.log("✅ Conexão com PostgreSQL estabelecida!");

    // Verificar se tabelas já existem
    const checkTables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('users', 'categories', 'transactions')
        `);

    if (checkTables.rows.length >= 3) {
      console.log("✅ Tabelas já existem! Pulando setup...");
      return;
    }

    console.log("📝 Criando tabelas...");

    // Criar tabelas e tipos em sequência
    await pool.query(`
            -- Criar tabela de usuários
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("✅ Tabela users criada");

    // Criar tipos ENUM
    await pool.query(`
            DO $ BEGIN
                CREATE TYPE transaction_type AS ENUM ('income', 'expense');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $;
        `);

    await pool.query(`
            DO $ BEGIN
                CREATE TYPE category_type AS ENUM ('income', 'expense', 'both');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $;
        `);
    console.log("✅ Tipos ENUM criados");

    // Criar tabela de categorias
    await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                type category_type DEFAULT 'both',
                user_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("✅ Tabela categories criada");

    // Criar tabela de transações
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
            );
        `);
    console.log("✅ Tabela transactions criada");

    // Criar índices
    await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
            CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
            CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
        `);
    console.log("✅ Índices criados");

    // Verificar se categorias padrão já existem
    const existingCategories = await pool.query(
      "SELECT COUNT(*) FROM categories WHERE user_id IS NULL"
    );

    if (parseInt(existingCategories.rows[0].count) === 0) {
      // Inserir categorias padrão
      await pool.query(`
                INSERT INTO categories (name, type, user_id) VALUES
                ('Alimentação', 'expense', NULL),
                ('Transporte', 'expense', NULL),
                ('Contas', 'expense', NULL),
                ('Lazer', 'expense', NULL),
                ('Saúde', 'expense', NULL),
                ('Educação', 'expense', NULL),
                ('Salário', 'income', NULL),
                ('Freelance', 'income', NULL),
                ('Investimentos', 'income', NULL),
                ('Outros', 'both', NULL)
            `);
      console.log("✅ Categorias padrão inseridas");
    } else {
      console.log("✅ Categorias padrão já existem");
    }

    // Verificar se tudo foi criado
    const finalCheck = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users') as users_table,
                (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'categories') as categories_table,
                (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'transactions') as transactions_table,
                (SELECT COUNT(*) FROM categories WHERE user_id IS NULL) as default_categories
        `);

    const result = finalCheck.rows[0];
    console.log("📊 Verificação final:");
    console.log(`   - Tabela users: ${result.users_table > 0 ? "✅" : "❌"}`);
    console.log(
      `   - Tabela categories: ${result.categories_table > 0 ? "✅" : "❌"}`
    );
    console.log(
      `   - Tabela transactions: ${result.transactions_table > 0 ? "✅" : "❌"}`
    );
    console.log(
      `   - Categorias padrão: ${result.default_categories} inseridas`
    );

    console.log("🎉 Setup do banco de dados concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao configurar banco de dados:");
    console.error("   Erro:", error.message);
    console.error("   Stack:", error.stack);
    throw error;
  } finally {
    await pool.end();
  }
};

// Permitir executar diretamente
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log("✅ Setup executado com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro no setup:", error);
      process.exit(1);
    });
}

module.exports = setupDatabase;
