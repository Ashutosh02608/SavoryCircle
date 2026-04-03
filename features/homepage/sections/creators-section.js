import Link from "next/link";
import { brandGradientClass, containerClass } from "@/features/homepage/constants";
import { creators } from "@/features/homepage/data";

export default function CreatorsSection() {
  return (
    <section className="py-14" id="creators">
      <div className={containerClass}>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Creator Spotlight</h2>
        <p className="mt-3 max-w-[60ch] text-[#565b64]">
          Follow inspiring cooks who blend culture, craft, and beautifully documented recipes.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator, index) => (
            <Link
              key={creator.name}
              href={`/recipes?creator=${encodeURIComponent(creator.name)}`}
              className="rounded-3xl border border-[#b89a8047] bg-white/80 p-4 shadow-[0_14px_34px_rgba(34,22,15,0.09)]"
            >
              <div className="flex items-center gap-3">
                {creator.avatarUrl ? (
                  <img
                    src={creator.avatarUrl}
                    alt={creator.name}
                    className="h-12 w-12 rounded-full border border-white/80 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-full text-sm font-extrabold ${
                      index === 1
                        ? `${brandGradientClass} text-white`
                        : "bg-[linear-gradient(135deg,#c4edcf_0%,#7bcf95_55%,#4cac70_100%)] text-[#173927]"
                    }`}
                  >
                    {creator.initials}
                  </div>
                )}
                <div>
                  <strong>{creator.name}</strong>
                  <div className="text-sm text-[#6f757d]">{creator.role}</div>
                </div>
              </div>
              <p className="my-3 text-[#565b64]">{creator.bio}</p>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                  index === 1 ? "bg-[#e4432824] text-[#cb3219]" : "bg-[#47a4672e] text-[#2e8850]"
                }`}
              >
                {creator.followers}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
