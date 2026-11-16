/**
 * Intents del bloque de cuentas: lo que el usuario pretende hacer.
 */

import { createIntent } from "../../../mvi/core.js";

export const SubmitLogin = ({ username, password, remember = false } = {}) =>
  createIntent("SubmitLogin", { username, password, remember });

export const SubmitRegistration = ({
  username,
  password,
  displayName = "",
  role = "operator",
} = {}) =>
  createIntent("SubmitRegistration", {
    username,
    password,
    display_name: displayName,
    role,
  });

export const RequestLogout = () => createIntent("RequestLogout", {});

/** Realimentacion: las credenciales fueron validas (o la cuenta creada). */
export const AuthenticationSucceeded = ({ actor = null, remember = false, created = false } = {}) =>
  createIntent("AuthenticationSucceeded", { actor, remember, created });

/** Realimentacion: las credenciales fueron rechazadas. */
export const AuthenticationFailed = ({ message, code = "invalid_credentials" } = {}) =>
  createIntent("AuthenticationFailed", { message, code });
