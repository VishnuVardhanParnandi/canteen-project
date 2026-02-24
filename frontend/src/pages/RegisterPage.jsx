import { useState } from "react";
import "../styles/login-ui.css";

export default function RegisterPage({ onBack }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    college: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    if (!form.username || !form.email || !form.college || !form.password) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
      } else {
        alert("Registration successful. Please login.");
        onBack();
      }
    } catch (err) {
      alert("Cannot connect to backend");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-page">
        <h2>Create Account</h2>
        <p className="sub-text">Register to use Digital Canteen</p>

        <input name="username" placeholder="Username" onChange={handleChange} />
        <input name="email" placeholder="Email address" onChange={handleChange} />
        <input name="college" placeholder="College name" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />

        <button onClick={register} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <button className="secondary-btn" onClick={onBack}>
          Back to Login
        </button>
      </div>

      {/* Right side placeholder to match login page layout */}
      <div className="login-slider register-slider">
        <div className="slider-overlay">
          <h3>Join Digital Canteen</h3>
          <p>Easy • Fast • Smart food ordering</p>
        </div>
      </div>
    </div>
  );
}
