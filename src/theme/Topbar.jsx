/**
 * Barra superior: marca, indicadores y control de sesion.
 */

import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.jsx";
import { APP_TAGLINE, firebaseHost } from "../config/app.js";
import { actorLabel } from "../domain/models.js";
import { BrandName } from "./Brand.jsx";
import Icon from "./Icon.jsx";

export default function Topbar() {
  const { actor, logout, configured } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="brand-mark">::</span>
        <BrandName />
        <span className="brand-tag">{APP_TAGLINE}</span>
      </div>

      <div className="topbar__meta">
        <span className="chip">
          <Icon name="layers" size={12} /> mvi
        </span>
        <span className="chip">
          <Icon name="database" size={12} /> {firebaseHost()}
        </span>

        {actor ? (
          <>
            <span className="chip">
              <span className="dot dot--online" aria-hidden="true" />
              {actorLabel(actor)}
            </span>
            <button className="btn btn--ghost btn--sm" type="button" onClick={() => logout()}>
              <Icon name="power" size={13} /> Salir
            </button>
          </>
        ) : (
          <Link className="btn btn--ghost btn--sm" to="/login">
            <Icon name="login" size={13} /> {configured ? "Acceder" : "Configurar"}
          </Link>
        )}
      </div>
    </header>
  );
}
