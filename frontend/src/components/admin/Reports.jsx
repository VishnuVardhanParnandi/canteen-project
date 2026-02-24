import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Reports() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders/")
      .then(res => res.json())
      .then(setOrders)
      .catch(err => console.error("Failed to fetch orders", err));
  }, []);

  /* ---------------- Revenue ---------------- */
  const revenue = orders.reduce(
    (sum, o) => sum + (Number(o.total) || 0),
    0
  );

  /* ---------------- Status Pie ---------------- */
  const statusCounts = orders.reduce((acc, o) => {
    const s = o.status || "Pending";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#facc15", "#22c55e", "#3b82f6"],
      },
    ],
  };

  /* ---------------- Daily Sales ---------------- */
  const dailySales = {};

  orders.forEach(o => {
    if (!o.created_at) return;
    const date = o.created_at.split("T")[0];
    dailySales[date] =
      (dailySales[date] || 0) + (Number(o.total) || 0);
  });

  const dailyBarData = {
    labels: Object.keys(dailySales),
    datasets: [
      {
        label: "Daily Revenue (₹)",
        data: Object.values(dailySales),
        backgroundColor: "#6366f1",
      },
    ],
  };

  /* ---------------- Item Sales ---------------- */
  const itemSales = {};

  orders.forEach(order => {
    if (!Array.isArray(order.items)) return;

    order.items.forEach(item => {
      const name = item.name;
      const qty = Number(item.quantity) || 1;
      itemSales[name] = (itemSales[name] || 0) + qty;
    });
  });

  const itemSalesData = {
    labels: Object.keys(itemSales),
    datasets: [
      {
        label: "Quantity Sold",
        data: Object.values(itemSales),
        backgroundColor: "#22c55e",
      },
    ],
  };

  return (
    <div className="reports-wrapper">
      <h2 className="reports-title">Sales Analytics</h2>
      <p className="reports-subtitle">
        Performance overview of orders and revenue
      </p>

      {/* Summary Cards */}
      <div className="reports-summary">
        <div className="reports-summary-card">
          <h4>Total Orders</h4>
          <p>{orders.length}</p>
        </div>

        <div className="reports-summary-card">
          <h4>Total Revenue</h4>
          <p>₹{revenue.toFixed(2)}</p>
        </div>

        <div className="reports-summary-card">
          <h4>Items Sold</h4>
          <p>
            {Object.values(itemSales).reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="reports-grid">

        <div className="reports-chart-card">
          <h4>📦 Orders by Status</h4>
          <div className="reports-chart-wrapper">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="reports-chart-card">
          <h4>📅 Daily Revenue</h4>
          <div className="reports-chart-wrapper">
            <Bar data={dailyBarData} />
          </div>
        </div>

        <div className="reports-chart-card">
          <h4>🍔 Item Sales (Quantity)</h4>
          <div className="reports-chart-wrapper">
            <Bar
              data={itemSalesData}
              options={{
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                  },
                },
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
