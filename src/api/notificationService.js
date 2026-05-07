import api from "./axios";

export const notificationService = {
  listerTout: async () => {
    const res = await api.get("/notifications");
    return res.data;
  },

  compterNonLues: async () => {
    const res = await api.get("/notifications/count");
    return res.data.count;
  },

  marquerLue: async (id) => {
    await api.put(`/notifications/${id}/lire`);
  },

  marquerToutesLues: async () => {
    await api.put("/notifications/lire-tout");
  },
};