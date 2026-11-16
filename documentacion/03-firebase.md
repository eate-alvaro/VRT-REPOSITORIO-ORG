# Firebase

La configuracion de la app web se guarda en el `.env` local. Vite expone al
cliente las variables con prefijo `VITE_`; no subas `.env` al repositorio.
Habilita el proveedor Email/Password en Firebase Authentication.

| Variable | Uso |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Inicializacion de los SDK web |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de Authentication |
| `VITE_FIREBASE_DATABASE_URL` | URL de Realtime Database |
| `VITE_FIREBASE_PROJECT_ID` | Identificador del proyecto |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket del proyecto |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Identificador de mensajeria |
| `VITE_FIREBASE_APP_ID` | Identificador de la app web |

## Nodos de Realtime Database

```text
users/<uid>
  username, display_name, role, active, created_at, last_login

players/<pushKey>
  name, team, status, hits, shots, created_at

sessions/<match_id>
  active, hp, ammo, score, shots, hits, started_at, finished_at, actor

events/<pushKey>
  kind, detail, actor, severity, source, match_id, created_at
```

Las cuentas se validan con Firebase Authentication. Sus perfiles se almacenan
en `users/<uid>`; las contrasenas no se guardan en Realtime Database.
