import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const placeOrder = (username, items, total) => {
    const order = {
      id: Date.now(),
      user: username,
      items,
      total,
      status: "Pending",
      time: new Date().toLocaleTimeString(),
    };
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
