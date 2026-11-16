import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthProvider.jsx";
import AboutPage from "./blocks/dashboard/AboutPage.jsx";
import DashboardPage from "./blocks/dashboard/DashboardPage.jsx";
import LoginPage from "./blocks/accounts/LoginPage.jsx";
import RegisterPage from "./blocks/accounts/RegisterPage.jsx";
import HistoryPage from "./blocks/history/HistoryPage.jsx";
import PlayersPage from "./blocks/players/PlayersPage.jsx";
import SimulationPage from "./blocks/simulation/SimulationPage.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import AppLayout from "./theme/AppLayout.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="simulacion" element={<SimulationPage />} />
              <Route path="jugadores" element={<PlayersPage />} />
              <Route path="historial" element={<HistoryPage />} />
              <Route path="proyecto" element={<AboutPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
