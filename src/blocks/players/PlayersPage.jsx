import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../../auth/AuthProvider.jsx";
import { TEAMS } from "../../domain/constants.js";
import { recordEvent } from "../../data/recorder.js";
import { createPlayer, deletePlayer, listPlayers, setPlayerStatus } from "../../data/players.js";
import { playerInitials } from "../../domain/models.js";
import Icon from "../../theme/Icon.jsx";
import Notice from "../../theme/Notice.jsx";
import PageHead from "../../theme/PageHead.jsx";

export default function PlayersPage() {
  const { actor } = useAuth();
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [team, setTeam] = useState(TEAMS[0]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPlayers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPlayers(await listPlayers());
    } catch (loadError) {
      setError(loadError.message || "No se pudo cargar el roster.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  async function handleAdd(event) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    if (players.some((player) => player.name.toLowerCase() === cleanName.toLowerCase())) {
      setError("Ya existe un jugador con ese nombre.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const player = await createPlayer(cleanName, team);
      setPlayers((current) =>
        [...current, player].sort(
          (a, b) => a.team.localeCompare(b.team) || a.name.localeCompare(b.name)
        )
      );
      setName("");
      setMessage(`${player.name} se agrego al roster.`);
      await recordEvent("roster:alta", `Jugador agregado: ${player.name} (${player.team}).`, {
        actor: actor?.username || "",
        severity: "success",
      });
    } catch (actionError) {
      setError(actionError.message || "No se pudo crear el jugador.");
    } finally {
      setBusy(false);
    }
  }

  async function handleToggle(player) {
    const status = player.status === "activo" ? "inactivo" : "activo";
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await setPlayerStatus(player.id, status);
      setPlayers((current) =>
        current.map((item) => (item.id === player.id ? { ...item, status } : item))
      );
      setMessage(`${player.name}: ${status}.`);
      await recordEvent("roster:estado", `${player.name} ahora esta ${status}.`, {
        actor: actor?.username || "",
        severity: status === "activo" ? "success" : "warning",
      });
    } catch (actionError) {
      setError(actionError.message || "No se pudo actualizar el jugador.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(player) {
    if (!window.confirm(`Eliminar a ${player.name} del roster?`)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await deletePlayer(player.id);
      setPlayers((current) => current.filter((item) => item.id !== player.id));
      setMessage(`${player.name} se elimino del roster.`);
      await recordEvent("roster:baja", `Jugador eliminado: ${player.name}.`, {
        actor: actor?.username || "",
        severity: "warning",
      });
    } catch (actionError) {
      setError(actionError.message || "No se pudo eliminar el jugador.");
    } finally {
      setBusy(false);
    }
  }

  const activeCount = players.filter((player) => player.status === "activo").length;

  return (
    <div className="stack">
      <PageHead
        eyebrow="bloque roster"
        title="Jugadores"
        subtitle="Participantes sincronizados con el nodo players de Realtime Database."
      >
        <span className="badge badge--info">
          <Icon name="users" size={12} /> {players.length} registrados
        </span>
        <span className="badge badge--success">
          <Icon name="check" size={12} /> {activeCount} activos
        </span>
      </PageHead>

      {error ? <Notice tone="error" tag="error">{error}</Notice> : null}
      {message ? <Notice tone="success" tag="ok">{message}</Notice> : null}

      <div className="grid grid--split">
        <section className="panel">
          <div className="panel__head">
            <span className="panel__title"><Icon name="plus" size={14} /> alta de jugador</span>
          </div>
          <div className="panel__body">
            <form className="form" onSubmit={handleAdd}>
              <div className="field">
                <label className="field__label" htmlFor="player-name">nombre</label>
                <input
                  className="input"
                  id="player-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={80}
                  required
                  disabled={busy}
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="player-team">equipo</label>
                <select
                  className="select"
                  id="player-team"
                  value={team}
                  onChange={(event) => setTeam(event.target.value)}
                  disabled={busy}
                >
                  {TEAMS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <button className="btn btn--primary" type="submit" disabled={busy}>
                <Icon name="plus" size={13} /> agregar jugador
              </button>
            </form>
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <span className="panel__title"><Icon name="users" size={14} /> roster</span>
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={loadPlayers}
              disabled={loading || busy}
            >
              <Icon name="refresh" size={12} /> actualizar
            </button>
          </div>
          <div className="panel__body panel__body--flush">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>jugador</th><th>equipo</th><th>estado</th><th>disp.</th><th>imp.</th><th>acciones</th></tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="table__empty">cargando roster...</td></tr>
                  ) : players.length ? players.map((player) => (
                    <tr key={player.id}>
                      <td><span className="is-strong">{playerInitials(player)} · {player.name}</span></td>
                      <td className="text-muted">{player.team}</td>
                      <td>
                        <span className={`badge ${player.status === "activo" ? "badge--success" : "badge--muted"}`}>
                          {player.status}
                        </span>
                      </td>
                      <td className="is-num">{player.shots}</td>
                      <td className="is-num">{player.hits}</td>
                      <td>
                        <div className="page-head__actions">
                          <button
                            className="btn btn--ghost btn--sm"
                            type="button"
                            onClick={() => handleToggle(player)}
                            disabled={busy}
                            aria-label={`${player.status === "activo" ? "Desactivar" : "Activar"} ${player.name}`}
                          >
                            {player.status === "activo" ? "desactivar" : "activar"}
                          </button>
                          <button
                            className="btn btn--danger btn--sm"
                            type="button"
                            onClick={() => handleDelete(player)}
                            disabled={busy}
                            aria-label={`Eliminar ${player.name}`}
                          >
                            <Icon name="trash" size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="table__empty">sin jugadores registrados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel__foot">{players.length - activeCount} inactivos</div>
        </section>
      </div>
    </div>
  );
}
