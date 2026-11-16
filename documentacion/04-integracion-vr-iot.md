# Integracion VR e IoT

La plataforma recibe telemetria en el nodo `events`. Los dispositivos o
servicios pueden registrar eventos con `source` igual a `godot`, `esp32` o
`mqtt`; las acciones del navegador usan `web`.

```json
{
  "kind": "impacto",
  "detail": "Impacto detectado",
  "actor": "jugador01",
  "severity": "warning",
  "source": "esp32",
  "match_id": "M-20261116-120000",
  "created_at": "2026-11-16T12:00:00-04:00"
}
```

Cada evento debe guardarse bajo una clave nueva en `events`. El historial
consulta los eventos recientes y el dashboard muestra un resumen. La
configuracion de Realtime Database debe permitir acceso solo a los clientes
autorizados segun las reglas del proyecto.
