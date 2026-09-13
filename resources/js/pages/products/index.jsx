import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ProductCard from '@/components/product-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

function buildUrl(filters, overrides) {
    const params = new URLSearchParams();
    Object.entries({ ...filters, ...overrides }).forEach(([key, value]) => {
        if (value) params.set(key, value);
    });
    const query = params.toString();
    return query ? `/products?${query}` : '/products';
}

export default function ProductsIndex({
    products,
    brands,
    categories,
    filters,
}) {
    const [minPrice, setMinPrice] = useState(filters.min_price ?? '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price ?? '');

    function applyPriceFilter(e) {
        e.preventDefault();
        router.get(
            '/products',
            {
                ...filters,
                min_price: minPrice || undefined,
                max_price: maxPrice || undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="Каталог" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] p-6">
                    <h1 className="mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Каталог
                    </h1>

                    <div className="mb-6 flex flex-wrap gap-2">
                        <Link
                            href={buildUrl(filters, { brand: undefined })}
                            className={
                                'rounded-full border px-4 py-1.5 text-sm font-medium ' +
                                (!filters.brand
                                    ? 'border-[#bf8438] bg-[#bf843829] text-[#241a10] dark:text-[#f6ecdd]'
                                    : 'border-[#e6d7bb] text-[#8a7860] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                            }
                        >
                            Все бренды
                        </Link>
                        {brands.map((brand) => (
                            <Link
                                key={brand.id}
                                href={buildUrl(filters, { brand: brand.slug })}
                                className={
                                    'rounded-full border px-4 py-1.5 text-sm font-medium ' +
                                    (filters.brand === brand.slug
                                        ? 'border-[#bf8438] bg-[#bf843829] text-[#241a10] dark:text-[#f6ecdd]'
                                        : 'border-[#e6d7bb] text-[#8a7860] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                                }
                            >
                                {brand.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mb-6 flex flex-wrap gap-2">
                        <Link
                            href={buildUrl(filters, { category: undefined })}
                            className={
                                'rounded-full border px-4 py-1.5 text-sm font-medium ' +
                                (!filters.category
                                    ? 'border-[#bf8438] bg-[#bf843829] text-[#241a10] dark:text-[#f6ecdd]'
                                    : 'border-[#e6d7bb] text-[#8a7860] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                            }
                        >
                            Все категории
                        </Link>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={buildUrl(filters, {
                                    category: category.slug,
                                })}
                                className={
                                    'rounded-full border px-4 py-1.5 text-sm font-medium ' +
                                    (filters.category === category.slug
                                        ? 'border-[#bf8438] bg-[#bf843829] text-[#241a10] dark:text-[#f6ecdd]'
                                        : 'border-[#e6d7bb] text-[#8a7860] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                                }
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    <form
                        onSubmit={applyPriceFilter}
                        className="mb-8 flex flex-wrap items-center gap-2"
                    >
                        <span className="text-[11px] font-semibold tracking-[0.1em] text-[#8a7860] uppercase dark:text-[#b7a58f]">
                            Цена, ₴
                        </span>
                        <input
                            type="number"
                            min="0"
                            placeholder="от"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-24 rounded-full border border-[#e6d7bb] bg-transparent px-3.5 py-1.5 text-sm text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                        />
                        <span className="text-[#8a7860] dark:text-[#b7a58f]">
                            —
                        </span>
                        <input
                            type="number"
                            min="0"
                            placeholder="до"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-24 rounded-full border border-[#e6d7bb] bg-transparent px-3.5 py-1.5 text-sm text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                        />
                        <button
                            type="submit"
                            className="rounded-full border border-[#bf8438] px-4 py-1.5 text-sm font-medium text-[#241a10] dark:text-[#f6ecdd]"
                        >
                            Применить
                        </button>
                        {(filters.min_price || filters.max_price) && (
                            <Link
                                href={buildUrl(filters, {
                                    min_price: undefined,
                                    max_price: undefined,
                                })}
                                className="text-sm text-[#8a7860] underline dark:text-[#b7a58f]"
                            >
                                Сбросить
                            </Link>
                        )}
                    </form>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {products.last_page > 1 && (
                        <div className="mt-8 flex flex-wrap gap-2">
                            {products.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={
                                        'rounded-full border px-3.5 py-1.5 text-sm ' +
                                        (link.active
                                            ? 'border-[#bf8438] bg-[#bf843829] text-[#241a10] dark:text-[#f6ecdd]'
                                            : 'border-[#e6d7bb] text-[#8a7860] dark:border-[#ffffff29] dark:text-[#b7a58f]') +
                                        (!link.url
                                            ? ' pointer-events-none opacity-40'
                                            : '')
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
