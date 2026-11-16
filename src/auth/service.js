/**
 * Servicio de autenticacion (Firebase Authentication, proveedor Email/Password).
 *
 * El usuario sigue entrando con un nombre de usuario: se mapea a un correo
 * sintetico `<usuario>@<VITE_AUTH_EMAIL_DOMAIN>` para hablarlo con Firebase.
 * El perfil (nombre visible y rol) se guarda en el nodo `users/<uid>`.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { emailForUsername } from "../config/app.js";
import { auth, isFirebaseConfigured } from "../config/firebase.js";
import { createUserProfile } from "../data/users.js";

export class AuthServiceError extends Error {
  constructor(message, code = "auth_error") {
    super(message);
    this.name = "AuthServiceError";
    this.code = code;
  }
}

function requireAuth() {
  if (!isFirebaseConfigured || !auth) {
    throw new AuthServiceError(
      "Firebase no esta configurado. Completa el archivo .env con las claves de la app web.",
      "backend_unavailable"
    );
  }
  return auth;
}

/** Traduccion de los codigos de Firebase Auth a mensajes del dominio. */
const ERROR_MAP = {
  "auth/invalid-email": ["El nombre de usuario no es valido.", "invalid_username"],
  "auth/missing-password": ["La contrasena es obligatoria.", "missing_fields"],
  "auth/user-not-found": ["Usuario o contrasena incorrectos.", "invalid_credentials"],
  "auth/wrong-password": ["Usuario o contrasena incorrectos.", "invalid_credentials"],
  "auth/invalid-credential": ["Usuario o contrasena incorrectos.", "invalid_credentials"],
  "auth/invalid-login-credentials": [
    "Usuario o contrasena incorrectos.",
    "invalid_credentials",
  ],
  "auth/user-disabled": ["La cuenta esta deshabilitada.", "user_disabled"],
  "auth/email-already-in-use": ["El usuario ya esta registrado.", "username_taken"],
  "auth/weak-password": [
    "La contrasena debe tener al menos 6 caracteres.",
    "weak_password",
  ],
  "auth/too-many-requests": [
    "Demasiados intentos. Espera un momento e intenta de nuevo.",
    "too_many_requests",
  ],
  "auth/network-request-failed": ["Sin conexion con Firebase. Revisa tu red.", "backend_unavailable"],
  "auth/operation-not-allowed": [
    "El proveedor Email/Password no esta habilitado en Firebase Authentication.",
    "provider_disabled",
  ],
  "auth/configuration-not-found": [
    "Falta habilitar Email/Password en Firebase Authentication.",
    "provider_disabled",
  ],
  "auth/invalid-api-key": ["La API key de Firebase no es valida.", "backend_unavailable"],
};

function translate(error) {
  const code = (error && error.code) || "";
  const [message, mapped] = ERROR_MAP[code] || [
    "No se pudo completar la operacion con Firebase.",
    "auth_error",
  ];
  return new AuthServiceError(message, mapped);
}

/** Inicia sesion con nombre de usuario y contrasena. */
export async function signIn(username, password) {
  const client = requireAuth();
  try {
    const credential = await signInWithEmailAndPassword(
      client,
      emailForUsername(username),
      password
    );
    return credential.user;
  } catch (error) {
    throw translate(error);
  }
}

/** Crea la cuenta y su perfil inicial en el nodo `users`. */
export async function signUp({ username, password, displayName = "" }) {
  const client = requireAuth();
  let credential;
  try {
    credential = await createUserWithEmailAndPassword(
      client,
      emailForUsername(username),
      password
    );
  } catch (error) {
    throw translate(error);
  }

  const user = credential.user;
  try {
    if (displayName) await updateProfile(user, { displayName });
    await createUserProfile(user.uid, { username, displayName, role: "operator" });
  } catch (error) {
    // La cuenta ya existe en Firebase Auth; el perfil se reintenta al detectar
    // la sesion activa, por lo que el registro no se considera fallido.
    // eslint-disable-next-line no-console
    console.warn("No se pudo crear el perfil inicial:", error.message);
  }
  return user;
}

/** Cierra la sesion actual. */
export async function signOutNow() {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    throw translate(error);
  }
}

/** Usuario de Firebase actualmente autenticado (o null). */
export function currentUser() {
  return (auth && auth.currentUser) || null;
}
