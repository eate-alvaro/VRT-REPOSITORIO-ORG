/**
 * Efectos declarativos del bloque del panel principal.
 */

import { createEffect } from "../../../mvi/core.js";

/** Leer players + events + sessions y verificar la conexion. */
export const FetchDashboardSnapshot = ({ eventLimit = 8 } = {}) =>
  createEffect("FetchDashboardSnapshot", { eventLimit });
