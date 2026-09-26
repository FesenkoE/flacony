import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    dangerButtonClass,
    fieldClass,
    panelClass,
    secondaryButtonClass,
    submitClass,
} from '@/components/brand-auth';
import ConfirmButton from '@/components/confirm-button';
import OrderStatusBadge from '@/components/order-status-badge';
import OrderTimeline from '@/components/order-timeline';
import { formatDateTime } from '@/lib/format-date';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

// What a decant seller can do with their own order, step by step.
function SellerActions({ order }) {
    const t = useTranslations();
    const [tracking, setTracking] = useState('');
    const setStatus = (status, extra = {}) =>
        router.post(
            `/orders/${order.id}/status`,
            { status, ...extra },
            { preserveScroll: true },
        );
    const canCancel = ['new', 'confirmed'].includes(order.status);

    if (!['new', 'confirmed', 'shipped'].includes(order.status)) {
        return null;
    }

    return (
        <div className={`mb-6 flex flex-col gap-3 p-4 ${panelClass}`}>
            <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                {t('Ваша продажа')}
            </span>

            {order.status === 'new' && (
                <p className="text-sm text-[#241a10] dark:text-[#f6ecdd]">
                    {t(
                        'Подтвердите заказ, когда будете готовы отправить распив.',
                    )}
                </p>
            )}

            {order.status === 'confirmed' && (
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="tracking_number"
                        className="text-sm text-[#241a10] dark:text-[#f6ecdd]"
                    >
                        {t('Номер ТТН Новой Почты')}
                    </label>
                    <input
                        id="tracking_number"
                        value={tracking}
                        onChange={(e) => setTracking(e.target.value)}
                        inputMode="numeric"
                        placeholder="20450000000000"
                        className={fieldClass}
                    />
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
                {order.status === 'new' && (
                    <button
                        type="button"
                        onClick={() => setStatus('confirmed')}
                        className={cn(submitClass, 'mt-0 px-5 py-2.5')}
                    >
                        {t('Подтвердить')}
                    </button>
                )}
                {order.status === 'confirmed' && (
                    <button
                        type="button"
                        disabled={!tracking.trim()}
                        onClick={() =>
                            setStatus('shipped', {
                                tracking_number: tracking.trim(),
                            })
                        }
                        className={cn(submitClass, 'mt-0 px-5 py-2.5')}
                    >
                        {t('Отправлено')}
                    </button>
                )}
                {order.status === 'shipped' && (
                    <button
                        type="button"
                        onClick={() => setStatus('delivered')}
                        className={secondaryButtonClass}
                    >
                        {t('Покупатель получил')}
                    </button>
                )}
                {canCancel && (
                    <ConfirmButton
                        label={t('Отменить заказ')}
                        title={t('Отменить заказ №{id}?', { id: order.id })}
                        description={t(
                            'Мл вернутся в ваш лот, покупатель получит письмо об отмене.',
                        )}
                        confirmLabel={t('Отменить заказ')}
                        onConfirm={() => setStatus('cancelled')}
                        className={dangerButtonClass}
                    />
                )}
            </div>
        </div>
    );
}

export default function OrderShow({
    order,
    isSeller,
    siblingOrders,
    deliveryMethodLabel,
    paymentMethodLabel,
}) {
    const t = useTranslations();
    const { auth } = usePage().props;
    const heading = {
        new: 'Заказ №{id} принят',
        confirmed: 'Заказ №{id} подтверждён',
        shipped: 'Заказ №{id} отправлен',
        delivered: 'Заказ №{id} доставлен',
        cancelled: 'Заказ №{id} отменён',
    }[order.status];
    const hint = {
        new: 'Скоро свяжемся, чтобы подтвердить заказ.',
        confirmed: 'Собираем заказ — напишем, когда отправим.',
        shipped: 'Заказ уже в пути.',
    }[order.status];

    return (
        <>
            <Head title={t('Заказ №{id}', { id: order.id })} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-2xl p-6">
                    <div className="mb-6 flex flex-col items-center gap-3 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-8 text-center dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                        {order.status !== 'cancelled' && (
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#c79a5f"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        )}
                        <h1 className="font-display text-2xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                            {t(heading ?? 'Заказ №{id}', { id: order.id })}
                        </h1>
                        {hint && !isSeller && (
                            <p className="text-sm text-[#241a10] dark:text-[#f6ecdd]">
                                {t(hint)}
                            </p>
                        )}
                        <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            {formatDateTime(order.created_at, t)} ·{' '}
                            {paymentMethodLabel}
                        </p>
                        {order.seller && !isSeller && (
                            <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {t('Отправитель: {name} (распив)', {
                                    name: order.seller.name,
                                })}
                            </p>
                        )}
                    </div>

                    <div className="mb-6 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-6 dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                        <OrderTimeline order={order} />
                    </div>

                    {isSeller && <SellerActions order={order} />}

                    {siblingOrders.length > 0 && (
                        <div
                            className={`mb-6 flex flex-col gap-2 p-4 ${panelClass}`}
                        >
                            <span className="text-sm text-[#241a10] dark:text-[#f6ecdd]">
                                {t(
                                    'Корзину отправляют разные отправители, поэтому она разделена на несколько заказов:',
                                )}
                            </span>
                            {siblingOrders.map((sibling) => (
                                <Link
                                    key={sibling.id}
                                    href={sibling.url}
                                    className="flex items-center justify-between gap-3 text-sm"
                                >
                                    <span className="font-semibold text-[#241a10] underline decoration-[#c79a5f] underline-offset-4 dark:text-[#f6ecdd]">
                                        {t('Заказ №{id}', { id: sibling.id })} ·{' '}
                                        {sibling.seller
                                            ? t('{name} (распив)', {
                                                  name: sibling.seller.name,
                                              })
                                            : 'Flacony'}
                                    </span>
                                    <OrderStatusBadge status={sibling.status} />
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-4 dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-baseline justify-between text-sm"
                            >
                                <span className="text-[#241a10] dark:text-[#f6ecdd]">
                                    {item.brand_name} — {item.product_name}
                                    <span className="text-[#7d6952] dark:text-[#b7a58f]">
                                        {' '}
                                        · {item.detail}
                                    </span>
                                </span>
                                <span className="shrink-0 font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                    {Number(item.subtotal).toFixed(2)} ₴
                                </span>
                            </div>
                        ))}
                        {Number(order.discount_amount) > 0 && (
                            <div className="flex items-baseline justify-between text-sm">
                                <span className="text-[#7d6952] dark:text-[#b7a58f]">
                                    {t('Скидка по промокоду {code}', {
                                        code: order.promo_code,
                                    })}
                                </span>
                                <span className="font-semibold text-[#c79a5f]">
                                    −{Number(order.discount_amount).toFixed(2)}{' '}
                                    ₴
                                </span>
                            </div>
                        )}
                        <div className="mt-1 flex items-baseline justify-between border-t border-[#1e160c14] pt-2 dark:border-[#ffffff1a]">
                            <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {t('Итого')}
                            </span>
                            <span className="font-display text-xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                {Number(order.total).toFixed(2)} ₴
                            </span>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-col gap-1 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-4 text-sm dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                        <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                            {t('Доставка')}
                        </span>
                        <span className="text-[#241a10] dark:text-[#f6ecdd]">
                            {order.name} · {order.phone} · {order.email}
                        </span>
                        <span className="text-[#241a10] dark:text-[#f6ecdd]">
                            {deliveryMethodLabel} · {order.city},{' '}
                            {order.address}
                        </span>
                        {order.promo_code && (
                            <span className="text-[#241a10] dark:text-[#f6ecdd]">
                                {t('Промокод: {code}', {
                                    code: order.promo_code,
                                })}
                            </span>
                        )}
                        {order.comment && (
                            <span className="text-[#241a10] dark:text-[#f6ecdd]">
                                {t('Комментарий: {comment}', {
                                    comment: order.comment,
                                })}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-center gap-4">
                        {auth.user && (
                            <Link
                                href="/dashboard"
                                className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                            >
                                {t('Личный кабинет')}
                            </Link>
                        )}
                        <Link
                            href="/products"
                            className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                        >
                            {t('Продолжить покупки')}
                        </Link>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
