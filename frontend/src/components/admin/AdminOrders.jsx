import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const interval = setInterval(fetchOrders, 2000);
    fetchOrders();
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/orders/");
    const data = await res.json();
    setOrders(data);
  };

  const updateStatus = async (order_id, status) => {
    await fetch(`http://127.0.0.1:8000/api/orders/${order_id}/status/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    fetchOrders();
  };

  return (
    <div>
      <h3>Live Orders</h3>

      {orders.map((order) => (
        <div key={order.order_id}>
          <h4>Order #{order.order_id}</h4>
          <p>User: {order.user}</p>
          <p>Total: ₹{order.total}</p>

          <select
            value={order.status}
            disabled={order.status === "Completed"}
            onChange={(e) =>
              updateStatus(order.order_id, e.target.value)
            }
          >
            <option value="Pending">Pending</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      ))}
    </div>
  );
}
