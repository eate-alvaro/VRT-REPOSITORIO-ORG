/**
 * Estado inmutable del panel principal.
 */

export function initialDashboardState(overrides = {}) {
  return Object.freeze({
    status: "idle", // idle | loading | ready | failed
    error: "",
    players: [],
    events: [],
    sessions_count: 0,
    events_count: 0,
    online: false,
    connection_detail: "",
    degraded: [],
    ...overrides,
  });
}

/** Metricas derivadas del estado del panel. */
export function dashboardDerived(state) {
  const playersTotal = state.players.length;
  const playersActive = state.players.filter((p) => p.status === "activo").length;
  const totalShots = state.players.reduce((acc, p) => acc + p.shots, 0);
  const totalHits = state.players.reduce((acc, p) => acc + p.hits, 0);
  const accuracy = totalShots ? Math.round((totalHits / totalShots) * 100) : 0;
  const criticalEvents = state.events.filter((e) => e.severity === "critical").length;
  const warningEvents = state.events.filter((e) => e.severity === "warning").length;
  const connectionLabel =
    state.status === "loading" ? "consultando" : state.online ? "en linea" : "sin conexion";

  return {
    playersTotal,
    playersActive,
    totalShots,
    totalHits,
    accuracy,
    criticalEvents,
    warningEvents,
    connectionLabel,
    hasDegraded: state.degraded.length > 0,
  };
}
