import { Head, Link, router } from '@inertiajs/react';
import LotCard from '@/components/lot-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

export default function LotsIndex({ lots, brands, filters }) {
    const t = useTranslations();
    const selectedBrands = filters.brand ?? [];

    function toggleBrand(brand) {
        const next = selectedBrands.includes(brand)
            ? selectedBrands.filter((b) => b !== brand)
            : [...selectedBrands, brand];
        router.get(
            '/lots',
            { brand: next },
            { preserveState: true, preserveScroll: true },
        );
    }

    return (
        <>
            <Head title={t('Розпив')} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] p-6">
                    <h1 className="mb-2 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Розпив')}
                    </h1>
                    <p className="mb-6 text-sm text-[#7d6952] dark:text-[#b7a58f]">
                        {t(
                            'Флаконы от других покупателей — от нескольких мл на попробовать',
                        )}
                    </p>

                    {brands.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
                            <Link
                                href="/lots"
                                className={
                                    'rounded-full border px-4 py-1.5 text-sm font-medium ' +
                                    (selectedBrands.length === 0
                                        ? 'border-[#c79a5f] bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]'
                                        : 'border-[#e6d7bb] text-[#7d6952] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                                }
                            >
                                {t('Все бренды')}
                            </Link>
                            {brands.map((brand) => (
                                <button
                                    key={brand}
                                    type="button"
                                    onClick={() => toggleBrand(brand)}
                                    className={
                                        'rounded-full border px-4 py-1.5 text-sm font-medium ' +
                                        (selectedBrands.includes(brand)
                                            ? 'border-[#c79a5f] bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]'
                                            : 'border-[#e6d7bb] text-[#7d6952] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                                    }
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    )}

                    {lots.data.length === 0 ? (
                        <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            {t('Пока никто не выставил распив на продажу.')}
                        </p>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
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
                                            ? 'border-[#c79a5f] bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]'
                                            : 'border-[#e6d7bb] text-[#7d6952] dark:border-[#ffffff29] dark:text-[#b7a58f]') +
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
