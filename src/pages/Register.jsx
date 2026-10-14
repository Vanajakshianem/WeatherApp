
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role: "STUDENT",
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Registration failed.");
      }

      alert("Account created successfully! Please sign in.");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-decoration register-decoration-one" />
      <div className="register-decoration register-decoration-two" />

      <section className="register-card">
        <div className="register-icon">🌤️</div>

        <p className="register-eyebrow">WELCOME TO WEATHERAPP</p>

        <h1>Create your account</h1>

        <p className="register-subtitle">
          Your weather updates and daily plans, all in one place.
        </p>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          {error && <p className="register-error">{error}</p>}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Sign in</span>
        </p>

        <p className="register-footer">
          ☁️ Weather updates for a better day
        </p>
      </section>
    </main>
  );
}

export default Register;
