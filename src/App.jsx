import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  return (
    <Router>
      <Routes>
        {/* Landing page always shows if no token */}
        <Route 
          path="/" 
          element={!token ? <LandingPage setToken={setToken} /> : <Navigate to="/dashboard" />} 
        />

        {/* Dashboard shows only if logged in */}
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard setToken={setToken} /> : <Navigate to="/" />} 
        />

        {/* Any unknown route redirects to landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;