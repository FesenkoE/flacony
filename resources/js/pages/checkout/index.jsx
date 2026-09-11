import { Form, Head, Link, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

const fieldClass =
    'w-full rounded-xl border border-[#e6d7bb] bg-[#fbf5ea] px-4 py-2.5 text-sm text-[#241a10] outline-none focus:border-[#bf8438] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#f6ecdd]';
const labelClass =
    'text-[11px] font-semibold tracking-[0.1em] text-[#8a7860] uppercase dark:text-[#b7a58f]';

export default function CheckoutIndex({ items, total }) {
    const { auth } = usePage().props;

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

                    <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-4 dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                        {items.map((item) => (
                            <div
                                key={`${item.type}-${item.key}`}
                                className="flex items-baseline justify-between text-sm"
                            >
                                <span className="text-[#241a10] dark:text-[#f6ecdd]">
                                    {item.brand_name} — {item.product_name}
                                    <span className="text-[#8a7860] dark:text-[#b7a58f]">
                                        {' '}
                                        · {item.detail}
                                    </span>
                                </span>
                                <span className="shrink-0 font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                    {Number(item.subtotal).toFixed(2)} ₴
                                </span>
                            </div>
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
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className={labelClass}
                                        htmlFor="name"
                                    >
                                        Имя и фамилия
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        defaultValue={auth.user.name}
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.name} />
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

                                <InputError message={errors.items} />

                                <p className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
                                    Оплата наличными или переводом при получении
                                    — онлайн-оплату пока не подключили.
                                </p>

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
