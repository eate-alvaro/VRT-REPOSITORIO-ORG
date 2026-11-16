/**
 * Pagina "Acerca del proyecto".
 */

import { APP_VERSION, FIREBASE_DB_URL, firebaseHost } from "../../config/app.js";
import Icon from "../../theme/Icon.jsx";
import Notice from "../../theme/Notice.jsx";
import PageHead from "../../theme/PageHead.jsx";

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="documentacion"
        title="Acerca del proyecto"
        subtitle="Modelo de realidad virtual e IoT para la simulacion interactiva de paintball."
      >
        <span className="badge badge--info">
          <Icon name="layers" size={12} /> arquitectura mvi
        </span>
        <span className="badge badge--muted">v{APP_VERSION}</span>
      </PageHead>

      <div className="grid grid--split">
        <section className="panel">
          <div className="panel__head">
            <span className="panel__title">
              <Icon name="info" size={14} /> descripcion
            </span>
          </div>
          <div className="panel__body doc">
            <h2>
              Modelo de realidad virtual e IoT para la simulacion interactiva de paintball en
              entornos controlados
            </h2>
            <p>
              El proyecto integra un entorno virtual interactivo con tecnologias IoT para detectar
              y representar los eventos de una partida de paintball. Esta plataforma web actua como
              centro de control: autentica usuarios, administra el roster, ejecuta la simulacion de
              la partida y consolida la telemetria de eventos.
            </p>

            <h3>Componentes previstos</h3>
            <ul>
              <li>
                <b>Godot</b> - entorno virtual 3D y logica de simulacion.
              </li>
              <li>
                <b>ESP32 + sensores</b> - adquisicion de eventos fisicos del marcador y los
                impactos.
              </li>
              <li>
                <b>Wi-Fi / MQTT</b> - transporte de los eventos hacia la plataforma.
              </li>
              <li>
                <b>React + Vite</b> - centro de control web (cliente puro, sin servidor propio).
              </li>
              <li>
                <b>Firebase Authentication</b> - cuentas de usuario (email/contrasena).
              </li>
              <li>
                <b>Firebase Realtime Database</b> - almacenamiento en tiempo real de usuarios,
                roster, partidas y eventos.
              </li>
            </ul>

            <h3>Alcance de esta version</h3>
            <p>
              Esta entrega implementa el centro de control web completo con arquitectura MVI. Los
              eventos se generan desde la propia plataforma (fuente <code>web</code>); la
              integracion fisica con ESP32 y Godot se conecta escribiendo en el mismo nodo{" "}
              <code>events</code> con las fuentes <code>esp32</code>, <code>mqtt</code> o{" "}
              <code>godot</code>.
            </p>

            <Notice tone="info" tag="nota">
              El acceso se valida con <b>Firebase Authentication</b> (proveedor Email/Password).
              El perfil y el rol de cada usuario se guardan en el nodo <code>users/&lt;uid&gt;</code>{" "}
              de Realtime Database.
            </Notice>
          </div>
        </section>

        <div className="stack">
          <section className="panel">
            <div className="panel__head">
              <span className="panel__title">
                <Icon name="layers" size={14} /> arquitectura mvi
              </span>
            </div>
            <div className="panel__body doc">
              <p>Flujo unidireccional aplicado en cada bloque funcional:</p>
              <div className="terminal">
                <div className="terminal__line">Intent -&gt; Reducer(puro) -&gt; State + Effects</div>
                <div className="terminal__line terminal__line--comment">                              |</div>
                <div className="terminal__line">            Effect handlers (IO) &lt;--+</div>
                <div className="terminal__line terminal__line--comment">                      |</div>
                <div className="terminal__line">
                  Intent de realimentacion -&gt; Reducer
                </div>
              </div>
              <h3>Bloques</h3>
              <ul>
                <li>
                  <b>mvi</b> - Store, Intent, Effect, Reducer y State.
                </li>
                <li>
                  <b>data</b> - acceso a Firebase Realtime Database y Authentication.
                </li>
                <li>
                  <b>theme</b> - tema Tokyo Night / Omarchy OS: tokens, layout y componentes.
                </li>
                <li>
                  <b>accounts</b> - autenticacion con Firebase Authentication.
                </li>
                <li>
                  <b>dashboard</b> - consolidacion del resumen del sistema.
                </li>
                <li>
                  <b>simulation</b> - maquina de estados de la partida.
                </li>
                <li>
                  <b>players</b> - roster sincronizado con <code>players</code>.
                </li>
                <li>
                  <b>history</b> - visor de telemetria con filtro por severidad.
                </li>
              </ul>
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <span className="panel__title">
                <Icon name="database" size={14} /> almacenamiento
              </span>
            </div>
            <div className="panel__body doc">
              <div className="kv">
                <span>host</span>
                <b>{firebaseHost()}</b>
              </div>
              <div className="kv">
                <span>url</span>
                <b>{FIREBASE_DB_URL}</b>
              </div>
              <h3>Nodos</h3>
              <ul>
                <li>
                  <code>users/&lt;uid&gt;</code> - perfil (nombre visible y rol) asociado a la
                  cuenta de Firebase Authentication.
                </li>
                <li>
                  <code>players/&lt;id&gt;</code> - roster con equipo, estado y estadisticas.
                </li>
                <li>
                  <code>sessions/&lt;match_id&gt;</code> - espejo del estado de cada partida.
                </li>
                <li>
                  <code>events/&lt;id&gt;</code> - telemetria: tipo, detalle, severidad, fuente y
                  actor.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
