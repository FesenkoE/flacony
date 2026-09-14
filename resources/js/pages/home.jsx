import { Head, Link, usePage } from '@inertiajs/react';
import { Banknote, Droplet, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import BottleIcon, { tintForId } from '@/components/bottle-icon';
import LotCard from '@/components/lot-card';
import ProductCard from '@/components/product-card';
import Reveal from '@/components/reveal';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

const STEPS = [
    {
        title: 'Выбери аромат',
        text: 'Каталог с фильтром по бренду — официальные позиции и нишевая парфюмерия.',
    },
    {
        title: 'Возьми нужный объём',
        text: 'От 5 мл на пробу до полного флакона — у каждого товара несколько вариантов.',
    },
    {
        title: 'Добавь в корзину',
        text: 'Собери несколько ароматов сразу и оформи заказ.',
    },
];

function pluralizeLots(n) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'лот';
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100))
        return 'лота';
    return 'лотов';
}

const TRUST_BADGES = [
    {
        icon: Truck,
        title: 'Нова Пошта',
        text: "Відділення або кур'єр по всій Україні",
    },
    {
        icon: Droplet,
        title: 'Розпив від 2 мл',
        text: 'Пробуй перед покупкою повного флакона',
    },
    {
        icon: Banknote,
        title: 'Оплата при отриманні',
        text: "Або карткою — без обов'язкової передоплати",
    },
];

function TrustBadges() {
    return (
        <div className="flex flex-col gap-5">
            {TRUST_BADGES.map((badge) => (
                <div key={badge.title} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#bf84381a] text-[#bf8438]">
                        <badge.icon size={18} strokeWidth={1.75} />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {badge.title}
                        </span>
                        <span className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
                            {badge.text}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function BigStat({ value, label }) {
    return (
        <div className="flex flex-col items-center text-center">
            <span className="font-display text-7xl leading-none font-bold text-white sm:text-8xl">
                {value}
            </span>
            <span className="mt-2 text-xs tracking-[0.15em] text-white/70 uppercase">
                {label}
            </span>
        </div>
    );
}

function buildSlides({ promoCode, newArrivals, activeLotsCount }) {
    const slides = [];

    if (promoCode) {
        const discount =
            promoCode.type === 'percent'
                ? `${Number(promoCode.value)}%`
                : `${Number(promoCode.value)} ₴`;
        slides.push({
            key: 'promo',
            eyebrow: 'Промокод для новых покупателей',
            title: `Скидка ${discount} на первый заказ`,
            text: `Введи код ${promoCode.code} на чекауте — работает на весь каталог, без минимальной суммы.`,
            cta: 'В каталог',
            href: '/products',
            visual: <BigStat value={`-${discount}`} label="на первый заказ" />,
        });
    }

    if (newArrivals?.length > 0) {
        const latest = newArrivals[0];
        slides.push({
            key: 'new',
            eyebrow: 'Новинки',
            title: `${latest.brand.name} — ${latest.name}`,
            text: 'Последнее поступление в каталог — уже можно взять на пробу от 2 мл.',
            cta: 'Смотреть новинки',
            href: '/products',
            visual: (
                <div className="flex h-[180px] w-[180px] items-center justify-center overflow-hidden rounded-[1.25rem] bg-white/10">
                    {latest.image_path ? (
                        <img
                            src={`/storage/${latest.image_path}`}
                            alt={`${latest.brand.name} ${latest.name}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <BottleIcon tint={tintForId(latest.id)} size={96} />
                    )}
                </div>
            ),
        });
    }

    slides.push({
        key: 'lots',
        eyebrow: 'Розпив',
        title: `${activeLotsCount} ${pluralizeLots(activeLotsCount)} в наличии`,
        text: 'Флаконы от других покупателей — раскуплены не полностью, можно взять несколько мл на пробу.',
        cta: 'Смотреть розпив',
        href: '/lots',
        visual: (
            <BigStat
                value={activeLotsCount}
                label={pluralizeLots(activeLotsCount)}
            />
        ),
    });

    return slides;
}

function PromoSlider({ slides }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || slides.length < 2) return;
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [paused, slides.length]);

    return (
        <div
            className="relative overflow-hidden rounded-[1.5rem]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.key}
                        className="flex w-full shrink-0 items-center gap-6 px-8 py-10 sm:px-12 sm:py-14"
                        style={{
                            background:
                                'linear-gradient(135deg, #2a1c0f 0%, #6b4420 55%, #bf8438 100%)',
                        }}
                    >
                        <div className="flex flex-1 flex-col items-start gap-3">
                            <span className="text-xs font-bold tracking-[0.2em] text-[#f6cf9a] uppercase">
                                {slide.eyebrow}
                            </span>
                            <h2 className="font-display text-2xl leading-tight font-semibold text-white italic sm:text-3xl">
                                {slide.title}
                            </h2>
                            <p className="max-w-md text-sm leading-relaxed text-white/75">
                                {slide.text}
                            </p>
                            <Link
                                href={slide.href}
                                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#f6ecdd] px-6 py-3 text-sm font-bold tracking-[0.04em] text-[#1c1408] uppercase"
                            >
                                {slide.cta}
                            </Link>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:items-center sm:justify-center">
                            {slide.visual}
                        </div>
                    </div>
                ))}
            </div>

            {slides.length > 1 && (
                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                    {slides.map((slide, i) => (
                        <button
                            key={slide.key}
                            type="button"
                            aria-label={`Слайд ${i + 1}`}
                            onClick={() => setIndex(i)}
                            className={
                                'h-2 rounded-full transition-all ' +
                                (i === index
                                    ? 'w-6 bg-[#f6ecdd]'
                                    : 'w-2 bg-[#f6ecdd66]')
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function Hero({ promoCode, newArrivals, activeLotsCount }) {
    const slides = buildSlides({ promoCode, newArrivals, activeLotsCount });
    return (
        <div className="relative overflow-hidden bg-[#f6efe3] dark:bg-[#0d0b09]">
            <div className="hero-bg absolute inset-0" />

            <div className="relative mx-auto max-w-[1600px] px-6 pt-8 md:px-12">
                <PromoSlider slides={slides} />
            </div>

            <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-10 px-6 py-12 md:px-12">
                <div className="flex max-w-2xl flex-col gap-3">
                    <span
                        className="hero-fade-up text-[13px] font-bold tracking-[0.3em] text-[#bf8438]"
                        style={{ animationDelay: '0.05s' }}
                    >
                        FLACONY
                    </span>

                    <h1
                        className="hero-fade-up text-3xl leading-[1.1] font-bold text-[#241a10] md:text-4xl dark:text-[#f6ecdd]"
                        style={{ animationDelay: '0.18s' }}
                    >
                        Пробуй ароматы, не переплачивая{' '}
                        <span className="font-display font-semibold text-[#bf8438] italic">
                            за флакон
                        </span>
                    </h1>

                    <p
                        className="hero-fade-up max-w-[440px] text-sm leading-relaxed text-[#8a7860] dark:text-[#b7a58f]"
                        style={{ animationDelay: '0.32s' }}
                    >
                        Официальный каталог и распив нишевой парфюмерии — от 5
                        мл на попробовать до полного флакона.
                    </p>

                    <div
                        className="hero-fade-up mt-1"
                        style={{ animationDelay: '0.46s' }}
                    >
                        <Link
                            href="/products"
                            className="hero-cta-sheen relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#bf8438] px-6 py-3 text-sm font-bold tracking-[0.04em] text-[#1c1408] uppercase"
                        >
                            Смотреть каталог
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="hidden shrink-0 lg:block">
                    <TrustBadges />
                </div>
            </div>
        </div>
    );
}

export default function Home({
    featuredProducts,
    newArrivals,
    brands,
    lots,
    promoCode,
    activeLotsCount,
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Flacony — парфюмерия на распив и в розницу" />
            <SiteHeader />
            <Hero
                promoCode={promoCode}
                newArrivals={newArrivals}
                activeLotsCount={activeLotsCount}
            />

            {brands.length > 0 && (
                <Reveal className="border-b border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
                    <div className="mx-auto max-w-[1600px] px-6 py-10">
                        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                            {brands.map((brand) => (
                                <span
                                    key={brand.id}
                                    className="text-sm font-semibold tracking-[0.12em] text-[#8a7860] uppercase dark:text-[#b7a58f]"
                                >
                                    {brand.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </Reveal>
            )}

            {featuredProducts.length > 0 && (
                <Reveal className="bg-[#f6efe3] dark:bg-[#0d0b09]">
                    <div className="mx-auto max-w-[1600px] px-6 py-16">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                Популярное
                            </h2>
                            <Link
                                href="/products"
                                className="text-sm text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                            >
                                Весь каталог →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </Reveal>
            )}

            {newArrivals.length > 0 && (
                <Reveal className="border-t border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
                    <div className="mx-auto max-w-[1600px] px-6 py-16">
                        <h2 className="mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            Новинки
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                            {newArrivals.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </Reveal>
            )}

            <Reveal className="border-t border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] px-6 py-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                Розпив від покупців
                            </h2>
                            <p className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                                Остатки чужих флаконов от нескольких мл — и твой
                                можно продать так же
                            </p>
                        </div>
                        <Link
                            href="/lots"
                            className="text-sm text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                        >
                            Весь розпив →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                        {lots.map((lot) => (
                            <LotCard key={lot.id} lot={lot} />
                        ))}
                        <Link
                            href="/sellers/lots/create"
                            className="flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[#e6d7bb] p-6 text-center transition-colors hover:border-[#bf8438] dark:border-[#ffffff29]"
                        >
                            <BottleIcon size={48} />
                            <span className="font-display text-xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                Есть что продать?
                            </span>
                            <span className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                                Выставь остаток флакона и получи деньги за то,
                                что не допробуешь
                            </span>
                            <span className="mt-2 rounded-full bg-[#bf8438] px-6 py-2.5 text-sm font-bold tracking-[0.04em] text-[#1c1408] uppercase">
                                Выставить лот
                            </span>
                        </Link>
                    </div>
                </div>
            </Reveal>

            <Reveal className="border-t border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] px-6 py-16">
                    <h2 className="mb-10 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Как это работает
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {STEPS.map((step, i) => (
                            <div
                                key={step.title}
                                className="flex flex-col gap-2"
                            >
                                <span className="font-display text-3xl font-semibold text-[#bf8438] italic">
                                    {i + 1}
                                </span>
                                <span className="text-base font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                    {step.title}
                                </span>
                                <span className="text-sm leading-relaxed text-[#8a7860] dark:text-[#b7a58f]">
                                    {step.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>

            {!auth.user && (
                <Reveal className="hero-bg relative overflow-hidden border-t border-[#1e160c14] dark:border-[#ffffff14]">
                    <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-8 px-6 py-16 md:grid-cols-[1fr_auto] md:py-20">
                        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
                            <h2 className="text-3xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                Создай аккаунт
                            </h2>
                            <p className="max-w-md text-sm leading-relaxed text-[#8a7860] dark:text-[#b7a58f]">
                                Оформляй заказы быстрее и следи за историей
                                покупок.
                            </p>
                            <Link
                                href="/register"
                                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#bf8438] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#1c1408] uppercase"
                            >
                                Зарегистрироваться
                            </Link>
                        </div>

                        <div className="relative flex h-[180px] w-[180px] items-center justify-center justify-self-center">
                            <div
                                className="absolute h-[180px] w-[180px] rounded-full blur-[16px]"
                                style={{
                                    background:
                                        'radial-gradient(circle, #bf843870 0%, transparent 70%)',
                                }}
                            />
                            <BottleIcon size={110} />
                        </div>
                    </div>
                </Reveal>
            )}

            <SiteFooter />
        </>
    );
}
