/**
 * Inicializacion de Firebase (app web).
 *
 * Se expone:
 *   - `app`  : instancia de la app de Firebase (o null si falta configuracion).
 *   - `auth` : servicio de Authentication (email/contrasena).
 *   - `db`   : Realtime Database.
 *   - `isFirebaseConfigured` : true cuando las claves minimas estan presentes.
 *
 * Si la configuracion esta incompleta la aplicacion arranca igual y muestra un
 * aviso en lugar de romperse.
 */

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const env = import.meta.env || {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "alvin-59045.firebaseapp.com",
  databaseURL:
    env.VITE_FIREBASE_DATABASE_URL || "https://alvin-59045-default-rtdb.firebaseio.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "alvin-59045",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "alvin-59045.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: env.VITE_FIREBASE_APP_ID || "",
};

/** Claves imprescindibles para hablar con Firebase. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.databaseURL
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  try {
    auth = getAuth(app);
  } catch {
    auth = null;
  }
  try {
    db = getDatabase(app);
  } catch {
    db = null;
  }
}

export { app, auth, db };
