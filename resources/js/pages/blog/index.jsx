import { Head, Link } from '@inertiajs/react';
import { Newspaper } from 'lucide-react';
import PostCard from '@/components/post-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { formatDate } from '@/lib/format-date';
import { useThemeImagePath } from '@/hooks/use-theme-image';
import { useLocalized, useTranslations } from '@/hooks/use-translations';

function FeaturedPostCard({ post }) {
    const t = useTranslations();
    const l = useLocalized();

    const coverPath = useThemeImagePath(post.cover_path, post.cover_path_light);

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group mb-10 flex flex-col overflow-hidden rounded-3xl border border-[#1e160c14] bg-[#fffaf1] transition-colors hover:border-[#c79a5f66] dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
        >
            <div className="scent-card-photo flex aspect-[21/9] items-center justify-center overflow-hidden">
                {coverPath ? (
                    <img
                        src={`/storage/${coverPath}`}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <Newspaper
                        size={56}
                        strokeWidth={1.5}
                        className="text-[#a9835a]"
                    />
                )}
            </div>
            <div className="flex flex-col gap-3 p-8">
                <div className="flex items-center gap-2">
                    {post.category && (
                        <span className="w-fit rounded-full bg-[#c79a5f1a] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#c79a5f] uppercase">
                            {t(post.category.name)}
                        </span>
                    )}
                    <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                        {formatDate(post.published_at, t)}
                    </span>
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#241a10] italic group-hover:text-[#c79a5f] dark:text-[#f6ecdd] md:text-4xl">
                    {l(post, 'title')}
                </h2>
                {l(post, 'excerpt') && (
                    <p className="max-w-2xl text-base leading-relaxed text-[#7d6952] dark:text-[#b7a58f]">
                        {l(post, 'excerpt')}
                    </p>
                )}
            </div>
        </Link>
    );
}

export default function BlogIndex({ posts, categories, activeCategory }) {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Блог')} />
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1 bg-[#f6efe3] dark:bg-[#0d0b09]">
                    <div className="mx-auto max-w-[1600px] p-6">
                        <h1 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {t('Блог')}
                        </h1>
                        <p className="mt-1 mb-6 text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            {t('Гиды по ароматам, парфюмерной культуре и уходу за флаконом.')}
                        </p>

                        {categories.length > 0 && (
                            <div className="mb-8 flex flex-wrap gap-2">
                                <Link
                                    href="/blog"
                                    className={
                                        'rounded-full border px-4 py-1.5 text-sm font-medium ' +
                                        (!activeCategory
                                            ? 'border-[#c79a5f] bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]'
                                            : 'border-[#e6d7bb] text-[#7d6952] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                                    }
                                >
                                    {t('Все статьи')}
                                </Link>
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/blog?category=${category.slug}`}
                                        className={
                                            'rounded-full border px-4 py-1.5 text-sm font-medium ' +
                                            (activeCategory === category.slug
                                                ? 'border-[#c79a5f] bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]'
                                                : 'border-[#e6d7bb] text-[#7d6952] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                                        }
                                    >
                                        {t(category.name)}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {posts.length === 0 ? (
                            <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {t('Пока нет статей.')}
                            </p>
                        ) : (
                            <>
                                <FeaturedPostCard post={posts[0]} />

                                {posts.length > 1 && (
                                    <>
                                        <h2 className="mb-4 text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                            {t('Ещё статьи')}
                                        </h2>
                                        <div className="grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-6">
                                            {posts.slice(1).map((post) => (
                                                <PostCard key={post.id} post={post} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <SiteFooter />
            </div>
        </>
    );
}
