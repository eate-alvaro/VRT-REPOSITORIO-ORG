/**
 * Constantes de dominio compartidas por todos los bloques.
 */

export const MAX_HP = 100;
export const MAX_AMMO = 30;
export const HIT_DAMAGE = 20;

export const TEAMS = Object.freeze(["azul", "rojo", "verde", "amarillo"]);
export const STATUSES = Object.freeze(["activo", "inactivo"]);
export const SEVERITIES = Object.freeze(["info", "success", "warning", "critical"]);
export const SOURCES = Object.freeze(["web", "godot", "esp32", "mqtt", "sistema"]);
export const FILTERS = Object.freeze(["todos", "info", "success", "warning", "critical"]);
export const ROLES = Object.freeze(["operator", "admin"]);
