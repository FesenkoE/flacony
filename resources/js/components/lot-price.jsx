import { useTranslations } from '@/hooks/use-translations';

// Total for the chosen ml; when the seller's "from N ml" price kicks in,
// the full price is struck through and the discount is called out.
export default function LotPrice({
    volume,
    pricePerMl,
    bulkThreshold,
    bulkPrice,
    size = 'text-2xl',
}) {
    const t = useTranslations();
    const hasBulk = bulkThreshold !== null && bulkPrice !== null;
    const active = hasBulk && volume >= bulkThreshold;
    const total = volume * (active ? bulkPrice : pricePerMl);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
                <span
                    className={`font-display font-semibold text-[#241a10] dark:text-[#f6ecdd] ${size}`}
                >
                    {total.toFixed(2)} ₴
                </span>
                {active && (
                    <s className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                        {(volume * pricePerMl).toFixed(2)} ₴
                    </s>
                )}
            </div>
            {/* Always takes a line, so cards in a row keep their buttons level. */}
            <span
                className={
                    'min-h-5 text-xs ' +
                    (active
                        ? 'font-semibold text-[#c79a5f]'
                        : 'text-[#7d6952] dark:text-[#b7a58f]')
                }
            >
                {active
                    ? t('Скидка от {threshold} мл: {price} ₴/мл', {
                          threshold: bulkThreshold,
                          price: bulkPrice.toFixed(2),
                      })
                    : hasBulk &&
                      t('Ещё {ml} мл — и цена {price} ₴/мл', {
                          ml: bulkThreshold - volume,
                          price: bulkPrice.toFixed(2),
                      })}
            </span>
        </div>
    );
}
