import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import BottleIcon from '@/components/bottle-icon';
import StarRating from '@/components/star-rating';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/format-date';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useAddToCart } from '@/hooks/use-add-to-cart';
import { pickThemeImage, useIsDarkTheme } from '@/hooks/use-theme-image';
import { useLocalized, useTranslations } from '@/hooks/use-translations';
import { pluralizeRu } from '@/lib/pluralize';

const LONGEVITY_LABELS = {
    weak: ['Слабая', 1],
    moderate: ['Умеренная', 2],
    long_lasting: ['Стойкая', 3],
    eternal: ['Очень стойкая', 4],
};

const SILLAGE_LABELS = {
    soft: ['Лёгкий', 1],
    moderate: ['Умеренный', 2],
    strong: ['Сильный', 3],
    enormous: ['Огромный', 4],
};

function LevelBar({ level }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4].map((n) => (
                <span
                    key={n}
                    className={
                        'h-1.5 w-6 rounded-full ' +
                        (n <= level
                            ? 'bg-[#c79a5f]'
                            : 'bg-[#e6d7bb] dark:bg-[#ffffff1a]')
                    }
                />
            ))}
        </div>
    );
}

export default function ProductShow({ product, myReview }) {
    const t = useTranslations();
    const [variantIndex, setVariantIndex] = useState(0);
    const { added, addToCart } = useAddToCart();
    const { auth } = usePage().props;
    const variant = product.variants[variantIndex];
    const isDark = useIsDarkTheme();
    const description = useLocalized()(product, 'description');
    const photos = [
        {
            image_path: product.image_path,
            image_path_light: product.image_path_light,
        },
        ...product.images,
    ];
    const [photoIndex, setPhotoIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const imagePath = pickThemeImage(
        isDark,
        photos[photoIndex].image_path,
        photos[photoIndex].image_path_light,
    );

    function prevPhoto() {
        setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
    }

    function nextPhoto() {
        setPhotoIndex((i) => (i + 1) % photos.length);
    }

    useEffect(() => {
        if (!lightboxOpen || photos.length < 2) {
            return;
        }

        function onKeyDown(e) {
            if (e.key === 'ArrowLeft') {
                prevPhoto();
            } else if (e.key === 'ArrowRight') {
                nextPhoto();
            }
        }

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [lightboxOpen, photos.length]);

    const [rating, setRating] = useState(myReview?.rating ?? 5);
    const [body, setBody] = useState(myReview?.body ?? '');

    function submitReview(e) {
        e.preventDefault();
        router.post(
            `/products/${product.slug}/reviews`,
            { rating, body },
            { preserveScroll: true },
        );
    }

    function deleteReview() {
        router.delete(`/reviews/${myReview?.id}`, { preserveScroll: true });
    }

    return (
        <>
            <Head title={`${product.brand.name} — ${product.name}`} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-4xl p-6">
                    <Link
                        href="/products"
                        className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← {t('Каталог')}
                    </Link>

                    <div className="mt-6 grid gap-8 md:grid-cols-2">
                        <div className="min-w-0">
                            <div className="scent-card-photo group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl">
                                {imagePath ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLightboxOpen(true)
                                            }
                                            aria-label={t('Увеличить фото')}
                                            className="h-full w-full"
                                        >
                                            <img
                                                src={`/storage/${imagePath}`}
                                                alt={`${product.brand.name} ${product.name}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                        <div className="pointer-events-none absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#00000066] text-white opacity-0 transition-opacity group-hover:opacity-100">
                                            <ZoomIn size={18} />
                                        </div>
                                    </>
                                ) : (
                                    <BottleIcon size={164} />
                                )}
                                {photos.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={prevPhoto}
                                            aria-label={t('Предыдущее фото')}
                                            className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#00000066] text-white"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextPhoto}
                                            aria-label={t('Следующее фото')}
                                            className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#00000066] text-white"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}
                            </div>
                            {photos.length > 1 && (
                                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                                    {photos.map((photo, i) => {
                                        const thumbPath = pickThemeImage(
                                            isDark,
                                            photo.image_path,
                                            photo.image_path_light,
                                        );
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setPhotoIndex(i)}
                                                aria-label={t('Фото {n}', {
                                                    n: i + 1,
                                                })}
                                                className={
                                                    'scent-card-photo aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 ' +
                                                    (i === photoIndex
                                                        ? 'border-[#c79a5f]'
                                                        : 'border-transparent')
                                                }
                                            >
                                                {thumbPath ? (
                                                    <img
                                                        src={`/storage/${thumbPath}`}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <BottleIcon size={40} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <Dialog
                            open={lightboxOpen}
                            onOpenChange={setLightboxOpen}
                        >
                            <DialogContent className="w-auto max-w-[92vw] rounded-none border-0 bg-transparent p-0 shadow-none">
                                <DialogTitle className="sr-only">
                                    {`${product.brand.name} — ${product.name}`}
                                </DialogTitle>
                                <div className="relative">
                                    {imagePath && (
                                        <img
                                            src={`/storage/${imagePath}`}
                                            alt={`${product.brand.name} ${product.name}`}
                                            className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain"
                                        />
                                    )}
                                    {photos.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={prevPhoto}
                                                aria-label={t(
                                                    'Предыдущее фото',
                                                )}
                                                className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#00000066] text-white"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextPhoto}
                                                aria-label={t('Следующее фото')}
                                                className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#00000066] text-white"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold tracking-[0.18em] text-[#c79a5f] uppercase">
                                    {product.brand.name}
                                </span>
                                <h1 className="font-display text-5xl leading-none font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                    {product.name}
                                </h1>
                                <div className="mt-1 h-0.5 w-9 rounded-full bg-[#c79a5f]" />
                                {product.reviews.length > 0 && (
                                    <div className="mt-1 flex items-center gap-2">
                                        <StarRating
                                            value={product.reviews_avg_rating}
                                        />
                                        <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                            {Number(
                                                product.reviews_avg_rating,
                                            ).toFixed(1)}{' '}
                                            · {product.reviews.length}{' '}
                                            {t(
                                                pluralizeRu(
                                                    product.reviews.length,
                                                    [
                                                        'отзыв',
                                                        'отзыва',
                                                        'отзывов',
                                                    ],
                                                ),
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {description && (
                                <p className="text-sm leading-relaxed text-[#7d6952] dark:text-[#b7a58f]">
                                    {description}
                                </p>
                            )}

                            <div className="h-px bg-[#1e160c14] dark:bg-[#ffffff1a]" />

                            <div className="flex flex-col gap-2">
                                <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                    {t('Объём')}
                                </span>
                                <div className="flex gap-2.5">
                                    {product.variants.map((v, i) => {
                                        const selected = i === variantIndex;
                                        return (
                                            <button
                                                key={v.id}
                                                type="button"
                                                onClick={() =>
                                                    setVariantIndex(i)
                                                }
                                                className={
                                                    'rounded-2xl border px-4 py-3 text-sm font-semibold whitespace-nowrap ' +
                                                    (selected
                                                        ? 'border-[#c79a5f] bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]'
                                                        : 'border-[#e6d7bb] bg-[#fbf5ea] text-[#7d6952] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#b7a58f]')
                                                }
                                            >
                                                {v.volume_ml} мл
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-2 flex flex-col gap-3">
                                <div className="flex items-baseline justify-between">
                                    <span className="font-display text-3xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                        {Number(variant.price).toFixed(2)} ₴
                                    </span>
                                    <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                        {variant.volume_ml} мл
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => addToCart(variant.id)}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c5aa86] px-5 py-3.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase dark:bg-[#c79a5f]"
                                >
                                    {added ? (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M6 6h15l-1.5 9h-12z" />
                                            <path d="M6 6 5 3H2" />
                                            <circle cx="9" cy="20" r="1" />
                                            <circle cx="18" cy="20" r="1" />
                                        </svg>
                                    )}
                                    <span>
                                        {added
                                            ? t('Добавлено')
                                            : t('В корзину')}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {(product.perfumer ||
                        product.release_year ||
                        product.concentration ||
                        product.top_notes ||
                        product.accords ||
                        product.longevity ||
                        product.sillage) && (
                        <div className="mt-12 flex flex-col gap-6">
                            <h2 className="text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                {t('Профиль аромата')}
                            </h2>

                            {(product.perfumer ||
                                product.release_year ||
                                product.concentration) && (
                                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                                    {product.perfumer && (
                                        <div>
                                            <span className="block text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                                {t('Парфюмер')}
                                            </span>
                                            <span className="text-[#241a10] dark:text-[#f6ecdd]">
                                                {product.perfumer}
                                            </span>
                                        </div>
                                    )}
                                    {product.release_year && (
                                        <div>
                                            <span className="block text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                                {t('Год')}
                                            </span>
                                            <span className="text-[#241a10] dark:text-[#f6ecdd]">
                                                {product.release_year}
                                            </span>
                                        </div>
                                    )}
                                    {product.concentration && (
                                        <div>
                                            <span className="block text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                                {t('Концентрация')}
                                            </span>
                                            <span className="text-[#241a10] dark:text-[#f6ecdd]">
                                                {product.concentration}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(product.longevity || product.sillage) && (
                                <div className="flex flex-wrap gap-x-10 gap-y-3">
                                    {product.longevity &&
                                        LONGEVITY_LABELS[product.longevity] && (
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                                    {t('Стойкость')}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <LevelBar
                                                        level={
                                                            LONGEVITY_LABELS[
                                                                product
                                                                    .longevity
                                                            ][1]
                                                        }
                                                    />
                                                    <span className="text-sm text-[#241a10] dark:text-[#f6ecdd]">
                                                        {t(
                                                            LONGEVITY_LABELS[
                                                                product
                                                                    .longevity
                                                            ][0],
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    {product.sillage &&
                                        SILLAGE_LABELS[product.sillage] && (
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                                    {t('Шлейф')}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <LevelBar
                                                        level={
                                                            SILLAGE_LABELS[
                                                                product.sillage
                                                            ][1]
                                                        }
                                                    />
                                                    <span className="text-sm text-[#241a10] dark:text-[#f6ecdd]">
                                                        {t(
                                                            SILLAGE_LABELS[
                                                                product.sillage
                                                            ][0],
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}

                            {product.accords && product.accords.length > 0 && (
                                <div className="flex flex-col gap-2.5">
                                    <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                        {t('Аккорды')}
                                    </span>
                                    <div className="flex flex-col gap-2">
                                        {product.accords.map((accord) => (
                                            <div
                                                key={accord.name}
                                                className="flex items-center gap-3"
                                            >
                                                <span className="w-36 shrink-0 text-sm text-[#241a10] dark:text-[#f6ecdd]">
                                                    {t(accord.name)}
                                                </span>
                                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e6d7bb] dark:bg-[#ffffff1a]">
                                                    <div
                                                        className="h-full rounded-full bg-[#c79a5f]"
                                                        style={{
                                                            width: `${accord.percent}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(product.top_notes ||
                                product.heart_notes ||
                                product.base_notes) && (
                                <div className="grid gap-6 sm:grid-cols-3">
                                    {[
                                        ['Верхние ноты', product.top_notes],
                                        ['Средние ноты', product.heart_notes],
                                        ['Базовые ноты', product.base_notes],
                                    ].map(
                                        ([label, notes]) =>
                                            notes &&
                                            notes.length > 0 && (
                                                <div
                                                    key={label}
                                                    className="flex flex-col gap-2"
                                                >
                                                    <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                                        {t(label)}
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {notes.map((note) => (
                                                            <span
                                                                key={note}
                                                                className="rounded-full border border-[#e6d7bb] bg-[#fbf5ea] px-3 py-1 text-xs text-[#7d6952] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#b7a58f]"
                                                            >
                                                                {t(note)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ),
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-12 flex flex-col gap-6">
                        <h2 className="text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {t('Отзывы')}
                        </h2>

                        {auth.user ? (
                            <form
                                onSubmit={submitReview}
                                className="flex flex-col gap-3 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-5 dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
                            >
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setRating(n)}
                                            aria-label={t('{n} из 5', { n })}
                                            className="p-0.5"
                                        >
                                            <svg
                                                width="22"
                                                height="22"
                                                viewBox="0 0 24 24"
                                                fill={
                                                    n <= rating
                                                        ? '#c79a5f'
                                                        : 'none'
                                                }
                                                stroke="#c79a5f"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder={t(
                                        'Поделитесь впечатлением от аромата',
                                    )}
                                    minLength={10}
                                    maxLength={2000}
                                    required
                                    rows={3}
                                    className="rounded-xl border border-[#e6d7bb] bg-transparent p-3 text-sm text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                                />
                                <div className="flex items-center gap-3">
                                    <button
                                        type="submit"
                                        className="rounded-full bg-[#c5aa86] px-5 py-2 text-sm font-bold text-[#3d2712] uppercase dark:bg-[#c79a5f]"
                                    >
                                        {myReview
                                            ? t('Обновить отзыв')
                                            : t('Оставить отзыв')}
                                    </button>
                                    {myReview && (
                                        <button
                                            type="button"
                                            onClick={deleteReview}
                                            className="text-sm text-[#7d6952] underline dark:text-[#b7a58f]"
                                        >
                                            {t('Удалить')}
                                        </button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                <Link href="/login" className="underline">
                                    {t('Войдите')}
                                </Link>
                                {t(', чтобы оставить отзыв.')}
                            </p>
                        )}

                        {product.reviews.length === 0 ? (
                            <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {t('Пока нет отзывов — будьте первым.')}
                            </p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {product.reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="rounded-2xl border border-[#1e160c14] p-5 dark:border-[#ffffff14]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                                {review.user.name}
                                            </span>
                                            <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                                {formatDate(
                                                    review.created_at,
                                                    t,
                                                )}
                                            </span>
                                        </div>
                                        <StarRating
                                            value={review.rating}
                                            size={12}
                                        />
                                        <p className="mt-2 text-sm leading-relaxed text-[#7d6952] dark:text-[#b7a58f]">
                                            {review.body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
