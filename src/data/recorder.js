/**
 * Registrador de eventos.
 *
 * Centraliza la escritura de telemetria para que cualquier bloque emita eventos
 * homogeneos sin conocer los detalles de Realtime Database. Es "mejor
 * esfuerzo": un fallo al registrar no interrumpe la operacion principal.
 */

import { nowIso } from "../domain/format.js";
import { appendEvent } from "./events.js";

export async function recordEvent(
  kind,
  detail = "",
  { actor = "", severity = "info", source = "web", matchId = "" } = {}
) {
  const event = {
    kind,
    detail,
    actor,
    severity,
    source,
    match_id: matchId,
    created_at: nowIso(),
  };
  try {
    const key = await appendEvent(event);
    return { ...event, id: key };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`No se pudo registrar el evento '${kind}':`, error.message);
    return { ...event, id: "" };
  }
}
