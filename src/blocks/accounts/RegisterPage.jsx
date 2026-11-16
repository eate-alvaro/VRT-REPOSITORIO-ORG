/**
 * Pantalla de registro.
 *
 * Crea la cuenta en Firebase Authentication y su perfil en el nodo `users`.
 */

import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthProvider.jsx";
import { firebaseHost } from "../../config/app.js";
import { useMviStore, useStore } from "../../mvi/useStore.js";
import AuthLayout from "../../theme/AuthLayout.jsx";
import Icon from "../../theme/Icon.jsx";
import Notice from "../../theme/Notice.jsx";
import { SubmitRegistration } from "./mvi/intents.js";
import { MIN_PASSWORD } from "./mvi/reducer.js";
import { createAuthStore } from "./mvi/store.js";

export default function RegisterPage() {
  const { user, configured, pushFlash } = useAuth();

  const store = useMviStore(() => createAuthStore({ pushFlash }));
  const state = useStore(store);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/" replace />;

  const processing = state.status === "processing";

  function handleSubmit(event) {
    event.preventDefault();
    store.dispatch(
      SubmitRegistration({ username, password, displayName, role: "operator" })
    );
  }

  return (
    <AuthLayout title="registro" foot={<Link to="/login">Ya tengo cuenta</Link>}>
      <h2 className="auth__title">Crear cuenta</h2>
      <p className="auth__intro">
        La cuenta se crea en <b>Firebase Authentication</b> y su perfil en el nodo{" "}
        <b>users</b> de Realtime Database.
      </p>

      {!configured ? (
        <Notice tone="warning" tag="configuracion">
          Firebase no esta configurado. Copia .env.example a .env y completa las claves de la
          app web antes de registrar usuarios.
        </Notice>
      ) : null}

      {state.error ? (
        <Notice tone="error" tag={state.error_code || "error"}>
          {state.error}
        </Notice>
      ) : null}

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="display_name">
            <span>nombre visible</span>
            <span className="field__hint">opcional</span>
          </label>
          <input
            className="input"
            id="display_name"
            name="display_name"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Jugador 01"
            autoComplete="name"
            disabled={processing}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="username">
            <span>usuario</span>
            <span className="field__hint">correo interno</span>
          </label>
          <input
            className="input"
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            placeholder="jugador01"
            required
            autoFocus
            disabled={processing}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="password">
            <span>contrasena</span>
            <span className="field__hint">minimo {MIN_PASSWORD} caracteres</span>
          </label>
          <input
            className="input"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            placeholder="........"
            required
            disabled={processing}
          />
        </div>

        <button
          className="btn btn--primary btn--block"
          type="submit"
          disabled={processing || !configured}
        >
          <Icon name="plus" size={14} /> {processing ? "Creando..." : "Registrar y entrar"}
        </button>
      </form>

      <p className="auth__hint">
        Al registrar se crea la cuenta en <b>Firebase Authentication</b> y el perfil{" "}
        <code>users/&lt;uid&gt;</code> en <b>{firebaseHost()}</b>.
      </p>
    </AuthLayout>
  );
}
