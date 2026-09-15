import { Form, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { useTranslations } from '@/hooks/use-translations';

const fieldClass =
    'w-full rounded-xl border border-[#e6d7bb] bg-[#fbf5ea] px-4 py-2.5 text-sm text-[#241a10] outline-none focus:border-[#c79a5f] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#f6ecdd]';
const labelClass =
    'text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]';

export default function LotForm({
    action,
    method,
    submitLabel,
    heading,
    backHref = '/sellers',
    backLabel,
    defaults = {},
}) {
    const t = useTranslations();

    return (
        <div className="mx-auto max-w-xl p-6">
            <Link
                href={backHref}
                className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
            >
                {backLabel ?? `← ${t('Продавцы')}`}
            </Link>

            <h1 className="mt-4 mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                {heading}
            </h1>

            <Form
                action={action}
                method={method}
                className="flex flex-col gap-5"
            >
                {({ errors, processing }) => (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label
                                    className={labelClass}
                                    htmlFor="brand_name"
                                >
                                    {t('Бренд')}
                                </label>
                                <input
                                    id="brand_name"
                                    name="brand_name"
                                    defaultValue={defaults.brand_name}
                                    className={fieldClass}
                                    placeholder="Xerjoff"
                                />
                                <InputError message={errors.brand_name} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label
                                    className={labelClass}
                                    htmlFor="product_name"
                                >
                                    {t('Название')}
                                </label>
                                <input
                                    id="product_name"
                                    name="product_name"
                                    defaultValue={defaults.product_name}
                                    className={fieldClass}
                                    placeholder="Naxos"
                                />
                                <InputError message={errors.product_name} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                className={labelClass}
                                htmlFor="total_volume_ml"
                            >
                                {t('Объём флакона, мл')}
                            </label>
                            <input
                                id="total_volume_ml"
                                name="total_volume_ml"
                                type="number"
                                min="1"
                                step="1"
                                defaultValue={defaults.total_volume_ml}
                                className={fieldClass}
                                placeholder="100"
                            />
                            <InputError message={errors.total_volume_ml} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                className={labelClass}
                                htmlFor="price_per_ml"
                            >
                                {t('Цена за мл, ₴')}
                            </label>
                            <input
                                id="price_per_ml"
                                name="price_per_ml"
                                type="number"
                                min="0.01"
                                step="0.01"
                                defaultValue={defaults.price_per_ml}
                                className={fieldClass}
                                placeholder="25"
                            />
                            <InputError message={errors.price_per_ml} />
                        </div>

                        <div className="h-px bg-[#1e160c14] dark:bg-[#ffffff1a]" />

                        <p className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                            {t(
                                'Необязательно: скидка при покупке от определённого объёма.',
                            )}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label
                                    className={labelClass}
                                    htmlFor="bulk_threshold_ml"
                                >
                                    {t('От скольки мл')}
                                </label>
                                <input
                                    id="bulk_threshold_ml"
                                    name="bulk_threshold_ml"
                                    type="number"
                                    min="1"
                                    step="1"
                                    defaultValue={defaults.bulk_threshold_ml}
                                    className={fieldClass}
                                    placeholder="5"
                                />
                                <InputError
                                    message={errors.bulk_threshold_ml}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label
                                    className={labelClass}
                                    htmlFor="bulk_price_per_ml"
                                >
                                    {t('Цена за мл при скидке, ₴')}
                                </label>
                                <input
                                    id="bulk_price_per_ml"
                                    name="bulk_price_per_ml"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    defaultValue={defaults.bulk_price_per_ml}
                                    className={fieldClass}
                                    placeholder="20"
                                />
                                <InputError
                                    message={errors.bulk_price_per_ml}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 rounded-full bg-[#c79a5f] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase disabled:opacity-60"
                        >
                            {submitLabel}
                        </button>
                    </>
                )}
            </Form>
        </div>
    );
}
