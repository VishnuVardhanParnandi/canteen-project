import { useEffect, useState } from "react";

export default function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/menu/");
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error("Menu fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
    const interval = setInterval(fetchMenu, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Group by college
  const groupByCollege = items => {
    return items.reduce((acc, item) => {
      const college = item.college || "Unknown";
      if (!acc[college]) acc[college] = [];
      acc[college].push(item);
      return acc;
    }, {});
  };

  const groupedMenu = groupByCollege(menu);

  return (
    <div className="admin-menu-wrapper">
      <h3>Menu (Database)</h3>

      {loading && <p>Loading...</p>}

      {!loading && menu.length === 0 && (
        <p>No menu items found. Add items in Django Admin.</p>
      )}

      {!loading &&
        Object.entries(groupedMenu).map(([college, items]) => (
          <div key={college} style={{ marginBottom: "35px" }}>
            <h4
              style={{
                margin: "20px 0 10px",
                color: "#1e40af",
                borderBottom: "2px solid #e5e7eb",
                paddingBottom: "6px"
              }}
            >
              {college}
            </h4>

            <div className="admin-menu">
              {items.map(item => {
                const stockClass =
                  item.stock === 0 ? "out" :
                  item.stock <= 5 ? "low" : "in";

                return (
                  <div key={item.id} className="admin-menu-card">
                    <h4>{item.name}</h4>

                    <div className="admin-price">₹{item.price}</div>

                    <div className={`admin-stock ${stockClass}`}>
                      {item.stock === 0
                        ? "Out of Stock"
                        : `Stock: ${item.stock}`}
                    </div>

                    <div className="admin-status">
                      Status: {item.stock > 0 ? "Available" : "Unavailable"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      <a
        className="admin-link"
        href="http://127.0.0.1:8000/admin/canteen/menuitem/"
        target="_blank"
        rel="noreferrer"
      >
        ➜ Open Django Admin Menu Manager
      </a>
    </div>
  );
}
