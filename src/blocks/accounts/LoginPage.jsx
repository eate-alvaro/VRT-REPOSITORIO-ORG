/**
 * Pantalla de acceso (Intent dispatcher).
 *
 * El formulario despacha `SubmitLogin`; el reducer valida y emite el efecto
 * `VerifyCredentials`, que habla con Firebase Authentication.
 */

import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../auth/AuthProvider.jsx";
import { firebaseHost } from "../../config/app.js";
import { useMviStore, useStore } from "../../mvi/useStore.js";
import AuthLayout from "../../theme/AuthLayout.jsx";
import Icon from "../../theme/Icon.jsx";
import Notice from "../../theme/Notice.jsx";
import { SubmitLogin } from "./mvi/intents.js";
import { createAuthStore } from "./mvi/store.js";

export default function LoginPage() {
  const { user, configured, pushFlash } = useAuth();
  const location = useLocation();
  const next = (location.state && location.state.from && location.state.from.pathname) || "/";

  const store = useMviStore(() => createAuthStore({ pushFlash }));
  const state = useStore(store);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  if (user) return <Navigate to={next} replace />;

  const processing = state.status === "processing";

  function handleSubmit(event) {
    event.preventDefault();
    store.dispatch(SubmitLogin({ username, password, remember }));
  }

  return (
    <AuthLayout title="acceso" foot={<Link to="/registro">Crear cuenta</Link>}>
      <h2 className="auth__title">Iniciar sesion</h2>
      <p className="auth__intro">
        Accede al centro de simulacion para controlar partidas, administrar el roster y
        consultar la telemetria de eventos.
      </p>

      {!configured ? (
        <Notice tone="warning" tag="configuracion">
          Firebase no esta configurado. Copia .env.example a .env y completa las claves de la
          app web (VITE_FIREBASE_API_KEY, VITE_FIREBASE_APP_ID y
          VITE_FIREBASE_MESSAGING_SENDER_ID).
        </Notice>
      ) : null}

      {state.error ? (
        <Notice tone="error" tag={state.error_code || "error"}>
          {state.error}
        </Notice>
      ) : null}

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="username">
            <span>usuario</span>
            <span className="field__hint">firebase auth</span>
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
            <span className="field__hint">email / password</span>
          </label>
          <input
            className="input"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="........"
            required
            disabled={processing}
          />
        </div>

        <label className="check">
          <input
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            disabled={processing}
          />
          <span>mantener sesion activa</span>
        </label>

        <button
          className="btn btn--primary btn--block"
          type="submit"
          disabled={processing || !configured}
        >
          <Icon name="login" size={14} /> {processing ? "Verificando..." : "Entrar"}
        </button>
      </form>

      <p className="auth__hint">
        Las credenciales se validan con <b>Firebase Authentication</b> sobre{" "}
        <b>{firebaseHost()}</b>. El nombre de usuario se mapea a un correo interno.
      </p>
    </AuthLayout>
  );
}
