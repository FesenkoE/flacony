import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import LotCard from '@/components/lot-card';
import ProductCard from '@/components/product-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

export default function SearchIndex({ query, products, lots, brands }) {
    const t = useTranslations();
    const [value, setValue] = useState(query);

    function submit(e) {
        e.preventDefault();
        router.get('/search', { q: value }, { preserveState: true });
    }

    function searchFor(term) {
        setValue(term);
        router.get('/search', { q: term }, { preserveState: true });
    }

    const hasResults = products.length > 0 || lots.length > 0;

    return (
        <>
            <Head title={query ? t('Поиск: {query}', { query }) : t('Поиск')} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] p-6">
                    <h1 className="mb-1 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Поиск')}
                    </h1>
                    <p className="mb-6 text-sm text-[#7d6952] dark:text-[#b7a58f]">
                        {t(
                            'Ищем сразу по официальному каталогу и лотам распива.',
                        )}
                    </p>

                    <form onSubmit={submit} className="mb-8 flex gap-2">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={t('Аромат, бренд, нота...')}
                            autoFocus
                            className="w-full max-w-md rounded-full border border-[#e6d7bb] bg-transparent px-4 py-2.5 text-sm text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                        />
                        <button
                            type="submit"
                            className="rounded-full bg-[#b3864d] dark:bg-[#c79a5f] px-5 py-2.5 text-sm font-bold text-[#3d2712] uppercase"
                        >
                            {t('Найти')}
                        </button>
                    </form>

                    {query === '' ? (
                        <div className="flex flex-col gap-3">
                            <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                {t('Или ищите по бренду')}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {brands.map((brand) => (
                                    <button
                                        key={brand}
                                        type="button"
                                        onClick={() => searchFor(brand)}
                                        className="rounded-full border border-[#e6d7bb] px-4 py-1.5 text-sm font-medium text-[#7d6952] dark:border-[#ffffff29] dark:text-[#b7a58f]"
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : !hasResults ? (
                        <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            {t('По запросу «{query}» ничего не нашлось.', {
                                query,
                            })}
                        </p>
                    ) : (
                        <div className="flex flex-col gap-10">
                            {products.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                        {t('Каталог')}
                                    </h2>
                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
                                        {products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {lots.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                        {t('Розпив')}
                                    </h2>
                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
                                        {lots.map((lot) => (
                                            <LotCard key={lot.id} lot={lot} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
