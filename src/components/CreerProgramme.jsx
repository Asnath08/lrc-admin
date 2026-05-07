import { useState } from "react";
import { useTranslation } from "react-i18next";
import theme, { adminStyles as styles } from "../theme.js";
import api from "../api/axios.js";
import { CATEGORIES, NIVEAUX, INITIAL_PROGRAMME } from "../data/adminData.js";

const responsiveStyles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    minWidth: 0,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
  },
  voirListeBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: "100%",
    boxSizing: "border-box",
  },
};

export default function CreerProgramme({ onSuccess, onVoirListe, total }) {
  const { t } = useTranslation();
  const [newProg, setNewProg] = useState(INITIAL_PROGRAMME);
  const [progMsg, setProgMsg] = useState(null);

  const set = (champ, val) => setNewProg(p => ({ ...p, [champ]: val }));

  const creerProgramme = async () => {
    const titreCree = newProg.titreFr || newProg.titreEn;
    try {
      await api.post("/programmes", {
        ...newProg,
        capaciteMax: newProg.capaciteMax ? parseInt(newProg.capaciteMax) : null,
        prix: newProg.prix ? parseFloat(newProg.prix) : null,
      });
      setNewProg(INITIAL_PROGRAMME);
      if (onSuccess) onSuccess(titreCree);
    } catch (error) {
      setProgMsg("❌ " + (error.response?.data?.message || error.message));
      setTimeout(() => setProgMsg(null), 4000);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "0 0.5rem" }}>
      <div style={styles.formSection}>
        <h3 style={styles.formTitle}>{t("admin.programme.titre")}</h3>

        {/* Grille responsive auto-fit */}
        <div style={responsiveStyles.grid}>

          {/* ── Titre FR ── */}
          <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup }}>
            <label style={styles.label}>{t("admin.programme.labelTitre")} 🇫🇷</label>
            <input
              value={newProg.titreFr}
              onChange={e => set("titreFr", e.target.value)}
              style={{ ...styles.input, ...responsiveStyles.input }}
              placeholder={t("admin.programme.placeholderTitre") + " (français)"}
            />
          </div>

          {/* ── Titre EN ── */}
          <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup }}>
            <label style={styles.label}>{t("admin.programme.labelTitre")} 🇺🇸</label>
            <input
              value={newProg.titreEn}
              onChange={e => set("titreEn", e.target.value)}
              style={{ ...styles.input, ...responsiveStyles.input }}
              placeholder={t("admin.programme.placeholderTitre") + " (English)"}
            />
          </div>

          {/* ── Lieu ── */}
          <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup }}>
            <label style={styles.label}>{t("admin.programme.labelLieu")}</label>
            <input
              value={newProg.lieu}
              onChange={e => set("lieu", e.target.value)}
              style={{ ...styles.input, ...responsiveStyles.input }}
              placeholder={t("admin.programme.placeholderLieu")}
            />
          </div>

          {/* ── Catégorie ── */}
          <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup }}>
            <label style={styles.label}>{t("admin.programme.labelCategorie")}</label>
            <select
              value={newProg.categorie}
              onChange={e => set("categorie", e.target.value)}
              style={{ ...styles.select, ...responsiveStyles.input }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* ── Niveau ── */}
          <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup }}>
            <label style={styles.label}>{t("admin.programme.labelNiveau")}</label>
            <select
              value={newProg.niveau}
              onChange={e => set("niveau", e.target.value)}
              style={{ ...styles.select, ...responsiveStyles.input }}
            >
              {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* ── Date début ── */}
          <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup }}>
            <label style={styles.label}>{t("admin.programme.labelDateDebut")}</label>
            <input
              type="date"
              value={newProg.dateDebut}
              onChange={e => set("dateDebut", e.target.value)}
              style={{ ...styles.input, ...responsiveStyles.input }}
            />
          </div>

          {/* ── Date fin ── */}
          <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup }}>
            <label style={styles.label}>{t("admin.programme.labelDateFin")}</label>
            <input
              type="date"
              value={newProg.dateFin}
              onChange={e => set("dateFin", e.target.value)}
              style={{ ...styles.input, ...responsiveStyles.input }}
            />
          </div>

          {/* ── Capacité ── */}
          <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup }}>
            <label style={styles.label}>{t("admin.programme.labelCapacite")}</label>
            <input
              type="number"
              value={newProg.capaciteMax}
              onChange={e => set("capaciteMax", e.target.value)}
              style={{ ...styles.input, ...responsiveStyles.input }}
              placeholder={t("admin.programme.placeholderCapacite")}
            />
          </div>

          {/* ── Gratuit ── */}
          <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup }}>
            <label style={styles.label}>{t("admin.programme.labelGratuit")}</label>
            <select
              value={newProg.gratuit}
              onChange={e => set("gratuit", e.target.value === "true")}
              style={{ ...styles.select, ...responsiveStyles.input }}
            >
              <option value="true">{t("admin.programme.oui")}</option>
              <option value="false">{t("admin.programme.non")}</option>
            </select>
          </div>
        </div>

        {/* ── Description FR ── (pleine largeur) */}
        <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup, marginTop: "1rem" }}>
          <label style={styles.label}>{t("admin.programme.labelDescription")} 🇫🇷</label>
          <textarea
            value={newProg.descriptionFr}
            onChange={e => set("descriptionFr", e.target.value)}
            style={{ ...styles.input, ...responsiveStyles.input, minHeight: "80px", resize: "vertical" }}
            placeholder={t("admin.programme.placeholderDesc") + " (français)"}
          />
        </div>

        {/* ── Description EN ── (pleine largeur) */}
        <div style={{ ...styles.fieldGroup, ...responsiveStyles.fieldGroup, marginTop: "0.75rem" }}>
          <label style={styles.label}>{t("admin.programme.labelDescription")} 🇺🇸</label>
          <textarea
            value={newProg.descriptionEn}
            onChange={e => set("descriptionEn", e.target.value)}
            style={{ ...styles.input, ...responsiveStyles.input, minHeight: "80px", resize: "vertical" }}
            placeholder={t("admin.programme.placeholderDesc") + " (English)"}
          />
        </div>

        {progMsg && <p style={styles.msg}>{progMsg}</p>}

        <button
          style={{ ...theme.buttons.primary, ...responsiveStyles.button, marginTop: "0.5rem" }}
          onClick={creerProgramme}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.primaryHover}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.colors.primary}
        >
          {t("admin.programme.creer")}
        </button>
      </div>

      {/* ── Barre bas ── */}
      <div style={{ ...styles.voirListeBar, ...responsiveStyles.voirListeBar }}>
        <p style={styles.voirListeCount}>
          📚 {total ?? 0} {total > 1
            ? t("admin.programme.totalPluriel")
            : t("admin.programme.total")} au total
        </p>
        <button
          style={{ ...styles.voirListeBtn, flexShrink: 0 }}
          onClick={onVoirListe}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.primaryHover}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.colors.primary}
        >
          {t("admin.programme.voirTous")}
        </button>
      </div>
    </div>
  );
}