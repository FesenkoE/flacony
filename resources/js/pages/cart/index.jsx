import { Head, Link, usePage } from '@inertiajs/react';
import { useConfirmDelete } from '@/hooks/use-confirm-delete';
import { useFlipList } from '@/hooks/use-flip-list';
import BottleIcon from '@/components/bottle-icon';
import ConfirmButton from '@/components/confirm-button';
import DissolveCard from '@/components/dissolve-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

function CartRow({ item, t }) {
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
                <span className="text-xs font-bold tracking-[0.1em] text-[#c79a5f] uppercase">
                    {item.brand_name}
                    {item.type === 'lot' && ` · ${t('Розпив')}`}
                </span>
                <span className="font-display text-xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                    {item.product_name}
                </span>
                <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                    {item.detail}
                </span>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="font-display text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                    {Number(item.subtotal).toFixed(2)} ₴
                </span>
                <ConfirmButton
                    title={t('Убрать «{name}» из корзины?', {
                        name: item.product_name,
                    })}
                    onConfirm={remove}
                />
            </div>
        </DissolveCard>
    );
}

export default function CartIndex({ items, total }) {
    const t = useTranslations();
    const listRef = useFlipList([items.length]);
    const { auth } = usePage().props;

    return (
        <>
            <Head title={t('Корзина')} />
            <div className="flex min-h-screen flex-col bg-[#f6efe3] dark:bg-[#0d0b09]">
                <SiteHeader />
                <div className="mx-auto w-full max-w-2xl flex-1 p-6">
                    <Link
                        href="/products"
                        className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← {t('Каталог')}
                    </Link>

                    <h1 className="mt-4 mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Корзина')}
                    </h1>

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#1e160c14] bg-[#fffaf1] px-6 py-20 text-center dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                            <BottleIcon size={102} />
                            <h2 className="font-display text-2xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                {t('Корзина пуста')}
                            </h2>
                            <p className="max-w-sm text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {t(
                                    'Выбери аромат из каталога или возьми на пробу пару мл распива — здесь появится сводка заказа',
                                )}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href="/products"
                                    className="rounded-full bg-[#c79a5f] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
                                >
                                    {t('Смотреть каталог')}
                                </Link>
                                <Link
                                    href="/lots"
                                    className="rounded-full border border-[#e6d7bb] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#241a10] uppercase dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                                >
                                    {t('Розпив')}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div ref={listRef} className="flex flex-col gap-4">
                            {items.map((item) => (
                                <CartRow
                                    key={`${item.type}-${item.key}`}
                                    item={item}
                                    t={t}
                                />
                            ))}

                            <div className="mt-2 flex items-baseline justify-between border-t border-[#1e160c14] pt-4 dark:border-[#ffffff1a]">
                                <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                    {t('Итого')}
                                </span>
                                <span className="font-display text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                    {Number(total).toFixed(2)} ₴
                                </span>
                            </div>

                            <Link
                                href={auth.user ? '/checkout' : '/login'}
                                className="mt-2 rounded-full bg-[#c79a5f] px-7 py-3.5 text-center text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
                            >
                                {auth.user
                                    ? t('Оформить заказ')
                                    : t('Войти, чтобы оформить заказ')}
                            </Link>
                        </div>
                    )}
                </div>
                <SiteFooter />
            </div>
        </>
    );
}
