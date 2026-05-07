
const API_URL = "http://localhost:8080/api/v1/auth";

export const authService = {

  // Login via le backend Spring Boot
  async login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, motDePasse: password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Email ou mot de passe incorrect");
    }

    const data = await res.json();

    const user = {
      token:   data.token,
      refresh: data.refresh,
      id:      data.user.id,
      email:   data.user.email,
      prenom:  data.user.prenom,
      nom:     data.user.nom,
      role:    data.user.role,
    };

    localStorage.setItem("token",   data.token);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user",    JSON.stringify(user));

    return user;
  },

  // Logout via le backend Spring Boot
  async logout() {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      await fetch(`${API_URL}/logout`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ refresh }),
      }).catch(() => {});
    }
    localStorage.clear();
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  async refreshToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) throw new Error("Pas de refresh token");

    const res = await fetch(`${API_URL}/refresh-token`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ refreshToken: refresh }),
    });

    if (!res.ok) {
      localStorage.clear();
      throw new Error("Session expirée");
    }

    const data = await res.json();
    localStorage.setItem("token",   data.accessToken);
    localStorage.setItem("refresh", data.refreshToken);
    return data.accessToken;
  },
};