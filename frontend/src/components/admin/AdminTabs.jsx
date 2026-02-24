import { useState } from "react";

import AdminMenu from "./AdminMenu";
import AdminOrders from "./AdminOrders";
import Reports from "./Reports";
import AdminFeedback from "./AdminFeedback";
import Forecast from "../../pages/Forecast";
import "../../styles/admin-ui.css";



export default function AdminTabs() {
  const [tab, setTab] = useState("menu");   // single source of truth

  return (
    <div className="admin-tabs">

      {/* ===== TAB BUTTONS ===== */}
    <div className="tab-buttons">
  	<button onClick={() => setTab("menu")}>Menu</button>
	<button onClick={() => setTab("orders")}>Orders</button>
  	<button onClick={() => setTab("reports")}>Reports</button>
  	<button onClick={() => setTab("feedback")}>Feedback</button>
  	<button onClick={() => setTab("forecast")}>Forecast</button>
    </div>

      {/* ===== TAB CONTENT ===== */}
      <div className="tab-content">
        {tab === "menu" && <AdminMenu />}
        {tab === "orders" && <AdminOrders />}
        {tab === "reports" && <Reports />}
        {tab === "feedback" && <AdminFeedback />}
        {tab=== "forecast" && <Forecast />}

      </div>

    </div>
  );
}
