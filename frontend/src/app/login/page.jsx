"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BackgroundPattern from "../components/BackgroundPattern";
import { fetchApi } from "@/lib/api.ts"
;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Call login endpoint using fetchApi
      const res = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      router.push("/");
    } catch (err) {
      setError("Username atau password salah");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background flex items-center justify-center">
      <BackgroundPattern />
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-10 flex flex-col gap-6 min-w-[350px]"
      >
        <h2 className="text-3xl font-bold text-center mb-2">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-purple-700 text-white py-3 text-lg font-semibold rounded-xl mt-2"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
