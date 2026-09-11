import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import BottleIcon, { tintForId } from '@/components/bottle-icon';
import StarRating from '@/components/star-rating';
import { useAddToCart } from '@/hooks/use-add-to-cart';

export default function ProductCard({ product }) {
    const [variantIndex, setVariantIndex] = useState(0);
    const { added, addToCart } = useAddToCart();
    const { auth, favoriteProductIds } = usePage().props;
    const variant = product.variants[variantIndex];
    const isFavorited = favoriteProductIds.includes(product.id);

    function toggleFavorite(e) {
        e.preventDefault();
        if (!auth.user) {
            router.visit('/login');
            return;
        }
        router.post(
            `/favorites/${product.id}`,
            {},
            { preserveScroll: true, preserveState: true },
        );
    }

    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#1e160c14] bg-[#fffaf1] shadow-[0_24px_48px_-24px_rgba(60,44,20,0.28)] dark:border-[#ffffff14] dark:bg-[#ffffff0a] dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] dark:backdrop-blur-lg">
            <button
                type="button"
                onClick={toggleFavorite}
                aria-label={
                    isFavorited ? 'Убрать из избранного' : 'В избранное'
                }
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#ffffffcc] text-[#241a10] shadow-sm dark:bg-[#00000066] dark:text-[#f6ecdd]"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isFavorited ? '#bf8438' : 'none'}
                    stroke={isFavorited ? '#bf8438' : 'currentColor'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
            </button>
            <Link href={`/products/${product.slug}`} className="block">
                <div className="scent-card-photo flex aspect-square items-center justify-center overflow-hidden">
                    {product.image_path ? (
                        <img
                            src={`/storage/${product.image_path}`}
                            alt={`${product.brand.name} ${product.name}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <BottleIcon tint={tintForId(product.id)} />
                    )}
                </div>

                <div className="flex flex-col gap-1.5 p-6 pb-3">
                    <span className="text-xs font-bold tracking-[0.18em] text-[#bf8438] uppercase">
                        {product.brand.name}
                    </span>
                    <h3 className="font-display text-[34px] leading-none font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                        {product.name}
                    </h3>
                    <div className="mt-0.5 h-0.5 w-7 rounded-full bg-[#bf8438]" />
                    {product.reviews_count > 0 && (
                        <div className="mt-1 flex items-center gap-1.5">
                            <StarRating
                                value={product.reviews_avg_rating}
                                size={12}
                            />
                            <span className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
                                ({product.reviews_count})
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="mt-auto flex flex-col gap-3.5 px-6 pb-6">
                <div className="h-px bg-[#1e160c14] dark:bg-[#ffffff1a]" />

                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold tracking-[0.1em] text-[#8a7860] uppercase dark:text-[#b7a58f]">
                        Объём
                    </span>
                    <div className="flex gap-2.5">
                        {product.variants.map((v, i) => {
                            const selected = i === variantIndex;
                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => setVariantIndex(i)}
                                    className={
                                        'rounded-2xl border px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap ' +
                                        (selected
                                            ? 'border-[#bf8438] bg-[#bf843829] text-[#241a10] dark:text-[#f6ecdd]'
                                            : 'border-[#e6d7bb] bg-[#fbf5ea] text-[#8a7860] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#b7a58f]')
                                    }
                                >
                                    {v.volume_ml} мл
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-1 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                        <span className="font-display text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {Number(variant.price).toFixed(2)} ₴
                        </span>
                        <span className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
                            {variant.volume_ml} мл
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => addToCart(variant.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#bf8438] px-5 py-3.5 text-sm font-bold tracking-[0.04em] text-[#241a10] uppercase dark:text-[#1c1408]"
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
                        <span>{added ? 'Добавлено' : 'В корзину'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
