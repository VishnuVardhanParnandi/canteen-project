import { useEffect, useState } from "react";

export default function Menu({ addToCart }) {
  const [menu, setMenu] = useState([]);

  // 🔁 Poll menu every 3 seconds
  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch("http://127.0.0.1:8000/api/menu/");
      const data = await res.json();
      setMenu(data);
    };

    fetchMenu();
    const interval = setInterval(fetchMenu, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Menu</h3>

      {menu.map(item => (
        <div key={item.id} className="menu-card">
          <span>{item.name}</span>
          <span>₹{item.price}</span>
          <button onClick={() => addToCart(item)}>Add</button>
        </div>
      ))}
    </div>
  );
}
