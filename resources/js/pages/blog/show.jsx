import { Head, Link } from '@inertiajs/react';
import { Check, ChevronLeft, ChevronRight, Copy, Newspaper } from 'lucide-react';
import BottleIcon from '@/components/bottle-icon';
import PostCard from '@/components/post-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { formatDate } from '@/lib/format-date';
import { useClipboard } from '@/hooks/use-clipboard';
import { useInitials } from '@/hooks/use-initials';
import { useThemeImagePath } from '@/hooks/use-theme-image';
import { useTranslations } from '@/hooks/use-translations';
import { pluralizeRu } from '@/lib/pluralize';

const WORDS_PER_MINUTE = 200;

// ponytail: only "гайды" posts are actually about decanting/распив so far —
// everything else stays pointed at the catalog. Extend this map if future
// categories deserve their own destination.
const CATEGORY_CTA = {
    gaidy: { href: '/lots', label: 'Смотреть розпив' },
};
const DEFAULT_CTA = { href: '/products', label: 'Смотреть каталог' };

export default function BlogShow({
    post,
    relatedPosts,
    prevPost,
    nextPost,
    promoCode,
}) {
    const t = useTranslations();
    const getInitials = useInitials();
    const [copiedText, copy] = useClipboard();
    const paragraphs = post.body.split(/\n{2,}/);
    const coverPath = useThemeImagePath(post.cover_path, post.cover_path_light);
    const wordCount = post.body.trim().split(/\s+/).length;
    const readingMinutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
    const cta = CATEGORY_CTA[post.category?.slug] ?? DEFAULT_CTA;
    const shareUrl =
        typeof window !== 'undefined' ? window.location.href : '';
    const CopyIcon = copiedText === shareUrl ? Check : Copy;
    const discount = promoCode
        ? promoCode.type === 'percent'
            ? `${Number(promoCode.value)}%`
            : `${Number(promoCode.value)} ₴`
        : null;

    return (
        <>
            <Head title={post.title} />
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1 bg-[#f6efe3] dark:bg-[#0d0b09]">
                    <div className="mx-auto max-w-7xl p-6">
                        <Link
                            href="/blog"
                            className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                        >
                            ← {t('Блог')}
                        </Link>

                        <div
                            className={`mt-6 grid grid-cols-1 gap-10 ${promoCode ? 'lg:grid-cols-[1fr_320px]' : ''}`}
                        >
                            <div className={promoCode ? '' : 'mx-auto w-full max-w-4xl'}>
                                <div className="scent-card-photo flex aspect-[21/9] items-center justify-center overflow-hidden rounded-3xl">
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
                                    {post.category && (
                                        <span className="text-xs font-bold tracking-[0.18em] text-[#c79a5f] uppercase">
                                            {t(post.category.name)}
                                        </span>
                                    )}
                                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                                        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                            {post.author && (
                                                <>
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c79a5f] text-[10px] font-bold text-[#3d2712]">
                                                        {getInitials(
                                                            post.author.name,
                                                        )}
                                                    </span>
                                                    {post.author.name}
                                                    <span>·</span>
                                                </>
                                            )}
                                            {formatDate(post.published_at, t)}
                                            <span>·</span>
                                            {readingMinutes}{' '}
                                            {t(
                                                pluralizeRu(readingMinutes, [
                                                    'минута',
                                                    'минуты',
                                                    'минут',
                                                ]),
                                            )}{' '}
                                            {t('чтения')}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => copy(shareUrl)}
                                            className="flex items-center gap-1.5 text-xs text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                                        >
                                            <CopyIcon size={14} />
                                            {copiedText === shareUrl
                                                ? t('Скопировано')
                                                : t('Скопировать ссылку')}
                                        </button>
                                    </div>
                                    <h1 className="font-display text-5xl leading-tight font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                        {post.title}
                                    </h1>
                                </div>

                                <div className="flex flex-col gap-5">
                                    {paragraphs.map((paragraph, i) => (
                                        <p
                                            key={i}
                                            className="text-lg leading-relaxed text-[#241a10] md:text-justify dark:text-[#f6ecdd]"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {(prevPost || nextPost) && (
                                    <div className="mt-10 flex items-stretch gap-4 border-t border-[#1e160c14] pt-8 dark:border-[#ffffff14]">
                                        {prevPost ? (
                                            <Link
                                                href={`/blog/${prevPost.slug}`}
                                                className="group flex flex-1 flex-col gap-1 rounded-2xl p-3 -m-3 hover:bg-[#1e160c08] dark:hover:bg-[#ffffff08]"
                                            >
                                                <span className="flex items-center gap-1 text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                                    <ChevronLeft size={14} />{' '}
                                                    {t('Предыдущая статья')}
                                                </span>
                                                <span className="font-display text-lg font-semibold text-[#241a10] italic group-hover:text-[#c79a5f] dark:text-[#f6ecdd]">
                                                    {prevPost.title}
                                                </span>
                                            </Link>
                                        ) : (
                                            <div className="flex-1" />
                                        )}
                                        {nextPost ? (
                                            <Link
                                                href={`/blog/${nextPost.slug}`}
                                                className="group flex flex-1 flex-col items-end gap-1 rounded-2xl p-3 -m-3 text-right hover:bg-[#1e160c08] dark:hover:bg-[#ffffff08]"
                                            >
                                                <span className="flex items-center gap-1 text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                                    {t('Следующая статья')}{' '}
                                                    <ChevronRight size={14} />
                                                </span>
                                                <span className="font-display text-lg font-semibold text-[#241a10] italic group-hover:text-[#c79a5f] dark:text-[#f6ecdd]">
                                                    {nextPost.title}
                                                </span>
                                            </Link>
                                        ) : (
                                            <div className="flex-1" />
                                        )}
                                    </div>
                                )}

                                {!promoCode && (
                                    <div className="mt-8 border-t border-[#1e160c14] pt-8 dark:border-[#ffffff14]">
                                        <Link
                                            href={cta.href}
                                            className="inline-flex items-center gap-2 rounded-full bg-[#c5aa86] px-6 py-3 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase dark:bg-[#c79a5f]"
                                        >
                                            {t(cta.label)} →
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {promoCode && (
                                <aside className="lg:sticky lg:top-[5.5rem] lg:self-start">
                                    <div className="overflow-hidden rounded-3xl border border-[#1e160c14] bg-[#fffaf1] dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                                        <div className="scent-card-photo flex aspect-square items-center justify-center overflow-hidden">
                                            <BottleIcon />
                                        </div>
                                        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                                            <span className="text-xs font-bold tracking-[0.18em] text-[#c79a5f] uppercase">
                                                {t('Промокод')}
                                            </span>
                                            <h2 className="font-display text-2xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                                {t(
                                                    'Скидка {discount} на первый заказ',
                                                    { discount },
                                                )}
                                            </h2>
                                            <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                                {t(
                                                    'Введи код {code} на чекауте — работает на весь каталог, без минимальной суммы.',
                                                    { code: promoCode.code },
                                                )}
                                            </p>
                                            <Link
                                                href={cta.href}
                                                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#c5aa86] px-6 py-3 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase dark:bg-[#c79a5f]"
                                            >
                                                {t(cta.label)} →
                                            </Link>
                                        </div>
                                    </div>
                                </aside>
                            )}
                        </div>
                    </div>

                    {relatedPosts.length > 0 && (
                        <div className="mx-auto max-w-[1600px] p-6 pt-0">
                            <h2 className="mb-4 text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                {t('Читайте также')}
                            </h2>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-6">
                                {relatedPosts.map((related) => (
                                    <PostCard key={related.id} post={related} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <SiteFooter />
            </div>
        </>
    );
}
