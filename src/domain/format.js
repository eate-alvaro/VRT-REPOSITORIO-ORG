/**
 * Utilidades de formato puras (sin dependencias de React ni de Firebase).
 *
 * Regla del tema: sin emojis. Los indicadores visuales son ASCII puro.
 */

/** Convierte un valor en entero de forma tolerante. */
export function toInt(value, fallback = 0) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

/** Iniciales a partir de un nombre (hasta dos letras, en mayusculas). */
export function initialsFrom(source) {
  const clean = String(source || "?").replace(/[._-]+/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Porcentaje entero acotado a [0, 100]. */
export function percent(value, total) {
  const t = Number(total);
  if (!Number.isFinite(t) || t <= 0) return 0;
  const v = Number(value);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round((v / t) * 100)));
}

/** Clase CSS segun la severidad de un evento. */
export function severityClass(value) {
  const mapping = {
    info: "is-info",
    success: "is-success",
    warning: "is-warning",
    critical: "is-critical",
    error: "is-critical",
  };
  return mapping[String(value || "").toLowerCase()] || "is-info";
}

/** Indicador ASCII sin emojis. */
export function asciiState(flag, on = "ACTIVO", off = "INACTIVO") {
  return flag ? `[x] ${on}` : `[ ] ${off}`;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

/** Hora legible (HH:MM:SS) a partir de un instante ISO almacenado. */
export function formatTimeLabel(iso) {
  const raw = String(iso || "");
  if (!raw) return "--:--:--";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return raw.length >= 19 ? raw.slice(11, 19) : raw;
  }
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

/** Fecha y hora legible (dd/mm/YYYY HH:MM). */
export function formatDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "--/--/---- --:--";
  return (
    `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}` +
    ` ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
  );
}

/**
 * Instante actual en ISO con desplazamiento local, con precision de segundos.
 */
export function nowIso() {
  const d = new Date();
  const offsetMinutes = -d.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const offset = `${sign}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`;
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` +
    `T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}${offset}`
  );
}

/** Identificador de partida con el formato `M-YYYYMMDD-HHMMSS`. */
export function matchIdFrom(date = new Date()) {
  return (
    `M-${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}` +
    `-${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}`
  );
}
