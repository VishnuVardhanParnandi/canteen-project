export default function Cart({ cart, removeFromCart, placeOrder }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">
      <h3>Your Cart</h3>

      {cart.length === 0 && <p className="cart-empty">Cart is empty</p>}

      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <span>
            {item.name} × {item.quantity}
          </span>

          <span>₹{item.price * item.quantity}</span>

          <button
            className="btn btn-danger"
            onClick={() => removeFromCart(item.id)}
            title="Remove one"
          >
            ✕
          </button>
        </div>
      ))}

      <div className="cart-total">
        <span>Total:</span>
        <span>₹{total}</span>
      </div>

      <button
        className="btn btn-success"
        onClick={placeOrder}
        disabled={cart.length === 0}
      >
        Place Order
      </button>
    </div>
  );
}
