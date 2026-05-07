// src/api/authService.js

const KEYCLOAK_URL    = "https://keycloak.nafaan.com";
const REALM           = "lerece";
const CLIENT_ID       = "lerece-backend";
const CLIENT_SECRET   = "NgInvO6rPA9ROV3VDTCDX0kYTWuXTp98";

const TOKEN_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

export const authService = {

  // ── Login via Keycloak ─────────────────────────────────────────────────
  async login(email, password) {
    const body = new URLSearchParams({
      grant_type:    "password",
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username:      email,
      password:      password,
      scope:         "openid profile email",
    });

    const res = await fetch(TOKEN_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    body.toString(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error_description || "Email ou mot de passe incorrect");
    }

    const data = await res.json();
    // data contient : access_token, refresh_token, expires_in...

    // Décoder le token pour récupérer le rôle et le profil
    const payload = parseJwt(data.access_token);

    // Les rôles viennent de realm_access.roles (KeycloakRealmRoleConverter)
    const roles = payload?.realm_access?.roles ?? [];
    const role  = detectRole(roles);

    const user = {
      token:     data.access_token,
      refresh:   data.refresh_token,
      email:     payload.email || payload.preferred_username,
      prenom:    payload.given_name  || payload.preferred_username,
      nom:       payload.family_name || "",
      role:      role,
      id:        payload.sub,
    };

    localStorage.setItem("token",   data.access_token);
    localStorage.setItem("refresh", data.refresh_token);
    localStorage.setItem("user",    JSON.stringify(user));

    return user;
  },

  // ── Logout ─────────────────────────────────────────────────────────────
  async logout() {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      // Invalider le token côté Keycloak
      const body = new URLSearchParams({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refresh,
      });
      await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`, {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:    body.toString(),
      }).catch(() => {}); // ignorer les erreurs réseau
    }
    localStorage.clear();
  },

  // ── Récupérer l'utilisateur connecté ───────────────────────────────────
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
    // Vérifier si le token est expiré
    const payload = parseJwt(token);
    if (!payload?.exp) return false;
    return payload.exp * 1000 > Date.now();
  },

  // ── Refresh token ──────────────────────────────────────────────────────
  async refreshToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) throw new Error("Pas de refresh token");

    const body = new URLSearchParams({
      grant_type:    "refresh_token",
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refresh,
    });

    const res = await fetch(TOKEN_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    body.toString(),
    });

    if (!res.ok) {
      localStorage.clear();
      throw new Error("Session expirée");
    }

    const data = await res.json();
    localStorage.setItem("token",   data.access_token);
    localStorage.setItem("refresh", data.refresh_token);
    return data.access_token;
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function detectRole(roles) {
  // Priorité : ADMIN > STAFF > PARTNER > USER
  if (roles.includes("ADMIN"))   return "ADMIN";
  if (roles.includes("STAFF"))   return "STAFF";
  if (roles.includes("PARTNER")) return "PARTNER";
  if (roles.includes("USER"))    return "USER";
  return roles[0] || "USER";
}