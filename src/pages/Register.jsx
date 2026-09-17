import { useState } from "react";
import { api } from "../api.js";

export default function Register({ onRegistered, onGoLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", phone_number: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username.trim() || form.password.length < 8) {
      setError("Fill in a username and a password of at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.register(form);
      onRegistered();
    } catch (err) {
  setError(err.message || "Couldn't create your account. That username or email may already be taken.");
} finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen">
      <div style={{ marginTop: 24 }}>
        <p className="eyebrow">Create account</p>
        <h1 style={{ fontSize: 24, marginTop: 6 }}>Join CivicConnect</h1>
        <p style={{ marginTop: 8 }}>Citizen accounts can report issues and track their status.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="field">
          <label htmlFor="reg-username">Username</label>
          <input id="reg-username" type="text" value={form.username} onChange={(e) => update("username", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="reg-email">Email(optional)</label>
          <input id="reg-email" type="text" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="reg-phone">Phone number</label>
          <input id="reg-phone" type="text" value={form.phone_number} onChange={(e) => update("phone_number", e.target.value)} />
          <span className="hint">Optional — used only if an officer needs to reach you about a report.</span>
        </div>
        <div className="field">
          <label htmlFor="reg-password">Password</label>
          <input id="reg-password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
          <span className="hint">At least 8 characters.</span>
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <button className="btn-text" onClick={onGoLogin}>
        Already have an account? Sign in →
      </button>
    </div>
  );
}
