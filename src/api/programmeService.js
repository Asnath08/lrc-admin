import api from "./axios";

export const programmeService = {
  // Lister les programmes actifs (public)
  listerActifs: async () => {
    const res = await api.get("/programmes");
    return res.data;
  },

  // Détail d'un programme
  trouverParId: async (id) => {
    const res = await api.get(`/programmes/${id}`);
    return res.data;
  },

  //  ADMIN 
  creer: async (données) => {                          
    const res = await api.post("/programmes", données);
    return res.data;
  },

  modifier: async (id, données) => {                   
    const res = await api.put(`/programmes/${id}`, données);
    return res.data;
  },

  archiver: async (id) => {                            
    await api.delete(`/programmes/${id}`);
  },

  inscrits: async (id) => {                            
    const res = await api.get(`/programmes/${id}/enrollments`);
    return res.data;
  },


  // S'inscrire à un programme
  inscrire: async (id) => {
    const res = await api.post(`/programmes/${id}/enroll`);
    return res.data;
  },

  // Mes programmes
  mesProgrammes: async () => {
    const res = await api.get("/programmes/my-programs");
    return res.data;
  },
};