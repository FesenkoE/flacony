import { Head, Link } from '@inertiajs/react';
import LotCard from '@/components/lot-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

function buildUrl(filters, overrides) {
    const params = new URLSearchParams();
    Object.entries({ ...filters, ...overrides }).forEach(([key, value]) => {
        if (value) params.set(key, value);
    });
    const query = params.toString();
    return query ? `/lots?${query}` : '/lots';
}

export default function LotsIndex({ lots, brands, filters }) {
    return (
        <>
            <Head title="Розпив" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] p-6">
                    <h1 className="mb-2 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Розпив
                    </h1>
                    <p className="mb-6 text-sm text-[#8a7860] dark:text-[#b7a58f]">
                        Флаконы от других покупателей — от нескольких мл на
                        попробовать
                    </p>

                    {brands.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
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
                                    key={brand}
                                    href={buildUrl(filters, { brand })}
                                    className={
                                        'rounded-full border px-4 py-1.5 text-sm font-medium ' +
                                        (filters.brand === brand
                                            ? 'border-[#bf8438] bg-[#bf843829] text-[#241a10] dark:text-[#f6ecdd]'
                                            : 'border-[#e6d7bb] text-[#8a7860] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                                    }
                                >
                                    {brand}
                                </Link>
                            ))}
                        </div>
                    )}

                    {lots.data.length === 0 ? (
                        <p className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                            Пока никто не выставил распив на продажу.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {lots.data.map((lot) => (
                                <LotCard key={lot.id} lot={lot} />
                            ))}
                        </div>
                    )}

                    {lots.last_page > 1 && (
                        <div className="mt-8 flex flex-wrap gap-2">
                            {lots.links.map((link, i) => (
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
