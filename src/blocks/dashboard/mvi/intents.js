/**
 * Intents del bloque del panel principal.
 */

import { createIntent } from "../../../mvi/core.js";

/** Solicita consolidar el resumen del sistema. */
export const LoadDashboard = ({ eventLimit = 8 } = {}) =>
  createIntent("LoadDashboard", { event_limit: eventLimit });

/** Recargar el resumen (alias explicito de LoadDashboard). */
export const RefreshDashboard = () => createIntent("RefreshDashboard", {});

/** Realimentacion: el resumen se consolido correctamente. */
export const DashboardLoaded = ({
  players = [],
  events = [],
  sessions_count = 0,
  events_count = 0,
  online = false,
  detail = "",
  degraded = [],
} = {}) =>
  createIntent("DashboardLoaded", {
    players,
    events,
    sessions_count,
    events_count,
    online,
    detail,
    degraded,
  });

/** Realimentacion: fallo total al consolidar el resumen. */
export const DashboardFailed = ({ message } = {}) =>
  createIntent("DashboardFailed", { message });
