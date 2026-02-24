import MenuGrid from "../components/user/MenuGrid";
import Cart from "../components/user/Cart";
import UserOrders from "../components/user/UserOrders";

export default function UserPage() {
  return (
    <section>
      <div className="main-grid">
        <div className="card">
          <MenuGrid />
          <UserOrders />
        </div>
        <Cart />
      </div>
    </section>
  );
}
