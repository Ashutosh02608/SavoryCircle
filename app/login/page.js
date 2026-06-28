"use client";
import React, { useState } from "react";
import { ImagesSlider } from "@/components/ui/images-slider";
import { AuthCard } from "@/components/ui/auth-card";
import { Input } from "@/components/ui/input";
import { CustomButton } from "@/components/ui/button";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const loginImages = [
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1600&auto=format&fit=crop",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/";
    } catch (error) {
      console.warn("Firebase login failed:", error.code);
      let errorMsg = "Invalid email or password.";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        errorMsg = "Invalid email or password credentials.";
      } else if (error.code === "auth/too-many-requests") {
        errorMsg = "Too many failed attempts. Please try again later.";
      }
      setErrors({ form: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImagesSlider className="h-screen w-full px-4 py-6 sm:py-8" images={loginImages}>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to save recipes and connect with home cooks."
      >
        {errors.form && (
          <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-500 text-xs font-semibold text-center select-none">
            {errors.form}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail />}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock />}
            error={errors.password}
            required
          />

          <div className="flex items-center justify-between text-xs font-semibold px-1">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-600 dark:text-zinc-400">
              <input
                type="checkbox"
                className="rounded border-neutral-300 dark:border-zinc-800 text-orange-500 focus:ring-orange-500/20"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-orange-500 hover:text-orange-600 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <CustomButton variant="glow" type="submit" className="w-full mt-2" disabled={loading}>
            <span>{loading ? "Signing In..." : "Sign In"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </CustomButton>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="absolute w-full border-t border-neutral-200 dark:border-zinc-800" />
          <span className="relative z-10 px-3 text-xs font-medium text-neutral-400 bg-white/0 backdrop-blur-0">
            Or continue with
          </span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => alert("Google Login (Mock Demo)")}
            className="flex items-center justify-center gap-2 py-2.5 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-semibold text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-800/80 transition duration-200 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.09 14.973 0 12 0 7.354 0 3.307 2.68 1.347 6.58l3.919 3.185z"
              />
              <path
                fill="#4285F4"
                d="M16.04 15.345c-1.07.712-2.46 1.164-4.04 1.164a7.077 7.077 0 01-6.734-4.856l-3.92 3.186A11.963 11.963 0 0012 24c3.24 0 6.136-1.08 8.182-2.92l-4.14-3.735z"
              />
              <path
                fill="#34A853"
                d="M12 16.51c-2.827 0-5.263-1.664-6.418-4.073l-3.92 3.186C3.623 20.655 7.49 24 12 24c2.94 0 5.627-.96 7.69-2.58l-3.65-3.08-2.04 1.83-2.04.34z"
              />
              <path
                fill="#FBBC05"
                d="M23.52 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.47a5.534 5.534 0 01-2.4 3.63l4.14 3.73C22.62 19.89 23.52 16.39 23.52 12.27z"
              />
            </svg>
            <span>Google</span>
          </button>
          <button
            onClick={() => alert("Apple Login (Mock Demo)")}
            className="flex items-center justify-center gap-2 py-2.5 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-semibold text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-800/80 transition duration-200 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.11.09 2.25-.56 2.94-1.39z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-sm font-medium text-neutral-500 dark:text-zinc-400 text-center mt-2">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-orange-500 hover:text-orange-600 font-bold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </AuthCard>
    </ImagesSlider>
  );
}
