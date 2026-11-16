# PAINTBALL VR & IOT

Centro de control web para la simulacion de paintball VR e IoT, construido con
React + Vite y Firebase.

## Requisitos

- Node.js 18 o superior y npm.
- Acceso a Firebase Authentication (proveedor Email/Password) y Realtime
  Database.

## Instalacion y ejecucion

```powershell
cd C:\Users\USUARIO\OneDrive\Documents\VRT
npm install
Copy-Item .env.example .env
```

Completa en `.env` las claves de la app web de Firebase:
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_APP_ID` y
`VITE_FIREBASE_MESSAGING_SENDER_ID`. Confirma tambien que
`VITE_FIREBASE_DATABASE_URL` apunta a tu Realtime Database. Luego inicia el
servidor:

```powershell
npm run dev
```

Abre <http://127.0.0.1:8765/>. En Windows tambien puedes iniciar
`iniciar_localhost.bat`. Para compilar los archivos estaticos:

```powershell
npm run build
npm run preview
```

## Modulos

| Ruta | Funcion |
| --- | --- |
| `/login` y `/registro` | Acceso y creacion de cuentas con Firebase Authentication |
| `/` | Resumen de jugadores, partidas, eventos y conectividad |
| `/simulacion` | Controles de partida; estado local y sincronizacion con Firebase |
| `/jugadores` | Alta, estado y eliminacion de participantes |
| `/historial` | Consulta, filtro y limpieza de eventos |
| `/proyecto` | Informacion tecnica del proyecto |

Las rutas de trabajo requieren una sesion autenticada. El registro crea un
perfil en `users/<uid>`. Los datos de roster, partidas y telemetria se guardan
en los nodos `players`, `sessions` y `events` de Realtime Database.

## Configuracion de usuarios

El inicio de sesion acepta nombres de usuario, que se convierten en direcciones
del formato `<usuario>@<VITE_AUTH_EMAIL_DOMAIN>` para Firebase Authentication.
El dominio predeterminado es `vrt.local`; debe usarse el mismo al registrar e
iniciar sesion. No hay contrasenas de demostracion integradas: crea las cuentas
desde `/registro`.

## Estructura

```text
src/
  auth/       Firebase Authentication y contexto de sesion
  blocks/     cuentas, dashboard, simulacion, jugadores e historial
  config/     configuracion de la app y Firebase
  data/       acceso a Realtime Database
  domain/     modelos, constantes y funciones de formato
  mvi/        nucleo MVI y puente con React
  routes/     proteccion de rutas
  styles/     tema Tokyo Night
  theme/      layout, navegacion y componentes visuales
```

# VRT-REPOSITORIO-ORG
