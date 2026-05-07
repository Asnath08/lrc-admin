import { useTranslation } from "react-i18next";

/**
 * Hook utilitaire pour afficher le bon champ selon la langue active.
 * Usage : const loc = useLocalise();
 *         loc(objet.titreFr, objet.titreEn)
 *
 * Si le champ de la langue active est vide → fallback sur l'autre langue.
 */
export function useLocalise() {
  const { i18n } = useTranslation();

  return (fr, en) => {
    if (i18n.language === "en") return en?.trim() || fr?.trim() || "";
    return fr?.trim() || en?.trim() || "";
  };
}