import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import BottleIcon, { tintForId } from '@/components/bottle-icon';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useAddToCart } from '@/hooks/use-add-to-cart';

export default function ProductShow({ product }) {
    const [variantIndex, setVariantIndex] = useState(0);
    const { added, addToCart } = useAddToCart();
    const variant = product.variants[variantIndex];

    return (
        <>
            <Head title={`${product.brand.name} — ${product.name}`} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-4xl p-6">
                    <Link
                        href="/products"
                        className="text-sm text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← Каталог
                    </Link>

                    <div className="mt-6 grid gap-8 md:grid-cols-2">
                        <div className="scent-card-photo flex aspect-square items-center justify-center rounded-3xl">
                            <BottleIcon size={160} tint={tintForId(product.id)} />
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold tracking-[0.18em] text-[#bf8438] uppercase">
                                    {product.brand.name}
                                </span>
                                <h1 className="font-display text-5xl leading-none font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                    {product.name}
                                </h1>
                                <div className="mt-1 h-0.5 w-9 rounded-full bg-[#bf8438]" />
                            </div>

                            {product.description && (
                                <p className="text-sm leading-relaxed text-[#8a7860] dark:text-[#b7a58f]">
                                    {product.description}
                                </p>
                            )}

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
                                                    'flex min-w-[72px] flex-col items-center gap-0.5 rounded-2xl border px-4 py-3 text-sm font-semibold ' +
                                                    (selected
                                                        ? 'border-[#bf8438] bg-[#bf843829] text-[#241a10] dark:text-[#f6ecdd]'
                                                        : 'border-[#e6d7bb] bg-[#fbf5ea] text-[#8a7860] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#b7a58f]')
                                                }
                                            >
                                                <span>{v.volume_ml} мл</span>
                                                <span className="text-[11px] font-medium opacity-75">
                                                    {Number(v.price).toFixed(2)} ₴
                                                </span>
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
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
