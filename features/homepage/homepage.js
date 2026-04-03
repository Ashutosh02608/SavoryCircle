import SiteHeader from "@/features/homepage/sections/site-header";
import HeroSection from "@/features/homepage/sections/hero-section";
import FeaturedSection from "@/features/homepage/sections/featured-section";
import CategoriesSection from "@/features/homepage/sections/categories-section";
import CreatorsSection from "@/features/homepage/sections/creators-section";
import TestimonialsSection from "@/features/homepage/sections/testimonials-section";
import NewsletterSection from "@/features/homepage/sections/newsletter-section";
import SiteFooter from "@/features/homepage/sections/site-footer";

export default function Homepage({ user }) {
  return (
    <div className="overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] text-[#1a1b1f]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-20 [background-image:radial-gradient(rgba(34,29,24,0.08)_0.65px,transparent_0.65px)] [background-size:3px_3px]"
      />

      <SiteHeader user={user} />

      <main className="relative z-10">
        <HeroSection user={user} />
        <FeaturedSection />
        <CategoriesSection />
        <CreatorsSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>

      <SiteFooter />
    </div>
  );
}
