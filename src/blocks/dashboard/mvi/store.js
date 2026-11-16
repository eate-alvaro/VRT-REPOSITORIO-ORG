/**
 * Fabrica del Store MVI del bloque del panel principal.
 */

import { createStore } from "../../../mvi/store.js";
import { createDashboardContext, createDashboardHandlers } from "./handlers.js";
import { reduceDashboard } from "./reducer.js";
import { initialDashboardState } from "./state.js";

export function createDashboardStore(context, state) {
  const ctx = context && context.service ? context : createDashboardContext(context);
  return createStore(state || initialDashboardState(), reduceDashboard, createDashboardHandlers(ctx));
}
