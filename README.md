# 💰 Monitor de Finanças Pessoais

<div align="center">

**Sistema completo para gerenciamento de finanças pessoais com interface moderna e funcionalidades avançadas**

---

## 📋 Sobre o Projeto

O **Monitor de Finanças Pessoais** é uma aplicação web full-stack desenvolvida para ajudar usuários a gerenciar suas receitas e despesas de forma intuitiva e eficiente. Com uma interface moderna e responsiva, oferece relatórios visuais, sistema de autenticação e gerenciamento personalizado de categorias.

### 🎯 Objetivo

Criar uma solução completa que demonstre conhecimentos avançados em desenvolvimento full-stack, incluindo autenticação, visualização de dados, design responsivo e boas práticas de desenvolvimento.

---

## ✨ Funcionalidades

### 🔐 **Sistema de Autenticação**

- [x] Registro e login de usuários
- [x] Autenticação JWT segura
- [x] Proteção de rotas
- [x] Dados isolados por usuário
- [x] Hash de senhas com bcrypt

### 💼 **Gerenciamento Financeiro**

- [x] Cadastro de receitas e despesas
- [x] Visualização de transações em tempo real
- [x] Cálculo automático de saldo
- [x] Filtros por tipo de transação
- [x] Exclusão de transações

### 📊 **Relatórios e Gráficos**

- [x] Gráfico de evolução mensal
- [x] Gráfico de pizza por categorias
- [x] Resumo financeiro com cards
- [x] Visualizações responsivas
- [x] Dados atualizados em tempo real

### 📋 **Categorias Personalizadas**

- [x] CRUD completo de categorias
- [x] Categorias padrão do sistema
- [x] Categorias personalizadas por usuário
- [x] Filtros inteligentes por tipo
- [x] Interface intuitiva de gerenciamento

### 🎨 **Interface Moderna**

- [x] Design responsivo e profissional
- [x] Navegação por abas
- [x] Animações e transições suaves
- [x] Estados de loading e feedback
- [x] Compatibilidade mobile

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- **React.js** - Library para interface de usuário
- **Chart.js** - Biblioteca para gráficos interativos
- **React Chart.js 2** - Integração Chart.js com React
- **CSS3** - Estilização moderna e responsiva
- **Axios** - Cliente HTTP para requisições

### **Backend**

- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web para Node.js
- **JSON Web Token (JWT)** - Autenticação segura
- **bcryptjs** - Hash de senhas
- **CORS** - Controle de acesso entre domínios

### **Banco de Dados**

- **MySQL** - Sistema de gerenciamento de banco de dados
- **mysql2** - Driver MySQL para Node.js

### **Ferramentas de Desenvolvimento**

- **Nodemon** - Reinicialização automática do servidor
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 🚀 Instalação

### **Pré-requisitos**

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [MySQL](https://mysql.com/) (versão 5.7 ou superior)
- [Git](https://git-scm.com/)

### **1. Clone o Repositório**

```bash
git clone https://github.com/seu-usuario/finance-monitor.git
cd finance-monitor
```

### **2. Configuração do Banco de Dados**

Execute o seguinte script SQL para criar o banco de dados:

```sql
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS finance_monitor;
USE finance_monitor;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('income', 'expense', 'both') DEFAULT 'both',
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Criar tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Inserir categorias padrão
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
('Outros', 'both', NULL);
```

### **3. Configuração do Backend**

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências
npm install

# Criar arquivo de configuração
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=finance_monitor
PORT=5000
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456789
```

### **4. Configuração do Frontend**

```bash
# Navegar para o diretório do frontend
cd ../frontend

# Instalar dependências
npm install
```

### **5. Executar a Aplicação**

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

A aplicação estará disponível em:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## 📁 Estrutura do Projeto

```
finance-monitor/
├── 📁 backend/
│   ├── 📁 config/
│   │   └── 📄 database.js          # Configuração do MySQL
│   ├── 📁 middleware/
│   │   └── 📄 auth.js             # Middleware de autenticação
│   ├── 📁 routes/
│   │   ├── 📄 auth.js             # Rotas de autenticação
│   │   ├── 📄 transactions.js     # Rotas de transações
│   │   └── 📄 categories.js       # Rotas de categorias
│   ├── 📄 server.js               # Servidor principal
│   ├── 📄 package.json            # Dependências do backend
│   └── 📄 .env                    # Variáveis de ambiente
│
├── 📁 frontend/
│   ├── 📁 public/
│   │   └── 📄 index.html
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📄 Login.js         # Componente de autenticação
│   │   │   ├── 📄 Summary.js       # Resumo financeiro
│   │   │   ├── 📄 TransactionForm.js  # Formulário de transações
│   │   │   ├── 📄 TransactionList.js  # Lista de transações
│   │   │   ├── 📄 Charts.js        # Gráficos interativos
│   │   │   └── 📄 CategoryManager.js  # Gerenciador de categorias
│   │   ├── 📁 styles/
│   │   │   └── 📄 App.css          # Estilos principais
│   │   ├── 📄 App.js               # Componente principal
│   │   └── 📄 index.js             # Ponto de entrada
│   └── 📄 package.json             # Dependências do frontend
│
├── 📄 README.md                    # Documentação do projeto
└── 📄 .gitignore                   # Arquivos ignorados pelo Git
```

---

## 🔌 API Endpoints

### **Autenticação**

| Método | Endpoint             | Descrição              | Autenticação |
| ------ | -------------------- | ---------------------- | ------------ |
| `POST` | `/api/auth/register` | Registrar novo usuário | ❌           |
| `POST` | `/api/auth/login`    | Login do usuário       | ❌           |

### **Transações**

| Método   | Endpoint                | Descrição                    | Autenticação |
| -------- | ----------------------- | ---------------------------- | ------------ |
| `GET`    | `/api/transactions`     | Listar transações do usuário | ✅           |
| `POST`   | `/api/transactions`     | Criar nova transação         | ✅           |
| `DELETE` | `/api/transactions/:id` | Deletar transação            | ✅           |

### **Categorias**

| Método   | Endpoint              | Descrição           | Autenticação |
| -------- | --------------------- | ------------------- | ------------ |
| `GET`    | `/api/categories`     | Listar categorias   | ✅           |
| `POST`   | `/api/categories`     | Criar categoria     | ✅           |
| `PUT`    | `/api/categories/:id` | Atualizar categoria | ✅           |
| `DELETE` | `/api/categories/:id` | Deletar categoria   | ✅           |

### **Exemplos de Uso**

**Registro de Usuário:**

```javascript
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Criar Transação:**

```javascript
POST /api/transactions
Headers: { "Authorization": "Bearer jwt_token" }
{
  "description": "Supermercado",
  "amount": 150.00,
  "type": "expense",
  "category": "Alimentação",
  "date": "2024-01-15"
}
```

## 🧪 Como Testar

### **1. Teste de Registro e Login**

- Acesse http://localhost:3000
- Clique em "Cadastre-se" e crie uma conta
- Faça login com suas credenciais

### **2. Teste de Transações**

- Adicione algumas receitas (ex: Salário - R$ 3.500,00)
- Adicione algumas despesas (ex: Supermercado - R$ 250,00)
- Verifique se o saldo é calculado corretamente

### **3. Teste de Filtros**

- Use os botões "Todas", "Receitas" e "Despesas"
- Verifique se a filtragem funciona corretamente

### **4. Teste de Gráficos**

- Vá para a aba "Relatórios"
- Verifique se os gráficos são exibidos corretamente
- Teste em dispositivos móveis

### **5. Teste de Categorias**

- Vá para a aba "Categorias"
- Crie uma nova categoria personalizada
- Use-a em uma nova transação

---

## 🚀 Deploy

### **Heroku (Backend)**

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login no Heroku
heroku login

# Criar aplicação
heroku create finance-monitor-api

# Configurar variáveis de ambiente
heroku config:set DB_HOST=seu_host_mysql
heroku config:set DB_USER=seu_usuario
heroku config:set DB_PASSWORD=sua_senha
heroku config:set DB_NAME=finance_monitor
heroku config:set JWT_SECRET=sua_chave_secreta

# Deploy
git subtree push --prefix backend heroku main
```

### **Vercel (Frontend)**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

---

## 🤝 Contribuindo

1. **Fork** o projeto
2. Crie sua **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### **Diretrizes de Contribuição**

- Mantenha o código limpo e bem comentado
- Siga os padrões de nomenclatura existentes
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário

---

## 👨‍💻 Autor

**Seu Nome**

- GitHub: [@anaflavia_silva](https://github.com/anaflavia-silva)
- LinkedIn: [@anaflavia-silvabs](https://linkedin.com/in/anaflavia-silvabs)
- Email: anaflaviabsdev@gmail.com

---

## 🙏 Agradecimentos

- [React.js](https://reactjs.org/) - Por ser uma biblioteca incrível
- [Chart.js](https://chartjs.org/) - Pelos gráficos interativos
- [Express.js](https://expressjs.com/) - Pelo framework web robusto
- [MySQL](https://mysql.com/) - Pelo banco de dados confiável

---

## 📈 Roadmap

### **Versão 2.0**

- [ ] Metas e objetivos financeiros
- [ ] Notificações e alertas
- [ ] Exportação para PDF/Excel
- [ ] Dashboard avançado com KPIs
- [ ] Modo escuro

### **Versão 2.1**

- [ ] Integração com bancos (Open Banking)
- [ ] App mobile (React Native)
- [ ] Backup automático
- [ ] Relatórios customizáveis
- [ ] API pública

---

## ❓ FAQ

**P: Como posso alterar a porta do servidor?**
R: Modifique a variável `PORT` no arquivo `.env` do backend.

**P: É possível usar outro banco de dados?**
R: Sim, você pode adaptar o código para PostgreSQL ou MongoDB modificando os arquivos de configuração.

**P: Como adiciono novas funcionalidades?**
R: Siga o padrão MVC existente, criando rotas no backend e componentes no frontend.

**P: O projeto é adequado para produção?**
R: Sim, mas recomenda-se adicionar testes automatizados, logging e monitoramento antes do deploy em produção.

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/anaflavia-silva/finance-monitor?style=social)](https://github.com/anaflavia-silva/finance-monitor)

---

_Desenvolvido com ❤️ e ☕ por ["Ana Flávia"](https://github.com/anaflavia-silva)_

</div>
