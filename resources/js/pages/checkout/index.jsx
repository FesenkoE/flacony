import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

const fieldClass =
    'w-full rounded-xl border border-[#e6d7bb] bg-[#fbf5ea] px-4 py-2.5 text-sm text-[#241a10] outline-none focus:border-[#bf8438] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#f6ecdd]';
const labelClass =
    'text-[11px] font-semibold tracking-[0.1em] text-[#8a7860] uppercase dark:text-[#b7a58f]';

function CheckoutItemRow({ item }) {
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
                <span className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
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
                aria-label="Убрать"
                className="shrink-0 text-[#8a7860] hover:text-[#c0645a] dark:text-[#b7a58f]"
            >
                ×
            </button>
        </div>
    );
}

export default function CheckoutIndex({
    items,
    total,
    deliveryMethods,
    paymentMethods,
}) {
    const { auth } = usePage().props;
    const [firstName, ...lastNameParts] = auth.user.name.split(' ');
    const lastName = lastNameParts.join(' ');

    return (
        <>
            <Head title="Оформление заказа" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-2xl p-6">
                    <Link
                        href="/cart"
                        className="text-sm text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← Корзина
                    </Link>

                    <h1 className="mt-4 mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Оформление заказа
                    </h1>

                    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-4 dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                        {items.map((item) => (
                            <CheckoutItemRow
                                key={`${item.type}-${item.key}`}
                                item={item}
                            />
                        ))}
                        <div className="mt-1 flex items-baseline justify-between border-t border-[#1e160c14] pt-2 dark:border-[#ffffff1a]">
                            <span className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                                Итого
                            </span>
                            <span className="font-display text-xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                {Number(total).toFixed(2)} ₴
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
                                            Имя
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
                                            Фамилия
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
                                            Телефон
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
                                        Способ доставки
                                    </label>
                                    <select
                                        id="delivery_method"
                                        name="delivery_method"
                                        defaultValue=""
                                        className={fieldClass}
                                    >
                                        <option value="" disabled>
                                            Выберите способ доставки
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            className={labelClass}
                                            htmlFor="city"
                                        >
                                            Город
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
                                            Отделение / адрес
                                        </label>
                                        <input
                                            id="address"
                                            name="address"
                                            className={fieldClass}
                                        />
                                        <InputError message={errors.address} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className={labelClass}
                                        htmlFor="payment_method"
                                    >
                                        Способ оплаты
                                    </label>
                                    <select
                                        id="payment_method"
                                        name="payment_method"
                                        defaultValue=""
                                        className={fieldClass}
                                    >
                                        <option value="" disabled>
                                            Выберите способ оплаты
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
                                    <p className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
                                        Онлайн-оплату картой пока не подключили
                                        — если выберешь её, мы свяжемся, чтобы
                                        уточнить оплату.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className={labelClass}
                                        htmlFor="promo_code"
                                    >
                                        Промокод (необязательно)
                                    </label>
                                    <input
                                        id="promo_code"
                                        name="promo_code"
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.promo_code} />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className={labelClass}
                                        htmlFor="comment"
                                    >
                                        Комментарий к заказу (необязательно)
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
                                    className="mt-1 rounded-full bg-[#bf8438] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#1c1408] uppercase disabled:opacity-60"
                                >
                                    Подтвердить заказ
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
