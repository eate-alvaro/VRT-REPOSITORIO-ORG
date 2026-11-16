/**
 * Fabrica del Store MVI del bloque de cuentas.
 */

import { createStore } from "../../../mvi/store.js";
import { createAuthContext, createAuthHandlers } from "./handlers.js";
import { reduceAuth } from "./reducer.js";
import { initialAuthState } from "./state.js";

export function createAuthStore(context, state) {
  const ctx = context && context.pushFlash ? context : createAuthContext(context);
  return createStore(state || initialAuthState(), reduceAuth, createAuthHandlers(ctx));
}
