import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/users/login",
        formData
      );

      const user = response.data;

      if (!user) {
        setMessage("Invalid email or password.");
        return;
      }

      login(user);

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      setMessage("Login failed. Please check your details.");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-brand">
          SOLESTYLE
        </div>

        <div className="auth-card">

          <div className="auth-header">
            <p className="section-label">WELCOME BACK</p>

            <h1>Login</h1>

            <p>
              Login to continue shopping with SoleStyle.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="auth-form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {message && (
              <p className="auth-message error">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="auth-button"
            >
              LOGIN
            </button>

          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create Account</Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;