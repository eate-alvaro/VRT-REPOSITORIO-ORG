/**
 * Estado inmutable del bloque de cuentas.
 */

export function initialAuthState(overrides = {}) {
  return Object.freeze({
    mode: "login", // login | register
    status: "idle", // idle | processing | failed | authenticated
    actor: null,
    username: "",
    display_name: "",
    remember: false,
    error: "",
    error_code: "",
    notice: "",
    attempts: 0,
    ...overrides,
  });
}

export function authDerived(state) {
  return {
    isAuthenticated: state.status === "authenticated" && state.actor !== null,
    isFailed: state.status === "failed",
    isProcessing: state.status === "processing",
  };
}
