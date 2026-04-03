import { containerClass } from "@/features/homepage/constants";
import { testimonials } from "@/features/homepage/data";

export default function TestimonialsSection() {
  return (
    <section className="py-14" id="testimonials">
      <div className={containerClass}>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">What Home Cooks Say</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {testimonials.map((item) => (
            <article
              key={item.author}
              className="rounded-3xl border border-[#ba9a7c47] bg-white/90 p-4 shadow-[0_14px_34px_rgba(34,22,15,0.09)]"
            >
              <p className="mb-3">&ldquo;{item.quote}&rdquo;</p>
              <cite className="text-sm not-italic text-[#565b64]">{item.author}</cite>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
