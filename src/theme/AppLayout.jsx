/**
 * Estructura del workspace: topbar / sidebar / area de trabajo / statusline.
 */

import { Outlet, useLocation } from "react-router-dom";

import FlashStack from "./FlashStack.jsx";
import Sidebar from "./Sidebar.jsx";
import Statusline from "./Statusline.jsx";
import Topbar from "./Topbar.jsx";
import { blockForPath } from "./navigation.js";

export default function AppLayout() {
  const location = useLocation();
  const activeBlock = blockForPath(location.pathname);

  return (
    <div className="app">
      <Topbar />

      <div className="shell">
        <Sidebar activeBlock={activeBlock} />

        <main className="workspace" id="workspace">
          <div className="workspace__inner" id="workspace-inner">
            <FlashStack />
            <Outlet />
          </div>
        </main>
      </div>

      <Statusline activeBlock={activeBlock} />
    </div>
  );
}
