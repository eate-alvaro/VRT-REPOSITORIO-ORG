/**
 * Repositorio del roster sobre el nodo `players`.
 *
 * Estructura:
 *
 *     players/<pushKey>/
 *       name:       "Jugador 01"
 *       team:       "azul" | "rojo" | "verde" | "amarillo"
 *       status:     "activo" | "inactivo"
 *       hits:       0
 *       shots:      0
 *       created_at: "2026-01-01T10:00:00-04:00"
 */

import { get, push, ref, remove, set, update } from "firebase/database";

import { PLAYERS_NODE } from "../config/app.js";
import { nowIso } from "../domain/format.js";
import { makePlayerRecord } from "../domain/models.js";
import { asFirebaseError, requireDb, shallowKeys } from "./client.js";

export async function listPlayers() {
  try {
    const snapshot = await get(ref(requireDb(), PLAYERS_NODE));
    const value = snapshot.val();
    if (!value || typeof value !== "object") return [];
    const records = Object.entries(value).map(([key, payload]) =>
      makePlayerRecord(key, payload)
    );
    records.sort(
      (a, b) =>
        a.team.localeCompare(b.team) ||
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    return records;
  } catch (error) {
    throw asFirebaseError(error, "No se pudo leer el nodo players");
  }
}

export async function getPlayer(playerId) {
  const snapshot = await get(ref(requireDb(), `${PLAYERS_NODE}/${playerId}`));
  const value = snapshot.val();
  if (!value) return null;
  return makePlayerRecord(playerId, value);
}

export async function countPlayers() {
  return (await shallowKeys(PLAYERS_NODE)).length;
}

export async function createPlayer(name, team = "azul") {
  try {
    const node = ref(requireDb(), PLAYERS_NODE);
    const target = push(node);
    const payload = {
      name: String(name || "").trim(),
      team: team || "azul",
      status: "activo",
      hits: 0,
      shots: 0,
      created_at: nowIso(),
    };
    await set(target, payload);
    return makePlayerRecord(target.key, payload);
  } catch (error) {
    throw asFirebaseError(error, "No se pudo crear el jugador");
  }
}

export async function setPlayerStatus(playerId, status) {
  try {
    await update(ref(requireDb(), `${PLAYERS_NODE}/${playerId}`), { status });
  } catch (error) {
    throw asFirebaseError(error, "No se pudo actualizar el estado del jugador");
  }
}

export async function deletePlayer(playerId) {
  try {
    await remove(ref(requireDb(), `${PLAYERS_NODE}/${playerId}`));
  } catch (error) {
    throw asFirebaseError(error, "No se pudo eliminar el jugador");
  }
}

/** Incrementa los disparos e impactos acumulados de un jugador. */
export async function bumpPlayerStats(playerId, { shots = 0, hits = 0 } = {}) {
  const current = await getPlayer(playerId);
  if (!current) return;
  await update(ref(requireDb(), `${PLAYERS_NODE}/${playerId}`), {
    shots: current.shots + shots,
    hits: current.hits + hits,
  });
}
