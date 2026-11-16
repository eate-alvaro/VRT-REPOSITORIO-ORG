/**
 * Navegacion global del workspace.
 *
 * Cada entrada corresponde a un bloque funcional con interfaz. El bloque de tema
 * es el unico responsable de como se presenta la navegacion.
 */

export const NAV_BLOCKS = Object.freeze([
  { key: "dashboard", label: "Panel principal", path: "/", icon: "grid", hint: "resumen" },
  { key: "simulation", label: "Simulacion", path: "/simulacion", icon: "crosshair", hint: "partida" },
  { key: "players", label: "Jugadores", path: "/jugadores", icon: "users", hint: "roster" },
  { key: "history", label: "Historial", path: "/historial", icon: "clock", hint: "telemetria" },
  { key: "about", label: "Proyecto", path: "/proyecto", icon: "info", hint: "documentacion" },
]);

/** Bloque activo a partir de la ruta actual. */
export function blockForPath(pathname) {
  if (pathname === "/" || pathname === "") return "dashboard";
  const match = NAV_BLOCKS.find(
    (item) => item.path !== "/" && pathname.startsWith(item.path)
  );
  return match ? match.key : null;
}
