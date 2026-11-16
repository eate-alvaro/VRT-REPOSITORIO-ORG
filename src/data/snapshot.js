/**
 * Servicio de consolidacion del panel principal.
 *
 * Lee los nodos `players`, `events` y `sessions` y arma una fotografia unica.
 * Cada lectura es tolerante a fallos: si un nodo no responde, el resto del
 * panel sigue siendo util y el nodo se reporta en `degraded`.
 */

import { health } from "./client.js";
import { countEvents, recentEvents } from "./events.js";
import { listPlayers } from "./players.js";
import { countSessions } from "./sessions.js";

export async function dashboardSnapshot({ eventLimit = 8 } = {}) {
  const degraded = [];

  let players = [];
  try {
    players = await listPlayers();
  } catch {
    degraded.push("players");
  }

  let events = [];
  try {
    events = await recentEvents(eventLimit);
  } catch {
    degraded.push("events");
  }

  let sessionsCount = 0;
  try {
    sessionsCount = await countSessions();
  } catch {
    degraded.push("sessions");
  }

  let eventsCount = 0;
  try {
    eventsCount = await countEvents();
  } catch {
    degraded.push("events:count");
  }

  const { online, detail } = await health();

  return {
    players,
    events,
    sessionsCount,
    eventsCount,
    online,
    detail,
    degraded: [...new Set(degraded)].sort(),
  };
}
