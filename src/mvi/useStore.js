/**
 * Puente entre el Store MVI y React.
 *
 * `useStore` suscribe el componente al estado del Store usando
 * `useSyncExternalStore`; el estado es inmutable y cambia de referencia en cada
 * dispatch, por lo que la comparacion es por identidad.
 */

import { useCallback, useRef, useSyncExternalStore } from "react";

export function useStore(store) {
  const subscribe = useCallback((listener) => store.subscribe(listener), [store]);
  const getSnapshot = useCallback(() => store.getSnapshot(), [store]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Crea un Store una sola vez por componente. */
export function useMviStore(factory) {
  const ref = useRef(null);
  if (ref.current === null) ref.current = factory();
  return ref.current;
}
