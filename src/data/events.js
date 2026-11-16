/**
 * Repositorio de eventos sobre el nodo `events`.
 *
 * Estructura:
 *
 *     events/<pushKey>/
 *       kind:       "disparo"
 *       detail:     "Disparo simulado. Municion restante: 29"
 *       actor:      "jugador01"
 *       severity:   "info"
 *       source:     "web"
 *       match_id:   "M-20260101-120000"
 *       created_at: "2026-01-01T12:00:00-04:00"
 *
 * Las claves generadas por `push` ordenan cronologicamente, por lo que
 * `orderByKey` + `limitToLast` devuelve los eventos mas recientes.
 */

import { get, limitToLast, orderByKey, push, query, ref, remove, set } from "firebase/database";

import { EVENTS_NODE } from "../config/app.js";
import { makeEventRecord } from "../domain/models.js";
import { asFirebaseError, requireDb, shallowKeys } from "./client.js";

function toRecords(value) {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).map(([key, payload]) => makeEventRecord(key, payload));
}

/** Ultimos `limit` eventos, del mas reciente al mas antiguo. */
export async function recentEvents(limit = 50) {
  try {
    const size = Math.max(1, Number.parseInt(limit, 10) || 1);
    const target = query(ref(requireDb(), EVENTS_NODE), orderByKey(), limitToLast(size));
    const snapshot = await get(target);
    const records = toRecords(snapshot.val());
    records.reverse();
    return records;
  } catch (error) {
    throw asFirebaseError(error, "No se pudo leer el nodo events");
  }
}

export async function allEvents() {
  const snapshot = await get(ref(requireDb(), EVENTS_NODE));
  const records = toRecords(snapshot.val());
  records.reverse();
  return records;
}

export async function countEvents() {
  return (await shallowKeys(EVENTS_NODE)).length;
}

export async function appendEvent(event) {
  try {
    const target = push(ref(requireDb(), EVENTS_NODE));
    await set(target, event);
    return String(target.key || "");
  } catch (error) {
    throw asFirebaseError(error, "No se pudo escribir el evento");
  }
}

export async function clearEvents() {
  try {
    await remove(ref(requireDb(), EVENTS_NODE));
  } catch (error) {
    throw asFirebaseError(error, "No se pudo vaciar el nodo events");
  }
}

export async function eventsByMatch(matchId) {
  const records = await allEvents();
  return records.filter((event) => event.match_id === matchId);
}
