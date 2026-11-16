/**
 * Contexto global de sesion.
 *
 * Es el unico responsable de observar Firebase Authentication
 * (`onAuthStateChanged`) y de cargar el perfil del nodo `users/<uid>`. Expone el
 * actor autenticado y las operaciones de cierre de sesion y mensajes flash.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth, isFirebaseConfigured } from "../config/firebase.js";
import { createUserProfile, getUserProfile } from "../data/users.js";
import { makeActor } from "../domain/models.js";
import { signOutNow } from "./service.js";

const AuthContext = createContext(null);

/** Crea un perfil minimo si el usuario de Auth no tiene uno en la base. */
async function ensureProfile(user) {
  const fromEmail = (user.email || "").split("@")[0] || "usuario";
  const username = (user.displayName || fromEmail).trim();
  try {
    return await createUserProfile(user.uid, {
      username,
      displayName: user.displayName || "",
      role: "operator",
    });
  } catch {
    // Si no se puede escribir, se usa un perfil sintetico para no bloquear.
    return {
      uid: user.uid,
      username,
      display_name: user.displayName || "",
      role: "operator",
      active: true,
      created_at: "",
      last_login: "",
    };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(null);
  const flashTimer = useRef(null);

  const pushFlash = useCallback((message) => {
    setFlash(message);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 6000);
  }, []);

  const clearFlash = useCallback(() => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlash(null);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!active) return;
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let loaded = await getUserProfile(nextUser.uid);
        if (!loaded) loaded = await ensureProfile(nextUser);
        if (!active) return;
        setProfile(loaded);
        setError("");
      } catch (err) {
        if (!active) return;
        setProfile(null);
        setError(err.message || "No se pudo cargar el perfil del usuario.");
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    clearFlash();
    await signOutNow();
  }, [clearFlash]);

  const actor = useMemo(() => (profile ? makeActor(profile) : null), [profile]);

  const value = useMemo(
    () => ({
      user,
      profile,
      actor,
      loading,
      error,
      configured: isFirebaseConfigured,
      flash,
      pushFlash,
      clearFlash,
      logout,
    }),
    [user, profile, actor, loading, error, flash, pushFlash, clearFlash, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return context;
}
