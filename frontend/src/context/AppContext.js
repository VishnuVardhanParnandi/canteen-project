import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Header() {
  const {
    role,
    setRole,
    username,
    setUsername,
    setCart,
    setOrders,
    setAdminOrders
  } = useContext(AppContext);

  function logout() {
    // Clear persistent storage
    localStorage.clear();

    // Reset ALL app state
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
          {role
            ? role === "admin"
              ? "Logged in as Admin"
              : `Logged in as ${username}`
            : "Not logged in"}
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
