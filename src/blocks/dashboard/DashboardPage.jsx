/**
 * Panel principal: consolidacion del resumen del sistema.
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";

import { firebaseHost } from "../../config/app.js";
import { formatTimeLabel, severityClass } from "../../domain/format.js";
import { useMviStore, useStore } from "../../mvi/useStore.js";
import Icon from "../../theme/Icon.jsx";
import Notice from "../../theme/Notice.jsx";
import PageHead from "../../theme/PageHead.jsx";
import { LoadDashboard, RefreshDashboard } from "./mvi/intents.js";
import { dashboardDerived } from "./mvi/state.js";
import { createDashboardStore } from "./mvi/store.js";

export default function DashboardPage() {
  const store = useMviStore(() => createDashboardStore());
  const state = useStore(store);
  const d = dashboardDerived(state);

  useEffect(() => {
    store.dispatch(LoadDashboard({ eventLimit: 8 }));
  }, [store]);

  return (
    <div className="stack">
      <PageHead
        eyebrow="bloque dashboard"
        title="Panel principal"
        subtitle="Centro de control de la simulacion de paintball en entornos controlados."
      >
        <span className={`badge ${state.online ? "badge--success" : "badge--danger"}`}>
          <span
            className={`dot ${state.online ? "dot--online" : "dot--offline"}`}
            aria-hidden="true"
          />
          {d.connectionLabel}
        </span>
        <button
          className="btn btn--ghost btn--sm"
          type="button"
          onClick={() => store.dispatch(RefreshDashboard())}
        >
          <Icon name="refresh" size={13} /> actualizar
        </button>
      </PageHead>

      <div className="stack">
        {state.error ? (
          <Notice tone="error" tag="error">
            {state.error}
          </Notice>
        ) : null}

        {d.hasDegraded ? (
          <Notice tone="warning" tag="degradado">
            Nodos sin respuesta en esta lectura: <b>{state.degraded.join(", ")}</b>. El resto del
            panel sigue operativo.
          </Notice>
        ) : null}

        <div className="grid grid--stats">
          <div className="stat stat--blue">
            <span className="stat__label">
              <Icon name="users" size={12} /> jugadores
            </span>
            <span className="stat__value">{d.playersActive}</span>
            <span className="stat__foot">
              {d.playersTotal} registrados / {d.playersActive} activos
            </span>
          </div>
          <div className="stat stat--cyan">
            <span className="stat__label">
              <Icon name="layers" size={12} /> partidas
            </span>
            <span className="stat__value">{state.sessions_count}</span>
            <span className="stat__foot">nodo sessions</span>
          </div>
          <div className="stat stat--yellow">
            <span className="stat__label">
              <Icon name="list" size={12} /> eventos
            </span>
            <span className="stat__value">{state.events_count}</span>
            <span className="stat__foot">{state.events.length} en la ultima lectura</span>
          </div>
          <div className="stat stat--green">
            <span className="stat__label">
              <Icon name="target" size={12} /> punteria global
            </span>
            <span className="stat__value">{d.accuracy}%</span>
            <span className="stat__foot">
              {d.totalHits} impactos / {d.totalShots} disparos
            </span>
          </div>
        </div>

        <div className="grid grid--split">
          <section className="panel">
            <div className="panel__head">
              <span className="panel__title">
                <Icon name="activity" size={14} /> ultimos eventos
              </span>
              <span className="panel__meta">nodo events</span>
            </div>
            <div className="panel__body panel__body--flush">
              <div className="events">
                {state.events.length ? (
                  state.events.map((event) => (
                    <div
                      className={`event ${severityClass(event.severity)}`}
                      key={event.id || `${event.kind}-${event.created_at}`}
                    >
                      <span className="event__time">{formatTimeLabel(event.created_at)}</span>
                      <span>
                        <span className="event__kind">{event.kind}</span>
                        <span className="event__detail">{event.detail}</span>
                        <span className="event__meta">
                          {event.actor || "sistema"} / {event.source}
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="events__empty">sin eventos registrados todavia</div>
                )}
              </div>
            </div>
            <div className="panel__foot">
              <Link to="/historial">ver historial completo</Link>
            </div>
          </section>

          <div className="stack">
            <section className="panel panel--accent">
              <div className="panel__head">
                <span className="panel__title">
                  <Icon name="database" size={14} /> conexion rtdb
                </span>
              </div>
              <div className="panel__body">
                <div className="kv">
                  <span>host</span>
                  <b>{firebaseHost()}</b>
                </div>
                <div className="kv">
                  <span>estado</span>
                  <b className={state.online ? "text-green" : "text-red"}>{d.connectionLabel}</b>
                </div>
                <div className="kv">
                  <span>respuesta</span>
                  <b>{state.connection_detail || "-"}</b>
                </div>
                <div className="kv">
                  <span>eventos criticos</span>
                  <b className="text-red">{d.criticalEvents}</b>
                </div>
                <div className="kv">
                  <span>avisos</span>
                  <b className="text-yellow">{d.warningEvents}</b>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel__head">
                <span className="panel__title">
                  <Icon name="users" size={14} /> roster
                </span>
                <span className="panel__meta">{d.playersTotal} jugadores</span>
              </div>
              <div className="panel__body panel__body--flush">
                <div className="table-wrap" style={{ maxHeight: 240 }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>jugador</th>
                        <th>equipo</th>
                        <th className="text-right">disp.</th>
                        <th className="text-right">imp.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.players.length ? (
                        state.players.map((player) => (
                          <tr key={player.id}>
                            <td className="is-strong">{player.name}</td>
                            <td className="text-muted">{player.team}</td>
                            <td className="is-num">{player.shots}</td>
                            <td className="is-num">{player.hits}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="table__empty">
                            sin jugadores
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel__foot">
                <Link to="/jugadores">gestionar roster</Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
