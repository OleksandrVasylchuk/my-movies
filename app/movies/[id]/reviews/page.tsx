import { getMovieReviews } from '@/lib/tmdb';
import type { Review } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReviewsPage({ params }: Props) {
  const { id } = await params;
  const data = (await getMovieReviews(id)) as { results: Review[] };
  const reviews = data.results;

  if (reviews.length === 0) {
    return <p className="text-gray-500 text-center py-12">Рецензій для цього фільму поки немає.</p>;
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {reviews.map((review) => {
        const date = new Date(review.created_at).toLocaleDateString("uk-UA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const excerpt = review.content.length > 600 ? review.content.slice(0, 600) + "…" : review.content;

        return (
          <div key={review.id} className="p-5 bg-bg-secondary rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-gold text-sm font-bold flex-shrink-0">{review.author[0]?.toUpperCase() ?? "?"}</div>
                <span className="text-white text-sm font-semibold">{review.author}</span>
              </div>
              <div className="flex items-center gap-3 text-right">
                {review.author_details?.rating != null && <span className="text-xs text-gold font-semibold">★ {review.author_details.rating}/10</span>}
                <span className="text-xs text-gray-500 hidden sm:block">{date}</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{excerpt}</p>
            <p className="text-gray-600 text-xs mt-2 sm:hidden">{date}</p>
          </div>
        );
      })}
    </div>
  );
}
