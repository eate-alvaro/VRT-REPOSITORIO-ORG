/**
 * Repositorio de perfiles de usuario sobre el nodo `users`.
 *
 * Con Firebase Authentication la credencial (correo/contrasena) la administra
 * Firebase. La Realtime Database guarda el perfil asociado al uid:
 *
 *     users/<uid>/
 *       username:     "jugador01"
 *       display_name: "Jugador 01"
 *       role:         "operator" | "admin"
 *       active:       true
 *       created_at:   "2026-01-01T10:00:00-04:00"
 *       last_login:   "2026-01-02T18:22:10-04:00"
 */

import { get, ref, set, update } from "firebase/database";

import { USERS_NODE } from "../config/app.js";
import { nowIso } from "../domain/format.js";
import { makeUserProfile } from "../domain/models.js";
import { asFirebaseError, requireDb } from "./client.js";

export async function getUserProfile(uid) {
  try {
    const snapshot = await get(ref(requireDb(), `${USERS_NODE}/${uid}`));
    const value = snapshot.val();
    if (!value) return null;
    return makeUserProfile(uid, value);
  } catch (error) {
    throw asFirebaseError(error, "No se pudo leer el perfil del usuario");
  }
}

export async function createUserProfile(uid, { username, displayName = "", role = "operator" } = {}) {
  try {
    const payload = {
      username: String(username || "").trim(),
      display_name: String(displayName || username || "").trim(),
      role: role || "operator",
      active: true,
      created_at: nowIso(),
      last_login: "",
    };
    await set(ref(requireDb(), `${USERS_NODE}/${uid}`), payload);
    return makeUserProfile(uid, payload);
  } catch (error) {
    throw asFirebaseError(error, "No se pudo crear el perfil del usuario");
  }
}

/** Actualiza la marca de ultimo acceso (mejor esfuerzo). */
export async function touchLastLogin(uid) {
  try {
    await update(ref(requireDb(), `${USERS_NODE}/${uid}`), { last_login: nowIso() });
  } catch {
    // No debe impedir el inicio de sesion.
  }
}

export async function listUserProfiles() {
  try {
    const snapshot = await get(ref(requireDb(), USERS_NODE));
    const value = snapshot.val();
    if (!value || typeof value !== "object") return [];
    return Object.entries(value)
      .map(([uid, payload]) => makeUserProfile(uid, payload))
      .sort((a, b) => a.username.localeCompare(b.username));
  } catch (error) {
    throw asFirebaseError(error, "No se pudo leer el nodo users");
  }
}
