import { useEffect, useState } from "react";

export default function ForecastPanel() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/forecast-items/")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const rows = Object.entries(data)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
    }}>
      <h3>📈 Predicted Next-Day Sales</h3>

      {loading && <p>Loading forecast…</p>}

      {!loading && rows.length === 0 && (
        <p>No forecast data available</p>
      )}

      {!loading && rows.length > 0 && (
        <table style={{ width: "100%", marginTop: 12 }}>
          <thead>
            <tr>
              <th align="left">Item</th>
              <th align="right">Predicted Qty</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([item, qty]) => (
              <tr key={item}>
                <td>{item}</td>
                <td align="right">{qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
ss