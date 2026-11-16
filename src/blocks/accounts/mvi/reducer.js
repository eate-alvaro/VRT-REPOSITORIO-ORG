/**
 * Reducer del bloque de cuentas.
 *
 * Funcion pura: recibe el estado y un intent, y devuelve el estado nuevo junto
 * con la lista de efectos a ejecutar. No toca la red ni la sesion.
 */

import { evolve, noChange } from "../../../mvi/core.js";
import { CloseSession, CreateAccount, RecordLogin, VerifyCredentials } from "./effects.js";

/** Firebase Authentication exige un minimo de 6 caracteres. */
export const MIN_PASSWORD = 6;

export function reduceAuth(state, intent) {
  // -- acceso --------------------------------------------------------------
  if (intent.type === "SubmitLogin") {
    const username = (intent.username || "").trim();
    if (!username || !intent.password) {
      return [
        evolve(state, {
          mode: "login",
          status: "failed",
          error: "Usuario y contrasena son obligatorios.",
          error_code: "missing_fields",
        }),
        [],
      ];
    }
    return [
      evolve(state, {
        mode: "login",
        status: "processing",
        username,
        display_name: "",
        remember: intent.remember,
        error: "",
        error_code: "",
        notice: "",
        attempts: state.attempts + 1,
      }),
      [
        VerifyCredentials({
          username,
          password: intent.password,
          remember: intent.remember,
        }),
      ],
    ];
  }

  // -- registro ------------------------------------------------------------
  if (intent.type === "SubmitRegistration") {
    const username = (intent.username || "").trim();
    if (!username || !intent.password) {
      return [
        evolve(state, {
          mode: "register",
          status: "failed",
          error: "Usuario y contrasena son obligatorios.",
          error_code: "missing_fields",
        }),
        [],
      ];
    }
    if (intent.password.length < MIN_PASSWORD) {
      return [
        evolve(state, {
          mode: "register",
          status: "failed",
          error: `La contrasena debe tener al menos ${MIN_PASSWORD} caracteres.`,
          error_code: "weak_password",
        }),
        [],
      ];
    }
    return [
      evolve(state, {
        mode: "register",
        status: "processing",
        username,
        display_name: (intent.display_name || "").trim(),
        error: "",
        error_code: "",
        notice: "",
      }),
      [
        CreateAccount({
          username,
          password: intent.password,
          display_name: (intent.display_name || "").trim(),
          role: intent.role,
        }),
      ],
    ];
  }

  // -- resultados ----------------------------------------------------------
  if (intent.type === "AuthenticationSucceeded") {
    return [
      evolve(state, {
        status: "authenticated",
        actor: intent.actor,
        username: intent.actor ? intent.actor.username : state.username,
        display_name: intent.actor ? intent.actor.displayName : state.display_name,
        error: "",
        error_code: "",
        notice: intent.created ? "Cuenta creada. Sesion iniciada." : "",
      }),
      [RecordLogin()],
    ];
  }

  if (intent.type === "AuthenticationFailed") {
    return [
      evolve(state, {
        status: "failed",
        actor: null,
        error: intent.message,
        error_code: intent.code,
      }),
      [],
    ];
  }

  // -- cierre de sesion ----------------------------------------------------
  if (intent.type === "RequestLogout") {
    return [evolve(state, { status: "idle", actor: null, notice: "" }), [CloseSession()]];
  }

  return noChange(state);
}
