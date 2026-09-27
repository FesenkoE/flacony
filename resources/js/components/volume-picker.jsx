import { useTranslations } from '@/hooks/use-translations';

const THUMB = 18;

// Like kremchik: the slider covers the whole remainder in 1 ml steps, +/− fine-tune.
export default function VolumePicker({ value, onChange, max }) {
    const t = useTranslations();
    const clamp = (ml) => Math.min(max, Math.max(1, ml));
    // Updater form, so quick repeated taps on +/− each count.
    const step = (delta) => onChange((ml) => clamp(ml + delta));
    const at = (ml) =>
        `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${(ml - 1) / (max - 1)})`;
    const stepButton =
        'flex h-8 w-8 items-center justify-center rounded-full border border-[#e6d7bb] text-[#241a10] disabled:opacity-30 dark:border-[#ffffff29] dark:text-[#f6ecdd]';

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                    {t('Сколько мл')}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => step(-1)}
                        disabled={value <= 1}
                        aria-label={t('Меньше на 1 мл')}
                        className={stepButton}
                    >
                        −
                    </button>
                    <span className="w-12 text-center text-sm font-semibold text-[#241a10] tabular-nums dark:text-[#f6ecdd]">
                        {value} мл
                    </span>
                    <button
                        type="button"
                        onClick={() => step(1)}
                        disabled={value >= max}
                        aria-label={t('Больше на 1 мл')}
                        className={stepButton}
                    >
                        +
                    </button>
                </div>
            </div>

            {max > 1 && (
                <div>
                    <input
                        type="range"
                        min={1}
                        max={max}
                        step={1}
                        value={value}
                        onChange={(e) =>
                            onChange(clamp(Number(e.target.value)))
                        }
                        aria-label={t('Сколько мл')}
                        className="volume-range"
                        style={{
                            '--fill': at(value),
                        }}
                    />
                </div>
            )}
        </div>
    );
}
