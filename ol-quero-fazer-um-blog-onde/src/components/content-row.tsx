import type { Post } from "@/types";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";

export function ContentRow({ title, kicker, posts }: { title: string; kicker?: string; posts: Post[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeading title={title} kicker={kicker} />
      <div className="scrollbar-none flex gap-4 overflow-x-auto pb-3">
        {posts.map((post) => (
          <div key={post.id} className="w-[280px] shrink-0 sm:w-[340px]">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}
