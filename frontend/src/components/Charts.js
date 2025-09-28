import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Charts({ transactions }) {
  // Dados para gráfico de linha (evolução mensal)
  const getMonthlyData = () => {
    const monthlyData = {};

    transactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }

      if (transaction.type === "income") {
        monthlyData[month].income += parseFloat(transaction.amount);
      } else {
        monthlyData[month].expense += parseFloat(transaction.amount);
      }
    });

    const months = Object.keys(monthlyData).sort();
    const incomeData = months.map((month) => monthlyData[month].income);
    const expenseData = months.map((month) => monthlyData[month].expense);

    return {
      labels: months,
      datasets: [
        {
          label: "Receitas",
          data: incomeData,
          borderColor: "#10b981",
          backgroundColor: "#10b981",
          tension: 0.1,
        },
        {
          label: "Despesas",
          data: expenseData,
          borderColor: "#ef4444",
          backgroundColor: "#ef4444",
          tension: 0.1,
        },
      ],
    };
  };

  // Dados para gráfico de categorias
  const getCategoryData = () => {
    const categoryTotals = {};

    transactions
      .filter((t) => t.type === "expense" && t.category)
      .forEach((transaction) => {
        const category = transaction.category || "Sem categoria";
        categoryTotals[category] =
          (categoryTotals[category] || 0) + parseFloat(transaction.amount);
      });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#FF6384",
      "#C9CBCF",
    ];

    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: colors.slice(0, categories.length),
          borderWidth: 2,
        },
      ],
    };
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Evolução Mensal de Receitas e Despesas",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "R$ " + value.toFixed(2);
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Despesas por Categoria",
      },
    },
  };

  if (transactions.length === 0) {
    return (
      <div className="charts-container">
        <p>Adicione algumas transações para ver os gráficos</p>
      </div>
    );
  }

  return (
    <div className="charts-container">
      <div className="chart-section">
        <div className="chart-wrapper">
          <Line data={getMonthlyData()} options={lineOptions} />
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-wrapper doughnut-chart">
          <Doughnut data={getCategoryData()} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
}

export default Charts;
