import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function LandingPage({ onLogin, sessionExpired }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="text-white">
          <p className="mb-3 inline-block rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-200">
            🎬 AI Studio
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
            Turn your story into scenes in seconds
          </h1>
          <p className="text-lg text-gray-300">
            Paste a story, choose a tone, and AI breaks it into scenes with
            what the camera sees and what the characters say, ready for your
            storyboard, skit or short film.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          {showLogin ? (
            <Login
              onLogin={onLogin}
              sessionExpired={sessionExpired}
              switchToRegister={() => setShowLogin(false)}
            />
          ) : (
            <Register onLogin={onLogin} switchToLogin={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
