const theme = {
  // COULEURS 
  colors: {
    primary:        "#C8520A",
    primaryHover:   "#E06010",
    gold:           "#D4960A",
    accent:         "#C8520A",
    dark:           "#1A0D00",
    dark2:          "#2A1200",
    bgLight:        "#F5EDE0",
    bgWhite:        "#FFFFFF",
    textDark:       "#1A0D00",
    textMuted:      "#4A3728",
    textLight:      "#FFFFFF",
    textLightMuted: "rgba(245, 237, 214, 0.72)",
    border:         "rgba(212, 150, 10, 0.18)",
    borderHover:    "rgba(212, 150, 10, 0.6)",
    cardDark:       "rgba(30, 15, 0, 0.72)",
  },

  // TYPOGRAPHIE 
  fonts: {
    heading: "'Playfair Display', serif",
    body:    "'Inter', sans-serif",
  },

  fontSizes: {
    label:  "0.7rem",
    small:  "0.875rem",
    body:   "1rem",
    h3:     "1.2rem",
    h2:     "clamp(2rem, 4vw, 3rem)",
    h1:     "clamp(2.8rem, 6vw, 5.2rem)",
  },

  //  ESPACEMENTS
  spacing: {
    sectionPadding: "6rem 2rem",
    innerMaxWidth:  "1100px",
  },

  //  BORDURES 
  borderRadius: {
    small:  "4px",
    medium: "10px",
    large:  "12px",
    pill:   "999px",
  },

  //  BOUTONS 
  buttons: {
    primary: {
      backgroundColor: "#C8520A",   
      color:           "#FFFFFF",
      border:          "none",
      cursor:          "pointer",
      fontSize:        "0.9rem",
      fontWeight:      "600",
      padding:         "0.85rem 1.8rem",  
      borderRadius:    "4px",
      transition:      "all 0.2s",
      fontFamily:      "'Inter', sans-serif",
    },
    secondary: {
      backgroundColor: "transparent",
      color:           "#F5EDD6",
      border:          "1.5px solid rgba(245, 237, 214, 0.5)",
      cursor:          "pointer",
      fontSize:        "0.9rem",
      fontWeight:      "500",
      padding:         "0.85rem 1.8rem",
      borderRadius:    "4px",
      transition:      "all 0.2s",
      fontFamily:      "'Inter', sans-serif",
    },
    small: {
      backgroundColor: "#C8520A",
      color:           "#FFFFFF",
      border:          "none",
      cursor:          "pointer",
      fontSize:        "0.875rem",
      fontWeight:      "600",
      padding:         "0.65rem 1.4rem",
      borderRadius:    "4px",
      transition:      "all 0.2s",
      fontFamily:      "'Inter', sans-serif",
    },
  },

  //  CARTES 
  cards: {
    light: {
      backgroundColor: "#FFFFFF",
      borderRadius:    "12px",
      padding:         "1.8rem",
      boxShadow:       "0 4px 16px rgba(0,0,0,0.07)",
      transition:      "transform 0.25s, box-shadow 0.25s",
    },
    dark: {
      backgroundColor: "rgba(30, 15, 0, 0.72)",
      border:          "1px solid rgba(212, 150, 10, 0.18)",
      borderRadius:    "10px",
      padding:         "2rem 1.5rem",
      backdropFilter:  "blur(14px)",
      transition:      "all 0.25s",
    },
      hoverLight: {
    transform: "translateY(-6px)",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)",
  },
  hoverDark: {
    transform: "translateX(-6px)",
    border: "1px solid rgba(212, 150, 10, 0.6)",
  },
  },

  //  SECTIONS 
  sections: {
    light: {
      backgroundColor: "#F5EDE0",
      padding:         "6rem 2rem",
    },
    white: {
      backgroundColor: "#FFFFFF",
      padding:         "6rem 2rem",
    },
    dark: {
      background: "linear-gradient(160deg, #1A0D00 0%, #2A1200 40%, #1A0800 100%)",
      padding:    "6rem 2rem",
    },
  },

  // LABEL RÉUTILISABLE 
  label: {
    display:       "flex",
    alignItems:    "center",
    gap:           "0.75rem",
    fontSize:      "0.7rem",
    fontWeight:    "700",
    letterSpacing: "0.15em",
    color:         "#C8520A",
    textTransform: "uppercase",
    marginBottom:  "1rem",
  },

  labelLine: {
    display:         "inline-block",
    width:           "28px",
    height:          "2px",
    backgroundColor: "#C8520A",
    borderRadius:    "2px",
    flexShrink:      0,
  },
};


const adminStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  modal: {
    backgroundColor: theme.colors.bgWhite,
    borderRadius: theme.borderRadius.large,
    width: "100%",
    maxWidth: "750px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1.8rem 2rem",
    borderBottom: "1px solid rgba(74,55,40,0.1)",
  },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: "1.4rem",
    fontWeight: "900",
    color: theme.colors.textDark,
    margin: 0,
  },
  closeBtn: {
    background: "none", border: "none",
    fontSize: "1.2rem", cursor: "pointer",
    color: theme.colors.textMuted,
  },
  tabs: {
    display: "flex",
    borderBottom: "2px solid rgba(74,55,40,0.1)",
    padding: "0 1.5rem",
    overflowX: "auto",
  },
  tab: {
    background: "none", border: "none",
    cursor: "pointer", fontSize: "0.8rem",
    fontWeight: "600", padding: "0.75rem 0.8rem",
    color: theme.colors.textMuted,
    borderBottom: "2px solid transparent",
    marginBottom: "-2px",
    fontFamily: theme.fonts.body,
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  tabActive: {
    color: theme.colors.primary,
    borderBottom: `2px solid ${theme.colors.primary}`,
  },
  content: { padding: "1.5rem 2rem 2rem" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
  },
  statCard: {
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.medium,
    padding: "1.5rem", textAlign: "center",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "0.5rem",
  },
  statIcon: { fontSize: "2rem" },
  statValue: {
    fontFamily: theme.fonts.heading,
    fontSize: "2.5rem", fontWeight: "700",
    color: theme.colors.primary, lineHeight: "1",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left", fontSize: "0.7rem",
    fontWeight: "700", letterSpacing: "0.1em",
    color: theme.colors.textMuted,
    padding: "0.75rem 0.5rem",
    borderBottom: "2px solid rgba(74,55,40,0.1)",
  },
  td: {
    padding: "0.75rem 0.5rem", fontSize: "0.875rem",
    color: theme.colors.textDark,
    borderBottom: "1px solid rgba(74,55,40,0.06)",
  },
  select: {
    padding: "0.3rem 0.5rem", borderRadius: "4px",
    border: "1px solid rgba(74,55,40,0.2)",
    backgroundColor: theme.colors.bgLight,
    fontSize: "0.8rem", fontFamily: theme.fonts.body,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "none", border: "none",
    cursor: "pointer", fontSize: "1rem", padding: "0.2rem",
  },
  formSection: {
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.medium,
    padding: "1.5rem",
    display: "flex", flexDirection: "column", gap: "1rem",
  },
  formTitle: {
    fontSize: "1rem", fontWeight: "700",
    color: theme.colors.textDark, margin: 0,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  fieldGroup: {
    display: "flex", flexDirection: "column", gap: "0.4rem",
  },
  label: {
    fontSize: "0.65rem", fontWeight: "700",
    letterSpacing: "0.12em", color: theme.colors.textMuted,
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: theme.borderRadius.small,
    border: "1.5px solid rgba(74, 55, 40, 0.15)",
    backgroundColor: theme.colors.bgWhite,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textDark,
    fontFamily: theme.fonts.body,
    outline: "none",
  },
  listItem: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "0.9rem 0",
    borderBottom: "1px solid rgba(74,55,40,0.08)",
  },
  msg: {
    color: theme.colors.primary,
    fontSize: "0.85rem", textAlign: "center",
  },
  empty: {
    textAlign: "center",
    color: theme.colors.textMuted, padding: "2rem",
  },
  voirListeBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.medium,
    padding: "1rem 1.5rem",
  },
  voirListeCount: {
    margin: 0,
    color: theme.colors.textMuted,
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  voirListeBtn: {
    backgroundColor: theme.colors.primary,
    color: "#fff", border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px", fontSize: "0.8rem",
    fontWeight: "700", cursor: "pointer",
    fontFamily: "inherit",
  },
  btnRetour: {
    backgroundColor: theme.colors.primary,
    color: "#fff", border: "none",
    padding: "0.5rem 1rem", borderRadius: "8px",
    fontSize: "0.8rem", fontWeight: "700",
    cursor: "pointer", fontFamily: "inherit",
  },
};

export { adminStyles };

export default theme;