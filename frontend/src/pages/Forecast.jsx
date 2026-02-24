import { useEffect, useState } from "react";

export default function Forecast() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/forecast-items/")
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({}));
  }, []);

  return (
    <div className="forecast-wrapper">

      {/* Header */}
      <div className="forecast-title">
        🔮 ML Forecast — Future Quantity
      </div>

      <div className="forecast-subtitle">
        Predicted demand based on recent order patterns
      </div>

      {/* Grid */}
      <div className="forecast-grid">

        {data === null && (
          <div className="forecast-card">
            <div className="forecast-item">Loading</div>
            <div className="forecast-label">Please wait…</div>
          </div>
        )}

        {data && Object.keys(data).length === 0 && (
          <div className="forecast-card">
            <div className="forecast-item">No Data</div>
            <div className="forecast-label">
              Not enough orders to predict
            </div>
          </div>
        )}

        {data && Object.entries(data).map(([item, qty]) => (
          <div className="forecast-card" key={item}>
            <div className="forecast-item">{item}</div>
            <div className="forecast-qty">{qty}</div>
            <div className="forecast-label">
              Predicted Quantity
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
