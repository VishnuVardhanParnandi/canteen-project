import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function FeedbackForm({ order, onSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submitFeedback = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/feedback/submit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.order_id,
          user: user.username,
          rating,
          comment
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to submit feedback");
      } else {
        setDone(true);
        onSubmitted && onSubmitted();
      }
    } catch (err) {
      alert("Network error");
    }

    setLoading(false);
  };

  if (done) {
    return <div className="feedback-box-success">✅ Feedback submitted</div>;
  }

  return (
    <div className="feedback-box">
      <h4>Rate your order</h4>

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={star <= rating ? "star active" : "star"}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
        <span className="rating-text">{rating}/5</span>
      </div>

      <textarea
        placeholder="Comment (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />

      <button
        className="feedback-box-btn"
        onClick={submitFeedback}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
}
