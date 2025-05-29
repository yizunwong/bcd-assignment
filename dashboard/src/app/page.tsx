"use client";

import React, { useState } from "react";
import { print } from "@/utils/toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLogin } from "@/services/auth"; // ✅ use the hook

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useLogin(); // ✅ use the mutation hook

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          print(`Welcome, ${data.user.email}`, "success");
          // Example: redirect or further actions here
          // router.push('/dashboard');
        },
        onError: (err) => {
          print("Login failed: " + (err?.message || "Unknown error"), "error");
        },
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-xl font-bold mb-4">Login</h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={login.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {login.isPending ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
