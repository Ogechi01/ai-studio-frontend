import { useState } from "react";
import api, { errorMessage } from "../api/axios";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200";

function Login({ onLogin, sessionExpired, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      onLogin(res.data.token);
    } catch (err) {
      setError(errorMessage(err, "Login failed. Please try again."));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
      <h2 className="mb-1 text-2xl font-bold text-gray-900">Welcome back</h2>
      <p className="mb-6 text-sm text-gray-500">Log in to your studio</p>

      <div className="mb-4 space-y-3">
        {sessionExpired && !error && (
          <Alert type="info">Your session expired. Please log in again.</Alert>
        )}
        <Alert>{error}</Alert>
      </div>

      <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        id="login-email"
        className={`${inputClass} mb-4`}
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        id="login-password"
        className={`${inputClass} mb-6`}
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 p-2.5 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
      >
        {loading && <Spinner />}
        {loading ? "Logging in..." : "Log in"}
      </button>

      <p className="mt-4 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <button type="button" className="font-medium text-violet-600 hover:underline" onClick={switchToRegister}>
          Register
        </button>
      </p>
    </form>
  );
}

export default Login;
