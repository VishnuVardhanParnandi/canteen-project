import { useAuth } from "../../context/AuthContext";
import AdminTabs from "./AdminTabs";
import "../../styles/admin-ui.css";


export default function AdminPanel() {
  const { logout, user } = useAuth();

  return (
    <div>
      <header>
        <h2>Admin Dashboard – {user.username}</h2>
        <button onClick={logout}>Logout</button>
      </header>

      <AdminTabs />
    </div>
  );
}
