/**
 * Repositorio del nodo `sessions` (espejo de las partidas).
 */

import { get, ref, set } from "firebase/database";

import { SESSIONS_NODE } from "../config/app.js";
import { nowIso } from "../domain/format.js";
import { asFirebaseError, requireDb, shallowKeys } from "./client.js";

export async function saveSession(matchId, payload) {
  try {
    const data = { ...payload, updated_at: nowIso() };
    await set(ref(requireDb(), `${SESSIONS_NODE}/${matchId}`), data);
    return data;
  } catch (error) {
    throw asFirebaseError(error, "No se pudo sincronizar la partida");
  }
}

export async function getSession(matchId) {
  const snapshot = await get(ref(requireDb(), `${SESSIONS_NODE}/${matchId}`));
  return snapshot.val() || null;
}

export async function countSessions() {
  return (await shallowKeys(SESSIONS_NODE)).length;
}
