import { Head, Link } from '@inertiajs/react';
import OrderStatusBadge from '@/components/order-status-badge';
import { formatDateTime } from '@/lib/format-date';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

export default function OrderShow({
    order,
    deliveryMethodLabel,
    paymentMethodLabel,
}) {
    const t = useTranslations();
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
                        <OrderStatusBadge status={order.status} />
                        <h1 className="font-display text-2xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                            {t(heading ?? 'Заказ №{id}', { id: order.id })}
                        </h1>
                        {hint && (
                            <p className="text-sm text-[#241a10] dark:text-[#f6ecdd]">
                                {t(hint)}
                            </p>
                        )}
                        {order.tracking_number && (
                            <a
                                href={`https://tracking.novaposhta.ua/#/uk/${encodeURIComponent(order.tracking_number)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-semibold text-[#241a10] underline decoration-[#c79a5f] underline-offset-4 dark:text-[#f6ecdd]"
                            >
                                {t('ТТН {ttn} — отследить на сайте Новой Почты', {
                                    ttn: order.tracking_number,
                                })}
                            </a>
                        )}
                        <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            {formatDateTime(order.created_at, t)} ·{' '}
                            {paymentMethodLabel}
                        </p>
                    </div>

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
                        <Link
                            href="/dashboard"
                            className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                        >
                            {t('Личный кабинет')}
                        </Link>
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
