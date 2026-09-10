import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/components/product-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

export default function ProductsIndex({ products, brands, filters }) {
    return (
        <>
            <Head title="Каталог" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-6xl p-6">
                    <h1 className="mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Каталог
                    </h1>

                    <div className="mb-6 flex flex-wrap gap-2">
                        <Link
                            href="/products"
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
                                href={`/products?brand=${brand.slug}`}
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

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                                        (!link.url ? ' pointer-events-none opacity-40' : '')
                                    }
                                    dangerouslySetInnerHTML={{ __html: link.label }}
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
