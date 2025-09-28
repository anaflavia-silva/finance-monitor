import React, { useState, useEffect } from "react";

function CategoryManager({ token }) {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "both",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://finance-monitor-backend.onrender.com/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCategories(data.filter((cat) => cat.user_id !== null)); // Apenas categorias do usuário
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingCategory
      ? `https://finance-monitor-backend.onrender.com/api/categories/${editingCategory.id}`
      : "https://finance-monitor-backend.onrender.com/api/categories";

    const method = editingCategory ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchCategories();
        setFormData({ name: "", type: "both" });
        setShowForm(false);
        setEditingCategory(null);
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, type: category.type });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta categoria?")) {
      try {
        const response = await fetch(
          `https://finance-monitor-backend.onrender.com/api/categories/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          fetchCategories();
        }
      } catch (error) {
        console.error("Erro ao deletar categoria:", error);
      }
    }
  };

  return (
    <div className="category-manager">
      <div className="category-header">
        <h2>Gerenciar Categorias</h2>
        <button
          className="add-category-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancelar" : "Nova Categoria"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label>Nome da Categoria</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="both">Ambos</option>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingCategory ? "Atualizar" : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingCategory(null);
                setFormData({ name: "", type: "both" });
              }}
              className="cancel-btn"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="categories-list">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <div className="category-info">
              <span className="category-name">{category.name}</span>
              <span className={`category-type ${category.type}`}>
                {category.type === "both"
                  ? "Ambos"
                  : category.type === "income"
                  ? "Receita"
                  : "Despesa"}
              </span>
            </div>
            <div className="category-actions">
              <button onClick={() => handleEdit(category)} className="edit-btn">
                ✏️
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="delete-btn"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <p className="no-categories">
            Nenhuma categoria personalizada criada
          </p>
        )}
      </div>
    </div>
  );
}

export default CategoryManager;
