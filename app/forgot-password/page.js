"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagesSlider } from "@/components/ui/images-slider";
import { AuthCard } from "@/components/ui/auth-card";
import { Input } from "@/components/ui/input";
import { CustomButton } from "@/components/ui/button";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetImages = [
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1600&auto=format&fit=crop",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail("");
    } catch (err) {
      console.warn("Password reset failed:", err.code);
      let errorMsg = "Failed to send reset link. Please check your email and try again.";
      if (err.code === "auth/user-not-found") {
        errorMsg = "We couldn't find an account registered with this email.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Invalid email format.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImagesSlider className="h-screen w-full px-4 py-6 sm:py-8" images={resetImages}>
      <AuthCard
        title="Reset Password"
        subtitle="Enter your email and we'll send you a link to recover access to your account."
      >
        {success ? (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-green-500/10 border border-green-500/25 rounded-2xl text-green-600 dark:text-green-400 text-xs font-semibold text-center select-none leading-relaxed">
              A password reset link has been successfully sent to your email! Please check your inbox.
            </div>
            <CustomButton
              variant="glow"
              onClick={() => router.push("/login")}
              className="w-full py-2.5"
            >
              <span>Back to Login</span>
            </CustomButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-500 text-xs font-semibold text-center select-none">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail />}
              required
            />

            <CustomButton
              variant="glow"
              type="submit"
              className="w-full mt-2 cursor-pointer"
              disabled={loading}
            >
              <span>{loading ? "Sending Link..." : "Send Reset Link"}</span>
              {!loading && <KeyRound className="w-4 h-4" />}
            </CustomButton>

            {/* Back to login link */}
            <p className="text-sm font-medium text-neutral-500 dark:text-zinc-400 text-center mt-2">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-orange-500 hover:text-orange-600 font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <span>Log in</span>
              </Link>
            </p>
          </form>
        )}
      </AuthCard>
    </ImagesSlider>
  );
}
