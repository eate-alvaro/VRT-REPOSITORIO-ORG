@echo off
title PAINTBALL VR ^& IOT - Vite
cd /d "C:\Users\USUARIO\OneDrive\Documents\VRT"

echo ==========================================================
echo   PAINTBALL VR ^& IOT  -  React ^& Vite
echo   http://127.0.0.1:8765/
echo   Cierra esta ventana para detener el servidor.
echo ==========================================================
echo.

rem Abre el navegador unos segundos despues de arrancar el servidor
start "" cmd /c "timeout /t 3 /nobreak >nul & start "" http://127.0.0.1:8765/"

npm.cmd run dev
