import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import BottleIcon, { tintForId } from '@/components/bottle-icon';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useAddLotToCart } from '@/hooks/use-add-lot-to-cart';
import { useTranslations } from '@/hooks/use-translations';
import { pluralizeRu } from '@/lib/pluralize';

// ponytail: просмотры/покупатели — прототип с выдуманными числами, реальный
// трекинг появится вместе с заказами/аналитикой. Заменить на честные данные,
// когда будет что считать.
function fakeStatsForLot(lotId) {
    return {
        views: 40 + ((lotId * 37) % 260),
        buyers: 1 + ((lotId * 13) % 20),
    };
}

export default function LotShow({ lot, isOwn, sellerLotsCount }) {
    const t = useTranslations();
    const stats = fakeStatsForLot(lot.id);
    const remaining = Number(lot.remaining_volume_ml);
    const total = Number(lot.total_volume_ml);
    const bulkThreshold =
        lot.bulk_threshold_ml !== null ? Number(lot.bulk_threshold_ml) : null;
    const bulkPrice =
        lot.bulk_price_per_ml !== null ? Number(lot.bulk_price_per_ml) : null;
    const pricePerMl = Number(lot.price_per_ml);
    const sold = total - remaining;
    const soldPercent = total > 0 ? Math.round((sold / total) * 100) : 0;

    const maxVolume = Math.max(1, Math.floor(remaining));
    const [volume, setVolume] = useState(Math.min(5, maxVolume));
    const { added, addLotToCart } = useAddLotToCart();

    const effectivePricePerMl =
        bulkThreshold !== null && bulkPrice !== null && volume >= bulkThreshold
            ? bulkPrice
            : pricePerMl;
    const price = (volume * effectivePricePerMl).toFixed(2);
    const projectedRemaining = remaining - volume;

    return (
        <>
            <Head title={`${lot.brand_name} — ${lot.product_name}`} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-4xl p-6">
                    <Link
                        href={`/sellers/${lot.seller.id}`}
                        className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← {t('Витрина {name}', { name: lot.seller.name })}
                    </Link>

                    <div className="mt-6 grid gap-8 md:grid-cols-2">
                        <div className="scent-card-photo flex aspect-square items-center justify-center rounded-3xl">
                            <BottleIcon size={160} tint={tintForId(lot.id)} />
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold tracking-[0.18em] text-[#c79a5f] uppercase">
                                    {lot.brand_name} · {t('Розпив')}
                                </span>
                                <h1 className="font-display text-5xl leading-none font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                    {lot.product_name}
                                </h1>
                            </div>

                            <div className="flex items-center gap-5 text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                <span className="flex items-center gap-1.5">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    {stats.views}{' '}
                                    {t(
                                        pluralizeRu(stats.views, [
                                            'просмотр',
                                            'просмотра',
                                            'просмотров',
                                        ]),
                                    )}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M6 6h15l-1.5 9h-12z" />
                                        <path d="M6 6 5 3H2" />
                                        <circle cx="9" cy="20" r="1" />
                                        <circle cx="18" cy="20" r="1" />
                                    </svg>
                                    {stats.buyers}{' '}
                                    {t(
                                        pluralizeRu(stats.buyers, [
                                            'покупатель',
                                            'покупателя',
                                            'покупателей',
                                        ]),
                                    )}
                                </span>
                            </div>

                            {isOwn ? (
                                <>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6d7bb] dark:bg-[#ffffff1a]">
                                            <div
                                                className="h-full rounded-full bg-[#c79a5f]"
                                                style={{
                                                    width: `${soldPercent}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                            {t(
                                                'Продано {sold} из {total} мл ({percent}%) · {price} ₴/мл',
                                                {
                                                    sold,
                                                    total,
                                                    percent: soldPercent,
                                                    price: pricePerMl.toFixed(
                                                        2,
                                                    ),
                                                },
                                            )}
                                            {bulkThreshold !== null &&
                                                bulkPrice !== null &&
                                                ' ' +
                                                    t(
                                                        '· от {threshold} мл — {price} ₴/мл',
                                                        {
                                                            threshold:
                                                                bulkThreshold,
                                                            price: bulkPrice.toFixed(
                                                                2,
                                                            ),
                                                        },
                                                    )}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex items-center gap-3">
                                        <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                            {t('Остаток {remaining} мл', {
                                                remaining,
                                            })}
                                        </span>
                                        <Link
                                            href={`/sellers/lots/${lot.id}/edit`}
                                            className="rounded-full bg-[#c79a5f] px-6 py-3 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
                                        >
                                            {t('Редактировать')}
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6d7bb] dark:bg-[#ffffff1a]">
                                            <div
                                                className="h-full rounded-full bg-[#c79a5f] transition-[width] duration-150"
                                                style={{
                                                    width: `${(projectedRemaining / total) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                            {t(
                                                'Останется {remaining} из {total} мл · {price} ₴/мл',
                                                {
                                                    remaining:
                                                        projectedRemaining,
                                                    total,
                                                    price: pricePerMl.toFixed(
                                                        2,
                                                    ),
                                                },
                                            )}
                                            {bulkThreshold !== null &&
                                                bulkPrice !== null &&
                                                ' ' +
                                                    t(
                                                        '· от {threshold} мл — {price} ₴/мл',
                                                        {
                                                            threshold:
                                                                bulkThreshold,
                                                            price: bulkPrice.toFixed(
                                                                2,
                                                            ),
                                                        },
                                                    )}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                                {t('Сколько мл')}
                                            </span>
                                            <span className="text-sm font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                                {volume} мл
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={1}
                                            max={maxVolume}
                                            step={1}
                                            value={volume}
                                            onChange={(e) =>
                                                setVolume(
                                                    Number(e.target.value),
                                                )
                                            }
                                            style={{ accentColor: '#c79a5f' }}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="font-display text-3xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                            {price} ₴
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                addLotToCart(lot.id, volume)
                                            }
                                            className="rounded-full bg-[#c79a5f] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
                                        >
                                            {added
                                                ? t('Добавлено')
                                                : t('В корзину')}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-5 dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                {t('Продавец')}
                            </span>
                            <span className="font-display text-xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                {lot.seller.name}
                            </span>
                        </div>
                        <Link
                            href={`/sellers/${lot.seller.id}`}
                            className="rounded-full border border-[#e6d7bb] px-5 py-2.5 text-sm font-semibold text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                        >
                            {t('Все лоты продавца ({count})', {
                                count: sellerLotsCount,
                            })}
                        </Link>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
