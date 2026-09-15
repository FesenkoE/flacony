import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import BottleIcon, { tintForId } from '@/components/bottle-icon';
import { useAddLotToCart } from '@/hooks/use-add-lot-to-cart';

export default function LotCard({ lot, isOwn = false }) {
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
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#1e160c14] bg-[#fffaf1] dark:border-[#ffffff14] dark:bg-[#ffffff0a] dark:backdrop-blur-lg">
            <div className="scent-card-photo flex aspect-square items-center justify-center overflow-hidden">
                <BottleIcon tint={tintForId(lot.id)} />
            </div>

            <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold tracking-[0.18em] text-[#c79a5f] uppercase">
                        {lot.brand_name}
                    </span>
                    <h3 className="font-display text-2xl leading-none font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                        {lot.product_name}
                    </h3>
                    {!isOwn && lot.seller && (
                        <Link
                            href={`/sellers/${lot.seller.id}`}
                            className="w-fit text-xs text-[#7d6952] hover:text-[#c79a5f] dark:text-[#b7a58f]"
                        >
                            Продавец: {lot.seller.name}
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
                                Продано {sold} из {total} мл ({soldPercent}%) ·{' '}
                                {pricePerMl.toFixed(2)} ₴/мл
                                {bulkThreshold !== null &&
                                    bulkPrice !== null && (
                                        <>
                                            {' '}
                                            · от {bulkThreshold} мл —{' '}
                                            {bulkPrice.toFixed(2)} ₴/мл
                                        </>
                                    )}
                            </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                            <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                Остаток {remaining} мл
                            </span>
                            <Link
                                href={`/sellers/lots/${lot.id}/edit`}
                                className="shrink-0 rounded-full border border-[#e6d7bb] px-5 py-2.5 text-sm font-bold tracking-[0.04em] whitespace-nowrap text-[#241a10] uppercase dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                            >
                                Редактировать
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
                                Останется {projectedRemaining} из {total} мл ·{' '}
                                {pricePerMl.toFixed(2)} ₴/мл
                                {bulkThreshold !== null &&
                                    bulkPrice !== null && (
                                        <>
                                            {' '}
                                            · от {bulkThreshold} мл —{' '}
                                            {bulkPrice.toFixed(2)} ₴/мл
                                        </>
                                    )}
                            </span>
                        </div>

                        <div className="mt-5 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                    Сколько мл
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
                                    setVolume(Number(e.target.value))
                                }
                                style={{ accentColor: '#c79a5f' }}
                                className="w-full"
                            />
                        </div>

                        <div className="mt-auto flex flex-col gap-3 pt-4">
                            <span className="font-display text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                {price} ₴
                            </span>
                            <button
                                type="button"
                                onClick={() => addLotToCart(lot.id, volume)}
                                className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#c79a5f] px-5 py-3 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
                            >
                                <ShoppingCart size={16} strokeWidth={2.25} />
                                {added ? 'Добавлено' : 'В корзину'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
