import theme from "../theme.js";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { evenementService } from "../api/index.js";

function EvenementCard({ dateEvenement, titreFr, titreEn, descriptionFr, descriptionEn, lieu }) {
  const { i18n } = useTranslation();
  const titre = i18n.language === "en" ? (titreEn || titreFr) : (titreFr || titreEn);
  const description = i18n.language === "en" ? (descriptionEn || descriptionFr) : (descriptionFr || descriptionEn);
  const [hovered, setHovered] = useState(false);
  const date = new Date(dateEvenement);
  const jour = date.getDate();
  const mois = date.toLocaleString("fr-FR", { month: "short" }).toUpperCase();

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? theme.cards.hoverLight : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.dateBadge, backgroundColor: theme.colors.primary }}>
        <span style={styles.dateJour}>{jour}</span>
        <span style={styles.dateMois}>{mois}</span>
      </div>
      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{titre}</h3>
        <p style={styles.cardDesc}>{description}</p>
        <div style={styles.infosRow}>
          <span style={styles.info}>
            📍 <span style={styles.infoText}>{lieu}</span>
          </span>
          <span style={styles.info}>
            🕐 <span style={styles.infoText}>
              {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Evenements() {
  const { t } = useTranslation();
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    evenementService.listerPublies()
      .then(data => {
        setEvenements(data);
        setLoading(false);
      })
      .catch(() => {
        setErreur(t("evenements.erreur"));
        setLoading(false);
      });
  }, []);

  return (
    <section className="scroll-reveal" style={styles.section}>
      <div style={styles.inner}>

        <div style={styles.header}>
          <div style={theme.label}>
            <span style={theme.labelLine} />
            {t("evenements.label")}
          </div>
          <h2 style={styles.title}>
            {t("evenements.titre")} <span style={styles.titleItalic}>{t("evenements.titreItalique")}</span>
          </h2>
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: theme.colors.textMuted }}>
            {t("evenements.chargement")}
          </p>
        )}
        {erreur && (
          <p style={{ textAlign: "center", color: theme.colors.primary }}>
            {erreur}
          </p>
        )}
        {!loading && !erreur && evenements.length === 0 && (
          <p style={{ textAlign: "center", color: theme.colors.textMuted }}>
            {t("evenements.aucun")}
          </p>
        )}

        {!loading && !erreur && evenements.length > 0 && (
          <div className="evenements-grid" style={styles.grid}>
            {evenements.map((evt) => (
              <EvenementCard key={evt.id} {...evt} />
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
  header: { marginBottom: "3rem" },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.h2,
    fontWeight: "900",
    color: theme.colors.textDark,
    lineHeight: "1.1",
    marginTop: "0.5rem",
  },
  titleItalic: {
    fontStyle: "italic",
    color: theme.colors.accent,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: theme.colors.bgWhite,
    borderRadius: theme.borderRadius.large,
    padding: "1.8rem",
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
    display: "flex",
    gap: "1.5rem",
    alignItems: "flex-start",
    transition: "transform 0.25s, box-shadow 0.25s",
  },
  dateBadge: {
    minWidth: "60px",
    height: "60px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dateJour: {
    fontFamily: theme.fonts.heading,
    fontSize: "1.4rem",
    fontWeight: "900",
    color: "white",
    lineHeight: "1",
  },
  dateMois: {
    fontSize: "0.6rem",
    fontWeight: "700",
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.85)",
    marginTop: "2px",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    flex: 1,
  },
  cardTitle: {
    fontFamily: theme.fonts.body,
    fontSize: "1rem",
    fontWeight: "700",
    color: theme.colors.textDark,
  },
  cardDesc: {
    fontSize: theme.fontSizes.small,
    lineHeight: "1.65",
    color: theme.colors.textMuted,
  },
  infosRow: {
    display: "flex",
    gap: "1.2rem",
    flexWrap: "wrap",
    marginTop: "0.5rem",
  },
  info: {
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    fontSize: "0.8rem",
  },
  infoText: {
    color: theme.colors.accent,
    fontWeight: "600",
  },
};

export default Evenements;