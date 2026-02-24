import { useEffect } from "react";
import FeedbackForm from "./FeedbackForm";
import "./UserOrders.css";

export default function UserOrders({ orders, setOrders, user }) {

  // 🔁 Poll backend every 3 seconds for live updates
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/orders/?user=${user.username}`
        );
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Order sync failed", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, setOrders]);

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="orders-empty">
        <h3>No Orders Yet</h3>
        <p>Your placed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2 className="orders-title">Your Orders</h2>

      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.order_id} className="order-card">
            <div className="order-header">
              <span className="order-id">Order #{order.order_id}</span>
              <span className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className="order-body">
              <ul className="order-items">
                {Array.isArray(order.items) &&
                  order.items.map((item, i) => (
                    <li key={i}>
                      <span>{item.name}</span>
                      <span>× {item.quantity}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="order-footer">
              <span>Total</span>
              <strong>₹{order.total}</strong>
            </div>

            {/* Feedback after completion */}
            {order.status === "Completed" && !order.has_feedback && (
              <div className="order-feedback">
                <FeedbackForm order={order} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
