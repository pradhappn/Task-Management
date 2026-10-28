
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/Auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register({ name, email, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">TaskFlow</div>
        <h1>Create your account</h1>
        <p className="auth-subtitle">Start organizing your work.</p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="form-label">Full name</label>
          <input
            id="name"
            className="form-control mb-3"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={80}
            required
          />

          <label htmlFor="register-email" className="form-label">Email</label>
          <input
            id="register-email"
            className="form-control mb-3"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="register-password" className="form-label">Password</label>
          <input
            id="register-password"
            className="form-control mb-4"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={72}
            required
          />

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
