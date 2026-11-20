import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Auth.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Registration failed"
      );
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
          <h1>Your next opportunity starts with a connection.</h1>

          <p>
            Join a growing community of developers. Share ideas,
            showcase your projects and build meaningful connections.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-icon">✦</span>
              Create your developer identity
            </div>

            <div className="auth-feature">
              <span className="auth-feature-icon">⌘</span>
              Share projects and technical knowledge
            </div>

            <div className="auth-feature">
              <span className="auth-feature-icon">↗</span>
              Discover your developer community
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

          <h2>Create your account</h2>

          <p className="auth-subtitle">
            Start building your developer network today.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email address</label>

              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">Password</label>

              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
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
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Register;