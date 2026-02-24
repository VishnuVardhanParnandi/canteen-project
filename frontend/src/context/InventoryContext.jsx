import { createContext, useContext, useEffect, useState } from "react";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);

  const loadInventory = () => {
    fetch("http://127.0.0.1:8000/api/menu/")
      .then(res => res.json())
      .then(data => setInventory(data))
      .catch(() => setInventory([]));
  };

  useEffect(() => {
    loadInventory();

    const interval = setInterval(loadInventory, 3000); // auto refresh

    return () => clearInterval(interval);
  }, []);

  return (
    <InventoryContext.Provider value={{ inventory, reload: loadInventory }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
