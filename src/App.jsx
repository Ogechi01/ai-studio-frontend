import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { getToken, saveToken, clearToken, SESSION_EXPIRED_EVENT } from "./utils/auth";

function App() {
  const [token, setToken] = useState(getToken);
  const [sessionExpired, setSessionExpired] = useState(false);

  // The axios client fires this when the server rejects the token
  useEffect(() => {
    const handleExpired = () => {
      setToken(null);
      setSessionExpired(true);
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, []);

  const login = (newToken) => {
    saveToken(newToken);
    setSessionExpired(false);
    setToken(newToken);
  };

  const logout = () => {
    clearToken();
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Landing page (login / register) when logged out */}
        <Route
          path="/"
          element={
            !token ? (
              <LandingPage onLogin={login} sessionExpired={sessionExpired} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Dashboard only when logged in */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard onLogout={logout} /> : <Navigate to="/" replace />}
        />

        {/* Any unknown route goes back to the start */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
