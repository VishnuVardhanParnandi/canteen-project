import { useEffect, useState } from "react";
import MenuGrid from "./MenuGrid";
import Cart from "./Cart";
import UserOrders from "./UserOrders";
import Recommendations from "./Recommendations";
import PaymentModal from "./PaymentModal";
import { useAuth } from "../../context/AuthContext";
import "../../styles/canteen-ui.css";

export default function UserPanel() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  /* =========================
     CART LOGIC
  ========================= */

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === itemId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  /* =========================
     LOAD MENU (USER COLLEGE)
  ========================= */

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8000/api/menu/?college=${user.college}`)
      .then((res) => res.json())
      .then(setMenu)
      .catch((err) => console.error("Menu load failed", err));
  }, [user]);

  /* =========================
     LOAD PREVIOUS ORDERS (SORTED)
  ========================= */

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8000/api/orders/?user=${user.username}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(
          Array.isArray(data)
            ? data.sort((a, b) => b.order_id - a.order_id)
            : []
        );
      })
      .catch((err) => console.error("Orders load failed", err));
  }, [user]);

  /* =========================
     FINALIZE ORDER
  ========================= */

  const finalizeOrder = async () => {
    if (!user || cart.length === 0) return;

    const items = cart;
    const total = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const order_id = Date.now();

    // Optimistic UI update (latest on top)
    setOrders((prev) => [
      { order_id, items, total, status: "Pending" },
      ...prev,
    ]);

    try {
      await fetch("http://localhost:8000/api/orders/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id,
          user: user.username,
          items,
          total,
        }),
      });

      setCart([]);

      // Reload orders and SORT again
      fetch(`http://localhost:8000/api/orders/?user=${user.username}`)
        .then((res) => res.json())
        .then((data) => {
          setOrders(
            Array.isArray(data)
              ? data.sort((a, b) => b.order_id - a.order_id)
              : []
          );
        });

    } catch (err) {
      console.error("Order failed", err);
    }
  };

  /* =========================
     PAYMENT HANDLERS
  ========================= */

  const startPayment = () => {
    if (cart.length === 0) return;
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    finalizeOrder();
    setActiveTab("orders");
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (!user) return null;

  const totalAmount = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  /* =========================
     UI
  ========================= */

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header className="user-header">
        <div>
          <h2>Welcome {user.username}</h2>
          <p className="college-text">College: {user.college}</p>
        </div>

        <div className="icon-bar">
          <div
            className={`icon-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            🏠
            <span>Home</span>
          </div>

          <div
            className={`icon-btn ${activeTab === "menu" ? "active" : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            🍽
            <span>Menu</span>
          </div>

          <div
            className={`icon-btn ${activeTab === "cart" ? "active" : ""}`}
            onClick={() => setActiveTab("cart")}
          >
            🛒
            {cart.length > 0 && <span className="dot" />}
            <span>Cart</span>
          </div>

          <div
            className={`icon-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            📦
            <span>Orders</span>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* ================= HOME ================= */}
      {activeTab === "home" && (
        <div className="home-fullscreen">
          <img
            src="/images/canteen1.jpg"
            alt="Canteen"
            className="home-bg-image"
          />
          <div className="home-overlay">
            <h1>Welcome to College Canteen</h1>
            <p>Fresh • Hygienic • Affordable</p>
          </div>
        </div>
      )}

      {/* ================= MENU ================= */}
      {activeTab === "menu" && (
        <>
          <Recommendations addToCart={addToCart} />

          {cart.length > 0 && (
            <div className="go-cart-wrapper">
              <button
                className="go-cart-btn"
                onClick={() => setActiveTab("cart")}
              >
                🛒 Go to Cart
              </button>
            </div>
          )}

          <MenuGrid
            menu={menu}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        </>
      )}

      {/* ================= CART ================= */}
      {activeTab === "cart" && (
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          placeOrder={startPayment}
        />
      )}

      {/* ================= ORDERS ================= */}
      {activeTab === "orders" && (
        <UserOrders orders={orders} />
      )}

      {/* ================= PAYMENT ================= */}
      {showPayment && (
        <PaymentModal
          total={totalAmount}
          onCancel={handlePaymentCancel}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
