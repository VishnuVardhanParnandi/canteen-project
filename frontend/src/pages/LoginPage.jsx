import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/login-ui.css";
import RegisterPage from "./RegisterPage";

export default function LoginPage() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  // slideshow (unchanged)
  const images = [
    "/images/canteen1.jpg",
    "/images/canteen2.jpg",
    "/images/canteen3.jpg",
    "/images/canteen4.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  if (showRegister) {
    return <RegisterPage onBack={() => setShowRegister(false)} />;
  }

  return (
    <div className="login-container">
      <div className="login-page">
        <h2>Digital Canteen Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={() => login(username, password)}>
          Login
        </button>

        {/* NEW register button */}
        <button
          className="secondary-btn"
          onClick={() => setShowRegister(true)}
        >
          Register
        </button>

        <div className="login-hint">
          <p><b>Admin:</b> admin / admin@123</p>
          <p><b>User:</b> Must be registered</p>
        </div>
      </div>

      <div className="login-slider">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Canteen"
            className={i === index ? "active" : ""}
          />
        ))}
        <div className="slider-overlay">
          <h3>Welcome to Digital Canteen</h3>
          <p>Fast • Smart • Cashless Ordering</p>
        </div>
      </div>
    </div>
  );
}
