import { useState, useEffect } from "react";
import theme from "../theme.js";
import api from "../api/axios.js";

function SuiviProgression({ utilisateur, onClose }) {
  const [data, setData] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onglet, setOnglet] = useState("progression");

  useEffect(() => {
    charger();
  }, []);

  const charger = async () => {
    try {
      const [progRes, inscRes] = await Promise.all([
        api.get(`/admin/users/${utilisateur.id}/progression`),
        api.get(`/admin/users/${utilisateur.id}/inscriptions`),
      ]);
      setData(progRes.data);
      setInscriptions(inscRes.data);
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>
              📈 {utilisateur.prenom} {utilisateur.nom}
            </h2>
            <p style={{ color: theme.colors.textMuted, fontSize: "0.85rem", margin: "0.2rem 0 0" }}>
              {utilisateur.email}
            </p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* STATS RAPIDES */}
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{data?.totalCompletes || 0}</span>
            <span style={styles.statLabel}>Leçons complétées</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{inscriptions.length}</span>
            <span style={styles.statLabel}>Programmes inscrits</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNum}>
              {inscriptions.filter(i => i.statut === "CONFIRMED").length}
            </span>
            <span style={styles.statLabel}>Confirmés</span>
          </div>
        </div>

        {/* ONGLETS */}
        <div style={styles.tabs}>
          {[
            { id: "progression", label: "📈 Progression" },
            { id: "inscriptions", label: "📚 Inscriptions" },
          ].map(tab => (
            <button
              key={tab.id}
              style={{ ...styles.tab, ...(onglet === tab.id ? styles.tabActive : {}) }}
              onClick={() => setOnglet(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={styles.body}>
          {loading ? (
            <p style={styles.empty}>Chargement...</p>
          ) : onglet === "progression" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {!data?.progression?.length ? (
                <p style={styles.empty}>Aucune progression enregistrée.</p>
              ) : data.progression.map((p, i) => (
                <div key={i} style={styles.progItem}>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: p.statut === "COMPLETED" ? "#006633" : theme.colors.primary,
                      backgroundColor: p.statut === "COMPLETED"
                        ? "rgba(0,150,50,0.1)" : "rgba(200,82,10,0.1)",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                    }}>
                      {p.statut === "COMPLETED" ? "✅ Complété" : "🔄 En cours"}
                    </span>
                    {p.score > 0 && (
                      <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: theme.colors.textMuted }}>
                        Score : {p.score}/100
                      </span>
                    )}
                  </div>
                  {p.completedAt && (
                    <span style={{ fontSize: "0.75rem", color: theme.colors.textMuted }}>
                      {new Date(p.completedAt).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {!inscriptions.length ? (
                <p style={styles.empty}>Aucune inscription.</p>
              ) : inscriptions.map(ins => (
                <div key={ins.id} style={styles.progItem}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: theme.colors.textDark, fontSize: "0.9rem" }}>
                      {ins.programme.titre}
                    </strong>
                    <p style={{ color: theme.colors.textMuted, fontSize: "0.78rem", margin: "0.2rem 0 0" }}>
                      {ins.programme.categorie} · Inscrit le {new Date(ins.dateInscription).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    color: ins.statut === "CONFIRMED" ? "#006633" : theme.colors.primary,
                    backgroundColor: ins.statut === "CONFIRMED"
                      ? "rgba(0,150,50,0.1)" : "rgba(200,82,10,0.1)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    flexShrink: 0,
                  }}>
                    {ins.statut}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    zIndex: 3000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  modal: {
    backgroundColor: theme.colors.bgWhite,
    borderRadius: "16px",
    width: "100%",
    maxWidth: "540px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1.5rem 1.8rem",
    borderBottom: "1px solid rgba(74,55,40,0.1)",
  },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: "1.2rem",
    fontWeight: "900",
    color: theme.colors.textDark,
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.1rem",
    cursor: "pointer",
    color: theme.colors.textMuted,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1px",
    backgroundColor: "rgba(74,55,40,0.1)",
    borderBottom: "1px solid rgba(74,55,40,0.1)",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: theme.colors.bgWhite,
    gap: "0.2rem",
  },
  statNum: {
    fontFamily: theme.fonts.heading,
    fontSize: "1.8rem",
    fontWeight: "700",
    color: theme.colors.primary,
    lineHeight: "1",
  },
  statLabel: {
    fontSize: "0.7rem",
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  tabs: {
    display: "flex",
    borderBottom: "2px solid rgba(74,55,40,0.1)",
    padding: "0 1.5rem",
  },
  tab: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    padding: "0.75rem 1rem",
    color: theme.colors.textMuted,
    borderBottom: "2px solid transparent",
    marginBottom: "-2px",
    fontFamily: theme.fonts.body,
    transition: "all 0.2s",
  },
  tabActive: {
    color: theme.colors.primary,
    borderBottom: `2px solid ${theme.colors.primary}`,
  },
  body: { padding: "1.2rem 1.8rem 1.8rem" },
  progItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    borderBottom: "1px solid rgba(74,55,40,0.07)",
  },
  empty: {
    textAlign: "center",
    color: theme.colors.textMuted,
    padding: "2rem",
  },
};

export default SuiviProgression;