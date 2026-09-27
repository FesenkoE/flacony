import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import BottleIcon from '@/components/bottle-icon';
import LotPrice from '@/components/lot-price';
import VolumePicker from '@/components/volume-picker';
import { useAddLotToCart } from '@/hooks/use-add-lot-to-cart';
import { useThemeImagePath } from '@/hooks/use-theme-image';
import { useTranslations } from '@/hooks/use-translations';

export default function LotCard({ lot, isOwn = false }) {
    const t = useTranslations();
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
    // Our catalog photo keeps the storefront uniform; seller photos live on the lot page.
    const coverPath = useThemeImagePath(
        lot.product?.image_path,
        lot.product?.image_path_light,
    );

    const projectedRemaining = remaining - volume;

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#1e160c14] bg-[#fffaf1] dark:border-[#ffffff14] dark:bg-[#ffffff0a] dark:backdrop-blur-lg">
            {/* Photo and title lead to the lot page (the seller name inside links elsewhere, so no single wrapper). */}
            <Link
                href={`/sellers/lots/${lot.id}`}
                className="scent-card-photo relative flex aspect-square items-center justify-center overflow-hidden"
            >
                {coverPath ? (
                    <img
                        src={`/storage/${coverPath}`}
                        alt={`${lot.brand_name} ${lot.product_name}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <BottleIcon />
                )}
                {isOwn && lot.status !== 'approved' && (
                    <span
                        className={
                            'absolute top-4 left-4 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] uppercase ' +
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
            </Link>

            <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold tracking-[0.18em] text-[#c79a5f] uppercase">
                        {lot.brand_name}
                    </span>
                    <h3 className="font-display text-2xl leading-none font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                        <Link
                            href={`/sellers/lots/${lot.id}`}
                            className="hover:text-[#c79a5f]"
                        >
                            {lot.product_name}
                        </Link>
                    </h3>
                    {!isOwn && lot.seller && (
                        <Link
                            href={`/sellers/${lot.seller.id}`}
                            className="w-fit text-xs text-[#7d6952] hover:text-[#c79a5f] dark:text-[#b7a58f]"
                        >
                            {t('Продавец: {name}', { name: lot.seller.name })}
                        </Link>
                    )}
                </div>

                {isOwn ? (
                    <>
                        <div className="mt-4 flex flex-col gap-1.5">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6d7bb] dark:bg-[#ffffff1a]">
                                <div
                                    className="h-full rounded-full bg-[#c79a5f]"
                                    style={{ width: `${soldPercent}%` }}
                                />
                            </div>
                            <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                {t(
                                    'Продано {sold} из {total} мл ({percent}%) · {price} ₴/мл',
                                    {
                                        sold,
                                        total,
                                        percent: soldPercent,
                                        price: pricePerMl.toFixed(2),
                                    },
                                )}
                                {bulkThreshold !== null &&
                                    bulkPrice !== null &&
                                    ' ' +
                                        t(
                                            '· от {threshold} мл — {price} ₴/мл',
                                            {
                                                threshold: bulkThreshold,
                                                price: bulkPrice.toFixed(2),
                                            },
                                        )}
                            </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                            <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {t('Остаток {remaining} мл', { remaining })}
                            </span>
                            <Link
                                href={`/sellers/lots/${lot.id}/edit`}
                                className="shrink-0 rounded-full border border-[#e6d7bb] px-5 py-2.5 text-sm font-bold tracking-[0.04em] whitespace-nowrap text-[#241a10] uppercase dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                            >
                                {t('Редактировать')}
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mt-4 flex flex-col gap-1.5">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6d7bb] dark:bg-[#ffffff1a]">
                                <div
                                    className="h-full rounded-full bg-[#c79a5f] transition-[width] duration-150"
                                    style={{
                                        width: `${(projectedRemaining / total) * 100}%`,
                                    }}
                                />
                            </div>
                            <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                {t(
                                    'Останется {remaining} из {total} мл · {price} ₴/мл',
                                    {
                                        remaining: projectedRemaining,
                                        total,
                                        price: pricePerMl.toFixed(2),
                                    },
                                )}
                                {bulkThreshold !== null &&
                                    bulkPrice !== null &&
                                    ' ' +
                                        t(
                                            '· от {threshold} мл — {price} ₴/мл',
                                            {
                                                threshold: bulkThreshold,
                                                price: bulkPrice.toFixed(2),
                                            },
                                        )}
                            </span>
                        </div>

                        {/* Pinned to the bottom with the price, so pickers line up across a row whatever the text above. */}
                        <div className="mt-auto pt-5">
                            <VolumePicker
                                value={volume}
                                onChange={setVolume}
                                max={maxVolume}
                            />
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <LotPrice
                                volume={volume}
                                pricePerMl={pricePerMl}
                                bulkThreshold={bulkThreshold}
                                bulkPrice={bulkPrice}
                            />
                            <button
                                type="button"
                                onClick={() => addLotToCart(lot.id, volume)}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c5aa86] dark:bg-[#c79a5f] px-5 py-3 text-sm font-bold tracking-[0.04em] whitespace-nowrap text-[#3d2712] uppercase"
                            >
                                <ShoppingCart size={16} strokeWidth={2.25} />
                                {added ? t('Добавлено') : t('В корзину')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
