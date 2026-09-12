import { Head } from '@inertiajs/react';
import ProductCard from '@/components/product-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useFlipList } from '@/hooks/use-flip-list';

export default function FavoritesIndex({ products }) {
    const listRef = useFlipList([products.length]);

    return (
        <>
            <Head title="Избранное" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-6xl p-6">
                    <h1 className="mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Избранное
                    </h1>

                    {products.length === 0 ? (
                        <p className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                            Пока пусто — добавляйте товары сердечком в каталоге.
                        </p>
                    ) : (
                        <div
                            ref={listRef}
                            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
            </div>
            <SiteFooter />
        </>
    );
}
