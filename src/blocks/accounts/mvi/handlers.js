/**
 * Manejadores de efectos del bloque de cuentas.
 *
 * Aqui vive toda la IO: hablar con Firebase Authentication y actualizar el
 * perfil en el nodo `users`. Cada manejador puede devolver un Intent de
 * realimentacion que vuelve al reducer.
 */

import { touchLastLogin } from "../../../data/users.js";
import { currentUser, signIn, signOutNow, signUp } from "../../../auth/service.js";
import { AuthenticationFailed, AuthenticationSucceeded } from "./intents.js";

/** Contexto de ejecucion (dependencias inyectadas). */
export function createAuthContext({ pushFlash } = {}) {
  return { pushFlash: pushFlash || (() => {}) };
}

export function createAuthHandlers(context) {
  return new Map([
    ["VerifyCredentials", (store, effect) => verifyCredentials(context, store, effect)],
    ["CreateAccount", (store, effect) => createAccount(context, store, effect)],
    ["RecordLogin", (store, effect) => recordLogin(context, store, effect)],
    ["CloseSession", (store, effect) => closeSession(context, store, effect)],
  ]);
}

// -- acceso -----------------------------------------------------------------
async function verifyCredentials(context, store, effect) {
  try {
    const user = await signIn(effect.username, effect.password);
    const label = user.displayName || effect.username;
    context.pushFlash({ tone: "success", tag: "ok", text: `Sesion iniciada como ${label}.` });
    return AuthenticationSucceeded({
      actor: {
        username: effect.username,
        displayName: user.displayName || "",
        role: "operator",
      },
      remember: effect.remember,
    });
  } catch (error) {
    return AuthenticationFailed({
      message: error.message,
      code: error.code || "invalid_credentials",
    });
  }
}

// -- registro ---------------------------------------------------------------
async function createAccount(context, store, effect) {
  try {
    const user = await signUp({
      username: effect.username,
      password: effect.password,
      displayName: effect.display_name,
    });
    context.pushFlash({ tone: "success", tag: "ok", text: "Cuenta creada. Sesion iniciada." });
    return AuthenticationSucceeded({
      actor: {
        username: effect.username,
        displayName: user.displayName || effect.display_name || "",
        role: "operator",
      },
      remember: true,
      created: true,
    });
  } catch (error) {
    return AuthenticationFailed({
      message: error.message,
      code: error.code || "invalid_registration",
    });
  }
}

// -- sesion -----------------------------------------------------------------
async function recordLogin(context, store, effect) {
  const user = currentUser();
  if (user) await touchLastLogin(user.uid);
  return null;
}

async function closeSession(context, store, effect) {
  await signOutNow();
  return null;
}
