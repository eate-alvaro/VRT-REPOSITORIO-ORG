/**
 * Guarda de rutas privadas.
 *
 *   - Si Firebase no esta configurado, muestra un aviso claro en pantalla.
 *   - Mientras se resuelve la sesion, muestra un estado de carga.
 *   - Sin sesion, redirige al acceso.
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.jsx";
import { APP_NAME, firebaseHost } from "../config/app.js";

function Pantalla({ title, lines }) {
  return (
    <div className="auth">
      <div className="auth__backdrop" aria-hidden="true" />
      <div className="auth__panel">
        <div className="auth__bar">
          <span className="auth__bar-title">{title}</span>
          <span className="auth__bar-meta">rtdb {firebaseHost()}</span>
        </div>
        <div className="auth__body">
          <h2 className="auth__title">{APP_NAME}</h2>
          {lines.map((line) => (
            <p className="auth__intro" key={line}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RequireAuth() {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Pantalla title="sesion" lines={["Verificando la sesion con Firebase Authentication..."]} />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
