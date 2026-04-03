import SiteHeader from "@/features/homepage/sections/site-header";
import SiteFooter from "@/features/homepage/sections/site-footer";
import { containerClass } from "@/features/homepage/constants";
import StoryComposer from "@/features/stories/components/story-composer";
import { testimonials } from "@/features/homepage/data";
import { getCurrentUser } from "@/features/auth/server";
import { listStories } from "@/features/stories/server";

export default async function StoriesPage() {
  const user = await getCurrentUser();
  const stories = await listStories({ limit: 30 });

  return (
    <div className="overflow-x-clip bg-[radial-gradient(circle_at_16%_0%,#ffe9cf_0%,transparent_36%),radial-gradient(circle_at_83%_15%,#ffd8c8_0%,transparent_35%),radial-gradient(circle_at_76%_84%,#d7f0db_0%,transparent_29%),#fffdf6] text-[#1a1b1f]">
      <SiteHeader user={user} />
      <main className="py-12">
        <section className={containerClass}>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Stories</h1>
          <p className="mt-3 text-[#565b64]">Real stories from home cooks in our community.</p>

          <StoryComposer canWrite={Boolean(user)} />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {stories.map((story) => (
              <article key={story.id} className="rounded-2xl border border-[#dbbc9952] bg-white/90 p-5">
                <h2 className="text-lg font-bold text-[#1a1b1f]">{story.title}</h2>
                <p className="mt-2 whitespace-pre-line text-[#373b42]">{story.content}</p>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold text-[#565b64]">
                  <span>{story.authorName}</span>
                  <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                </div>
              </article>
            ))}

            {stories.length === 0
              ? testimonials.map((story) => (
                  <article key={story.author} className="rounded-2xl border border-[#dbbc9952] bg-white/90 p-5">
                    <p className="text-[#373b42]">&ldquo;{story.quote}&rdquo;</p>
                    <p className="mt-3 text-sm font-semibold text-[#565b64]">{story.author}</p>
                  </article>
                ))
              : null}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
