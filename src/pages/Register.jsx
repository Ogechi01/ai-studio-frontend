import { useState } from "react";
import api from "../api/axios";

function Register({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (password !== confirm) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const res = await api.post("/auth/register", { email, password });
      console.log(res.data);
      alert("Registration Successful 🚀");
      switchToLogin(); // go to login automatically
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration Failed ❌");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

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

      <input
        className="border p-2 w-full mb-3"
        placeholder="Confirm Password"
        type="password"
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button
        className="bg-green-600 text-white w-full p-2 rounded mb-3"
        onClick={handleRegister}
      >
        Register
      </button>

      <p className="text-center text-gray-500">
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={switchToLogin}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;