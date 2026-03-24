"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = async (e: any) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const token = await userCred.user.getIdToken();

      localStorage.setItem("token", token);

      router.push("/");
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  };
  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();

      localStorage.setItem("token", token);

      router.push("/"); // or "/subscriptions"
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#070a12] font-[Arial]">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a] via-[#070a12] to-[#05070d]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] 
      bg-[#5a6cff] opacity-30 blur-[140px] rounded-full" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[500px]
      bg-gradient-to-b from-[#7b8cff]/50 to-transparent blur-2xl" />
      <div className="absolute inset-0 bg-black/40" />

      {/* FORM */}
      <form onSubmit={handleSignup}
        className="relative z-10 w-[420px] rounded-[18px] px-10 py-12 
        bg-[rgba(10,15,30,0.85)] backdrop-blur-xl
        border border-white/10
        shadow-[0_0_80px_rgba(80,100,255,0.35)]">

        <h1 className="text-[28px] font-semibold text-white text-center mb-2">
          Create Your Account
        </h1>

        <p className="text-center text-white/60 text-sm mb-6">
          Start managing subscriptions stress-free
        </p>
        {/* OR DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="px-3 text-white/50 text-sm">or</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* GOOGLE BUTTON */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full py-3 rounded-[12px] text-white font-medium
  border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2"
        >
          {/* Google Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>

          Continue with Google
        </button>

        {/* NAME */}
        <label className="text-sm text-white/70">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          className="w-full mt-1 mb-4 px-4 py-3 rounded-[10px]
          bg-white/5 border border-white/10 text-white"
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        {/* EMAIL */}
        <label className="text-sm text-white/70">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full mt-1 mb-4 px-4 py-3 rounded-[10px]
          bg-white/5 border border-white/10 text-white"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <label className="text-sm text-white/70">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Min 8 characters"
            className="w-full mt-1 mb-4 px-4 py-3 pr-10 rounded-[10px]
            bg-white/5 border border-white/10 text-white"
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

        {/* CONFIRM */}
        <label className="text-sm text-white/70">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter password"
            className="w-full mt-1 mb-6 px-4 py-3 pr-10 rounded-[10px]
            bg-white/5 border border-white/10 text-white"
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmPassword: e.target.value,
              })
            }
          />
          <Eye
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 cursor-pointer"
            size={18}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-[12px] text-white font-medium
          bg-gradient-to-r from-[#5a6cff] to-[#7b5cff]"
        >
          Create Account
        </button>

        <p className="text-sm text-center mt-6 text-white/50">
          Already have an account?{" "}
          <a href="/login" className="text-[#6c7cff]">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}