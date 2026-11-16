import { useEffect, useState } from "react";

import { useAuth } from "../../auth/AuthProvider.jsx";
import { HIT_DAMAGE, MAX_AMMO, MAX_HP } from "../../domain/constants.js";
import { MATCH_STORAGE_KEY } from "../../config/app.js";
import { recordEvent } from "../../data/recorder.js";
import { saveSession } from "../../data/sessions.js";
import { formatDateTime, matchIdFrom, nowIso, percent } from "../../domain/format.js";
import Icon from "../../theme/Icon.jsx";
import Notice from "../../theme/Notice.jsx";
import PageHead from "../../theme/PageHead.jsx";

const INITIAL_MATCH = Object.freeze({
  active: false,
  hp: MAX_HP,
  max_hp: MAX_HP,
  ammo: MAX_AMMO,
  max_ammo: MAX_AMMO,
  score: 0,
  shots: 0,
  hits: 0,
  match_id: "",
  started_at: "",
  finished_at: "",
});

function normalizeMatch(payload) {
  if (!payload || typeof payload !== "object") return { ...INITIAL_MATCH };
  const number = (value, fallback, min, max) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.floor(parsed))) : fallback;
  };
  return {
    ...INITIAL_MATCH,
    active: payload.active === true,
    hp: number(payload.hp, MAX_HP, 0, MAX_HP),
    max_hp: MAX_HP,
    ammo: number(payload.ammo, MAX_AMMO, 0, MAX_AMMO),
    max_ammo: MAX_AMMO,
    score: number(payload.score, 0, 0, Number.MAX_SAFE_INTEGER),
    shots: number(payload.shots, 0, 0, Number.MAX_SAFE_INTEGER),
    hits: number(payload.hits, 0, 0, Number.MAX_SAFE_INTEGER),
    match_id: typeof payload.match_id === "string" ? payload.match_id : "",
    started_at: typeof payload.started_at === "string" ? payload.started_at : "",
    finished_at: typeof payload.finished_at === "string" ? payload.finished_at : "",
  };
}

export default function SimulationPage() {
  const { actor } = useAuth();
  const [match, setMatch] = useState({ ...INITIAL_MATCH });
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MATCH_STORAGE_KEY);
      if (stored) setMatch(normalizeMatch(JSON.parse(stored)));
    } catch (loadError) {
      setError(`No se pudo restaurar la partida local: ${loadError.message}`);
    } finally {
      setReady(true);
    }
  }, []);

  async function commit(next, { kind, detail, severity = "info", storageAction = "save" } = {}) {
    setMatch(next);
    setFeedback(detail);
    setError("");
    setBusy(true);

    try {
      if (storageAction === "remove") {
        window.localStorage.removeItem(MATCH_STORAGE_KEY);
      } else {
        window.localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(next));
      }
    } catch (storageError) {
      setError(`No se pudo guardar la partida en este navegador: ${storageError.message}`);
    }

    const sessionId = next.match_id || match.match_id;
    if (sessionId) {
      try {
        await saveSession(sessionId, {
          ...next,
          match_id: sessionId,
          actor: actor?.username || "",
        });
      } catch (saveError) {
        setError((current) =>
          [current, saveError.message || "No se pudo sincronizar la partida."].filter(Boolean).join(" ")
        );
      }
    }

    if (kind) {
      await recordEvent(kind, detail, {
        actor: actor?.username || "",
        severity,
        matchId: match.match_id || next.match_id,
      });
    }
    setBusy(false);
  }

  function startMatch() {
    const timestamp = nowIso();
    const next = {
      ...INITIAL_MATCH,
      active: true,
      match_id: matchIdFrom(),
      started_at: timestamp,
    };
    void commit(next, {
      kind: "partida:inicio",
      detail: `Partida ${next.match_id} iniciada.`,
      severity: "success",
    });
  }

  function shoot() {
    if (!match.active) {
      setFeedback("Primero inicia la partida.");
      return;
    }
    if (match.ammo <= 0) {
      setFeedback("No queda municion en el marcador.");
      return;
    }
    const next = {
      ...match,
      ammo: match.ammo - 1,
      shots: match.shots + 1,
      score: match.score + 10,
    };
    void commit(next, {
      kind: "disparo",
      detail: `Disparo detectado. Municion restante: ${next.ammo}.`,
    });
  }

  function registerHit() {
    if (!match.active) {
      setFeedback("Primero inicia la partida.");
      return;
    }
    const hp = Math.max(0, match.hp - HIT_DAMAGE);
    const eliminated = hp === 0;
    const detail = eliminated
      ? "Jugador eliminado: la vida llego a cero."
      : `Impacto recibido. Vida restante: ${hp}.`;
    const next = {
      ...match,
      hp,
      hits: match.hits + 1,
      active: !eliminated,
      finished_at: eliminated ? nowIso() : match.finished_at,
    };
    void commit(next, {
      kind: eliminated ? "jugador:eliminado" : "impacto",
      detail,
      severity: eliminated ? "critical" : "warning",
    });
  }

  function finishMatch() {
    if (!match.active) return;
    const next = { ...match, active: false, finished_at: nowIso() };
    void commit(next, {
      kind: "partida:fin",
      detail: `Partida finalizada. Puntuacion: ${match.score}.`,
      severity: "success",
    });
  }

  function resetMatch() {
    if (!window.confirm("Restablecer los indicadores de la partida?")) return;
    const next = { ...INITIAL_MATCH };
    void commit(next, {
      kind: "partida:reset",
      detail: "Indicadores de partida restablecidos.",
      storageAction: "remove",
    });
  }

  const accuracy = match.shots ? Math.round((match.hits / match.shots) * 100) : 0;
  const hpState = percent(match.hp, match.max_hp) <= 25
    ? "meter__fill--danger"
    : percent(match.hp, match.max_hp) <= 55
      ? "meter__fill--warning"
      : "";

  return (
    <div className="stack">
      <PageHead
        eyebrow="bloque simulation"
        title="Simulacion"
        subtitle="Control local de partida con sincronizacion a Realtime Database."
      >
        <span className={`badge ${match.active ? "badge--success" : "badge--muted"}`}>
          <span className={`dot ${match.active ? "dot--online" : "dot--offline"}`} />
          {match.active ? "en curso" : match.finished_at ? "finalizada" : "en espera"}
        </span>
        <span className="badge badge--info">{match.match_id || "sin partida"}</span>
      </PageHead>

      {error ? <Notice tone="error" tag="sincronizacion">{error}</Notice> : null}
      {feedback ? <Notice tone="info" tag="ultimo evento">{feedback}</Notice> : null}

      <div className="grid grid--stats">
        <div className="stat stat--green">
          <span className="stat__label"><Icon name="shield" size={12} /> vida</span>
          <span className="stat__value">{match.hp}<small> / {match.max_hp}</small></span>
          <div className="meter__track"><div className={`meter__fill ${hpState}`} style={{ width: `${percent(match.hp, match.max_hp)}%` }} /></div>
        </div>
        <div className="stat stat--cyan">
          <span className="stat__label"><Icon name="target" size={12} /> municion</span>
          <span className="stat__value">{match.ammo}<small> / {match.max_ammo}</small></span>
          <div className="meter__track"><div className="meter__fill meter__fill--ammo" style={{ width: `${percent(match.ammo, match.max_ammo)}%` }} /></div>
        </div>
        <div className="stat stat--purple">
          <span className="stat__label"><Icon name="flag" size={12} /> puntuacion</span>
          <span className="stat__value">{match.score}</span>
          <span className="stat__foot">{match.shots} disparos / {match.hits} impactos</span>
        </div>
        <div className="stat stat--yellow">
          <span className="stat__label"><Icon name="activity" size={12} /> precision</span>
          <span className="stat__value">{accuracy}%</span>
          <span className="stat__foot">{match.started_at ? `inicio ${formatDateTime(match.started_at)}` : "sin actividad"}</span>
        </div>
      </div>

      <section className="panel">
        <div className="panel__head">
          <span className="panel__title"><Icon name="crosshair" size={14} /> controles de partida</span>
          <span className="panel__meta">{ready ? "estado restaurado" : "restaurando estado..."}</span>
        </div>
        <div className="panel__body">
          <div className="page-head__actions">
            <button className="btn btn--success" type="button" onClick={startMatch} disabled={!ready || busy || match.active}>
              <Icon name="play" size={13} /> iniciar partida
            </button>
            <button className="btn btn--primary" type="button" onClick={shoot} disabled={!ready || busy || !match.active || match.ammo <= 0}>
              <Icon name="target" size={13} /> disparar
            </button>
            <button className="btn btn--warn" type="button" onClick={registerHit} disabled={!ready || busy || !match.active}>
              <Icon name="shield" size={13} /> registrar impacto
            </button>
            <button className="btn btn--danger" type="button" onClick={finishMatch} disabled={!ready || busy || !match.active}>
              <Icon name="stop" size={13} /> finalizar
            </button>
            <button className="btn btn--ghost" type="button" onClick={resetMatch} disabled={!ready || busy}>
              restablecer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
