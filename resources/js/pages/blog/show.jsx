import { Head, Link } from '@inertiajs/react';
import { Newspaper } from 'lucide-react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { formatDate } from '@/lib/format-date';
import { useThemeImagePath } from '@/hooks/use-theme-image';
import { useTranslations } from '@/hooks/use-translations';

export default function BlogShow({ post }) {
    const t = useTranslations();
    const paragraphs = post.body.split(/\n{2,}/);
    const coverPath = useThemeImagePath(post.cover_path, post.cover_path_light);

    return (
        <>
            <Head title={post.title} />
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1 bg-[#f6efe3] dark:bg-[#0d0b09]">
                    <div className="mx-auto max-w-2xl p-6">
                        <Link
                            href="/blog"
                            className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                        >
                            ← {t('Блог')}
                        </Link>

                        <div className="scent-card-photo mt-6 flex aspect-[21/9] items-center justify-center overflow-hidden rounded-3xl">
                            {coverPath ? (
                                <img
                                    src={`/storage/${coverPath}`}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Newspaper
                                    size={48}
                                    strokeWidth={1.5}
                                    className="text-[#a9835a]"
                                />
                            )}
                        </div>

                        <div className="mt-6 mb-8 flex flex-col gap-2">
                            <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                {formatDate(post.published_at)}
                                {post.author && <> · {post.author.name}</>}
                            </span>
                            <h1 className="font-display text-4xl leading-tight font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                {post.title}
                            </h1>
                        </div>

                        <div className="flex flex-col gap-4">
                            {paragraphs.map((paragraph, i) => (
                                <p
                                    key={i}
                                    className="text-base leading-relaxed text-[#241a10] dark:text-[#f6ecdd]"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
                <SiteFooter />
            </div>
        </>
    );
}
