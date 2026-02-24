export default function MenuCard({
  item,
  quantity = 0,
  addToCart,
  removeFromCart,
  isTopRated = false,
  isPopular = false,
  rating = 0,
  sold = 0
}) {
  const outOfStock = item.stock <= 0;

  return (
    <div className={`menu-card ${outOfStock ? "out" : ""}`}>

      {/* ✅ Badges */}
      {(isTopRated || isPopular) && (
        <div className="badges">
          {isTopRated && <span className="badge top">⭐ Top Rated</span>}
          {isPopular && <span className="badge hot">🔥 Popular</span>}
        </div>
      )}

      <h3>{item.name}</h3>
      <p className="price">₹{item.price}</p>

      <div className="rating">
        ⭐ {rating} | Sold: {sold}
      </div>

      <div className="stock">Stock: {item.stock}</div>

      {/* Controls */}
      {outOfStock ? (
        <button className="btn-disabled" disabled>
          Unavailable
        </button>
      ) : quantity === 0 ? (
        <button className="btn-add" onClick={() => addToCart(item)}>
          ADD
        </button>
      ) : (
        <div className="qty-box">
          <button onClick={() => removeFromCart(item.id)}>−</button>
          <span>{quantity}</span>
          <button onClick={() => addToCart(item)}>+</button>
        </div>
      )}
    </div>
  );
}
