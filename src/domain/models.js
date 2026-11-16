/**
 * Modelo de dominio: fabricas y derivados de los registros que viven en la
 * Realtime Database.
 *
 * Los registros son objetos planos con los mismos nombres de campo que usa la
 * base de datos (`name`, `team`, `created_at`, ...). Los valores derivados se
 * calculan con funciones puras.
 */

import { toInt, initialsFrom } from "./format.js";

// --- Jugadores (nodo players) ---------------------------------------------
export function makePlayerRecord(id = "", payload = {}) {
  const data = payload || {};
  return {
    id: String(id),
    name: String(data.name ?? ""),
    team: String(data.team ?? "azul"),
    status: String(data.status ?? "activo"),
    hits: toInt(data.hits, 0),
    shots: toInt(data.shots, 0),
    created_at: String(data.created_at ?? ""),
  };
}

export function playerIsActive(player) {
  return player.status === "activo";
}

export function playerInitials(player) {
  return initialsFrom(player.name);
}

export function playerToPayload(player) {
  return {
    name: player.name,
    team: player.team,
    status: player.status,
    hits: player.hits,
    shots: player.shots,
    created_at: player.created_at,
  };
}

// --- Eventos (nodo events) ------------------------------------------------
export function makeEventRecord(id = "", payload = {}) {
  const data = payload || {};
  return {
    id: String(id),
    kind: String(data.kind ?? ""),
    detail: String(data.detail ?? ""),
    actor: String(data.actor ?? ""),
    severity: String(data.severity ?? "info"),
    source: String(data.source ?? "web"),
    match_id: String(data.match_id ?? ""),
    created_at: String(data.created_at ?? ""),
  };
}

export function eventToPayload(event) {
  return {
    kind: event.kind,
    detail: event.detail,
    actor: event.actor,
    severity: event.severity,
    source: event.source,
    match_id: event.match_id,
    created_at: event.created_at,
  };
}

// --- Usuarios (nodo users) ------------------------------------------------
export function makeUserProfile(uid = "", payload = {}) {
  const data = payload || {};
  return {
    uid: String(uid),
    username: String(data.username ?? ""),
    display_name: String(data.display_name ?? ""),
    role: String(data.role ?? "operator"),
    active: data.active !== false,
    created_at: String(data.created_at ?? ""),
    last_login: String(data.last_login ?? ""),
  };
}

export function userLabel(profile) {
  if (!profile) return "";
  return profile.display_name || profile.username || "";
}

// --- Actor (identidad autenticada) ----------------------------------------
export function makeActor(profile) {
  if (!profile) return null;
  const username = profile.username || "";
  return {
    username,
    displayName: profile.display_name || "",
    role: profile.role || "operator",
  };
}

export function actorLabel(actor) {
  if (!actor) return "";
  return actor.displayName || actor.username || "";
}

export function actorInitials(actor) {
  if (!actor) return "?";
  return initialsFrom(actor.displayName || actor.username);
}
