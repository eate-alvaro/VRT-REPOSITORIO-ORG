/**
 * Reducer puro del bloque del panel principal.
 */

import { evolve, noChange } from "../../../mvi/core.js";
import { FetchDashboardSnapshot } from "./effects.js";

export function reduceDashboard(state, intent) {
  if (intent.type === "LoadDashboard") {
    return [
      evolve(state, { status: "loading", error: "" }),
      [FetchDashboardSnapshot({ eventLimit: intent.event_limit })],
    ];
  }

  if (intent.type === "RefreshDashboard") {
    return [
      evolve(state, { status: "loading", error: "" }),
      [FetchDashboardSnapshot({ eventLimit: 8 })],
    ];
  }

  if (intent.type === "DashboardLoaded") {
    return [
      evolve(state, {
        status: "ready",
        error: "",
        players: intent.players,
        events: intent.events,
        sessions_count: intent.sessions_count,
        events_count: intent.events_count,
        online: intent.online,
        connection_detail: intent.detail,
        degraded: intent.degraded,
      }),
      [],
    ];
  }

  if (intent.type === "DashboardFailed") {
    return [evolve(state, { status: "failed", error: intent.message }), []];
  }

  return noChange(state);
}
