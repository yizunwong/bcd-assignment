"use client";

import React, { useState } from "react";
import { print } from "@/utils/toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { login } from '@/services/auth';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(email, password);

      // setUser(result);
      // print(`Welcome, ${result.name}`, "success");

      // // Optional: Save token or redirect here
      // localStorage.setItem("access_token", result.accessToken); // if returned
    } catch (err) {
      print("Login failed: " + (err || "Unknown error"), "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </>
  );
}
