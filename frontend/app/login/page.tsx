"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: any) => {
    e.preventDefault();

    console.log("🔥 LOGIN CLICKED"); // ✅ DEBUG

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const token = await userCred.user.getIdToken();
      localStorage.setItem("token", token);

      router.push("/");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("🔥 GOOGLE LOGIN CLICKED");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);

      router.push("/");
    } catch (error: any) {
      console.error(error);

      if (error.code !== "auth/popup-closed-by-user") {
        alert(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#070a12] font-[Arial]">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a] via-[#070a12] to-[#05070d]" />

      {/* GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#5a6cff] opacity-30 blur-[140px] rounded-full" />

      {/* LIGHT BEAM */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[500px] bg-gradient-to-b from-[#7b8cff]/50 to-transparent blur-2xl" />

      {/* ✅ FIXED VIGNETTE (important fix) */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* FORM CARD */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-[420px] rounded-[18px] px-10 py-12
        bg-[rgba(10,15,30,0.85)] backdrop-blur-xl
        border border-white/10
        shadow-[0_0_80px_rgba(80,100,255,0.35)]"
      >
        <h1 className="text-[28px] font-semibold text-white text-center mb-2">
          Sign In to Your Account
        </h1>

        <p className="text-center text-white/60 text-sm mb-6">
          Welcome back!
        </p>

        {/* GOOGLE LOGIN */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mb-4 py-3 rounded-[10px]
          bg-white/5 border border-white/10 text-white
          flex items-center justify-center gap-2 hover:bg-white/10 transition"
        >
          <span>🌐</span>
          Continue with Google
        </button>

        {/* OR divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-white/40 text-xs">or</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* EMAIL */}
        <label className="text-sm text-white/70">Email</label>
        <input
          type="email"
          value={formData.email}
          placeholder="you@example.com"
          className="w-full mt-1 mb-4 px-4 py-3 rounded-[10px]
          bg-white/5 border border-white/10 text-white outline-none"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <label className="text-sm text-white/70">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            placeholder="Enter your password"
            className="w-full mt-1 mb-6 px-4 py-3 rounded-[10px]
            bg-white/5 border border-white/10 text-white outline-none"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <Eye
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 cursor-pointer"
            size={18}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-3 rounded-[12px] text-white font-medium
          bg-gradient-to-r from-[#5a6cff] to-[#7b5cff]
          shadow-[0_10px_40px_rgba(90,108,255,0.6)]"
        >
          Sign In
        </button>

        {/* LINK */}
        <p className="text-center mt-6 text-white/60 text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#7b8cff]">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}