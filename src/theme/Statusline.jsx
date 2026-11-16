/**
 * Linea de estado inferior (estilo Waybar).
 */

import { useEffect, useState } from "react";

import { useAuth } from "../auth/AuthProvider.jsx";
import { firebaseHost } from "../config/app.js";
import { formatDateTime } from "../domain/format.js";
import Icon from "./Icon.jsx";

export default function Statusline({ activeBlock }) {
  const { actor } = useAuth();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="statusline">
      <span className="statusline__seg is-accent">[ MVI ] model :: view :: intent</span>
      <span className="statusline__sep">|</span>
      <span className="statusline__seg">
        <Icon name="activity" size={12} /> <b>{activeBlock || "inicio"}</b>
      </span>
      <span className="statusline__sep">|</span>
      <span className="statusline__seg">
        <Icon name="database" size={12} /> RTDB <b>{firebaseHost()}</b>
      </span>
      <span className="statusline__spacer" />
      {actor ? (
        <>
          <span className="statusline__seg">
            <Icon name="user" size={12} /> <b>{actor.username}</b>
          </span>
          <span className="statusline__sep">|</span>
        </>
      ) : (
        <>
          <span className="statusline__seg">
            <Icon name="lock" size={12} /> sin sesion
          </span>
          <span className="statusline__sep">|</span>
        </>
      )}
      <span className="statusline__seg">{formatDateTime(now)}</span>
    </footer>
  );
}
