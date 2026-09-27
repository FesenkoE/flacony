import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import BottleIcon from '@/components/bottle-icon';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import LotPrice from '@/components/lot-price';
import VolumePicker from '@/components/volume-picker';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAddLotToCart } from '@/hooks/use-add-lot-to-cart';
import { useThemeImagePath } from '@/hooks/use-theme-image';
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

// The seller's own shots of this very bottle — proof it's genuine, not a storefront photo.
function SellerPhotos({ lot }) {
    const t = useTranslations();
    const [open, setOpen] = useState(null);
    const photos = [
        { path: lot.photo_sprayer_path, label: t('Флакон') },
        { path: lot.photo_batch_code_path, label: t('Батч-код') },
    ].filter((photo) => photo.path);

    if (photos.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                    {t('Фото от продавца')}
                </span>
                <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                    {t(
                        'Тот самый флакон, из которого наливают. Батч-код можно проверить на сайте бренда.',
                    )}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {photos.map((photo) => (
                    <button
                        key={photo.path}
                        type="button"
                        onClick={() => setOpen(photo)}
                        className="group flex flex-col gap-1.5 text-left"
                    >
                        <span className="aspect-square overflow-hidden rounded-2xl">
                            <img
                                src={`/storage/${photo.path}`}
                                alt={photo.label}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                        </span>
                        <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                            {photo.label}
                        </span>
                    </button>
                ))}
            </div>

            <Dialog open={open !== null} onOpenChange={() => setOpen(null)}>
                <DialogContent className="w-auto max-w-[92vw] rounded-none border-0 bg-transparent p-0 shadow-none">
                    <DialogTitle className="sr-only">{open?.label}</DialogTitle>
                    {open && (
                        <img
                            src={`/storage/${open.path}`}
                            alt={open.label}
                            className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
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
    const coverPath = useThemeImagePath(
        lot.product?.image_path,
        lot.product?.image_path_light,
    );

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
                        <div className="flex flex-col gap-6">
                            <div className="scent-card-photo relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl">
                                {coverPath ? (
                                    <img
                                        src={`/storage/${coverPath}`}
                                        alt={`${lot.brand_name} ${lot.product_name}`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <BottleIcon size={164} />
                                )}
                                {isOwn && lot.status !== 'approved' && (
                                    <span
                                        className={
                                            'absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold tracking-[0.04em] uppercase ' +
                                            (lot.status === 'rejected'
                                                ? 'bg-[#c0645a] text-[#fdf3f1]'
                                                : 'bg-[#c79a5f] text-[#3d2712]')
                                        }
                                    >
                                        {lot.status === 'rejected'
                                            ? t('Отклонён')
                                            : t('На модерации')}
                                    </span>
                                )}
                            </div>
                            <SellerPhotos lot={lot} />
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

                            {lot.description && (
                                <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                    {lot.description}
                                </p>
                            )}

                            {lot.product && (
                                <Link
                                    href={`/products/${lot.product.slug}`}
                                    className="w-fit text-sm font-semibold text-[#241a10] underline decoration-[#c79a5f] underline-offset-4 dark:text-[#f6ecdd]"
                                >
                                    {t('Ноты и описание аромата')}
                                </Link>
                            )}

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
                                    {lot.status === 'rejected' &&
                                        lot.rejection_reason && (
                                            <p className="rounded-xl bg-[#c0645a14] px-4 py-3 text-sm text-[#c0645a]">
                                                {t(
                                                    'Причина отклонения: {reason}',
                                                    {
                                                        reason: lot.rejection_reason,
                                                    },
                                                )}
                                            </p>
                                        )}
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
                                            className="rounded-full bg-[#c5aa86] dark:bg-[#c79a5f] px-6 py-3 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
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

                                    <VolumePicker
                                        value={volume}
                                        onChange={setVolume}
                                        max={maxVolume}
                                    />

                                    <div className="mt-2 flex items-center justify-between gap-4">
                                        <LotPrice
                                            volume={volume}
                                            pricePerMl={pricePerMl}
                                            bulkThreshold={bulkThreshold}
                                            bulkPrice={bulkPrice}
                                            size="text-3xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                addLotToCart(lot.id, volume)
                                            }
                                            className="rounded-full bg-[#c5aa86] dark:bg-[#c79a5f] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
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
