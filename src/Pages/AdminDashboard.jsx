import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import theme, { adminStyles as baseStyles } from "../theme.js";
import api from "../api/axios.js";
import { authService } from "../api/index.js";
import { ConfirmModal, SuccessModal } from "../components/Modal.jsx";
import CreerProgramme from "../components/CreerProgramme.jsx";
import CreerEvenement from "../components/CreerEvenement.jsx";
import { ONGLETS, STATS_CONFIG } from "../data/adminData.js";
import SuiviProgression from "../Pages/SuiviProgression.jsx";

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  bg:          "#0F0E17",
  bgCard:      "#1A1826",
  bgCardHover: "#201E2E",
  border:      "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.15)",
  primary:     "#C8520A",
  primaryGlow: "rgba(200,82,10,0.25)",
  gold:        "#D4960A",
  green:       "#2ECC71",
  red:         "#E74C3C",
  blue:        "#3498DB",
  purple:      "#9B59B6",
  text:        "#F0EBF8",
  textMuted:   "rgba(240,235,248,0.45)",
  textDim:     "rgba(240,235,248,0.22)",
};

const NAV = [
  { id: "stats",           icon: "📊", label: "Stats" },
  { id: "users",           icon: "👥", label: "Utilisateurs" },
  { id: "programmes",      icon: "➕", label: "Nouveau prog." },
  { id: "listeProgrammes", icon: "📋", label: "Programmes" },
  { id: "evenements",      icon: "➕", label: "Nouvel évén." },
  { id: "listeEvenements", icon: "📅", label: "Événements" },
  { id: "progression",     icon: "📈", label: "Progression" },
  { id: "notifications",   icon: "🔔", label: "Notifications" },
  { id: "kpis",            icon: "💹", label: "KPIs" },
  { id: "rapports",        icon: "📄", label: "Rapports" },
  { id: "configuration",   icon: "⚙️", label: "Config" },
];

// ── Hook responsive ────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ── Micro-composants ──────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontFamily: "'Georgia',serif", fontSize: "1.15rem", fontWeight: "700", color: C.text, margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
      {children}
    </h2>
  );
}

function Chip({ children, color = C.primary }) {
  return (
    <span style={{ fontSize: "0.68rem", fontWeight: "700", padding: "0.15rem 0.6rem", borderRadius: "999px", backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

function Card({ children, title, style = {} }) {
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "1.5rem", ...style }}>
      {title && (
        <h3 style={{ fontFamily: "'Georgia',serif", fontSize: "0.95rem", fontWeight: "700", color: C.text, margin: "0 0 1.25rem", paddingBottom: "0.75rem", borderBottom: `1px solid ${C.border}` }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.62rem", fontWeight: "700", letterSpacing: "0.1em", color: C.textMuted, textTransform: "uppercase", marginBottom: "0.4rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function DInput({ value, onChange, placeholder, type = "text", textarea = false }) {
  const [foc, setFoc] = useState(false);
  const Tag = textarea ? "textarea" : "input";
  return (
    <Tag value={value} onChange={onChange} placeholder={placeholder} type={type}
      onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${foc ? C.primary : C.border}`, borderRadius: "10px", padding: "0.7rem 1rem", color: C.text, fontSize: "0.875rem", fontFamily: theme.fonts.body, outline: "none", width: "100%", boxSizing: "border-box", resize: textarea ? "vertical" : undefined, minHeight: textarea ? "80px" : undefined, transition: "border 0.2s", placeholderColor: C.textDim }}
    />
  );
}

function DSelect({ value, onChange, children, style = {} }) {
  return (
    <select value={value} onChange={onChange}
      style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, padding: "0.7rem 1rem", fontSize: "0.875rem", fontFamily: theme.fonts.body, width: "100%", cursor: "pointer", ...style }}>
      {children}
    </select>
  );
}

function Btn({ children, onClick, color = C.primary, outline = false, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: "0.6rem 1.4rem", borderRadius: "10px", border: outline ? `1px solid ${color}` : "none", background: outline ? (hov ? `${color}18` : "transparent") : (hov ? `${color}cc` : color), color: outline ? color : "#fff", cursor: "pointer", fontWeight: "700", fontSize: "0.82rem", fontFamily: theme.fonts.body, transition: "all 0.18s", boxShadow: !outline && hov ? `0 4px 20px ${color}44` : "none", ...style }}>
      {children}
    </button>
  );
}

function IconBtn({ icon, color = C.textMuted, onClick, title }) {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 34, height: 34, borderRadius: "8px", border: `1px solid ${hov ? color : C.border}`, background: hov ? `${color}22` : "transparent", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.18s", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {icon}
    </button>
  );
}

function StatCard({ icon, value, label, color = C.primary }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? C.bgCardHover : C.bgCard, border: `1px solid ${hov ? C.borderHover : C.border}`, borderRadius: "16px", padding: "1.4rem", transition: "all 0.22s", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -24, right: -24, width: 80, height: 80, borderRadius: "50%", background: color, opacity: 0.1, filter: "blur(16px)", pointerEvents: "none" }} />
      <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{icon}</div>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: "2rem", fontWeight: "700", color, lineHeight: 1, marginBottom: "0.35rem" }}>
        {value ?? "—"}
      </div>
      <div style={{ fontSize: "0.68rem", color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function RowItem({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: "1rem", background: hov ? C.bgCardHover : C.bgCard, border: `1px solid ${hov ? C.borderHover : C.border}`, borderRadius: "12px", padding: "0.85rem 1.25rem", transition: "all 0.2s" }}>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ textAlign: "center", color: C.textMuted, padding: "4rem 2rem", background: C.bgCard, borderRadius: "16px", border: `1px dashed ${C.border}` }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📭</div>
      <p style={{ fontSize: "0.875rem", margin: 0 }}>{text}</p>
    </div>
  );
}

function Loader() {
  return <p style={{ textAlign: "center", color: C.textMuted, padding: "3rem" }}>Chargement...</p>;
}

function Msg({ text, ok = true }) {
  return <p style={{ fontSize: "0.8rem", color: ok ? C.green : C.red, margin: "0.5rem 0 0" }}>{text}</p>;
}

function dl(data, name) {
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

// ── Composant principal ────────────────────────────────────────────────────
function AdminDashboard({ onClose }) {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();

  const [stats, setStats]           = useState(null);
  const [users, setUsers]           = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [onglet, setOnglet]         = useState("stats");
  const [loading, setLoading]       = useState(true);
  const [collapsed, setCollapsed]   = useState(false);
  // Sur mobile, la sidebar commence fermée
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null, icon: "⚠️", confirmColor: C.primary });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "", onAction: null, actionLabel: "" });
  const [showProgression, setShowProgression] = useState(null);

  const [notif, setNotif]                     = useState({ titre: "", message: "" });
  const [notifMsg, setNotifMsg]               = useState("");
  const [notifProgId, setNotifProgId]         = useState("");
  const [notifProg, setNotifProg]             = useState({ titre: "", message: "" });
  const [notifProgMsg, setNotifProgMsg]       = useState(null);

  useEffect(() => { charger(); }, []);

  // Fermer la sidebar mobile quand on change d'onglet
  const handleOnglet = (id) => {
    setOnglet(id);
    if (isMobile) setSidebarOpen(false);
  };

  const charger = async () => {
    try {
      const [s, u, p, e] = await Promise.all([
        api.get("/admin/stats").then(r => r.data),
        api.get("/admin/users").then(r => r.data),
        api.get("/programmes/tous").then(r => r.data),
        api.get("/evenements/tous").then(r => r.data),
      ]);
      setStats(s); setUsers(u); setProgrammes(p); setEvenements(e);
    } catch {}
    finally { setLoading(false); }
  };

  const confirmer = (title, message, onConfirm, icon = "⚠️", confirmColor = C.primary) =>
    setConfirmModal({ isOpen: true, title, message, onConfirm, icon, confirmColor });

  const deconnecter = () => { localStorage.clear(); window.location.reload(); };

  const loc = (item) => i18n.language === "en"
    ? (item?.titreEn || item?.titreFr)
    : (item?.titreFr || item?.titreEn);

  const changerRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      setSuccessModal({ isOpen: true, title: t("admin.roleMisAJour"), message: `${t("admin.roleChangePour")} ${role}.`, onAction: null, actionLabel: "" });
    } catch (e) { alert(e.response?.data?.message || t("admin.erreurRole")); }
  };

  const supprimerUser = (id) => confirmer(t("admin.supprimerUser"), t("admin.actionIrreversible"), async () => {
    try { await api.delete(`/admin/users/${id}`); await charger();
      setSuccessModal({ isOpen: true, title: t("admin.userSupprime"), message: t("admin.supprimeSuceces"), onAction: null, actionLabel: "" });
    } catch { alert(t("commun.erreur")); }
  }, "🗑️", C.red);

  const archiverProg = (id) => confirmer(t("admin.archiverProgramme"), t("admin.programmeInvisible"), async () => {
    try { await api.delete(`/programmes/${id}`); await charger();
      setSuccessModal({ isOpen: true, title: t("admin.programmeArchive"), message: t("admin.archiveSuceces"), onAction: null, actionLabel: "" });
    } catch (err) { setSuccessModal({ isOpen: true, title: "❌ Erreur", message: err.response?.data?.message || "Erreur lors de l'archivage.", onAction: null, actionLabel: "" }); }
  }, "📦", C.primary);

  const reactiverProg = async (id) => {
    try { await api.put(`/programmes/${id}/reactiver`); await charger(); }
    catch { alert(t("commun.erreur")); }
  };

  const supprimerEvt = (id) => confirmer(t("admin.supprimerEvenement"), t("admin.evenementSupprime"), async () => {
    try { await api.delete(`/evenements/${id}`); await charger();
      setSuccessModal({ isOpen: true, title: t("admin.evenementSupprimeOk"), message: t("admin.supprimeSuceces"), onAction: null, actionLabel: "" });
    } catch { alert(t("commun.erreur")); }
  }, "🗑️", C.red);

  const envoyerNotif = async () => {
    if (!notif.titre || !notif.message) { setNotifMsg(t("admin.remplirTitreMessage")); return; }
    try { const r = await api.post("/admin/notify-all", notif);
      setNotifMsg(r.data.message || t("admin.notifEnvoyee")); setNotif({ titre: "", message: "" });
      setTimeout(() => setNotifMsg(""), 3000);
    } catch { setNotifMsg(t("admin.erreurEnvoi")); }
  };

  const envoyerNotifProg = async () => {
    if (!notifProgId) { setNotifProgMsg(t("admin.selectionnerProgramme")); return; }
    try { const r = await api.post(`/admin/notify-programme/${notifProgId}`, notifProg);
      setNotifProgMsg(r.data.message || t("admin.notifEnvoyee")); setNotifProg({ titre: "", message: "" });
      setTimeout(() => setNotifProgMsg(null), 3000);
    } catch { setNotifProgMsg(t("admin.erreurEnvoi")); }
  };

  const notifierUser = (u) => confirmer(t("admin.envoyerNotif"), `${t("admin.envoyerNotifA")} ${u.prenom} ${u.nom} ?`, async () => {
    try { await api.post("/admin/notify-all", { titre: t("admin.messageStaff"), message: t("admin.equipeContact") });
      setSuccessModal({ isOpen: true, title: t("admin.notifEnvoyee"), message: `${u.prenom} ${u.nom} ${t("admin.notifie")}`, onAction: null, actionLabel: "" });
    } catch { alert(t("admin.erreurEnvoi")); }
  });

  const user = authService.getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) return null;

  const current = NAV.find(n => n.id === onglet);

  // Sur mobile : sidebar = drawer par-dessus le contenu
  // Sur desktop : sidebar = colonne fixe à gauche (comportement original)
  const sidebarWidth = isMobile ? 232 : (collapsed ? 64 : 232);

  return (
    
      <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: theme.fonts.body, color: C.text, position: "relative", overflow: "hidden" }}>
      {/* Overlay mobile (fond sombre derrière la sidebar) */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99 }}
        />
      )}

      {/*  SIDEBAR  */}
      <aside style={{
        width: sidebarWidth,
        flexShrink: 0,
        background: C.bgCard,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.25s ease, width 0.25s ease",
        overflow: "hidden",
        // Mobile : sidebar en position fixe, cachée par défaut
        ...(isMobile ? {
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 100,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        } : {
          position: "sticky",
          top: 0,
          height: "100vh",
        }),
      }}>

        {/* Logo */}
        <div style={{ padding: (!isMobile && collapsed) ? "1.25rem 0.75rem" : "1.25rem 1.25rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.75rem", minHeight: 64 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:`#1a1a2e`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 4px 12px ${C.primaryGlow}` }}>
  <img src="/logo.png" alt="logo" style={{ width:"100%", height:"100%", objectFit:"contain", borderRadius:9 }} />
</div>
          {(!isMobile ? !collapsed : true) && (
            <div>
              <div style={{ fontFamily: "'Georgia',serif", fontWeight: "700", fontSize: "0.85rem", color: C.text, lineHeight: 1.1 }}>LRC Admin</div>
              <div style={{ fontSize: "0.58rem", color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>DASHBOARD</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0.6rem 0.4rem" }}>
          {NAV.map(tab => {
            const active = onglet === tab.id;
            const isCollapsed = !isMobile && collapsed;
            return (
              <button key={tab.id} onClick={() => handleOnglet(tab.id)} title={isCollapsed ? tab.label : undefined}
                style={{ display: "flex", alignItems: "center", gap: "0.65rem", width: "100%", padding: isCollapsed ? "0.65rem" : "0.6rem 0.75rem", borderRadius: "9px", border: "none", justifyContent: isCollapsed ? "center" : "flex-start", background: active ? `${C.primary}18` : "transparent", color: active ? C.primary : C.textMuted, cursor: "pointer", fontSize: "0.8rem", fontWeight: active ? "700" : "400", fontFamily: theme.fonts.body, transition: "all 0.15s", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", borderLeft: !isCollapsed ? `3px solid ${active ? C.primary : "transparent"}` : "none" }}>
                <span style={{ fontSize: "0.95rem", flexShrink: 0 }}>{tab.icon}</span>
                {!isCollapsed && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div style={{ padding: "0.6rem 0.4rem", borderTop: `1px solid ${C.border}` }}>
          {/* Bouton collapse uniquement sur desktop */}
          {!isMobile && (
            <button onClick={() => setCollapsed(v => !v)} title={collapsed ? "Agrandir" : "Réduire"}
              style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: "0.65rem", width: "100%", padding: collapsed ? "0.65rem" : "0.6rem 0.75rem", borderRadius: "9px", border: "none", background: "transparent", color: C.textMuted, cursor: "pointer", fontSize: "0.8rem", fontFamily: theme.fonts.body, marginBottom: "0.4rem" }}>
              <span>{collapsed ? "▶" : "◀"}</span>
              {!collapsed && <span>Réduire</span>}
            </button>
          )}
          <button onClick={deconnecter}
            style={{ display: "flex", alignItems: "center", justifyContent: (!isMobile && collapsed) ? "center" : "flex-start", gap: "0.65rem", width: "100%", padding: (!isMobile && collapsed) ? "0.65rem" : "0.6rem 0.75rem", borderRadius: "9px", border: `1px solid rgba(231,76,60,0.25)`, background: "rgba(231,76,60,0.07)", color: "#E74C3C", cursor: "pointer", fontSize: "0.8rem", fontFamily: theme.fonts.body }}>
            <span>🚪</span>
            {(!isMobile && collapsed) ? null : <span>{t("menu.deconnexion")}</span>}
          </button>
        </div>
      </aside>

      {/*  MAIN  */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflow: "hidden" }}>

        {/* Top header */}
        <header style={{ padding: isMobile ? "0.75rem 1rem" : "0.9rem 2rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bgCard, position: "sticky", top: 0, zIndex: 50, gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            {/* Bouton hamburger mobile */}
            {isMobile && (
              <button onClick={() => setSidebarOpen(v => !v)}
                style={{ width: 36, height: 36, borderRadius: "8px", border: `1px solid ${C.border}`, background: "transparent", color: C.text, cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                ☰
              </button>
            )}
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: "'Georgia',serif", fontSize: isMobile ? "1rem" : "1.2rem", fontWeight: "700", color: C.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {current?.icon} {current?.label}
              </h1>
              {!isMobile && (
                <p style={{ fontSize: "0.68rem", color: C.textMuted, margin: 0, marginTop: 1 }}>{t("admin.sousTitre")}</p>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexShrink: 0 }}>
            {onClose && (
              <Btn onClick={onClose} outline color={C.border} style={{ color: C.textMuted, borderColor: C.border }}>← {isMobile ? "" : "Retour"}</Btn>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: "9px", padding: "0.35rem 0.75rem" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: "700", color: "#fff" }}>
                {user?.prenom?.charAt(0).toUpperCase()}
              </div>
              {!isMobile && <span style={{ fontSize: "0.78rem", color: C.text, fontWeight: "600" }}>{user?.prenom}</span>}
              <span style={{ fontSize: "0.6rem", color: C.primary, fontWeight: "700", padding: "0.1rem 0.4rem", border: `1px solid ${C.primaryGlow}`, borderRadius: "4px" }}>{user?.role}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: isMobile ? "1rem" : "2rem", overflowY: "auto", height: 0 }}>

          {/* STATS */}
          {onglet === "stats" && (
            <>
              <SectionTitle>Vue d'ensemble</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(200px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {STATS_CONFIG.map(s => <StatCard key={s.key} icon={s.icon} value={stats?.[s.key]} label={s.label} color={C.primary} />)}
              </div>
              <Card title="📊 Activité mensuelle">
                <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: 90 }}>
                  {Array(12).fill(0).map((_, i) => {
                    const h = 20 + Math.random() * 80;
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <div style={{ width: "100%", height: `${h}%`, background: `linear-gradient(to top, ${C.primary}, ${C.gold})`, borderRadius: "4px 4px 0 0", opacity: 0.85 }} />
                        <span style={{ fontSize: "0.55rem", color: C.textDim }}>{"JFMAMJJASOND"[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}

          {/* USERS */}
          {onglet === "users" && (
            <>
              <SectionTitle>{users.length} comptes enregistrés</SectionTitle>
              {loading ? <Loader /> : (
                isMobile ? (
                  // Vue cartes sur mobile au lieu du tableau
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {users.map(u => (
                      <Card key={u.id}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary}55,${C.gold}55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "700", color: C.text, flexShrink: 0 }}>
                            {u.prenom?.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: "700", fontSize: "0.88rem", color: C.text }}>{u.prenom} {u.nom}</div>
                            <div style={{ fontSize: "0.72rem", color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                          </div>
                          <IconBtn icon="🗑️" color={C.red} onClick={() => supprimerUser(u.id)} title={t("admin.supprimerUser")} />
                        </div>
                        <DSelect value={u.role} onChange={e => changerRole(u.id, e.target.value)} style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}>
                          {user.role === "ADMIN"
                            ? ["USER","STAFF","ADMIN","PARTNER"].map(r => <option key={r} value={r}>{r}</option>)
                            : ["USER","PARTNER"].map(r => <option key={r} value={r}>{r}</option>)}
                        </DSelect>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          {[t("admin.nom"), t("admin.email"), t("admin.role"), t("admin.actions")].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "0.6rem 1rem", fontSize: "0.6rem", fontWeight: "700", letterSpacing: "0.1em", color: C.textMuted, borderBottom: `1px solid ${C.border}`, textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                            <td style={{ padding: "0.8rem 1rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary}55,${C.gold}55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: "700", color: C.text, flexShrink: 0 }}>
                                  {u.prenom?.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: "0.875rem", color: C.text, fontWeight: "600" }}>{u.prenom} {u.nom}</span>
                              </div>
                            </td>
                            <td style={{ padding: "0.8rem 1rem", fontSize: "0.78rem", color: C.textMuted }}>{u.email}</td>
                            <td style={{ padding: "0.8rem 1rem" }}>
                              <DSelect value={u.role} onChange={e => changerRole(u.id, e.target.value)} style={{ width: "auto", padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}>
                                {user.role === "ADMIN"
                                  ? ["USER","STAFF","ADMIN","PARTNER"].map(r => <option key={r} value={r} style={{ background: "#1A1826", color: "#F0EBF8" }}>{r}</option>)
                                  : ["USER","PARTNER"].map(r => <option key={r} value={r} style={{ background: "#1A1826", color: "#F0EBF8" }}>{r}</option>)}
                              </DSelect>
                            </td>
                            <td style={{ padding: "0.8rem 1rem" }}>
                              <IconBtn icon="🗑️" color={C.red} onClick={() => supprimerUser(u.id)} title={t("admin.supprimerUser")} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                )
              )}
            </>
          )}

          {/* CRÉER PROGRAMME */}
          {onglet === "programmes" && (
            <>
              <SectionTitle>{t("admin.creerProgramme")}</SectionTitle>
              <Card>
                <CreerProgramme total={programmes.length} onVoirListe={() => setOnglet("listeProgrammes")}
                  onSuccess={(titre) => { charger(); setSuccessModal({ isOpen: true, title: t("admin.programmeCree"), message: `"${titre}" ${t("admin.creeSuceces")}`, onAction: () => { setSuccessModal(s => ({ ...s, isOpen: false })); setOnglet("listeProgrammes"); }, actionLabel: `📋 ${t("admin.voirProgrammes")}` }); }} />
              </Card>
            </>
          )}

          {/* LISTE PROGRAMMES */}
          {onglet === "listeProgrammes" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <SectionTitle>📋 {t("admin.tousProgrammes")} <Chip>{programmes.length}</Chip></SectionTitle>
                <Btn onClick={() => setOnglet("programmes")}>➕ {t("admin.creerProgramme")}</Btn>
              </div>
              {programmes.length === 0 ? <Empty text={t("admin.aucunProgramme")} /> : (
                isMobile ? (
                  // Vue cartes sur mobile
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {programmes.map(p => (
                      <Card key={p.id}>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                          <div style={{ width: 4, height: 40, borderRadius: 2, background: p.actif ? C.green : C.textDim, flexShrink: 0, marginTop: 2 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: "700", color: C.text, fontSize: "0.88rem", marginBottom: "0.4rem" }}>{loc(p) || "—"}</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
                              <Chip color={C.primary}>{p.categorie || "—"}</Chip>
                              <Chip color={C.purple}>{p.niveau || "—"}</Chip>
                              <Chip color={p.actif ? C.green : C.textDim}>{p.actif ? `✅ ${t("admin.actif")}` : `⛔ ${t("admin.archive")}`}</Chip>
                            </div>
                            <div style={{ fontSize: "0.72rem", color: C.textMuted }}>
                              📍 {p.lieu || t("admin.lieuNonDefini")} · {p.gratuit || !p.prix ? `🆓 ${t("programmes.gratuit")}` : `💰 ${p.prix}$`}
                            </div>
                          </div>
                          <div>
                            {p.actif
                              ? <IconBtn icon="📦" color={C.primary} onClick={() => archiverProg(p.id)} title="Archiver" />
                              : <IconBtn icon="♻️" color={C.green} onClick={() => reactiverProg(p.id)} title="Réactiver" />}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
                    {/* En-tête tableau */}
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px", gap: "1rem", padding: "0.75rem 1.25rem", borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)" }}>
                      {["Programme", "Catégorie", "Niveau", "Lieu", "Statut", "Actions"].map(h => (
                        <span key={h} style={{ fontSize: "0.6rem", fontWeight: "700", letterSpacing: "0.1em", color: C.textMuted, textTransform: "uppercase" }}>{h}</span>
                      ))}
                    </div>
                    {/* Lignes */}
                    {programmes.map((p, i) => (
                      <div key={p.id}
                        style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px", gap: "1rem", padding: "1rem 1.25rem", borderBottom: i < programmes.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.bgCardHover}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                          <div style={{ width: 4, height: 36, borderRadius: 2, background: p.actif ? C.green : C.textDim, flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: "700", color: C.text, fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loc(p) || "—"}</div>
                            <div style={{ fontSize: "0.68rem", color: C.textMuted, marginTop: 2 }}>
                              {p.gratuit || !p.prix ? `🆓 ${t("programmes.gratuit")}` : `💰 ${p.prix}$`}
                              {p.capaciteMax && ` · 👥 ${p.capaciteMax} places`}
                            </div>
                          </div>
                        </div>
                        <Chip color={C.primary}>{p.categorie || "—"}</Chip>
                        <Chip color={C.purple}>{p.niveau || "—"}</Chip>
                        <span style={{ fontSize: "0.78rem", color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          📍 {p.lieu || t("admin.lieuNonDefini")}
                        </span>
                        <Chip color={p.actif ? C.green : C.textDim}>
                          {p.actif ? `✅ ${t("admin.actif")}` : `⛔ ${t("admin.archive")}`}
                        </Chip>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          {p.actif
                            ? <IconBtn icon="📦" color={C.primary} onClick={() => archiverProg(p.id)} title="Archiver" />
                            : <IconBtn icon="♻️" color={C.green} onClick={() => reactiverProg(p.id)} title="Réactiver" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}

          {/* CRÉER ÉVÉNEMENT */}
          {onglet === "evenements" && (
            <>
              <SectionTitle>{t("admin.creerEvenement")}</SectionTitle>
              <Card>
                <CreerEvenement total={evenements.length} onVoirListe={() => setOnglet("listeEvenements")}
                  onSuccess={(titre) => { charger(); setSuccessModal({ isOpen: true, title: t("admin.evenementCree"), message: `"${titre}" ${t("admin.creeSuceces")}`, onAction: () => { setSuccessModal(s => ({ ...s, isOpen: false })); setOnglet("listeEvenements"); }, actionLabel: `📅 ${t("admin.voirEvenements")}` }); }} />
              </Card>
            </>
          )}

          {/* LISTE ÉVÉNEMENTS */}
          {onglet === "listeEvenements" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <SectionTitle>📅 {t("admin.tousEvenements")} <Chip>{evenements.length}</Chip></SectionTitle>
                <Btn onClick={() => setOnglet("evenements")}>➕ {t("admin.creerEvenement")}</Btn>
              </div>
              {evenements.length === 0 ? <Empty text={t("admin.aucunEvenement")} /> : (
                isMobile ? (
                  // Vue cartes sur mobile
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {evenements.map(e => (
                      <Card key={e.id}>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                          <div style={{ width: 4, height: 40, borderRadius: 2, background: C.blue, flexShrink: 0, marginTop: 2 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: "700", color: C.text, fontSize: "0.88rem", marginBottom: "0.4rem" }}>{loc(e) || "—"}</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
                              <Chip color={C.blue}>{e.statut || t("admin.publie")}</Chip>
                              <Chip color={C.gold}>{e.gratuit ? `🆓 ${t("programmes.gratuit")}` : `💰 ${t("admin.payant")}`}</Chip>
                            </div>
                            <div style={{ fontSize: "0.72rem", color: C.textMuted }}>
                              📅 {e.dateEvenement ? new Date(e.dateEvenement).toLocaleDateString("fr-FR") : "—"} · 📍 {e.lieu || "—"}
                            </div>
                          </div>
                          <IconBtn icon="🗑️" color={C.red} onClick={() => supprimerEvt(e.id)} title="Supprimer" />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 60px", gap: "1rem", padding: "0.75rem 1.25rem", borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)" }}>
                      {["Événement", "Date", "Lieu", "Statut", "Prix", ""].map(h => (
                        <span key={h} style={{ fontSize: "0.6rem", fontWeight: "700", letterSpacing: "0.1em", color: C.textMuted, textTransform: "uppercase" }}>{h}</span>
                      ))}
                    </div>
                    {evenements.map((e, i) => (
                      <div key={e.id}
                        style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 60px", gap: "1rem", padding: "1rem 1.25rem", borderBottom: i < evenements.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center", transition: "background 0.15s" }}
                        onMouseEnter={ev => ev.currentTarget.style.background = C.bgCardHover}
                        onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                          <div style={{ width: 4, height: 36, borderRadius: 2, background: C.blue, flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: "700", color: C.text, fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loc(e) || "—"}</div>
                            {e.placesDisponibles && (
                              <div style={{ fontSize: "0.68rem", color: C.textMuted, marginTop: 2 }}>👥 {e.placesDisponibles} places</div>
                            )}
                          </div>
                        </div>
                        <span style={{ fontSize: "0.78rem", color: C.text }}>
                          📅 {e.dateEvenement ? new Date(e.dateEvenement).toLocaleDateString("fr-FR") : "—"}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          📍 {e.lieu || "—"}
                        </span>
                        <Chip color={C.blue}>{e.statut || t("admin.publie")}</Chip>
                        <Chip color={C.gold}>
                          {e.gratuit ? `🆓 ${t("programmes.gratuit")}` : `💰 ${t("admin.payant")}`}
                        </Chip>
                        <IconBtn icon="🗑️" color={C.red} onClick={() => supprimerEvt(e.id)} title="Supprimer" />
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}

          {/* PROGRESSION */}
          {onglet === "progression" && (
            <>
              <SectionTitle>📈 {t("admin.suiviProgression")}</SectionTitle>
              {loading ? <Loader /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {users.filter(u => u.role === "USER").map(u => (
                    <RowItem key={u.id}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.blue}55,${C.purple}55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "700", color: C.text, flexShrink: 0 }}>
                        {u.prenom?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "700", fontSize: "0.88rem", color: C.text }}>{u.prenom} {u.nom}</div>
                        <div style={{ fontSize: "0.72rem", color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                      </div>
                      {!isMobile && <Chip color={C.green}>{u.role}</Chip>}
                      <Btn onClick={() => notifierUser(u)} outline color={C.border} style={{ color: C.textMuted, fontSize: "0.75rem", padding: "0.4rem 0.9rem", flexShrink: 0 }}>
                        📨 {!isMobile && t("admin.notifier")}
                      </Btn>
                    </RowItem>
                  ))}
                </div>
              )}
            </>
          )}

          {/* NOTIFICATIONS */}
          {onglet === "notifications" && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
              <Card title={`📢 ${t("admin.notifTous")}`}>
                <Field label={t("admin.titre2")}><DInput value={notif.titre} onChange={e => setNotif({ ...notif, titre: e.target.value })} placeholder={t("admin.titrePlaceholder")} /></Field>
                <Field label={t("admin.message")}><DInput value={notif.message} onChange={e => setNotif({ ...notif, message: e.target.value })} placeholder={t("admin.messagePlaceholder")} textarea /></Field>
                {notifMsg && <Msg text={notifMsg} />}
                <Btn onClick={envoyerNotif} style={{ marginTop: "0.75rem" }}>{t("admin.envoyerTous")} →</Btn>
              </Card>

              <Card title={`🎯 ${t("admin.notifInscrits")}`}>
                <Field label={t("admin.programmeLabel")}>
                  <DSelect value={notifProgId} onChange={e => setNotifProgId(e.target.value)}>
                    <option value="" style={{ background: C.bgCard, color: C.text }}>-- {t("admin.selectionnerProgramme")} --</option>
                    {programmes.map(p => (
                      <option key={p.id} value={p.id} style={{ background: C.bgCard, color: C.text }}>{loc(p)}</option>
                    ))}
                  </DSelect>
                </Field>
                <Field label={t("admin.titre2")}><DInput value={notifProg.titre} onChange={e => setNotifProg({ ...notifProg, titre: e.target.value })} placeholder={t("admin.titrePlaceholder")} /></Field>
                <Field label={t("admin.message")}><DInput value={notifProg.message} onChange={e => setNotifProg({ ...notifProg, message: e.target.value })} placeholder={t("admin.messageInscritsPlaceholder")} textarea /></Field>
                {notifProgMsg && <Msg text={notifProgMsg} />}
                <Btn onClick={envoyerNotifProg} style={{ marginTop: "0.75rem" }}>{t("admin.envoyerInscrits")} →</Btn>
              </Card>
            </div>
          )}

          {/* KPIs */}
          {onglet === "kpis" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <SectionTitle>💹 {t("admin.kpisTitre")}</SectionTitle>
                <span style={{ fontSize: "0.7rem", color: C.textMuted }}>🔄 {t("admin.kpisActualise")}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                  { label: t("admin.kpisBeneficiairesActifs"), value: stats?.beneficiairesActifs, icon: "👥", color: C.blue },
                  { label: t("admin.kpisInscritsMois"),        value: stats?.inscritsMois,        icon: "📝", color: C.green },
                  { label: t("admin.kpisCoursEnCours"),        value: stats?.coursEnCours,        icon: "📚", color: C.primary },
                  { label: t("admin.kpisTauxCompletion"),      value: stats?.tauxCompletion ? `${stats.tauxCompletion}%` : undefined, icon: "✅", color: C.purple },
                  { label: t("admin.kpisRevenusMois"),         value: stats?.revenusMois ? `$${stats.revenusMois}` : undefined, icon: "💰", color: C.gold },
                  { label: t("admin.kpisDonsMois"),            value: stats?.donsMois ? `$${stats.donsMois}` : undefined, icon: "💛", color: C.primary },
                ].map(k => <StatCard key={k.label} {...k} />)}
              </div>
              <Card title={`📊 ${t("admin.kpisEvolutionInscriptions")}`}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: 90 }}>
                  {(stats?.evolutionMensuelle || Array(12).fill(0)).map((val, i) => {
                    const max = Math.max(...(stats?.evolutionMensuelle || [1]), 1);
                    const h = Math.max((val / max) * 100, 4);
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <div style={{ width: "100%", height: `${h}%`, background: `linear-gradient(to top,${C.primary},${C.gold})`, borderRadius: "3px 3px 0 0", transition: "height 0.5s" }} />
                        <span style={{ fontSize: "0.55rem", color: C.textDim }}>{"JFMAMJJASOND"[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}

          {/* RAPPORTS */}
          {onglet === "rapports" && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
              <Card title={`📊 ${t("admin.rapportAnnuel")}`}>
                <p style={{ fontSize: "0.82rem", color: C.textMuted, marginBottom: "1.25rem", lineHeight: 1.65 }}>{t("admin.rapportAnnuelDesc")}</p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <Btn onClick={async () => { try { const r = await api.get("/admin/rapports/annuel", { responseType: "blob" }); dl(r.data, "rapport_annuel_lrc.csv"); } catch { alert(t("commun.erreur")); } }}>
                    📥 {t("admin.exportCSV")}
                  </Btn>
                  <Btn color={C.blue} onClick={async () => { try { const r = await api.get("/admin/rapports/annuel/pdf", { responseType: "blob" }); dl(r.data, "rapport_annuel_lrc.pdf"); } catch { alert(t("commun.erreur")); } }}>
                    📄 {t("admin.exportPDF")}
                  </Btn>
                </div>
              </Card>
              <Card title={`💰 ${t("admin.rapportFinancier")}`}>
                <p style={{ fontSize: "0.82rem", color: C.textMuted, marginBottom: "1rem", lineHeight: 1.65 }}>{t("admin.rapportFinancierDesc")}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem", marginBottom: "1.25rem" }}>
                  {[
                    { label: t("admin.subventions"), v: stats?.subventions ? `$${stats.subventions}` : "—" },
                    { label: t("admin.fraisInscription"), v: stats?.fraisInscription ? `$${stats.fraisInscription}` : "—" },
                    { label: t("admin.donsTotal"), v: stats?.donsTotal ? `$${stats.donsTotal}` : "—" },
                  ].map(item => (
                    <div key={item.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "0.6rem", textAlign: "center", border: `1px solid ${C.border}` }}>
                      <div style={{ fontFamily: "'Georgia',serif", fontSize: "1.1rem", fontWeight: "700", color: C.gold }}>{item.v}</div>
                      <div style={{ fontSize: "0.6rem", color: C.textMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <Btn onClick={async () => { try { const r = await api.get("/admin/rapports/financier", { responseType: "blob" }); dl(r.data, "rapport_financier_lrc.csv"); } catch { alert(t("commun.erreur")); } }}>
                  📥 {t("admin.exportCSV")}
                </Btn>
              </Card>
            </div>
          )}

          {/* CONFIGURATION */}
          {onglet === "configuration" && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
              <Card title={`🌐 ${t("admin.configLangues")}`}>
                {[{ code: "fr", label: "🇫🇷 Français" }, { code: "en", label: "🇺🇸 English" }].map(lang => (
                  <label key={lang.code} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0", cursor: "pointer", fontSize: "0.875rem", color: C.text, borderBottom: `1px solid ${C.border}` }}>
                    <input type="checkbox" defaultChecked={lang.code !== "ht"} style={{ accentColor: C.primary, width: 16, height: 16 }} />
                    {lang.label}
                  </label>
                ))}
              </Card>

              <Card title={`📢 ${t("admin.configBanniere")}`}>
                <ConfigBanniere t={t} />
              </Card>

              <Card title={`⭐ ${t("admin.configAlaUne")}`} style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
                <p style={{ fontSize: "0.8rem", color: C.textMuted, marginBottom: "0.75rem" }}>{t("admin.configAlaUneDesc")}</p>
                <DSelect value={notifProgId} onChange={e => setNotifProgId(e.target.value)}>
                  <option value="" style={{ background: C.bgCard, color: C.text }}>-- {t("admin.selectionnerProgramme")} --</option>
                  {programmes.map(p => (
                    <option key={p.id} value={p.id} style={{ background: C.bgCard, color: C.text }}>{loc(p)}</option>
                  ))}
                </DSelect>
              </Card>
            </div>
          )}

        </main>
      </div>

      {/* Modals */}
      <ConfirmModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm} title={confirmModal.title} message={confirmModal.message}
        icon={confirmModal.icon} confirmColor={confirmModal.confirmColor} confirmLabel={t("commun.confirmer")} />
      <SuccessModal isOpen={successModal.isOpen} onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        title={successModal.title} message={successModal.message} onAction={successModal.onAction} actionLabel={successModal.actionLabel} />
      {showProgression && <SuiviProgression utilisateur={showProgression} onClose={() => setShowProgression(null)} />}
    </div>
  );
}

//  ConfigBannière
function ConfigBanniere({ t }) {
  const [texte, setTexte]     = useState("");
  const [dateFin, setDateFin] = useState("");
  const [active, setActive]   = useState(false);
  const [saved, setSaved]     = useState(false);

  const save = async () => {
    try { await api.post("/admin/banniere", { texte, dateFin, active }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch { alert(t("commun.erreur")); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <DInput value={texte} onChange={e => setTexte(e.target.value)} placeholder={t("admin.bannierePlaceholder")} />
      <DInput value={dateFin} onChange={e => setDateFin(e.target.value)} type="date" />
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer", color: C.text }}>
        <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} style={{ accentColor: C.primary }} />
        {t("admin.banniereActiver")}
      </label>
      <Btn onClick={save}>{saved ? `✅ ${t("staff.sauvegarde")}` : t("commun.enregistrer")}</Btn>
    </div>
  );
}

export default AdminDashboard;