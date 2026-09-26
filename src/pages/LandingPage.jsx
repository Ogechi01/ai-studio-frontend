import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function LandingPage({ setToken }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      {showLogin ? (
        <Login setToken={setToken} switchToRegister={() => setShowLogin(false)} />
      ) : (
        <Register switchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default LandingPage;