import { Form, Link } from '@inertiajs/react';
import { ImagePlus } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { useTranslations } from '@/hooks/use-translations';

const fieldClass =
    'w-full rounded-lg border border-[#e6d7bb] bg-[#fbf5ea] px-3.5 py-2 text-sm text-[#241a10] outline-none focus:border-[#c79a5f] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#f6ecdd]';
const textareaClass = fieldClass + ' resize-none';
const labelClass =
    'text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]';
const fieldWrapClass = 'flex flex-col gap-1.5';

function FormSection({ title, description, children }) {
    return (
        <div className="h-full rounded-xl border border-[#1e160c14] bg-[#fffaf1] p-5 dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
            <h2 className="text-sm font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                {title}
            </h2>
            {description && (
                <p className="mt-1 text-xs text-[#7d6952] dark:text-[#b7a58f]">
                    {description}
                </p>
            )}
            <div className="mt-4 flex flex-col gap-4">{children}</div>
        </div>
    );
}

function PhotoTile({ name, label, hint, currentPath, required, error }) {
    const t = useTranslations();
    const [preview, setPreview] = useState(null);
    const src = preview ?? (currentPath ? `/storage/${currentPath}` : null);

    return (
        <div className={fieldWrapClass}>
            <label className={labelClass} htmlFor={name}>
                {label}
            </label>
            {hint && (
                <p className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                    {hint}
                </p>
            )}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#e6d7bb] bg-[#fbf5ea] dark:border-[#ffffff29] dark:bg-[#ffffff0a]">
                {src ? (
                    <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#7d6952] dark:text-[#b7a58f]">
                        <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
                        <span className="text-xs font-medium">
                            {t('Выбрать файл')}
                        </span>
                    </div>
                )}
                {src && (
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-center text-xs font-semibold text-white">
                        {t('Заменить файл')}
                    </span>
                )}
                {/* Нативный input рендерит "Choose file / No file chosen" на
                    языке браузера, это не переводится через CSS/JS — поэтому
                    прячем сам input прозрачным слоем поверх всей плитки. */}
                <input
                    id={name}
                    name={name}
                    type="file"
                    accept="image/*"
                    required={required}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        setPreview(file ? URL.createObjectURL(file) : null);
                    }}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
            </div>
            <InputError message={error} />
        </div>
    );
}

function AutocompleteField({
    id,
    label,
    options,
    defaultValue,
    error,
    placeholder,
}) {
    const [value, setValue] = useState(defaultValue ?? '');
    const [open, setOpen] = useState(false);

    const matches = value.trim()
        ? options
              .filter((o) => o.toLowerCase().includes(value.toLowerCase()))
              .slice(0, 8)
        : options.slice(0, 8);

    return (
        <div className={fieldWrapClass + ' relative'}>
            <label className={labelClass} htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                name={id}
                autoComplete="off"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                className={fieldClass}
                placeholder={placeholder}
            />
            {open && matches.length > 0 && (
                <div className="absolute top-full left-0 z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-[#e6d7bb] bg-[#fffaf1] shadow-lg dark:border-[#ffffff29] dark:bg-[#130f0b]">
                    {matches.map((o) => (
                        <button
                            key={o}
                            type="button"
                            onMouseDown={() => {
                                setValue(o);
                                setOpen(false);
                            }}
                            className="block w-full px-3 py-2 text-left text-sm text-[#241a10] hover:bg-[#f6efe3] dark:text-[#f6ecdd] dark:hover:bg-[#ffffff0a]"
                        >
                            {o}
                        </button>
                    ))}
                </div>
            )}
            <InputError message={error} />
        </div>
    );
}

export default function LotForm({
    action,
    method,
    submitLabel,
    heading,
    backHref = '/sellers',
    backLabel,
    defaults = {},
    brands = [],
    productNames = [],
}) {
    const t = useTranslations();

    return (
        <div className="mx-auto max-w-6xl p-6">
            <Link
                href={backHref}
                className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
            >
                {backLabel ?? `← ${t('Продавцы')}`}
            </Link>

            <h1 className="mt-2 mb-3 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                {heading}
            </h1>

            <Form
                action={action}
                method={method}
                className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem_1fr] lg:items-stretch"
            >
                {({ errors, processing }) => (
                    <>
                        <FormSection
                            title={t('Фото')}
                            description={t(
                                'Обязательно, для проверки на подделку. Покупатели увидят их на странице лота, а в каталоге распива покажем наше фото аромата.',
                            )}
                        >
                            <PhotoTile
                                name="photo_sprayer"
                                label={t('Фото флакона без крышечки')}
                                hint={t('Распылитель — в камеру.')}
                                currentPath={defaults.photo_sprayer_path}
                                required={!defaults.photo_sprayer_path}
                                error={errors.photo_sprayer}
                            />
                            <PhotoTile
                                name="photo_batch_code"
                                label={t('Фото батч-кода')}
                                hint={t('Должен чётко читаться.')}
                                currentPath={defaults.photo_batch_code_path}
                                required={!defaults.photo_batch_code_path}
                                error={errors.photo_batch_code}
                            />
                        </FormSection>

                        <div className="flex flex-col gap-6">
                            <FormSection title={t('Аромат')}>
                                <AutocompleteField
                                    id="brand_name"
                                    label={t('Бренд')}
                                    options={brands}
                                    defaultValue={defaults.brand_name}
                                    error={errors.brand_name}
                                    placeholder="Xerjoff"
                                />
                                <AutocompleteField
                                    id="product_name"
                                    label={t('Название')}
                                    options={productNames}
                                    defaultValue={defaults.product_name}
                                    error={errors.product_name}
                                    placeholder="Naxos"
                                />
                            </FormSection>

                            <FormSection title={t('Объём и цена')}>
                                <div className={fieldWrapClass}>
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
                                    <InputError
                                        message={errors.total_volume_ml}
                                    />
                                </div>

                                <div className={fieldWrapClass}>
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
                            </FormSection>

                            <FormSection
                                title={t('Оптовая скидка')}
                                description={t(
                                    'Необязательно: скидка при покупке от определённого объёма.',
                                )}
                            >
                                <div className={fieldWrapClass}>
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
                                        defaultValue={
                                            defaults.bulk_threshold_ml
                                        }
                                        className={fieldClass}
                                        placeholder="5"
                                    />
                                    <InputError
                                        message={errors.bulk_threshold_ml}
                                    />
                                </div>
                                <div className={fieldWrapClass}>
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
                                        defaultValue={
                                            defaults.bulk_price_per_ml
                                        }
                                        className={fieldClass}
                                        placeholder="20"
                                    />
                                    <InputError
                                        message={errors.bulk_price_per_ml}
                                    />
                                </div>
                            </FormSection>

                            <FormSection title={t('Описание')}>
                                <div className={fieldWrapClass}>
                                    <p className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                        {t(
                                            'Необязательно: будет видно рядом с лотом покупателям. Сюда же можно добавить то, что плохо видно на фото — например, номер батч-кода.',
                                        )}
                                    </p>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={2}
                                        defaultValue={defaults.description}
                                        className={textareaClass}
                                        placeholder="Batch code: 3201..."
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </FormSection>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-full bg-[#c5aa86] px-7 py-3 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase disabled:opacity-60 dark:bg-[#c79a5f]"
                            >
                                {submitLabel}
                            </button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
