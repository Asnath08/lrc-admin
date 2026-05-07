import api from "./axios";

export const contactService = {
  envoyerMessage: async (data) => {
    const res = await api.post("/contact", data);
    return res.data;
  },
};