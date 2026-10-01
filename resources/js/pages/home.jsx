import { Head, Link, usePage } from '@inertiajs/react';
import { Banknote, Droplet, Heart, History, Store, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import BottleIcon from '@/components/bottle-icon';
import LotCard from '@/components/lot-card';
import ProductCard from '@/components/product-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import StarRating from '@/components/star-rating';
import { useThemeImagePath } from '@/hooks/use-theme-image';
import { useTranslations } from '@/hooks/use-translations';
import { pluralizeRu } from '@/lib/pluralize';

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

// ponytail: макет для превью — настоящих отзывов в базе только 2 (тестовые), заменить на реальные через Review::latest(), когда наберётся достаточно
const MOCK_TESTIMONIALS = [
    {
        name: 'Оля К.',
        rating: 5,
        text: 'Взяла 5 мл Sauvage на пробу перед тем, как брать полный флакон — стойкость именно такая, как обещали. Отделение получила на следующий день.',
        product: 'Dior — Sauvage',
    },
    {
        name: 'Максим П.',
        rating: 5,
        text: 'Продал остаток своего Aventus за пару дней после того, как надоел. Деньги пришли сразу после того, как покупатель забрал с Новой Почты.',
        product: 'Продавец на маркетплейсе',
    },
    {
        name: 'Ірина Д.',
        rating: 4,
        text: 'Заказывала розпив трёх ароматов сразу, чтобы выбрать один на подарок. Разлив был аккуратный, флаконы подписаны.',
        product: 'Byredo — Gypsy Water',
    },
];

function pluralizeLots(n) {
    return pluralizeRu(n, ['лот', 'лота', 'лотов']);
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

const ACCOUNT_BENEFITS = [
    { icon: History, text: 'История заказов' },
    { icon: Heart, text: 'Список избранного' },
    { icon: Store, text: 'Своя витрина продавца' },
];

function TrustBadges() {
    const t = useTranslations();
    return (
        <div className="flex flex-col gap-5">
            {TRUST_BADGES.map((badge) => (
                <div key={badge.title} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c79a5f1a] text-[#c79a5f]">
                        <badge.icon size={18} strokeWidth={1.75} />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {t(badge.title)}
                        </span>
                        <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                            {t(badge.text)}
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

function buildSlides({
    promoCode,
    newArrivals,
    activeLotsCount,
    t,
    latestImagePath,
}) {
    const slides = [];

    if (promoCode) {
        const discount =
            promoCode.type === 'percent'
                ? `${Number(promoCode.value)}%`
                : `${Number(promoCode.value)} ₴`;
        slides.push({
            key: 'promo',
            eyebrow: t('Промокод'),
            title: t('Скидка {discount} на первый заказ', { discount }),
            text: t(
                'Введи код {code} на чекауте — работает на весь каталог, без минимальной суммы.',
                { code: promoCode.code },
            ),
            cta: t('В каталог'),
            href: '/products',
            visual: (
                <BigStat value={`-${discount}`} label={t('на первый заказ')} />
            ),
        });
    }

    if (newArrivals?.length > 0) {
        const latest = newArrivals[0];
        slides.push({
            key: 'new',
            eyebrow: t('Новинка'),
            title: `${latest.brand.name} — ${latest.name}`,
            text: t(
                'Последнее поступление в каталог — уже можно взять на пробу от 2 мл.',
            ),
            cta: t('Смотреть новинки'),
            href: '/products',
            visual: (
                <div className="flex h-[180px] w-[180px] items-center justify-center overflow-hidden rounded-[1.25rem] bg-white/10">
                    {latestImagePath ? (
                        <img
                            src={`/storage/${latestImagePath}`}
                            alt={`${latest.brand.name} ${latest.name}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <BottleIcon size={76} />
                    )}
                </div>
            ),
        });
    }

    slides.push({
        key: 'lots',
        eyebrow: t('Розпив'),
        title: t('{count} {word} в наличии', {
            count: activeLotsCount,
            word: t(pluralizeLots(activeLotsCount)),
        }),
        text: t(
            'Флаконы от других покупателей — раскуплены не полностью, можно взять несколько мл на пробу.',
        ),
        cta: t('Смотреть розпив'),
        href: '/lots',
        visual: (
            <BigStat
                value={activeLotsCount}
                label={t(pluralizeLots(activeLotsCount))}
            />
        ),
    });

    return slides;
}

function PromoSlider({ slides }) {
    const t = useTranslations();
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
                                'linear-gradient(135deg, #2a1c0f 0%, #6b4420 55%, #c79a5f 100%)',
                        }}
                    >
                        <div className="flex flex-1 flex-col items-start gap-3">
                            <span className="inline-flex items-center rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-[#f6cf9a]">
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
                                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#f6ecdd] px-6 py-3 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
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
                            aria-label={t('Слайд {n}', { n: i + 1 })}
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
    const t = useTranslations();
    const latest = newArrivals?.[0];
    const latestImagePath = useThemeImagePath(
        latest?.image_path,
        latest?.image_path_light,
    );
    const slides = buildSlides({
        promoCode,
        newArrivals,
        activeLotsCount,
        t,
        latestImagePath,
    });
    return (
        <div className="relative overflow-hidden bg-[#f6efe3] dark:bg-[#0d0b09]">
            <div className="hero-bg absolute inset-0" />

            <div className="relative mx-auto max-w-[1600px] px-6 pt-8 md:px-12">
                <PromoSlider slides={slides} />
            </div>

            <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-10 px-6 py-12 md:px-12">
                <div className="flex max-w-2xl flex-col gap-3">
                    <h1
                        className="hero-fade-up text-3xl leading-[1.1] font-bold text-[#241a10] md:text-4xl dark:text-[#f6ecdd]"
                        style={{ animationDelay: '0.05s' }}
                    >
                        {t('Пробуй ароматы, не переплачивая')}{' '}
                        <span className="font-display font-semibold text-[#c79a5f] italic">
                            {t('за флакон')}
                        </span>
                    </h1>

                    <p
                        className="hero-fade-up max-w-[440px] text-sm leading-relaxed text-[#7d6952] dark:text-[#b7a58f]"
                        style={{ animationDelay: '0.18s' }}
                    >
                        {t(
                            'Официальный каталог и распив нишевой парфюмерии — от 5 мл на попробовать до полного флакона.',
                        )}
                    </p>

                    <div
                        className="hero-fade-up mt-1"
                        style={{ animationDelay: '0.32s' }}
                    >
                        <Link
                            href="/products"
                            className="hero-cta-sheen relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#c5aa86] px-6 py-3 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase dark:bg-[#c79a5f]"
                        >
                            {t('Смотреть каталог')}
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
    const t = useTranslations();

    return (
        <>
            <Head title={t('Flacony — парфюмерия на распив и в розницу')} />
            <SiteHeader />
            <Hero
                promoCode={promoCode}
                newArrivals={newArrivals}
                activeLotsCount={activeLotsCount}
            />

            {brands.length > 0 && (
                <div className="border-b border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
                    <div className="mx-auto max-w-[1600px] px-6 py-10">
                        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                            {brands.map((brand) => (
                                <span
                                    key={brand.id}
                                    className="text-sm font-semibold tracking-[0.12em] text-[#7d6952] uppercase dark:text-[#b7a58f]"
                                >
                                    {brand.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {featuredProducts.length > 0 && (
                <div className="bg-[#f6efe3] dark:bg-[#0d0b09]">
                    <div className="mx-auto max-w-[1600px] px-6 py-16">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                {t('Популярное')}
                            </h2>
                            <Link
                                href="/products"
                                className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                            >
                                {t('Весь каталог →')}
                            </Link>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {newArrivals.length > 0 && (
                <div className="relative overflow-hidden border-t border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
                    <div className="section-glow pointer-events-none absolute inset-0" />
                    <div className="relative mx-auto max-w-[1600px] px-6 py-16">
                        <h2 className="mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {t('Новинки')}
                        </h2>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
                            {newArrivals.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="border-t border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] px-6 py-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                {t('Розпив від покупців')}
                            </h2>
                            <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {t(
                                    'Остатки чужих флаконов от нескольких мл — и твой можно продать так же',
                                )}
                            </p>
                        </div>
                        <Link
                            href="/lots"
                            className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                        >
                            {t('Весь розпив →')}
                        </Link>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
                        {lots.map((lot) => (
                            <LotCard key={lot.id} lot={lot} />
                        ))}
                        <Link
                            href="/sellers/lots/create"
                            className="flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[#e6d7bb] p-6 text-center transition-colors hover:border-[#c79a5f] dark:border-[#ffffff29]"
                        >
                            <BottleIcon size={48} />
                            <span className="font-display text-xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                {t('Есть что продать?')}
                            </span>
                            <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {t(
                                    'Выставь остаток флакона и получи деньги за то, что не допробуешь',
                                )}
                            </span>
                            <span className="mt-2 rounded-full bg-[#c5aa86] px-6 py-2.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase dark:bg-[#c79a5f]">
                                {t('Выставить лот')}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="relative overflow-hidden border-t border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
                <div className="section-glow-alt pointer-events-none absolute inset-0" />
                <div className="relative mx-auto max-w-[1600px] px-6 py-16">
                    <h2 className="mb-10 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Как это работает')}
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {STEPS.map((step, i) => (
                            <div
                                key={step.title}
                                className="flex flex-col gap-2"
                            >
                                <span className="font-display text-3xl font-semibold text-[#c79a5f] italic">
                                    {i + 1}
                                </span>
                                <span className="text-base font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                    {t(step.title)}
                                </span>
                                <span className="text-sm leading-relaxed text-[#7d6952] dark:text-[#b7a58f]">
                                    {t(step.text)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] px-6 py-16">
                    <h2 className="mb-10 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Что говорят покупатели')}
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {MOCK_TESTIMONIALS.map((testimonial) => (
                            <div
                                key={testimonial.name}
                                className="flex flex-col gap-3 rounded-3xl bg-[#1e160c08] p-6 dark:bg-[#ffffff08]"
                            >
                                <StarRating value={testimonial.rating} />
                                <p className="flex-1 text-sm leading-relaxed text-[#241a10] dark:text-[#f6ecdd]">
                                    {t(testimonial.text)}
                                </p>
                                <div className="mt-1 flex items-center justify-between text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                    <span className="font-semibold">
                                        {testimonial.name}
                                    </span>
                                    <span className="font-display italic">
                                        {t(testimonial.product)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {!auth.user && (
                <div className="relative overflow-hidden border-t border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
                    <div className="section-glow pointer-events-none absolute inset-0" />
                    <div className="relative mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-6 py-16 text-center md:py-20">
                        <h2 className="text-3xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {t('Создай аккаунт')}
                        </h2>
                        <p className="max-w-md text-sm leading-relaxed text-[#7d6952] dark:text-[#b7a58f]">
                            {t(
                                'Оформляй заказы быстрее и следи за историей покупок.',
                            )}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                            {ACCOUNT_BENEFITS.map((benefit) => (
                                <div
                                    key={benefit.text}
                                    className="flex items-center gap-2 text-sm text-[#7d6952] dark:text-[#b7a58f]"
                                >
                                    <benefit.icon
                                        size={16}
                                        strokeWidth={1.75}
                                        className="text-[#c79a5f]"
                                    />
                                    {t(benefit.text)}
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/register"
                            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#c5aa86] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase dark:bg-[#c79a5f]"
                        >
                            {t('Зарегистрироваться')}
                        </Link>
                    </div>
                </div>
            )}

            <SiteFooter />
        </>
    );
}
