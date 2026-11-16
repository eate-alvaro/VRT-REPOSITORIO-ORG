/**
 * Nucleo MVI (Model - View - Intent).
 *
 * Flujo unidireccional:
 *
 *     Intent  --dispatch-->  Reducer (puro)  -->  State + Effects
 *                                                   |
 *                                                   v
 *                                             Effect handlers (IO)
 *                                                   |
 *                                         Intent de realimentacion
 *                                                   |
 *                                                   v
 *                                                Reducer ...
 *
 * Los reducers son funciones puras: nunca realizan efectos secundarios. Los
 * efectos son *datos* declarativos que un manejador ejecuta fuera del reducer.
 *
 * En JavaScript los Intent y los Effect son objetos planos congelados con un
 * campo `type` que identifica su clase.
 */

/** Construye un Intent inmutable. */
export function createIntent(type, payload = {}) {
  return Object.freeze({ ...payload, type });
}

/** Construye un Effect inmutable. */
export function createEffect(type, payload = {}) {
  return Object.freeze({ ...payload, type });
}

/** Nombre legible de un intent (para registros y depuracion). */
export function intentName(intent) {
  return (intent && intent.type) || "Intent";
}

/** Nombre legible de un efecto (para registros y depuracion). */
export function effectName(effect) {
  return (effect && effect.type) || "Effect";
}

/** Devuelve una copia inmutable del estado con los campos indicados cambiados. */
export function evolve(state, changes = {}) {
  return Object.freeze({ ...state, ...changes });
}

/** Resultado sin efectos. */
export const NO_EFFECTS = Object.freeze([]);

/** Reducer neutro: devuelve el estado tal cual, sin efectos. */
export function noChange(state) {
  return [state, NO_EFFECTS];
}
