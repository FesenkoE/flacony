import { Head, Link } from '@inertiajs/react';
import BottleIcon from '@/components/bottle-icon';
import ProductCard from '@/components/product-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useFlipList } from '@/hooks/use-flip-list';
import { useTranslations } from '@/hooks/use-translations';

export default function FavoritesIndex({ products }) {
    const t = useTranslations();
    const listRef = useFlipList([products.length]);

    return (
        <>
            <Head title={t('Избранное')} />
            <div className="flex min-h-screen flex-col bg-[#f6efe3] dark:bg-[#0d0b09]">
                <SiteHeader />
                <div className="mx-auto w-full max-w-[1600px] flex-1 p-6">
                    <h1 className="mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Избранное')}
                    </h1>

                    {products.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#1e160c14] bg-[#fffaf1] px-6 py-20 text-center dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                            <BottleIcon size={102} />
                            <h2 className="font-display text-2xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                {t('Пока пусто')}
                            </h2>
                            <p className="max-w-sm text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {t(
                                    'Добавляй ароматы сердечком в каталоге — здесь будет твой список желаний',
                                )}
                            </p>
                            <Link
                                href="/products"
                                className="mt-2 rounded-full bg-[#c79a5f] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
                            >
                                {t('Смотреть каталог')}
                            </Link>
                        </div>
                    ) : (
                        <div
                            ref={listRef}
                            className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6"
                        >
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    dissolveOnUnfavorite
                                    flipKey={product.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <SiteFooter />
            </div>
        </>
    );
}
