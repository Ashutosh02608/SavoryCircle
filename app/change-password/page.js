import { redirect } from "next/navigation";
import SiteHeader from "@/features/homepage/sections/site-header";
import SiteFooter from "@/features/homepage/sections/site-footer";
import ChangePasswordForm from "@/features/auth/components/change-password-form";
import { containerClass } from "@/features/homepage/constants";
import { getCurrentUser } from "@/features/auth/server";

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] text-[#1a1b1f]">
      <SiteHeader user={user} />
      <main className="py-12">
        <section className={containerClass}>
          <div className="mx-auto w-full max-w-xl rounded-3xl border border-[#dbbc9952] bg-white/90 p-6 shadow-[0_14px_34px_rgba(34,22,15,0.09)]">
            <h1 className="text-3xl font-extrabold">Change Password</h1>
            <p className="mt-2 text-sm text-[#565b64]">
              Keep your account secure by setting a strong password.
            </p>
            <ChangePasswordForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
