import api from "./axios";

export const evenementService = {
  // Lister les événements (public)
  listerPublies: async () => {
    const res = await api.get("/evenements");
    return res.data;
  },

  // Détail d'un événement
  trouverParId: async (id) => {
    const res = await api.get(`/evenements/${id}`);
    return res.data;
  },
};