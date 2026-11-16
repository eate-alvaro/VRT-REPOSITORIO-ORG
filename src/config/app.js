/**
 * Identidad y configuracion general de la aplicacion.
 *
 * Los valores se leen de variables de entorno de Vite (prefijo VITE_) con
 * respaldo en constantes para que la aplicacion nunca quede sin identidad.
 */

const env = import.meta.env || {};

export const APP_NAME = env.VITE_APP_NAME || "PAINTBALL VR & IOT";
export const APP_TAGLINE = env.VITE_APP_TAGLINE || "PLATAFORMA DE SIMULACION";
export const APP_VERSION = env.VITE_APP_VERSION || "1.0.0";

/** Nombre del tema activo (Tokyo Night / Omarchy OS). */
export const THEME_NAME = "TOKYO NIGHT";

/**
 * Dominio sintetico usado para mapear un nombre de usuario a un correo de
 * Firebase Authentication: `<usuario>@<dominio>`.
 */
export const AUTH_EMAIL_DOMAIN = env.VITE_AUTH_EMAIL_DOMAIN || "vrt.local";

/** URL de la Realtime Database compartida. */
export const FIREBASE_DB_URL =
  env.VITE_FIREBASE_DATABASE_URL || "https://alvin-59045-default-rtdb.firebaseio.com";

/** Nodos de la Realtime Database. */
export const USERS_NODE = "users";
export const PLAYERS_NODE = "players";
export const SESSIONS_NODE = "sessions";
export const EVENTS_NODE = "events";

/** Clave del estado de la partida en el almacenamiento local del navegador. */
export const MATCH_STORAGE_KEY = "vrt.match";

/** Host legible de la Realtime Database (para las barras de estado). */
export function firebaseHost() {
  try {
    return new URL(FIREBASE_DB_URL).host;
  } catch {
    return FIREBASE_DB_URL;
  }
}

/** Correo sintetico de Firebase Auth a partir de un nombre de usuario. */
export function emailForUsername(username) {
  const clean = String(username || "").trim().toLowerCase();
  return `${clean}@${AUTH_EMAIL_DOMAIN}`;
}
