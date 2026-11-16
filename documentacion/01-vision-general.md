# Vision general

Centro de control para simulacion interactiva de paintball VR e IoT. La
aplicacion es un cliente web construido con React, Vite y Firebase.

## Requisitos

- Node.js 18 o posterior y npm.
- Una app web de Firebase con Authentication y Realtime Database habilitados.

## Desarrollo

Desde la carpeta del proyecto:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Completa las variables `VITE_FIREBASE_*` del `.env` con la configuracion de la
app web y reinicia Vite. El servidor local usa `http://127.0.0.1:8765/`.
Para validar la compilacion usa `npm run build`; `npm run preview` sirve el
resultado de `dist/`.

## Rutas

| Ruta | Funcion |
| --- | --- |
| `/login`, `/registro` | Sesion y registro con Firebase Authentication |
| `/` | Resumen general |
| `/simulacion` | Controles y estado de partida |
| `/jugadores` | Administracion de roster |
| `/historial` | Eventos y telemetria |
| `/proyecto` | Informacion del proyecto |
