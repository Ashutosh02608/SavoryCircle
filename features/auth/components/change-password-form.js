"use client";

import { useState } from "react";
import { PASSWORD_RULE, validateChangePasswordInput } from "@/shared/lib/validation";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validation = validateChangePasswordInput(form);

    if (!validation.isValid) {
      setFieldErrors(validation.fieldErrors);
      setError(validation.error);
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setFieldErrors(data.fieldErrors || {});
        setError(data.error || "Unable to change password.");
        return;
      }

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setFieldErrors({});
      setSuccess(data.message || "Password updated successfully.");
    } catch {
      setError("Unable to change password right now.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[#373b42]">Current password</span>
        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2"
        />
        {fieldErrors.currentPassword ? (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.currentPassword}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[#373b42]">New password</span>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          minLength={8}
          required
          className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2"
        />
        <p className="mt-1 text-xs text-[#6f757d]">{PASSWORD_RULE}</p>
        {fieldErrors.newPassword ? (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.newPassword}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[#373b42]">Confirm new password</span>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-[#d0ab8859] bg-white px-3 py-2 text-sm outline-none ring-[#e052358c] transition focus:ring-2"
        />
        {fieldErrors.confirmPassword ? (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
        ) : null}
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-[#2e8850]">{success}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[linear-gradient(120deg,#e44328,#ff7b45_56%,#f8b35b)] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
