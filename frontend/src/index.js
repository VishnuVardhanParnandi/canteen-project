import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { OrderProvider } from "./context/OrderContext";
import { InventoryProvider } from "./context/InventoryContext";
import { AuthProvider } from "./context/AuthContext";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <InventoryProvider>
      <OrderProvider>
        <App />
      </OrderProvider>
    </InventoryProvider>
  </AuthProvider>
);
