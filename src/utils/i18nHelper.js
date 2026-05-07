export const getTexte = (objFr, objEn, langue) => {
  if (langue === "en") return objEn || objFr || "";
  return objFr || objEn || "";
};