import { Head, Link, usePage } from '@inertiajs/react';
import { Citrus, Flame, Flower2, TreePine } from 'lucide-react';
import { useState } from 'react';
import BottleIcon from '@/components/bottle-icon';
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

const SCENT_TAGS = [
    { label: 'Woody', icon: TreePine, top: '14%', left: '8%', delay: '0.2s' },
    { label: 'Amber', icon: Flame, top: '84%', left: '6%', delay: '1.4s' },
    { label: 'Citrus', icon: Citrus, top: '22%', right: '9%', delay: '0.8s' },
    {
        label: 'Floral',
        icon: Flower2,
        top: '74%',
        right: '12%',
        delay: '2s',
    },
];

const POUR_BODY_PATH =
    'M52,50 C44,52 34,58 28,68 C27,70 26,72 26,74 L26,170 A8,8 0 0 0 34,178 L86,178 A8,8 0 0 0 94,170 L94,74 C94,72 93,70 92,68 C86,58 76,52 68,50 Z';

function PourDemo({ avgPricePerMl }) {
    const MAX_ML = 15;
    const [volume, setVolume] = useState(5);

    const bodyTop = 60;
    const bodyBottom = 176;
    const fillHeight = ((bodyBottom - bodyTop) * volume) / MAX_ML;
    const fillY = bodyBottom - fillHeight;
    const price = Math.round(volume * avgPricePerMl);

    return (
        <div className="flex flex-col items-center gap-6">
            <svg
                width="160"
                height="220"
                viewBox="0 0 120 200"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <clipPath id="pourBodyClip">
                        <path d={POUR_BODY_PATH} />
                    </clipPath>
                    <linearGradient id="pourLiquid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e2a457" />
                        <stop offset="100%" stopColor="#8a5a20" />
                    </linearGradient>
                </defs>

                <g clipPath="url(#pourBodyClip)">
                    <rect
                        x="20"
                        width="80"
                        y={fillY}
                        height={fillHeight}
                        fill="url(#pourLiquid)"
                        style={{
                            transition: 'y 0.3s ease-out, height 0.3s ease-out',
                        }}
                    />
                </g>

                <path
                    d={POUR_BODY_PATH}
                    fill="none"
                    stroke="#bf8438"
                    strokeOpacity="0.55"
                    strokeWidth="2"
                />
                <rect
                    x="52"
                    y="28"
                    width="16"
                    height="24"
                    fill="none"
                    stroke="#bf8438"
                    strokeOpacity="0.55"
                    strokeWidth="2"
                />
                <rect
                    x="44"
                    y="6"
                    width="32"
                    height="24"
                    rx="8"
                    fill="#bf8438"
                />
            </svg>

            <div className="flex w-full max-w-[260px] flex-col gap-2">
                <div className="flex items-baseline justify-between">
                    <span className="font-display text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {volume} мл
                    </span>
                    <span className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                        ~{price} ₴
                    </span>
                </div>
                <input
                    type="range"
                    min={1}
                    max={MAX_ML}
                    step={1}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    style={{ accentColor: '#bf8438' }}
                    className="w-full"
                />
                <span className="text-center text-xs text-[#8a7860] dark:text-[#b7a58f]">
                    Столько распива можно взять на пробу
                </span>
            </div>
        </div>
    );
}

function Hero({ avgPricePerMl }) {
    const [tilt, setTilt] = useState({ x: 0, y: 0, shiftX: 0, shiftY: 0 });

    function handleMouseMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({
            x: py * -26,
            y: px * 34,
            shiftX: px * 24,
            shiftY: py * 16,
        });
    }

    function handleMouseLeave() {
        setTilt({ x: 0, y: 0, shiftX: 0, shiftY: 0 });
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-[760px] overflow-hidden bg-[#f6efe3] dark:bg-[#0d0b09]"
        >
            <div className="hero-bg absolute inset-0" />

            <div className="relative mx-auto grid min-h-[760px] max-w-[1600px] grid-cols-1 items-center gap-6 px-6 md:grid-cols-[1.1fr_0.9fr] md:px-12">
                {SCENT_TAGS.map((tag) => (
                    <span
                        key={tag.label}
                        className="hero-float hero-tag absolute hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs tracking-wide backdrop-blur-[10px] md:flex"
                        style={{
                            top: tag.top,
                            left: tag.left,
                            right: tag.right,
                            animationDelay: tag.delay,
                        }}
                    >
                        <tag.icon size={13} strokeWidth={1.75} />
                        {tag.label}
                    </span>
                ))}
                <div className="flex flex-col gap-5">
                    <span
                        className="hero-fade-up text-[13px] font-bold tracking-[0.3em] text-[#bf8438]"
                        style={{ animationDelay: '0.05s' }}
                    >
                        FLACONY
                    </span>

                    <h1
                        className="hero-fade-up text-5xl leading-[1.04] font-bold text-[#241a10] md:text-6xl dark:text-[#f6ecdd]"
                        style={{ animationDelay: '0.18s' }}
                    >
                        Пробуй ароматы,
                        <br />
                        не переплачивая{' '}
                        <span className="font-display font-semibold text-[#bf8438] italic">
                            за флакон
                        </span>
                    </h1>

                    <p
                        className="hero-fade-up max-w-[440px] text-base leading-relaxed text-[#8a7860] dark:text-[#b7a58f]"
                        style={{ animationDelay: '0.32s' }}
                    >
                        Официальный каталог и распив нишевой парфюмерии — от 5
                        мл на попробовать до полного флакона.
                    </p>

                    <div
                        className="hero-fade-up"
                        style={{ animationDelay: '0.46s' }}
                    >
                        <Link
                            href="/products"
                            className="hero-cta-sheen relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#bf8438] px-7 py-4 text-sm font-bold tracking-[0.04em] text-[#1c1408] uppercase"
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

                <div className="relative flex h-[480px] items-center justify-center">
                    <div
                        className="hero-glow absolute h-[380px] w-[380px] rounded-full blur-[16px]"
                        style={{
                            background:
                                'radial-gradient(circle, #bf843870 0%, transparent 70%)',
                            transform: `translate(${tilt.shiftX * 1.6}px, ${tilt.shiftY * 1.6}px)`,
                            transition: 'transform 0.12s ease-out',
                        }}
                    />
                    <PourDemo avgPricePerMl={avgPricePerMl} />
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
    avgPricePerMl,
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Flacony — парфюмерия на распив и в розницу" />
            <SiteHeader />
            <Hero avgPricePerMl={avgPricePerMl} />

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
