"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Hardcoded admin credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "su2025";

    if (form.username === ADMIN_USERNAME && form.password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true"); // Save login state
      window.location.href = "/admin"; // Redirect to dashboard
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}