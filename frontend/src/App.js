import LoginPage from "./pages/LoginPage";
import AdminPanel from "./components/admin/AdminPanel";
import UserPanel from "./components/user/UserPanel";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  if (user.role === "admin") {
    return <AdminPanel />;
  }

  return <UserPanel />;
}
