import "../../styles/canteen-ui.css";

export default function PaymentModal({ total, onCancel, onSuccess }) {
  const upiId = "canteen@upi";
  const merchant = "Digital Canteen";

  const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchant
  )}&am=${total}&cu=INR`;

  return (
    <div className="payment-overlay">
      <div className="payment-box">
        <h3>Demo Payment</h3>

        <p className="amount">Amount: ₹{total}</p>

        <div className="upi-section">
          <p className="upi-title">Scan & Pay (Demo UPI)</p>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              qrData
            )}`}
            alt="UPI QR Code"
            className="upi-qr"
          />

          <p className="upi-id">UPI ID: {upiId}</p>
        </div>

        <div className="payment-methods">
          <button className="pay-btn" onClick={onSuccess}>
            I Have Paid (Demo)
          </button>

          <button className="card-btn" onClick={onSuccess}>
            Pay with Card (Demo)
          </button>

          <button className="cash-btn" onClick={onSuccess}>
            Cash on Delivery
          </button>
        </div>

        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}