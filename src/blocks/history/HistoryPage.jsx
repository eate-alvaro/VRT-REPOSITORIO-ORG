import { useCallback, useEffect, useState } from "react";

import { FILTERS } from "../../domain/constants.js";
import { clearEvents, recentEvents } from "../../data/events.js";
import { formatDateTime, severityClass } from "../../domain/format.js";
import Icon from "../../theme/Icon.jsx";
import Notice from "../../theme/Notice.jsx";
import PageHead from "../../theme/PageHead.jsx";

const EVENT_LIMIT = 200;

export default function HistoryPage() {
  const [events, setEvents] = useState([]);
  const [severity, setSeverity] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setEvents(await recentEvents(EVENT_LIMIT));
    } catch (loadError) {
      setError(loadError.message || "No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  async function handleClear() {
    if (!events.length || !window.confirm("Eliminar todos los eventos de Realtime Database?")) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await clearEvents();
      setEvents([]);
    } catch (clearError) {
      setError(clearError.message || "No se pudo limpiar el historial.");
    } finally {
      setBusy(false);
    }
  }

  const filteredEvents =
    severity === "todos" ? events : events.filter((event) => event.severity === severity);

  return (
    <div className="stack">
      <PageHead
        eyebrow="bloque telemetria"
        title="Historial de eventos"
        subtitle={`Ultimos ${EVENT_LIMIT} registros del nodo events.`}
      >
        <span className="badge badge--info">
          <Icon name="activity" size={12} /> {filteredEvents.length} visibles
        </span>
        <button className="btn btn--ghost btn--sm" type="button" onClick={loadEvents} disabled={loading || busy}>
          <Icon name="refresh" size={12} /> actualizar
        </button>
        <button className="btn btn--danger btn--sm" type="button" onClick={handleClear} disabled={loading || busy || !events.length}>
          <Icon name="trash" size={12} /> limpiar
        </button>
      </PageHead>

      {error ? <Notice tone="error" tag="error">{error}</Notice> : null}

      <section className="panel">
        <div className="panel__head">
          <span className="panel__title"><Icon name="list" size={14} /> telemetria</span>
          <label className="field__label" htmlFor="severity-filter">
            severidad
            <select
              className="select"
              id="severity-filter"
              style={{ width: 140 }}
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              disabled={busy}
            >
              {FILTERS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className="panel__body panel__body--flush">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>fecha</th><th>tipo</th><th>detalle</th><th>actor</th><th>fuente</th><th>severidad</th><th>partida</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="table__empty">cargando eventos...</td></tr>
                ) : filteredEvents.length ? filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="text-muted">{formatDateTime(event.created_at)}</td>
                    <td className={`is-strong ${severityClass(event.severity)}`}>{event.kind || "evento"}</td>
                    <td>{event.detail || "-"}</td>
                    <td className="text-muted">{event.actor || "sistema"}</td>
                    <td className="text-muted">{event.source}</td>
                    <td><span className={`badge ${event.severity === "critical" ? "badge--danger" : event.severity === "warning" ? "badge--warning" : "badge--muted"}`}>{event.severity}</span></td>
                    <td className="text-muted">{event.match_id || "-"}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="table__empty">sin eventos para este filtro</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel__foot">La base conserva todos los registros; esta vista consulta los {EVENT_LIMIT} mas recientes.</div>
      </section>
    </div>
  );
}
