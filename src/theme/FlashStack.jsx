/**
 * Pila de mensajes flash de la aplicacion.
 */

import { useAuth } from "../auth/AuthProvider.jsx";

export default function FlashStack() {
  const { flash } = useAuth();
  if (!flash) return null;
  const tone = flash.tone || "info";
  return (
    <div className="flash-stack">
      <div className={`notice notice--${tone}`}>
        <span className="notice__tag">{flash.tag || tone}</span>
        <span>{flash.text}</span>
      </div>
    </div>
  );
}
