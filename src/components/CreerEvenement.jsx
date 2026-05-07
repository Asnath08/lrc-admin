import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import theme, { adminStyles as styles } from "../theme.js";
import api from "../api/axios.js";
import { CATEGORIES, INITIAL_EVENEMENT } from "../data/adminData.js";

export default function CreerEvenement({ onSuccess, onVoirListe, total }) {
  const { t } = useTranslation();
  const [newEvt, setNewEvt] = useState(INITIAL_EVENEMENT);
  const [evtMsg, setEvtMsg] = useState(null);

  // ✅ Responsive state (React propre)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const set = (champ, val) => setNewEvt(p => ({ ...p, [champ]: val }));

  const creerEvenement = async () => {
    const titreCree = newEvt.titreFr || newEvt.titreEn;
    try {
      await api.post("/evenements", {
        ...newEvt,
        placesDisponibles: newEvt.placesDisponibles
          ? parseInt(newEvt.placesDisponibles)
          : null,
      });
      setNewEvt(INITIAL_EVENEMENT);
      if (onSuccess) onSuccess(titreCree);
    } catch {
      setEvtMsg(t("admin.evenement.erreur"));
      setTimeout(() => setEvtMsg(null), 4000);
    }
  };

  // ✅ Styles responsive
  const responsiveGrid = {
    ...styles.formGrid,
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
  };

  const responsiveSection = {
    ...styles.formSection,
    padding: isMobile ? "1rem" : styles.formSection.padding,
  };

  const responsiveRow = {
    ...styles.voirListeBar,
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "flex-start" : "center",
    gap: isMobile ? "0.5rem" : "1rem",
  };

  const responsiveInput = {
    ...styles.input,
    width: "100%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      <div style={responsiveSection}>
        <h3 style={styles.formTitle}>{t("admin.evenement.titre")}</h3>

        <div style={responsiveGrid}>

          {/* ── Titre FR ── */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              {t("admin.evenement.labelTitre")} 🇫🇷
            </label>
            <input
              value={newEvt.titreFr}
              onChange={e => set("titreFr", e.target.value)}
              style={responsiveInput}
              placeholder={t("admin.evenement.placeholderTitre") + " (français)"}
            />
          </div>

          {/* ── Titre EN ── */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              {t("admin.evenement.labelTitre")} 🇺🇸
            </label>
            <input
              value={newEvt.titreEn}
              onChange={e => set("titreEn", e.target.value)}
              style={responsiveInput}
              placeholder={t("admin.evenement.placeholderTitre") + " (English)"}
            />
          </div>

          {/* ── Lieu ── */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>{t("admin.evenement.labelLieu")}</label>
            <input
              value={newEvt.lieu}
              onChange={e => set("lieu", e.target.value)}
              style={responsiveInput}
              placeholder={t("admin.evenement.placeholderLieu")}
            />
          </div>

          {/* ── Date ── */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>{t("admin.evenement.labelDate")}</label>
            <input
              type="datetime-local"
              value={newEvt.dateEvenement}
              onChange={e => set("dateEvenement", e.target.value)}
              style={responsiveInput}
            />
          </div>

          {/* ── Catégorie ── */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>{t("admin.evenement.labelCategorie")}</label>
            <select
              value={newEvt.categorie}
              onChange={e => set("categorie", e.target.value)}
              style={{ ...styles.select, width: "100%" }}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* ── Places ── */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>{t("admin.evenement.labelPlaces")}</label>
            <input
              type="number"
              value={newEvt.placesDisponibles}
              onChange={e => set("placesDisponibles", e.target.value)}
              style={responsiveInput}
              placeholder={t("admin.evenement.placeholderPlaces")}
            />
          </div>

          {/* ── Gratuit ── */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>{t("admin.evenement.labelGratuit")}</label>
            <select
              value={newEvt.gratuit}
              onChange={e => set("gratuit", e.target.value === "true")}
              style={{ ...styles.select, width: "100%" }}
            >
              <option value="true">{t("admin.evenement.oui")}</option>
              <option value="false">{t("admin.evenement.non")}</option>
            </select>
          </div>
        </div>

        {/* ── Description FR ── */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            {t("admin.evenement.labelDescription")} 🇫🇷
          </label>
          <textarea
            value={newEvt.descriptionFr}
            onChange={e => set("descriptionFr", e.target.value)}
            style={{ ...responsiveInput, minHeight: "80px", resize: "vertical" }}
            placeholder={t("admin.evenement.placeholderDesc") + " (français)"}
          />
        </div>

        {/* ── Description EN ── */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            {t("admin.evenement.labelDescription")} 🇺🇸
          </label>
          <textarea
            value={newEvt.descriptionEn}
            onChange={e => set("descriptionEn", e.target.value)}
            style={{ ...responsiveInput, minHeight: "80px", resize: "vertical" }}
            placeholder={t("admin.evenement.placeholderDesc") + " (English)"}
          />
        </div>

        {evtMsg && <p style={styles.msg}>{evtMsg}</p>}

        <button
          style={{ ...theme.buttons.primary, marginTop: "0.5rem", width: isMobile ? "100%" : "auto" }}
          onClick={creerEvenement}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.primaryHover}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.colors.primary}
        >
          {t("admin.evenement.creer")}
        </button>
      </div>

      <div style={responsiveRow}>
        <p style={styles.voirListeCount}>
          📅 {total ?? 0} {total > 1
            ? t("admin.evenement.totalPluriel")
            : t("admin.evenement.total")} au total
        </p>
        <button
          style={{ ...styles.voirListeBtn, width: isMobile ? "100%" : "auto" }}
          onClick={onVoirListe}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.primaryHover}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.colors.primary}
        >
          {t("admin.evenement.voirTous")}
        </button>
      </div>
    </div>
  );
}