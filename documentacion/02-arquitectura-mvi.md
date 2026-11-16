# Arquitectura MVI

La interfaz React organiza el flujo de estado como **Intent → Reducer → State
+ Effects**. Los reducers son funciones puras; el Store procesa intents y
entrega los efectos a manejadores asincronos.

```text
Vista -> Intent -> Reducer -> Estado nuevo
                         \-> Effects -> handlers -> Firebase
```

## Nucleo

- `src/mvi/core.js`: creacion de intents/effects y actualizacion inmutable.
- `src/mvi/store.js`: ciclo MVI, handlers y realimentacion.
- `src/mvi/useStore.js`: suscripcion React a un Store.

Los bloques de cuentas y dashboard usan Stores MVI. Las paginas de jugadores,
simulacion e historial mantienen estado local React y usan los repositorios
compartidos en `src/data/`.

## Modulos

- `src/auth/`: contexto de sesion y acceso a Firebase Authentication.
- `src/blocks/`: pantallas y comportamiento de cada modulo.
- `src/config/`: identidad de la app y configuracion Firebase.
- `src/data/`: acceso a Authentication y Realtime Database.
- `src/domain/`: modelos, constantes y funciones puras.
- `src/routes/`: proteccion de rutas.
- `src/theme/` y `src/styles/`: navegacion, componentes y tema visual.
