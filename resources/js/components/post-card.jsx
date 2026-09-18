import { Link } from '@inertiajs/react';
import { Newspaper } from 'lucide-react';
import { formatDate } from '@/lib/format-date';
import { useThemeImagePath } from '@/hooks/use-theme-image';

export default function PostCard({ post }) {
    const coverPath = useThemeImagePath(post.cover_path, post.cover_path_light);

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="flex flex-col overflow-hidden rounded-3xl border border-[#1e160c14] bg-[#fffaf1] transition-colors hover:border-[#c79a5f66] dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
        >
            <div className="scent-card-photo flex aspect-[16/9] items-center justify-center overflow-hidden">
                {coverPath ? (
                    <img
                        src={`/storage/${coverPath}`}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <Newspaper
                        size={36}
                        strokeWidth={1.5}
                        className="text-[#a9835a]"
                    />
                )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="w-fit rounded-full bg-[#c79a5f1a] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#c79a5f] uppercase">
                    {formatDate(post.published_at)}
                </span>
                <h2 className="font-display line-clamp-2 text-2xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                    {post.title}
                </h2>
                {post.excerpt && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-[#7d6952] dark:text-[#b7a58f]">
                        {post.excerpt}
                    </p>
                )}
            </div>
        </Link>
    );
}
