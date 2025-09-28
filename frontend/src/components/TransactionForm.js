import React, { useState } from "react";

function TransactionForm({ onAddTransaction, categories }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "income",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.description || !formData.amount) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    onAddTransaction(formData);

    // Limpar formulário
    setFormData({
      description: "",
      amount: "",
      type: "income",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Filtrar categorias baseado no tipo selecionado
  const filteredCategories = categories.filter(
    (cat) => cat.type === "both" || cat.type === formData.type
  );

  return (
    <div className="transaction-form">
      <h2>Nova Transação</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Descrição *</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Salário, Supermercado..."
            required
          />
        </div>

        <div className="form-group">
          <label>Valor *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo *</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>

        <div className="form-group">
          <label>Categoria</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Selecione uma categoria</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Data *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Adicionar Transação
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
