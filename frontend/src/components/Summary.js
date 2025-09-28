import React from "react";

function Summary({ transactions }) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="summary">
      <div className="summary-card income">
        <h3>Receitas</h3>
        <p>R$ {totalIncome.toFixed(2)}</p>
      </div>
      <div className="summary-card expenses">
        <h3>Despesas</h3>
        <p>R$ {totalExpenses.toFixed(2)}</p>
      </div>
      <div
        className={`summary-card balance ${
          balance >= 0 ? "positive" : "negative"
        }`}
      >
        <h3>Saldo</h3>
        <p>R$ {balance.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Summary;
