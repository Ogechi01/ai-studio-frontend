import { useState } from "react";
import api, { errorMessage } from "../api/axios";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200";

function Register({ onLogin, switchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name: form.name || undefined,
        email: form.email,
        password: form.password,
      });

      // The backend logs the new user straight in
      onLogin(res.data.token);
    } catch (err) {
      setError(errorMessage(err, "Registration failed. Please try again."));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
      <h2 className="mb-1 text-2xl font-bold text-gray-900">Create your account</h2>
      <p className="mb-6 text-sm text-gray-500">Start turning stories into scenes</p>

      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <label htmlFor="reg-name" className="mb-1 block text-sm font-medium text-gray-700">
        Name <span className="font-normal text-gray-400">(optional)</span>
      </label>
      <input id="reg-name" name="name" className={`${inputClass} mb-4`} autoComplete="name" value={form.name} onChange={handleChange} />

      <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-gray-700">
        Email
      </label>
      <input id="reg-email" name="email" type="email" className={`${inputClass} mb-4`} autoComplete="email" value={form.email} onChange={handleChange} required />

      <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-gray-700">
        Password
      </label>
      <input id="reg-password" name="password" type="password" className={`${inputClass} mb-4`} autoComplete="new-password" minLength={6} value={form.password} onChange={handleChange} required />

      <label htmlFor="reg-confirm" className="mb-1 block text-sm font-medium text-gray-700">
        Confirm password
      </label>
      <input id="reg-confirm" name="confirm" type="password" className={`${inputClass} mb-6`} autoComplete="new-password" value={form.confirm} onChange={handleChange} required />

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 p-2.5 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
      >
        {loading && <Spinner />}
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button type="button" className="font-medium text-violet-600 hover:underline" onClick={switchToLogin}>
          Log in
        </button>
      </p>
    </form>
  );
}

export default Register;
