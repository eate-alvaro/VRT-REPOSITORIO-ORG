/**
 * Cliente de Realtime Database.
 *
 * Envuelve al SDK web de Firebase y expone utilidades comunes:
 *   - `FirebaseError`      : error de comunicacion o de reglas.
 *   - `requireDb()`        : instancia de la base o error claro.
 *   - `shallowKeys(node)`  : claves de un nodo (consulta superficial via REST).
 *   - `health()`           : comprobacion de conectividad.
 *
 * `shallowKeys` usa el endpoint REST `?shallow=true` (el SDK web no ofrece una
 * lectura superficial directa) y adjunta el token del usuario autenticado.
 */

import { app, auth, db, isFirebaseConfigured } from "../config/firebase.js";

export class FirebaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "FirebaseError";
  }
}

export function isConfigured() {
  return isFirebaseConfigured;
}

export function requireDb() {
  if (!db) {
    throw new FirebaseError(
      "Firebase no esta configurado. Completa el archivo .env con las claves de la app web."
    );
  }
  return db;
}

/** Normaliza cualquier fallo del SDK a `FirebaseError`. */
export function asFirebaseError(error, context = "") {
  if (error instanceof FirebaseError) return error;
  const detail = (error && (error.message || error.code)) || String(error);
  return new FirebaseError(context ? `${context}: ${detail}` : detail);
}

function databaseUrl() {
  return (app && app.options && app.options.databaseURL) || "";
}

async function currentToken() {
  const user = auth && auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
}

function restUrl(node = "") {
  const base = databaseUrl().replace(/\/+$/, "");
  const clean = String(node || "").replace(/^\/+|\/+$/g, "");
  return clean ? `${base}/${clean}.json` : `${base}/.json`;
}

/** Claves de un nodo sin descargar su contenido (consulta superficial). */
export async function shallowKeys(node = "") {
  const base = databaseUrl();
  if (!base) throw new FirebaseError("Falta VITE_FIREBASE_DATABASE_URL.");

  const url = new URL(restUrl(node));
  url.searchParams.set("shallow", "true");
  const token = await currentToken();
  if (token) url.searchParams.set("auth", token);

  let response;
  try {
    response = await fetch(url.toString());
  } catch (error) {
    throw new FirebaseError(`No se pudo conectar con Firebase: ${error.message}`);
  }
  if (!response.ok) {
    throw new FirebaseError(`Firebase respondio ${response.status} en ${node || "/"}.`);
  }
  const data = await response.json();
  return data && typeof data === "object" ? Object.keys(data) : [];
}

/** Comprueba la conectividad. Devuelve { online, detail }. */
export async function health() {
  const base = databaseUrl();
  if (!base) return { online: false, detail: "firebase sin configurar" };

  const url = new URL(restUrl(""));
  url.searchParams.set("shallow", "true");
  const token = await currentToken();
  if (token) url.searchParams.set("auth", token);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) return { online: false, detail: `HTTP ${response.status}` };
    return { online: true, detail: `HTTP ${response.status}` };
  } catch (error) {
    return { online: false, detail: `sin conexion: ${error.message}` };
  }
}
