/**
 * Estructura de las pantallas de acceso (login y registro).
 */

import { APP_TAGLINE, APP_VERSION, THEME_NAME, firebaseHost } from "../config/app.js";
import { BrandName } from "./Brand.jsx";
import FlashStack from "./FlashStack.jsx";
import Icon from "./Icon.jsx";

export default function AuthLayout({ title = "acceso", children, foot }) {
  return (
    <div className="auth">
      <div className="auth__backdrop" aria-hidden="true" />

      <div className="auth__panel">
        <div className="auth__bar">
          <span className="auth__bar-title">{title}</span>
          <span className="auth__bar-meta">
            {THEME_NAME} / v{APP_VERSION}
          </span>
        </div>

        <div className="auth__body">
          <div className="auth__brand">
            <span className="auth__mark">
              <Icon name="crosshair" size={22} />
            </span>
            <span>
              <BrandName className="auth__brand-name" />
              <span className="auth__brand-tag">{APP_TAGLINE}</span>
            </span>
          </div>

          <FlashStack />

          {children}
        </div>

        <div className="auth__foot">
          <span>
            <Icon name="database" size={12} /> RTDB {firebaseHost()}
          </span>
          {foot ?? <span>{THEME_NAME}</span>}
        </div>
      </div>
    </div>
  );
}
