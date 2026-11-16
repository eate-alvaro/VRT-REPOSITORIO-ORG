/**
 * Store: runtime MVI.
 *
 * Concentra el bucle unidireccional:
 *
 *     1. recibe un Intent,
 *     2. aplica el reducer puro para obtener (estado nuevo, efectos),
 *     3. ejecuta cada efecto con su manejador registrado,
 *     4. encola los Intent de realimentacion devueltos por los manejadores.
 *
 * Los manejadores son asincronos porque hablan con Firebase desde el navegador.
 * El reducer sigue
 * siendo puro y sincrono: la parte sincrona del ciclo se ejecuta de inmediato
 * (para que la interfaz muestre el estado "cargando") y la realimentacion se
 * encola cuando cada efecto termina.
 *
 * El ciclo sincrono esta acotado por `maxDispatches` para detectar bucles
 * infinitos entre reducer y efectos.
 */

export class Store {
  constructor(state, reducer, handlers = new Map(), options = {}) {
    this._state = state;
    this._reducer = reducer;
    this._handlers = handlers instanceof Map ? new Map(handlers) : new Map(Object.entries(handlers));
    this._maxDispatches = options.maxDispatches ?? 64;
    this._history = [];
    this._effectsLog = [];
    this._listeners = new Set();
    this._queue = [];
    this._draining = false;
  }

  // -- lectura ------------------------------------------------------------
  get state() {
    return this._state;
  }

  /** Intents procesados, en orden (util para depuracion y auditoria). */
  get history() {
    return this._history.slice();
  }

  get effectsLog() {
    return this._effectsLog.slice();
  }

  // -- registro -----------------------------------------------------------
  register(effectType, handler) {
    this._handlers.set(effectType, handler);
    return this;
  }

  // -- suscripcion (React) ------------------------------------------------
  subscribe = (listener) => {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  };

  getSnapshot = () => this._state;

  _notify() {
    for (const listener of this._listeners) listener();
  }

  _setState(next) {
    if (next === this._state) return;
    this._state = next;
    this._notify();
  }

  // -- ciclo MVI ----------------------------------------------------------
  /** Procesa un intent y todo su arbol de realimentacion. */
  dispatch(intent) {
    if (intent == null) return this._state;
    this._queue.push(intent);
    this._drain();
    return this._state;
  }

  _drain() {
    if (this._draining) return;
    this._draining = true;
    let processed = 0;
    try {
      while (this._queue.length) {
        const current = this._queue.shift();
        processed += 1;
        if (processed > this._maxDispatches) {
          throw new Error(
            `Se detecto un bucle de intenciones en el Store MVI (mas de ${this._maxDispatches} iteraciones).`
          );
        }

        this._history.push(current);
        const [nextState, effects] = this._reducer(this._state, current);
        this._setState(nextState);

        for (const effect of effects || []) {
          this._effectsLog.push(effect);
          const handler = this._handlers.get(effect.type);
          if (!handler) continue;
          this._runEffect(handler, effect);
        }
      }
    } finally {
      this._draining = false;
    }
  }

  _runEffect(handler, effect) {
    Promise.resolve()
      .then(() => handler(this, effect))
      .then((feedback) => {
        if (feedback == null) return;
        const list = Array.isArray(feedback) ? feedback : [feedback];
        for (const item of list) {
          if (item != null) this._queue.push(item);
        }
        this._drain();
      })
      .catch((error) => {
        // Los manejadores deben traducir sus fallos a Intents de error. Este
        // catch es defensivo para que un fallo inesperado no rompa la pagina.
        // eslint-disable-next-line no-console
        console.error("[mvi] efecto sin manejar", effect && effect.type, error);
      });
  }
}

/** Fabrica de conveniencia para construir un Store. */
export function createStore(state, reducer, handlers, options) {
  return new Store(state, reducer, handlers, options);
}
