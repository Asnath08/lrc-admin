
import { useState, useEffect } from "react";
import PortailPartenaire from "./pages/AdminDashboard";
import { authService } from "./api/authService";

const C = {
  bg: "#0F0E17", bgCard: "#1A1826",
  text: "#F0EBF8", primary: "#C8520A", gold: "#D4960A",
};

function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await authService.login(email, password);
      // Vérifier que c'est bien un partenaire
      if (user.role !== "PARTNER") {
        await authService.logout();
        throw new Error("Accès réservé aux partenaires LRC");
      }
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${C.primary}, ${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", margin: "0 auto 1rem", boxShadow: `0 8px 24px rgba(200,82,10,0.35)` }}>🤝</div>
          <h1 style={{ fontFamily: "'Georgia',serif", fontSize: "1.5rem", fontWeight: "700", color: C.text, margin: "0 0 0.3rem" }}>Portail Partenaire</h1>
          <p style={{ fontSize: "0.82rem", color: "rgba(240,235,248,0.45)", margin: 0 }}>Leadership Revolutionary Center</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: C.bgCard, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.62rem", fontWeight: "700", letterSpacing: "0.1em", color: "rgba(240,235,248,0.45)", textTransform: "uppercase", marginBottom: "0.4rem" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="partenaire@organisation.com" required
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.05)", color: C.text, fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"} />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.62rem", fontWeight: "700", letterSpacing: "0.1em", color: "rgba(240,235,248,0.45)", textTransform: "uppercase", marginBottom: "0.4rem" }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.05)", color: C.text, fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"} />
          </div>
          {error && (
            <div style={{ background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, padding: "0.7rem 1rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#E74C3C" }}>
              ⚠️ {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "0.8rem", borderRadius: 10, border: "none", background: loading ? "rgba(200,82,10,0.5)" : C.primary, color: "#fff", fontWeight: "700", fontSize: "0.875rem", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : `0 4px 16px rgba(200,82,10,0.35)` }}>
            {loading ? "Connexion en cours..." : "Se connecter →"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(240,235,248,0.25)", marginTop: "1.5rem" }}>
          Accès réservé aux partenaires institutionnels LRC
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser]       = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Vérifier si déjà connecté et token encore valide
    if (authService.isAuthenticated()) {
      const stored = authService.getCurrentUser();
      if (stored) setUser(stored);
    } else {
      localStorage.clear();
    }
    setChecking(false);
  }, []);

  const handleLogin  = (u) => setUser(u);
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (checking) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(240,235,248,0.45)", fontSize: "0.875rem" }}>Chargement...</div>
    </div>
  );

  if (!user) return <LoginPage onLogin={handleLogin} />;

  if (user.role !== "ADMIN") return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.text, flexDirection: "column", gap: "1rem" }}>
      <div style={{ fontSize: "3rem" }}>🚫</div>
      <p>Accès réservé aux partenaires LRC</p>
      <button onClick={handleLogout} style={{ padding: "0.6rem 1.4rem", borderRadius: 10, border: "none", background: C.primary, color: "#fff", cursor: "pointer", fontWeight: "700" }}>
        Se déconnecter
      </button>
    </div>
  );

  return <PortailPartenaire user={user} onDeconnexion={handleLogout} />;
}