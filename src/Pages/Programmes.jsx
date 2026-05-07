import theme from "../theme.js";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { programmeService, authService } from "../api/index.js";
import { SuccessModal, ErrorModal } from "../components/Modal.jsx";
import { useLocalise } from "../hooks/useLocalise.js";

const CATEGORY_ICONS = {
  ESL: "📚",
  WORKFORCE: "💼",
  CIVIC: "🏛️",
  DIGITAL: "💻",
};

const CATEGORY_COLORS = {
  ESL: "#C8520A",
  WORKFORCE: "#D4960A",
  CIVIC: "#2A7A4B",
  DIGITAL: "#1A5FAB",
};

function ProgrammeCard({ id, titreFr, titreEn, descriptionFr, descriptionEn, categorie, niveau, lieu, gratuit, prix }) {
  const { t, i18n } = useTranslation();
  const titre = i18n.language === "en" ? (titreEn || titreFr) : (titreFr || titreEn);
  const description = i18n.language === "en" ? (descriptionEn || descriptionFr) : (descriptionFr || descriptionEn);
  const [hovered, setHovered] = useState(false);
  const [inscrit, setInscrit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const color = CATEGORY_COLORS[categorie] || "#C8520A";
  const iconEmoji = CATEGORY_ICONS[categorie] || "📖";

  const handleInscription = async () => {
    if (!authService.isAuthenticated()) {
      setErrorMsg(t("programmes.nonConnecte"));
      setShowError(true);
      return;
    }
    setLoading(true);
    try {
      await programmeService.inscrire(id);
      setInscrit(true);
      setShowSuccess(true);
    } catch (e) {
      setErrorMsg(e.response?.data?.message || t("programmes.erreurInscription"));
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          ...styles.card,
          ...(hovered ? theme.cards.hoverLight : {}),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ ...styles.cardBar, backgroundColor: color }} />
        <div style={styles.cardBody}>
          <div style={styles.icon}>{iconEmoji}</div>
          <h3 style={styles.cardTitle}>{titre}</h3>
          <p style={styles.cardDesc}>{description}</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <span style={styles.badge}>{niveau}</span>
            <span style={styles.badge}>{gratuit ? t("programmes.gratuit") : `$${prix}`}</span>
            {lieu && <span style={styles.badge}>📍 {lieu}</span>}
          </div>
          <button
            style={{
              ...theme.buttons.primary,
              width: "100%",
              opacity: inscrit || loading ? 0.7 : 1,
              backgroundColor: inscrit ? "#006633" : theme.colors.primary,
            }}
            onClick={handleInscription}
            disabled={inscrit || loading}
            onMouseEnter={e => {
              if (!inscrit) e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
            }}
            onMouseLeave={e => {
              if (!inscrit) e.currentTarget.style.backgroundColor = inscrit ? "#006633" : theme.colors.primary;
            }}
          >
            {loading ? t("programmes.inscription") : inscrit ? t("programmes.inscrit") : t("programmes.sInscrire")}
          </button>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={t("programmes.successTitre")}
        message={t("programmes.successMsg").replace("%titre%", titre)}
      />
      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        title={t("programmes.oops")}
        message={errorMsg}
      />
    </>
  );
}

function Programmes() {
  const { t } = useTranslation();
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    programmeService.listerActifs()
      .then(data => {
        setProgrammes(data);
        setLoading(false);
      })
      .catch(() => {
        setErreur(t("programmes.erreur"));
        setLoading(false);
      });
  }, []);

  return (
    <section className="scroll-reveal" style={styles.section}>
      <div style={styles.inner}>

        <div className="programmes-header" style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.label}>
              <span style={styles.labelLine} />
              {t("programmes.label")}
            </div>
            <h2 style={styles.title}>
              {t("programmes.titre")} <span style={styles.titleItalic}>{t("programmes.titreItalique")}</span> {t("programmes.titreSuite")}
            </h2>
          </div>
          <p style={styles.headerDesc}>
            {t("programmes.headerDesc")}
          </p>
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: theme.colors.textMuted }}>
            {t("programmes.chargement")}
          </p>
        )}
        {erreur && (
          <p style={{ textAlign: "center", color: theme.colors.primary }}>
            {erreur}
          </p>
        )}

        {!loading && !erreur && programmes.length === 0 && (
          <p style={{ textAlign: "center", color: theme.colors.textMuted }}>
            {t("programmes.aucun")}
          </p>
        )}
        {!loading && !erreur && programmes.length > 0 && (
          <div className="programmes-grid" style={styles.grid}>
            {programmes.map((prog) => (
              <ProgrammeCard key={prog.id} {...prog} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

const styles = {
  section: {
    backgroundColor: "#faf7f2",
    padding: theme.spacing.sectionPadding,
  },
  inner: {
    maxWidth: theme.spacing.innerMaxWidth,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "3rem",
    gap: "2rem",
    flexWrap: "wrap",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  label: { ...theme.label },
  labelLine: { ...theme.labelLine },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.h2,
    fontWeight: "900",
    color: theme.colors.textDark,
    lineHeight: "1.1",
  },
  titleItalic: {
    fontStyle: "italic",
    color: theme.colors.accent,
  },
  headerDesc: {
    fontSize: theme.fontSizes.body,
    lineHeight: "1.75",
    color: theme.colors.textMuted,
    maxWidth: "280px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: theme.colors.bgWhite,
    borderRadius: theme.borderRadius.large,
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
    transition: "transform 0.25s, box-shadow 0.25s",
  },
  cardBar: {
    height: "6px",
    width: "100%",
  },
  cardBody: {
    padding: "1.8rem",
  },
  icon: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  cardTitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.body,
    fontWeight: "700",
    color: theme.colors.textDark,
    marginBottom: "0.75rem",
  },
  cardDesc: {
    fontSize: theme.fontSizes.small,
    lineHeight: "1.7",
    color: theme.colors.textMuted,
    marginBottom: "1.2rem",
  },
  badge: {
    display: "inline-block",
    fontSize: "0.65rem",
    fontWeight: "600",
    letterSpacing: "0.1em",
    color: "#3d2b1f",
    border: "1px solid rgba(74, 55, 40, 0.25)",
    borderRadius: theme.borderRadius.pill,
    padding: "0.3rem 0.8rem",
    backgroundColor: "#ede5d4",
  },
};

export default Programmes;