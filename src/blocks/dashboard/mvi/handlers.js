/**
 * Manejadores de efectos del bloque del panel principal.
 */

import { dashboardSnapshot } from "../../../data/snapshot.js";
import { DashboardFailed, DashboardLoaded } from "./intents.js";

export function createDashboardContext(service) {
  return { service: service || dashboardSnapshot };
}

export function createDashboardHandlers(context) {
  return new Map([
    [
      "FetchDashboardSnapshot",
      async (store, effect) => {
        try {
          const snapshot = await context.service({ eventLimit: effect.eventLimit });
          return DashboardLoaded({
            players: snapshot.players,
            events: snapshot.events,
            sessions_count: snapshot.sessionsCount,
            events_count: snapshot.eventsCount,
            online: snapshot.online,
            detail: snapshot.detail,
            degraded: snapshot.degraded,
          });
        } catch (error) {
          // Defensivo: el panel nunca debe romper la pagina.
          // eslint-disable-next-line no-console
          console.error("Fallo al consolidar el panel:", error);
          return DashboardFailed({ message: "No se pudo consolidar el resumen del sistema." });
        }
      },
    ],
  ]);
}
