import { useState } from "react";
import api from "../api/axios";

function Login({ setToken, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      alert("Login Successful 🚀");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login Failed ❌");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white w-full p-2 rounded"
        onClick={handleLogin}
      >
        Login
      </button>

      <p className="text-center text-gray-500 mt-3">
        Don't have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={switchToRegister}
        >
          Register
        </span>
      </p>
    </div>
  );
}

export default Login;