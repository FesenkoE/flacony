import { Head, Link } from '@inertiajs/react';
import { Newspaper } from 'lucide-react';
import PostCard from '@/components/post-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { formatDate } from '@/lib/format-date';
import { useThemeImagePath } from '@/hooks/use-theme-image';
import { useLocalized, useTranslations } from '@/hooks/use-translations';

// Category + date line shared by the lead story and the side list.
function PostMeta({ post }) {
    const t = useTranslations();

    return (
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
    );
}

function PostCover({ post, iconSize, className }) {
    const coverPath = useThemeImagePath(post.cover_path, post.cover_path_light);

    return (
        <div
            className={`scent-card-photo flex items-center justify-center overflow-hidden ${className}`}
        >
            {coverPath ? (
                <img
                    src={`/storage/${coverPath}`}
                    alt=""
                    className="h-full w-full object-cover"
                />
            ) : (
                <Newspaper
                    size={iconSize}
                    strokeWidth={1.5}
                    className="text-[#a9835a]"
                />
            )}
        </div>
    );
}

// Magazine lead: the newest story large, the next few as a list beside it.
function FeaturedPost({ post }) {
    const l = useLocalized();

    return (
        <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
            <PostCover
                post={post}
                iconSize={56}
                className="aspect-[2/1] rounded-3xl"
            />
            <PostMeta post={post} />
            <h2 className="font-display text-3xl font-semibold text-[#241a10] italic group-hover:text-[#c79a5f] md:text-4xl dark:text-[#f6ecdd]">
                {l(post, 'title')}
            </h2>
            {l(post, 'excerpt') && (
                <p className="max-w-2xl text-base leading-relaxed text-[#7d6952] dark:text-[#b7a58f]">
                    {l(post, 'excerpt')}
                </p>
            )}
        </Link>
    );
}

function SidePost({ post }) {
    const l = useLocalized();

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex items-start gap-4"
        >
            <PostCover
                post={post}
                iconSize={24}
                className="aspect-[4/3] w-32 shrink-0 rounded-2xl"
            />
            <div className="flex min-w-0 flex-col gap-2">
                <PostMeta post={post} />
                <span className="font-display line-clamp-3 text-lg leading-snug font-semibold text-[#241a10] italic group-hover:text-[#c79a5f] dark:text-[#f6ecdd]">
                    {l(post, 'title').replaceAll('-', '‑')}
                </span>
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
                    <div className="mx-auto max-w-7xl p-6">
                        <h1 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {t('Блог')}
                        </h1>
                        <p className="mt-1 mb-6 text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            {t(
                                'Гиды по ароматам, парфюмерной культуре и уходу за флаконом.',
                            )}
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
                                <div
                                    className={`mb-12 grid grid-cols-1 gap-10 ${posts.length > 1 ? 'lg:grid-cols-[1fr_380px]' : ''}`}
                                >
                                    <FeaturedPost post={posts[0]} />
                                    {posts.length > 1 && (
                                        <div className="flex flex-col gap-6">
                                            {posts.slice(1, 5).map((post) => (
                                                <SidePost
                                                    key={post.id}
                                                    post={post}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {posts.length > 5 && (
                                    <>
                                        <h2 className="mb-4 text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                            {t('Ещё статьи')}
                                        </h2>
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                                            {posts.slice(5).map((post) => (
                                                <PostCard
                                                    key={post.id}
                                                    post={post}
                                                />
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
