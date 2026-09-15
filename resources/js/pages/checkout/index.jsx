import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

const fieldClass =
    'w-full rounded-xl border border-[#e6d7bb] bg-[#fbf5ea] px-4 py-2.5 text-sm text-[#241a10] outline-none focus:border-[#c79a5f] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#f6ecdd]';
const labelClass =
    'text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]';

const NOVA_POSHTA_METHODS = ['np_branch', 'np_courier'];

function readXsrfToken() {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function CityField({ city, onSelectCity, error }) {
    const t = useTranslations();
    const [query, setQuery] = useState(city?.name ?? '');
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (query.trim().length < 2 || query === city?.name) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(() => {
            fetch(`/nova-poshta/cities?q=${encodeURIComponent(query)}`)
                .then((r) => r.json())
                .then((data) => {
                    setResults(data);
                    setOpen(true);
                })
                .catch(() => setResults([]));
        }, 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    return (
        <div className="relative flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="city_query">
                {t('Город')}
            </label>
            <input
                id="city_query"
                autoComplete="off"
                placeholder={t('Начните вводить город...')}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onSelectCity(null);
                }}
                onFocus={() => results.length > 0 && setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                className={fieldClass}
            />
            <input type="hidden" name="city" value={city?.name ?? ''} />
            {open && results.length > 0 && (
                <div className="absolute top-full left-0 z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-[#e6d7bb] bg-[#fffaf1] shadow-lg dark:border-[#ffffff29] dark:bg-[#130f0b]">
                    {results.map((c) => (
                        <button
                            key={c.ref}
                            type="button"
                            onMouseDown={() => {
                                onSelectCity(c);
                                setQuery(c.name);
                                setOpen(false);
                            }}
                            className="block w-full px-3 py-2 text-left text-sm text-[#241a10] hover:bg-[#f6efe3] dark:text-[#f6ecdd] dark:hover:bg-[#ffffff0a]"
                        >
                            {c.name}{' '}
                            <span className="text-[#7d6952] dark:text-[#b7a58f]">
                                · {c.area}
                            </span>
                        </button>
                    ))}
                </div>
            )}
            <InputError message={error} />
        </div>
    );
}

function WarehouseField({ cityRef, error }) {
    const t = useTranslations();
    const [warehouses, setWarehouses] = useState([]);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setSelected('');
        setQuery('');

        if (!cityRef) {
            setWarehouses([]);
            return;
        }

        fetch(`/nova-poshta/warehouses?city_ref=${cityRef}`)
            .then((r) => r.json())
            .then(setWarehouses)
            .catch(() => setWarehouses([]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cityRef]);

    if (!cityRef) {
        return (
            <div className="flex flex-col gap-1.5">
                <label className={labelClass}>{t('Отделение')}</label>
                <p className="rounded-xl border border-dashed border-[#e6d7bb] px-4 py-2.5 text-sm text-[#7d6952] dark:border-[#ffffff29] dark:text-[#b7a58f]">
                    {t('Сначала выберите город')}
                </p>
            </div>
        );
    }

    const matches = query
        ? warehouses.filter((w) =>
              w.description.toLowerCase().includes(query.toLowerCase()),
          )
        : warehouses;

    return (
        <div className="relative flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="address_query">
                {t('Отделение')}
            </label>
            <input
                id="address_query"
                autoComplete="off"
                placeholder={
                    warehouses.length === 0
                        ? t('Загрузка отделений...')
                        : t('Начните вводить номер или улицу...')
                }
                disabled={warehouses.length === 0}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setSelected('');
                    setOpen(true);
                }}
                onFocus={() => warehouses.length > 0 && setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                className={fieldClass}
            />
            <input type="hidden" name="address" value={selected} />
            {open && matches.length > 0 && (
                <div className="absolute top-full left-0 z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-[#e6d7bb] bg-[#fffaf1] shadow-lg dark:border-[#ffffff29] dark:bg-[#130f0b]">
                    {matches.slice(0, 50).map((w) => (
                        <button
                            key={w.ref}
                            type="button"
                            onMouseDown={() => {
                                setSelected(w.description);
                                setQuery(w.description);
                                setOpen(false);
                            }}
                            className="block w-full px-3 py-2 text-left text-sm text-[#241a10] hover:bg-[#f6efe3] dark:text-[#f6ecdd] dark:hover:bg-[#ffffff0a]"
                        >
                            {w.description}
                        </button>
                    ))}
                </div>
            )}
            <InputError message={error} />
        </div>
    );
}

function CheckoutItemRow({ item }) {
    const t = useTranslations();

    function setQuantity(quantity) {
        router.patch(
            `/cart/${item.product_variant_id}`,
            { quantity },
            { preserveScroll: true },
        );
    }

    function remove() {
        const href =
            item.type === 'lot'
                ? `/cart/lots/${item.lot_id}`
                : `/cart/${item.product_variant_id}`;
        router.delete(href, { preserveScroll: true });
    }

    return (
        <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[#241a10] dark:text-[#f6ecdd]">
                    {item.brand_name} — {item.product_name}
                </span>
                <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                    {item.type === 'lot' ? item.detail : `${item.volume_ml} мл`}
                </span>
            </div>

            {item.type === 'variant' && (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setQuantity(item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e6d7bb] text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                    >
                        −
                    </button>
                    <span className="w-4 text-center text-[#241a10] dark:text-[#f6ecdd]">
                        {item.quantity}
                    </span>
                    <button
                        type="button"
                        onClick={() => setQuantity(item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e6d7bb] text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                    >
                        +
                    </button>
                </div>
            )}

            <span className="w-20 shrink-0 text-right font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                {Number(item.subtotal).toFixed(2)} ₴
            </span>

            <button
                type="button"
                onClick={remove}
                aria-label={t('Убрать')}
                className="shrink-0 text-[#7d6952] hover:text-[#c0645a] dark:text-[#b7a58f]"
            >
                ×
            </button>
        </div>
    );
}

function PromoCodeField({ onDiscountChange }) {
    const t = useTranslations();
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    function reset() {
        setStatus('idle');
        setMessage('');
        onDiscountChange(0);
    }

    function check() {
        if (!code.trim()) {
            reset();
            return;
        }

        setStatus('checking');

        fetch('/checkout/promo/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': readXsrfToken(),
            },
            body: JSON.stringify({ code }),
        })
            .then(async (r) => {
                const data = await r.json();

                if (!r.ok) {
                    setStatus('invalid');
                    setMessage(data.message ?? t('Промокод не найден.'));
                    onDiscountChange(0);
                    return;
                }

                setStatus('valid');
                setMessage(
                    t('Скидка {discount} ₴', {
                        discount: Number(data.discount).toFixed(2),
                    }),
                );
                onDiscountChange(data.discount);
            })
            .catch(() => {
                setStatus('invalid');
                setMessage(t('Не получилось проверить код, попробуй ещё раз.'));
                onDiscountChange(0);
            });
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="promo_code">
                {t('Промокод (необязательно)')}
            </label>
            <div className="flex gap-2">
                <input
                    id="promo_code"
                    name="promo_code"
                    autoComplete="off"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        reset();
                    }}
                    className={fieldClass}
                />
                <button
                    type="button"
                    onClick={check}
                    disabled={status === 'checking'}
                    className="shrink-0 rounded-xl border border-[#e6d7bb] px-4 text-sm font-semibold text-[#7d6952] hover:border-[#c79a5f] hover:text-[#c79a5f] disabled:opacity-60 dark:border-[#ffffff29] dark:text-[#b7a58f]"
                >
                    {t('Применить')}
                </button>
            </div>
            {message && (
                <p
                    className={
                        status === 'valid'
                            ? 'text-xs text-[#c79a5f]'
                            : 'text-xs text-red-500'
                    }
                >
                    {message}
                </p>
            )}
        </div>
    );
}

export default function CheckoutIndex({
    items,
    total,
    deliveryMethods,
    paymentMethods,
}) {
    const t = useTranslations();
    const { auth } = usePage().props;
    const [firstName, ...lastNameParts] = auth.user.name.split(' ');
    const lastName = lastNameParts.join(' ');
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [city, setCity] = useState(null);
    const [discount, setDiscount] = useState(0);
    const usesNovaPoshta = NOVA_POSHTA_METHODS.includes(deliveryMethod);

    return (
        <>
            <Head title={t('Оформление заказа')} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-2xl p-6">
                    <Link
                        href="/cart"
                        className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← {t('Корзина')}
                    </Link>

                    <h1 className="mt-4 mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Оформление заказа')}
                    </h1>

                    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-4 dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                        {items.map((item) => (
                            <CheckoutItemRow
                                key={`${item.type}-${item.key}`}
                                item={item}
                            />
                        ))}
                        {discount > 0 && (
                            <div className="flex items-baseline justify-between text-sm">
                                <span className="text-[#7d6952] dark:text-[#b7a58f]">
                                    {t('Скидка по промокоду')}
                                </span>
                                <span className="font-semibold text-[#c79a5f]">
                                    −{Number(discount).toFixed(2)} ₴
                                </span>
                            </div>
                        )}
                        <div className="mt-1 flex items-baseline justify-between border-t border-[#1e160c14] pt-2 dark:border-[#ffffff1a]">
                            <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {t('Итого')}
                            </span>
                            <span className="font-display text-xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                {Number(total - discount).toFixed(2)} ₴
                            </span>
                        </div>
                    </div>

                    <Form
                        action="/checkout"
                        method="post"
                        className="flex flex-col gap-5"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            className={labelClass}
                                            htmlFor="first_name"
                                        >
                                            {t('Имя')}
                                        </label>
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            defaultValue={firstName}
                                            className={fieldClass}
                                        />
                                        <InputError
                                            message={errors.first_name}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            className={labelClass}
                                            htmlFor="last_name"
                                        >
                                            {t('Фамилия')}
                                        </label>
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            defaultValue={lastName}
                                            className={fieldClass}
                                        />
                                        <InputError
                                            message={errors.last_name}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            className={labelClass}
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={auth.user.email}
                                            className={fieldClass}
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            className={labelClass}
                                            htmlFor="phone"
                                        >
                                            {t('Телефон')}
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            placeholder="+380..."
                                            className={fieldClass}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className={labelClass}
                                        htmlFor="delivery_method"
                                    >
                                        {t('Способ доставки')}
                                    </label>
                                    <select
                                        id="delivery_method"
                                        name="delivery_method"
                                        value={deliveryMethod}
                                        onChange={(e) => {
                                            setDeliveryMethod(e.target.value);
                                            setCity(null);
                                        }}
                                        className={fieldClass}
                                    >
                                        <option value="" disabled>
                                            {t('Выберите способ доставки')}
                                        </option>
                                        {Object.entries(deliveryMethods).map(
                                            ([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                    <InputError
                                        message={errors.delivery_method}
                                    />
                                </div>

                                {usesNovaPoshta ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <CityField
                                            city={city}
                                            onSelectCity={setCity}
                                            error={errors.city}
                                        />
                                        {deliveryMethod === 'np_branch' ? (
                                            <WarehouseField
                                                cityRef={city?.ref}
                                                error={errors.address}
                                            />
                                        ) : (
                                            <div className="flex flex-col gap-1.5">
                                                <label
                                                    className={labelClass}
                                                    htmlFor="address"
                                                >
                                                    {t('Улица, дом, квартира')}
                                                </label>
                                                <input
                                                    id="address"
                                                    name="address"
                                                    className={fieldClass}
                                                />
                                                <InputError
                                                    message={errors.address}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label
                                                className={labelClass}
                                                htmlFor="city"
                                            >
                                                {t('Город')}
                                            </label>
                                            <input
                                                id="city"
                                                name="city"
                                                className={fieldClass}
                                            />
                                            <InputError message={errors.city} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label
                                                className={labelClass}
                                                htmlFor="address"
                                            >
                                                {t('Адрес')}
                                            </label>
                                            <input
                                                id="address"
                                                name="address"
                                                className={fieldClass}
                                            />
                                            <InputError
                                                message={errors.address}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className={labelClass}
                                        htmlFor="payment_method"
                                    >
                                        {t('Способ оплаты')}
                                    </label>
                                    <select
                                        id="payment_method"
                                        name="payment_method"
                                        defaultValue=""
                                        className={fieldClass}
                                    >
                                        <option value="" disabled>
                                            {t('Выберите способ оплаты')}
                                        </option>
                                        {Object.entries(paymentMethods).map(
                                            ([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                    <InputError
                                        message={errors.payment_method}
                                    />
                                    <p className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                        {t(
                                            'Онлайн-оплату картой пока не подключили — если выберешь её, мы свяжемся, чтобы уточнить оплату.',
                                        )}
                                    </p>
                                </div>

                                <PromoCodeField
                                    onDiscountChange={setDiscount}
                                />
                                <InputError message={errors.promo_code} />

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className={labelClass}
                                        htmlFor="comment"
                                    >
                                        {t(
                                            'Комментарий к заказу (необязательно)',
                                        )}
                                    </label>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        rows={3}
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.comment} />
                                </div>

                                <InputError message={errors.items} />

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-1 rounded-full bg-[#c79a5f] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase disabled:opacity-60"
                                >
                                    {t('Подтвердить заказ')}
                                </button>
                            </>
                        )}
                    </Form>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
