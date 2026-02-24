import { useEffect, useState } from "react";
import "../../styles/admin-ui.css";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/feedback/all/")
      .then(res => res.json())
      .then(setFeedbacks);
  }, []);

  return (
    <div className="admin-feedback-container">
      <h3 className="admin-feedback-title">Customer Feedback</h3>

      {feedbacks.map((f, i) => (
        <div key={i} className="feedback-card">
          <div className="feedback-row">
            <span className="label">Order:</span>
            <span>{f.order_id}</span>
          </div>

          <div className="feedback-row">
            <span className="label">User:</span>
            <span>{f.user}</span>
          </div>

          <div className="feedback-row">
            <span className="label">Rating:</span>
            <span className="rating">⭐ {f.rating}</span>
          </div>

          <div className="feedback-comment">
            <span className="label">Comment:</span>
            <p>{f.comment || "No comment provided"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
