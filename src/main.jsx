/**
 * Punto de entrada de la aplicacion React.
 *
 * Monta el arbol de componentes sobre #root y carga los estilos del tema.
 */

import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./styles/index.css";

const container = document.getElementById("root");

if (container) {
  createRoot(container).render(<App />);
}
