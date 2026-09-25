import { Head, Link, usePage } from '@inertiajs/react';
import { useConfirmDelete } from '@/hooks/use-confirm-delete';
import { useFlipList } from '@/hooks/use-flip-list';
import ConfirmButton from '@/components/confirm-button';
import DissolveCard from '@/components/dissolve-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import OrderStatusBadge from '@/components/order-status-badge';
import { formatDate } from '@/lib/format-date';
import { useTranslations } from '@/hooks/use-translations';

const actionButtonBase =
    'flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ease-out hover:scale-110 active:scale-95';

const viewButtonClass =
    actionButtonBase +
    ' border-[#e6d7bb] text-[#7d6952] hover:border-[#6d9b8f] hover:bg-[#6d9b8f1a] hover:text-[#4f7a6f] dark:border-[#ffffff29] dark:text-[#b7a58f] dark:hover:border-[#8fc4b6] dark:hover:bg-[#8fc4b61a] dark:hover:text-[#8fc4b6]';

const editButtonClass =
    actionButtonBase +
    ' border-[#c79a5f] text-[#c79a5f] hover:bg-[#c79a5f] hover:text-[#3d2712]';

const deleteButtonClass =
    actionButtonBase +
    ' border-[#c0645a] text-[#c0645a] hover:bg-[#c0645a] hover:text-[#fdf3f1]';

const iconProps = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

function EyeIcon() {
    return (
        <svg {...iconProps}>
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function PencilIcon() {
    return (
        <svg {...iconProps}>
            <path d="M17 3a2.83 2.83 0 0 1 4 4L7 21l-4 1 1-4Z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg {...iconProps}>
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
    );
}

function LotStatusBadge({ lot, t }) {
    if (lot.status === 'pending') {
        return (
            <span className="w-fit rounded-full bg-[#c79a5f29] px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.04em] text-[#8a6a3a] uppercase dark:text-[#e0bd85]">
                {t('На модерации')}
            </span>
        );
    }

    if (lot.status === 'rejected') {
        return (
            <span
                className="w-fit rounded-full bg-[#c0645a29] px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.04em] text-[#c0645a] uppercase"
                title={lot.rejection_reason ?? undefined}
            >
                {t('Отклонён')}
            </span>
        );
    }

    return null;
}

function LotRow({ lot, t }) {
    const { removing, remove } = useConfirmDelete(`/sellers/lots/${lot.id}`);

    return (
        <DissolveCard
            active={removing}
            data-flip-key={lot.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-4 dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
        >
            <div className="flex flex-col gap-1">
                <span className="text-xs font-bold tracking-[0.1em] text-[#c79a5f] uppercase">
                    {lot.brand_name}
                </span>
                <span className="font-display text-lg font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                    {lot.product_name}
                </span>
                <LotStatusBadge lot={lot} t={t} />
                {lot.status === 'rejected' && lot.rejection_reason && (
                    <span className="text-xs text-[#c0645a]">
                        {lot.rejection_reason}
                    </span>
                )}
                <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                    {t('Остаток {remaining} из {total} мл · {price} ₴/мл', {
                        remaining: lot.remaining_volume_ml,
                        total: lot.total_volume_ml,
                        price: Number(lot.price_per_ml).toFixed(2),
                    })}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Link
                    href={`/sellers/lots/${lot.id}`}
                    title={t('Посмотреть')}
                    aria-label={t('Посмотреть')}
                    className={viewButtonClass}
                >
                    <EyeIcon />
                </Link>
                <Link
                    href={`/sellers/lots/${lot.id}/edit`}
                    title={t('Редактировать')}
                    aria-label={t('Редактировать')}
                    className={editButtonClass}
                >
                    <PencilIcon />
                </Link>
                <ConfirmButton
                    label={t('Удалить')}
                    icon={<TrashIcon />}
                    title={t('Удалить лот «{name}»?', {
                        name: lot.product_name,
                    })}
                    onConfirm={remove}
                    className={deleteButtonClass}
                />
            </div>
        </DissolveCard>
    );
}

export default function AccountIndex({ lots, orders, sales, activeTab }) {
    const t = useTranslations();
    const newSales = sales.filter((sale) => sale.status === 'new').length;
    const tabs = [
        { key: 'orders', label: t('Мои заказы') },
        // Only sellers who've actually sold something need this tab.
        ...(sales.length > 0
            ? [
                  {
                      key: 'sales',
                      label: t('Мои продажи'),
                      // Sales waiting for the seller to confirm them.
                      badge: newSales || null,
                  },
              ]
            : []),
        { key: 'lots', label: t('Мои лоты') },
    ];
    const { auth } = usePage().props;
    const listRef = useFlipList([lots.length]);

    return (
        <>
            <Head title={t('Личный кабинет')} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-4xl p-6">
                    <h1 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Личный кабинет')}
                    </h1>
                    <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-sm">
                        <span className="text-[#7d6952] dark:text-[#b7a58f]">
                            {auth.user.name} · {auth.user.email}
                        </span>
                        <span className="flex gap-5">
                            <Link
                                href="/settings/profile"
                                className="font-semibold text-[#241a10] underline decoration-[#c79a5f] underline-offset-4 dark:text-[#f6ecdd]"
                            >
                                {t('Настройки')}
                            </Link>
                            <Link
                                href={`/sellers/${auth.user.id}`}
                                className="font-semibold text-[#241a10] underline decoration-[#c79a5f] underline-offset-4 dark:text-[#f6ecdd]"
                            >
                                {t('Моя витрина')}
                            </Link>
                        </span>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.key}
                                href={`/dashboard?tab=${tab.key}`}
                                preserveScroll
                                className={
                                    'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ' +
                                    (activeTab === tab.key
                                        ? 'border-[#c79a5f] bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]'
                                        : 'border-[#e6d7bb] text-[#7d6952] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                                }
                            >
                                {tab.label}
                                {tab.badge && (
                                    <span className="rounded-full bg-[#c79a5f] px-2 py-0.5 text-[11px] font-bold text-[#3d2712]">
                                        {tab.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {activeTab === 'orders' && (
                        <>
                            {orders.length === 0 ? (
                                <p className="mt-4 text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                    {t('Ты ещё не оформлял заказы.')}
                                </p>
                            ) : (
                                <div className="mt-4 flex flex-col gap-3">
                                    {orders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={`/orders/${order.id}`}
                                            className="flex items-center justify-between gap-4 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-4 dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="font-display text-lg font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                                    {t('Заказ №{id}', {
                                                        id: order.id,
                                                    })}
                                                </span>
                                                <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                                    {formatDate(order.created_at, t)}
                                                    {order.seller &&
                                                        ` · ${t('{name} (распив)', {
                                                            name: order.seller.name,
                                                        })}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <OrderStatusBadge
                                                    status={order.status}
                                                />
                                                <span className="font-display text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                                    {Number(order.total).toFixed(2)} ₴
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'sales' && (
                        <>
                            <div className="mt-4 flex flex-col gap-3">
                                {sales.map((sale) => (
                                    <Link
                                        key={sale.id}
                                        href={`/orders/${sale.id}`}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-4 dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="font-display text-lg font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                                {t('Заказ №{id}', {
                                                    id: sale.id,
                                                })}
                                            </span>
                                            <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                                {sale.name} ·{' '}
                                                {formatDate(sale.created_at, t)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <OrderStatusBadge
                                                status={sale.status}
                                            />
                                            <span className="font-display text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                                {Number(sale.total).toFixed(2)}{' '}
                                                ₴
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'lots' && (
                        <>
                            <div className="mt-6 flex justify-end">
                                <Link
                                    href="/sellers/lots/create"
                                    className="rounded-full bg-[#c5aa86] dark:bg-[#c79a5f] px-5 py-2.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
                                >
                                    + {t('Добавить лот')}
                                </Link>
                            </div>

                            {lots.length === 0 ? (
                                <p className="mt-4 text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                    {t('Ты ещё не выставлял лоты на распив.')}
                                </p>
                            ) : (
                                <div ref={listRef} className="mt-4 flex flex-col gap-3">
                                    {lots.map((lot) => (
                                        <LotRow key={lot.id} lot={lot} t={t} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
