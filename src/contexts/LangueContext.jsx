import { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LangueContext = createContext();

export function LangueProvider({ children }) {
  const { i18n } = useTranslation();
  const [langue, setLangue] = useState(
    localStorage.getItem("langue") || "fr"
  );

  useEffect(() => {
    i18n.changeLanguage(langue);
  }, [langue]);

  const changerLangue = (code) => {
    localStorage.setItem("langue", code);
    setLangue(code);
    i18n.changeLanguage(code);
  };

  return (
    <LangueContext.Provider value={{ langue, changerLangue }}>
      {children}
    </LangueContext.Provider>
  );
}

export function useLangue() {
  return useContext(LangueContext);
}