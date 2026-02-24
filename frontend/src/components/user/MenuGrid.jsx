import { useEffect, useState } from "react";
import MenuCard from "./MenuCard";

export default function MenuGrid({
  menu = [],          // user college menu (initial)
  cart = [],
  addToCart,
  removeFromCart,
}) {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [activeMenu, setActiveMenu] = useState(menu);

  // 🔹 Get quantity from cart
  const getQty = (id) => {
    const found = cart.find((i) => i.id === id);
    return found ? found.quantity : 0;
  };

  // 🔹 Fetch ALL colleges
  useEffect(() => {
    fetch("http://localhost:8000/api/colleges/")
      .then((res) => res.json())
      .then((data) => setColleges(data))
      .catch(() => {});
  }, []);

  // 🔹 When college changes, fetch its menu
  useEffect(() => {
    if (!selectedCollege) {
      setActiveMenu(menu);
      return;
    }

    fetch(
      `http://localhost:8000/api/menu/?college=${encodeURIComponent(
        selectedCollege
      )}`
    )
      .then((res) => res.json())
      .then((data) => setActiveMenu(data))
      .catch(() => setActiveMenu([]));
  }, [selectedCollege, menu]);

  return (
    <div>
      {/* 🔽 College Dropdown */}
      <div style={{ textAlign: "center", margin: "15px 0" }}>
        <select
          value={selectedCollege}
          onChange={(e) => setSelectedCollege(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            minWidth: "220px",
          }}
        >
          <option value="" disabled>
            Select College
          </option>
          {colleges.map((college, idx) => (
            <option key={idx} value={college}>
              {college}
            </option>
          ))}
        </select>
      </div>

      {/* 🧾 Menu Grid */}
      <div className="menu-grid">
        {!selectedCollege ? (
          <div className="menu-empty-screen">
           <p>Please select a college to view menu</p>
          </div>

        ) : activeMenu.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            No items available for this college
          </p>
        ) : (
          activeMenu.map((item) => {
            const qty = getQty(item.id);

            // 🔹 Rating / Popular logic (unchanged)
            const rating = Number(
              item.avg_rating ?? item.rating ?? 0
            );
            const sold = Number(
              item.sold ??
                item.sold_count ??
                item.total_sold ??
                0
            );

            const isTopRated = rating >= 4.5;
            const isPopular = sold >= 10;

            return (
              <MenuCard
                key={item.id}
                item={item}
                quantity={qty}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                isTopRated={isTopRated}
                isPopular={isPopular}
                rating={rating}
                sold={sold}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
