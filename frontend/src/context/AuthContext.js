import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    if (!username || !password) {
      alert("Username and password required");
      return;
    }

    // Admin login unchanged
    if (username === "admin" && password === "admin@123") {
      setUser({ username: "admin", role: "admin" });
      return;
    }

    if (username === "admin") {
      alert("Invalid admin credentials");
      return;
    }

    const res = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    setUser({
      username: data.username,
      college: data.college,   // ✅ stored
      role: "user"
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
