import { Head, Link } from '@inertiajs/react';
import { useConfirmDelete } from '@/hooks/use-confirm-delete';
import { useFlipList } from '@/hooks/use-flip-list';
import ConfirmButton from '@/components/confirm-button';
import DissolveCard from '@/components/dissolve-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

function CartRow({ item }) {
    const href =
        item.type === 'lot' ? `/cart/lots/${item.key}` : `/cart/${item.key}`;
    const { removing, remove } = useConfirmDelete(href);

    return (
        <DissolveCard
            active={removing}
            data-flip-key={`${item.type}-${item.key}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-4 dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
        >
            <div className="flex flex-col gap-1">
                <span className="text-xs font-bold tracking-[0.1em] text-[#bf8438] uppercase">
                    {item.brand_name}
                    {item.type === 'lot' && ' · распив'}
                </span>
                <span className="font-display text-xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                    {item.product_name}
                </span>
                <span className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
                    {item.detail}
                </span>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="font-display text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                    {Number(item.subtotal).toFixed(2)} ₴
                </span>
                <ConfirmButton
                    title={`Убрать «${item.product_name}» из корзины?`}
                    onConfirm={remove}
                />
            </div>
        </DissolveCard>
    );
}

export default function CartIndex({ items, total }) {
    const listRef = useFlipList([items.length]);

    return (
        <>
            <Head title="Корзина" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-2xl p-6">
                    <Link
                        href="/products"
                        className="text-sm text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← Каталог
                    </Link>

                    <h1 className="mt-4 mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Корзина
                    </h1>

                    {items.length === 0 ? (
                        <p className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                            Корзина пуста.
                        </p>
                    ) : (
                        <div ref={listRef} className="flex flex-col gap-4">
                            {items.map((item) => (
                                <CartRow
                                    key={`${item.type}-${item.key}`}
                                    item={item}
                                />
                            ))}

                            <div className="mt-2 flex items-baseline justify-between border-t border-[#1e160c14] pt-4 dark:border-[#ffffff1a]">
                                <span className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                                    Итого
                                </span>
                                <span className="font-display text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                    {Number(total).toFixed(2)} ₴
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
