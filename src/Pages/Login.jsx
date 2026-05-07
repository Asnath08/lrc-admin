import { useState } from "react";
import api from "../api/axios.js";

const C = {
  bg: "#0F0E17", bgCard: "#1A1826", border: "rgba(255,255,255,0.07)",
  primary: "#C8520A", gold: "#D4960A", text: "#F0EBF8",
  textMuted: "rgba(240,235,248,0.45)", red: "#E74C3C",
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);
    try {
      const res = await api.post("/auth/login", { email, motDePasse: password });
      const { accessToken, user } = res.data;

      if (user.role !== "ROLE_ADMIN" && user.role !== "ADMIN") {
        setErreur("Accès réservé aux administrateurs.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/";
    } catch (err) {
      setErreur("Email ou mot de passe incorrect.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg,${C.primary},${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 1rem" }}>🛡️</div>
          <h1 style={{ fontFamily: "'Georgia',serif", fontSize: "1.5rem", color: C.text, margin: 0 }}>Administration LRC</h1>
          <p style={{ fontSize: "0.8rem", color: C.textMuted, margin: "0.5rem 0 0" }}>Leadership Revolutionary Center</p>
        </div>

        {/* Erreur */}
        {erreur && (
          <div style={{ background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.82rem", color: C.red }}>
            ❌ {erreur}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="admin@lrc.org"
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.05)", color: C.text, fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.05)", color: C.text, fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
          </div>

          <button type="submit" disabled={chargement}
            style={{ padding: "0.8rem", borderRadius: 10, border: "none", background: C.primary, color: "#fff", fontWeight: "700", fontSize: "0.9rem", cursor: chargement ? "not-allowed" : "pointer", opacity: chargement ? 0.7 : 1, marginTop: "0.5rem" }}>
            {chargement ? "Connexion..." : "Se connecter →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.78rem", color: C.textMuted, marginTop: "1.5rem" }}>
          Accès réservé aux administrateurs LRC uniquement.
        </p>
      </div>
    </div>
  );
}

export default Login;