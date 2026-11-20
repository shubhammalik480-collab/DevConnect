import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand">
          Dev<span>Connect</span>.
        </div>

        <div className="auth-brand-content">
          <h1>Where developers connect and grow together.</h1>

          <p>
            Build your network, showcase your work, share knowledge
            and discover opportunities with developers worldwide.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-icon">✦</span>
              Connect with talented developers
            </div>

            <div className="auth-feature">
              <span className="auth-feature-icon">⌘</span>
              Showcase your projects and skills
            </div>

            <div className="auth-feature">
              <span className="auth-feature-icon">↗</span>
              Grow your professional network
            </div>
          </div>
        </div>

        <div className="auth-footer">
          © 2026 DevConnect. Built for developers.
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            Dev<span>Connect</span>.
          </div>

          <h2>Welcome back 👋</h2>

          <p className="auth-subtitle">
            Sign in to continue your developer journey.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in to DevConnect →"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;