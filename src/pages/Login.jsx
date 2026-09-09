import { useState } from "react";
import { api, setToken } from "../api.js";

export default function Login({ onLoggedIn, onGoRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await api.login(username.trim(), password);
      setToken(data.access);
      onLoggedIn();
    } catch (err) {
      setError("Couldn't sign you in. Check your username and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen">
      <div style={{ marginTop: 24 }}>
        <p className="eyebrow">CivicConnect</p>
        <h1 style={{ fontSize: 26, marginTop: 6 }}>Report it. Track it. Get it fixed.</h1>
        <p style={{ marginTop: 8 }}>
          Sign in to report a problem with a street light, water pump, or other public asset in your area.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <button className="btn-text" onClick={onGoRegister}>
        New here? Create a citizen account →
      </button>
    </div>
  );
}
