import { useEffect, useState } from "react";

export default function Recommendations({ addToCart }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/recommendations/")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  return (
    <div className="recommendations">

      <h3>⭐ Top Rated Items</h3>
      <div className="rec-grid">
        {data.top_rated.map(item => (
          <div key={item.id} className="rec-card">
            <b>{item.name}</b>
            <p>₹{item.price}</p>
            <p>⭐ {item.rating}</p>
            <button onClick={() => addToCart(item)}>Add</button>
          </div>
        ))}
      </div>

      <h3>🔥 Most Sold Items</h3>
      <div className="rec-grid">
        {data.most_sold.map(item => (
          <div key={item.id} className="rec-card">
            <b>{item.name}</b>
            <p>₹{item.price}</p>
            <p>Sold: {item.sold}</p>
            <button onClick={() => addToCart(item)}>Add</button>
          </div>
        ))}
      </div>

    </div>
  );
}
