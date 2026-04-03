"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PASSWORD_RULE,
  normalizeEmail,
  validateSignupInput,
  validateSignupOtpVerifyInput,
} from "@/shared/lib/validation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isPending, setIsPending] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function requestOtp() {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "request_otp",
        ...form,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setFieldErrors(data.fieldErrors || {});
      setError(data.error || "Could not send OTP.");
      return false;
    }

    setOtpEmail(normalizeEmail(form.email));
    setOtpRequested(true);
    setOtpMessage(data.message || "Verification code sent to your email.");
    setFieldErrors({});
    setError("");
    return true;
  }

  async function verifyOtp() {
    const otpValidation = validateSignupOtpVerifyInput({ email: otpEmail, otp });

    if (!otpValidation.isValid) {
      setFieldErrors(otpValidation.fieldErrors);
      setError(otpValidation.error);
      return false;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify_otp",
        email: otpEmail,
        otp,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setFieldErrors(data.fieldErrors || {});
      setError(data.error || "Could not verify OTP.");
      return false;
    }

    router.push("/");
    router.refresh();
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validation = validateSignupInput(form);
    if (!validation.isValid) {
      setFieldErrors(validation.fieldErrors);
      setError(validation.error);
      return;
    }

    setIsPending(true);

    try {
      if (!otpRequested) {
        await requestOtp();
      } else {
        await verifyOtp();
      }
    } catch {
      setError("Could not create account right now.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] px-6 py-14 text-[#1a1b1f]">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-3 text-xl font-extrabold">
          <span className="relative aspect-square w-8 rounded-xl bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] shadow-[0_14px_34px_rgba(34,22,15,0.09)] after:absolute after:inset-[24%_28%] after:rounded-[60%_40%_55%_45%] after:bg-white/90 after:content-['']" />
          SavoryCircle
        </Link>

        <div className="mt-8 rounded-3xl border border-[#dbbc9952] bg-white/90 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
          <h1 className="text-3xl font-extrabold">Create your account</h1>
          <p className="mt-2 text-sm text-[#565b64]">
            Already have one?{" "}
            <Link href="/login" className="font-semibold text-[#cb3219] hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#373b42]">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={otpRequested}
                className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#f5f1eb]"
              />
              {fieldErrors.name ? <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p> : null}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#373b42]">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={otpRequested}
                className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#f5f1eb]"
              />
              {fieldErrors.email ? <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p> : null}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#373b42]">Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                required
                disabled={otpRequested}
                className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#f5f1eb]"
              />
              <p className="mt-1 text-xs text-[#6f757d]">{PASSWORD_RULE}</p>
              {fieldErrors.password ? <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p> : null}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#373b42]">Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={otpRequested}
                className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#f5f1eb]"
              />
              {fieldErrors.confirmPassword ? (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
              ) : null}
            </label>

            {otpRequested ? (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#373b42]">OTP code</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => {
                    setOtp(event.target.value.replace(/\D/g, ""));
                    setFieldErrors((prev) => ({ ...prev, otp: "" }));
                  }}
                  placeholder="Enter 6-digit code"
                  className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2"
                />
                {fieldErrors.otp ? <p className="mt-1 text-xs text-red-600">{fieldErrors.otp}</p> : null}
              </label>
            ) : null}

            {otpMessage ? <p className="text-sm text-[#2e8850]">{otpMessage}</p> : null}
            <p className="text-xs text-[#565b64]">Check your inbox (and spam folder) for the verification code.</p>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending
                ? otpRequested
                  ? "Verifying OTP..."
                  : "Sending OTP..."
                : otpRequested
                  ? "Verify OTP & sign up"
                  : "Sign up"}
            </button>

            {otpRequested ? (
              <button
                type="button"
                disabled={isPending}
                onClick={async () => {
                  setError("");
                  setIsPending(true);
                  try {
                    await requestOtp();
                  } catch {
                    setError("Could not resend OTP.");
                  } finally {
                    setIsPending(false);
                  }
                }}
                className="w-full rounded-full border border-[#d0ab8859] bg-white px-4 py-3 text-sm font-semibold text-[#373b42] transition hover:bg-[#fff7ef] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Resend OTP
              </button>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  );
}





