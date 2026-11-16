/**
 * Barra lateral: navegacion entre modulos y resumen de la sesion.
 */

import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.jsx";
import Icon from "./Icon.jsx";
import { NAV_BLOCKS } from "./navigation.js";

export default function Sidebar({ activeBlock }) {
  const { actor } = useAuth();

  return (
    <aside className="sidebar">
      <nav className="nav" aria-label="Modulos">
        <p className="nav__label">// modulos</p>
        {NAV_BLOCKS.map((item) => {
          const active = item.key === activeBlock;
          return (
            <Link
              key={item.key}
              className={`nav__item${active ? " is-active" : ""}`}
              to={item.path}
              aria-current={active ? "page" : undefined}
            >
              <span className="nav__glyph" aria-hidden="true">
                {active ? ">" : "\u00a0"}
              </span>
              <span className="nav__icon">
                <Icon name={item.icon} size={15} />
              </span>
              <span className="nav__text">{item.label}</span>
              <span className="nav__hint">{item.hint}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar__foot">
        <p className="nav__label">// sesion</p>
        {actor ? (
          <>
            <div className="kv">
              <span>usuario</span>
              <b>{actor.username}</b>
            </div>
            <div className="kv">
              <span>rol</span>
              <b>{actor.role}</b>
            </div>
            <div className="kv">
              <span>estado</span>
              <b className="text-green">autenticado</b>
            </div>
          </>
        ) : (
          <>
            <div className="kv">
              <span>usuario</span>
              <b className="text-muted">anonimo</b>
            </div>
            <div className="kv">
              <span>rol</span>
              <b className="text-muted">-</b>
            </div>
            <div className="kv">
              <span>estado</span>
              <b className="text-yellow">sin sesion</b>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
