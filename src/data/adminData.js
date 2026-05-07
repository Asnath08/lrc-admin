export const CATEGORIES = [
  "ESL",
  "WORKFORCE",
  "CIVIC",
  "DIGITAL",
  "HEALTH",
  "LEGAL",
];


export const NIVEAUX = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export const ROLES = ["USER", "STAFF", "ADMIN", "PARTNER"];

export const STATUTS_EVENEMENT = ["PUBLIE", "ANNULE", "REPORTE"];

export const INITIAL_PROGRAMME = {
  titreFr:       "",   
  titreEn:       "", 
  descriptionFr: "",   
  descriptionEn: "",   
  lieu:          "",
  categorie:     "ESL",
  niveau:        "BEGINNER",
  dateDebut:     "",
  dateFin:       "",
  capaciteMax:   "",
  gratuit:       true,
  prix:          "",
};

export const INITIAL_EVENEMENT = {
  titreFr:          "",  
  titreEn:          "",   
  descriptionFr:    "",   
  descriptionEn:    "",   
  lieu:             "",
  dateEvenement:    "",
  categorie:        "ESL",
  placesDisponibles: "",
  gratuit:          true,
};

export const ONGLETS = [
  { id: "stats",           label: "📊 Stats" },
   { id: "kpis",            label: "📈 KPIs temps réel" },
  { id: "users",           label: "👥 Utilisateurs" },
  { id: "programmes",      label: "📚 Programmes" },
  { id: "listeProgrammes", label: "📋 Liste Programmes" },
  { id: "evenements",      label: "📅 Événements" },
  { id: "listeEvenements", label: "🗓️ Liste Événements" },
  { id: "progression",     label: "📈 Progression" },
  { id: "notifications",   label: "🔔 Notifications" },
  { id: "rapports",        label: "📄 Rapports" },         
  { id: "configuration",   label: "⚙️ Configuration" },
];

export const STATS_CONFIG = [
  { label: "Utilisateurs", key: "totalUsers",      icon: "👥" },
  { label: "Programmes",   key: "totalProgrammes",  icon: "📚" },
  { label: "Événements",   key: "totalEvenements",  icon: "📅" },
  { label: "Inscriptions", key: "totalEnrollments", icon: "✅" },
  { label: "Revenus ($)",   key: "totalRevenus",      icon: "💰" }, 
  { label: "Dons ($)",      key: "totalDons",         icon: "💛" },  
];
 