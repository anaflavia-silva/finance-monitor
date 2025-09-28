import React from "react";

function TransactionList({ transactions, onDeleteTransaction }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="transaction-list">
      <h2>Histórico de Transações</h2>

      {transactions.length === 0 ? (
        <p className="no-transactions">Nenhuma transação encontrada</p>
      ) : (
        <div className="transactions">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`transaction-item ${transaction.type}`}
            >
              <div className="transaction-info">
                <h4>{transaction.description}</h4>
                <p className="category">{transaction.category}</p>
                <p className="date">{formatDate(transaction.date)}</p>
              </div>

              <div className="transaction-amount">
                <span className={`amount ${transaction.type}`}>
                  {transaction.type === "income" ? "+" : "-"}R${" "}
                  {parseFloat(transaction.amount).toFixed(2)}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => onDeleteTransaction(transaction.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionList;
