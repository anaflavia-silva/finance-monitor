import React, { useState, useEffect, useCallback } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";
import Charts from "./components/Charts";
import CategoryManager from "./components/CategoryManager";
import Login from "./components/Login";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Verificar se há token salvo
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setTransactions([]);
    setCategories([]);
  };

  const addTransaction = async (transaction) => {
    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (response.ok) {
        fetchTransactions();
        alert("Transação adicionada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      alert("Erro ao adicionar transação");
    }
  };

  const deleteTransaction = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta transação?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/transactions/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          fetchTransactions();
          alert("Transação deletada com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao deletar transação:", error);
        alert("Erro ao deletar transação");
      }
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  // Se não estiver logado, mostrar tela de login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>💰 MeuBolso</h1>
            <p>Gerencie suas finanças pessoais de forma fácil e rápida</p>
            <p>Bem-vindo(a), {user.name}!</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={activeTab === "transactions" ? "active" : ""}
          onClick={() => setActiveTab("transactions")}
        >
          Transações
        </button>
        <button
          className={activeTab === "reports" ? "active" : ""}
          onClick={() => setActiveTab("reports")}
        >
          Relatórios
        </button>
        <button
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          Categorias
        </button>
      </nav>

      <main className="app-main">
        <div className="container">
          {activeTab === "dashboard" && (
            <>
              <Summary transactions={transactions} />
              <div className="content-grid">
                <div className="form-section">
                  <TransactionForm
                    onAddTransaction={addTransaction}
                    categories={categories}
                  />
                </div>
                <div className="list-section">
                  <div className="filter-controls">
                    <button
                      className={filter === "all" ? "active" : ""}
                      onClick={() => setFilter("all")}
                    >
                      Todas
                    </button>
                    <button
                      className={filter === "income" ? "active" : ""}
                      onClick={() => setFilter("income")}
                    >
                      Receitas
                    </button>
                    <button
                      className={filter === "expense" ? "active" : ""}
                      onClick={() => setFilter("expense")}
                    >
                      Despesas
                    </button>
                  </div>
                  <TransactionList
                    transactions={filteredTransactions.slice(0, 5)}
                    onDeleteTransaction={deleteTransaction}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "transactions" && (
            <div className="transactions-tab">
              <div className="filter-controls">
                <button
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  Todas
                </button>
                <button
                  className={filter === "income" ? "active" : ""}
                  onClick={() => setFilter("income")}
                >
                  Receitas
                </button>
                <button
                  className={filter === "expense" ? "active" : ""}
                  onClick={() => setFilter("expense")}
                >
                  Despesas
                </button>
              </div>
              <TransactionList
                transactions={filteredTransactions}
                onDeleteTransaction={deleteTransaction}
                showAll={true}
              />
            </div>
          )}

          {activeTab === "reports" && (
            <div className="reports-tab">
              <Summary transactions={transactions} />
              <Charts transactions={transactions} />
            </div>
          )}

          {activeTab === "categories" && (
            <CategoryManager token={token} onCategoryChange={fetchCategories} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
