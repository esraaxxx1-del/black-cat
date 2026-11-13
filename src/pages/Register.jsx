import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usersDB = JSON.parse(localStorage.getItem("blackCat_users")) || [];

    if (isLogin) {
      const existingUser = usersDB.find(
        (user) => user.email === formData.email,
      );

      if (!existingUser) {
        setError("Account not found. Please create one first.");
        return;
      }
      if (existingUser.password !== formData.password) {
        setError("Incorrect password! Please try again.");
        return;
      }

      localStorage.setItem("blackCat_userName", existingUser.name);
      localStorage.setItem("blackCat_currentUser", formData.email);
      localStorage.removeItem("blackCat_projectName");
      localStorage.removeItem("blackCat_projectDate");
      localStorage.removeItem("blackCat_segments");
      localStorage.removeItem("blackCat_originalFile");
      navigate("/dashboard");
    } else {

      const emailExists = usersDB.some((user) => user.email === formData.email);

      if (emailExists) {
        setError("This email is already registered. Please log in.");
        return;
      }

      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      usersDB.push(newUser);
      localStorage.setItem("blackCat_users", JSON.stringify(usersDB));
      localStorage.setItem("blackCat_userName", newUser.name);
      localStorage.setItem("blackCat_currentUser", formData.email);
      localStorage.removeItem("blackCat_projectName");
      localStorage.removeItem("blackCat_projectDate");
      localStorage.removeItem("blackCat_segments");
      localStorage.removeItem("blackCat_originalFile");
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">BLACK CAT 🐾</h1>
          <p className="auth-subtitle">
            {isLogin
              ? "Welcome back, Translator"
              : "Create your translator account"}
          </p>
              </div>
              
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="e.g. Esraa Abdulbasit"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="translator@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? "Log In" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="auth-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </div>
      </div>
    </div>
  );
}
