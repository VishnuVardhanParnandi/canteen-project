import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Header() {
  const { role, username, setRole, setUsername, setCart, setOrders, setAdminOrders } =
    useContext(AppContext);

  function logout() {
    localStorage.clear();
    setRole(null);
    setUsername("");
    setCart([]);
    setOrders([]);
    setAdminOrders([]);
  }

  return (
    <header>
      <div className="brand">
        <div className="logo-circle">DC</div>
        <div>
          <h1>Digital Canteen</h1>
          <span>Smart Canteen Management System</span>
        </div>
      </div>

      <div className="header-actions">
        <span className="tag-pill">
          {!role
            ? "Not logged in"
            : role === "admin"
            ? "Logged in as Admin"
            : `Logged in as User: ${username}`}
        </span>

        {role && (
          <button className="btn btn-outline btn-sm" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
