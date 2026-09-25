import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SearchOverlay from '@/components/search-overlay';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useAppearance } from '@/hooks/use-appearance';
import { useTranslations } from '@/hooks/use-translations';
import { logout } from '@/routes';

const MOBILE_NAV_LINK_CLASS =
    'text-base font-semibold text-[#241a10] dark:text-[#f6ecdd]';

export default function SiteHeader() {
    const { auth, cart, locale } = usePage().props;
    const t = useTranslations();
    const [searchOpen, setSearchOpen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted && resolvedAppearance === 'dark';
    const LOCALES = [
        { code: 'uk', label: 'Укр' },
        { code: 'ru', label: 'рус' },
    ];
    const currentLocaleLabel =
        LOCALES.find((option) => option.code === locale)?.label ?? locale;

    useEffect(() => {
        function onKeyDown(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <header className="site-header sticky top-0 z-10 border-b border-[#1e160c14] px-6 py-4 backdrop-blur-lg md:px-10 dark:border-[#ffffff14]">
            <div className="mx-auto grid max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-4 sm:flex sm:justify-between">
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                className="flex items-center text-[#241a10] outline-none sm:hidden dark:text-[#f6ecdd]"
                                aria-label={t('Меню')}
                            >
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-72 gap-0 border-[#1e160c14] bg-[#f6efe3] p-6 dark:border-[#ffffff1a] dark:bg-[#0d0b09]"
                        >
                            <SheetTitle className="mb-6 flex items-center gap-2.5 border-b border-[#1e160c14] pb-6 text-lg font-bold tracking-[0.22em] text-[#241a10] dark:border-[#ffffff1a] dark:text-[#f6ecdd]">
                                <span className="h-3 w-3 rounded-full bg-[#c79a5f]" />
                                FLACONY
                            </SheetTitle>
                            <nav className="flex flex-col gap-5">
                                <Link
                                    href="/products"
                                    className={MOBILE_NAV_LINK_CLASS}
                                >
                                    {t('Каталог')}
                                </Link>
                                <Link
                                    href="/lots"
                                    className={MOBILE_NAV_LINK_CLASS}
                                >
                                    {t('Розпив')}
                                </Link>
                                <Link
                                    href="/blog"
                                    className={MOBILE_NAV_LINK_CLASS}
                                >
                                    {t('Блог')}
                                </Link>
                                <Link
                                    href="/forum"
                                    className={MOBILE_NAV_LINK_CLASS}
                                >
                                    {t('Форум')}
                                </Link>

                                {auth.user && (
                                    <>
                                        <div className="border-t border-[#1e160c14] dark:border-[#ffffff1a]" />
                                        <Link
                                            href="/favorites"
                                            className={MOBILE_NAV_LINK_CLASS}
                                        >
                                            {t('Избранное')}
                                        </Link>
                                        <Link
                                            href="/sellers/lots/create"
                                            className={MOBILE_NAV_LINK_CLASS}
                                        >
                                            {t('Продавать')}
                                        </Link>
                                    </>
                                )}

                                <div className="border-t border-[#1e160c14] dark:border-[#ffffff1a]" />

                                <div className="flex items-center gap-4">
                                    {LOCALES.map((option) => (
                                        <Link
                                            key={option.code}
                                            href={`/locale/${option.code}`}
                                            method="post"
                                            as="button"
                                            preserveScroll
                                            className={
                                                option.code === locale
                                                    ? 'text-sm font-bold text-[#241a10] dark:text-[#f6ecdd]'
                                                    : 'text-sm font-bold text-[#7d6952] dark:text-[#b7a58f]'
                                            }
                                        >
                                            {option.label}
                                        </Link>
                                    ))}
                                    <span className="text-[#1e160c29] dark:text-[#ffffff29]">
                                        |
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateAppearance(
                                                resolvedAppearance === 'dark'
                                                    ? 'light'
                                                    : 'dark',
                                            )
                                        }
                                        className="text-sm font-semibold text-[#7d6952] dark:text-[#b7a58f]"
                                    >
                                        {isDark
                                            ? t('Светлая тема')
                                            : t('Тёмная тема')}
                                    </button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <Link
                        href="/"
                        className="hidden items-center gap-2 sm:flex"
                    >
                        <span className="h-2.5 w-2.5 rounded-full bg-[#c79a5f]" />
                        <span className="text-sm font-bold tracking-[0.22em] text-[#241a10] dark:text-[#f6ecdd]">
                            FLACONY
                        </span>
                    </Link>
                </div>

                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 sm:hidden"
                >
                    <span className="h-2.5 w-2.5 rounded-full bg-[#c79a5f]" />
                    <span className="text-sm font-bold tracking-[0.22em] text-[#241a10] dark:text-[#f6ecdd]">
                        FLACONY
                    </span>
                </Link>

                <nav className="flex items-center gap-8">
                    <Link
                        href="/products"
                        className="hidden text-sm font-semibold text-[#241a10] sm:inline dark:text-[#f6ecdd]"
                    >
                        {t('Каталог')}
                    </Link>

                    <Link
                        href="/lots"
                        className="hidden text-sm font-semibold text-[#241a10] sm:inline dark:text-[#f6ecdd]"
                    >
                        {t('Розпив')}
                    </Link>

                    <Link
                        href="/blog"
                        className="hidden text-sm font-semibold text-[#241a10] sm:inline dark:text-[#f6ecdd]"
                    >
                        {t('Блог')}
                    </Link>

                    <Link
                        href="/forum"
                        className="hidden text-sm font-semibold text-[#241a10] sm:inline dark:text-[#f6ecdd]"
                    >
                        {t('Форум')}
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="hidden items-center gap-1 text-sm font-bold tracking-[0.08em] text-[#7d6952] outline-none sm:flex dark:text-[#b7a58f]"
                                aria-label={t('Выбрать язык')}
                            >
                                {currentLocaleLabel}
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="min-w-24 border-[#1e160c14] bg-[#fffaf1] text-[#241a10] dark:border-[#ffffff1a] dark:bg-[#130f0b] dark:text-[#f6ecdd]"
                        >
                            {LOCALES.map((option) => (
                                <DropdownMenuItem key={option.code} asChild>
                                    <Link
                                        href={`/locale/${option.code}`}
                                        method="post"
                                        as="button"
                                        preserveScroll
                                        className="flex w-full items-center justify-between"
                                    >
                                        {option.label}
                                        {option.code === locale && (
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                        )}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center text-[#241a10] dark:text-[#f6ecdd]"
                        aria-label={t('Поиск')}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            updateAppearance(
                                resolvedAppearance === 'dark'
                                    ? 'light'
                                    : 'dark',
                            )
                        }
                        className="hidden items-center text-[#241a10] sm:flex dark:text-[#f6ecdd]"
                        aria-label={
                            isDark
                                ? t('Включить светлую тему')
                                : t('Включить тёмную тему')
                        }
                    >
                        {isDark ? (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                            </svg>
                        ) : (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
                            </svg>
                        )}
                    </button>

                    <Link
                        href="/cart"
                        className="relative flex items-center text-[#241a10] dark:text-[#f6ecdd]"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M6 6h15l-1.5 9h-12z" />
                            <path d="M6 6 5 3H2" />
                            <circle cx="9" cy="20" r="1" />
                            <circle cx="18" cy="20" r="1" />
                        </svg>
                        {cart.count > 0 && (
                            <span className="absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c79a5f] px-1 text-[10px] font-bold text-[#3d2712]">
                                {cart.count}
                            </span>
                        )}
                    </Link>

                    {auth.user ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="group flex cursor-pointer items-center gap-1.5 rounded-full transition-transform duration-150 outline-none hover:scale-105 active:scale-95"
                                    >
                                        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#c79a5f] text-xs font-bold text-[#3d2712] ring-2 ring-transparent transition-all duration-150 group-hover:ring-[#c79a5f66]">
                                            {auth.user.name
                                                .split(' ')
                                                .map((part) => part[0])
                                                .join('')
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-[#7d6952] transition-transform duration-150 group-data-[state=open]:rotate-180 dark:text-[#b7a58f]"
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="border-[#1e160c14] bg-[#fffaf1] text-[#241a10] dark:border-[#ffffff1a] dark:bg-[#130f0b] dark:text-[#f6ecdd]"
                                >
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">
                                            {t('Личный кабинет')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/favorites">
                                            {t('Избранное')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/sellers/${auth.user.id}`}>
                                            {t('Моя витрина')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/sellers/lots/create">
                                            {t('Продавать')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings/profile">
                                            {t('Настройки')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-[#1e160c14] dark:bg-[#ffffff1a]" />
                                    <DropdownMenuItem
                                        asChild
                                        variant="destructive"
                                    >
                                        <Link
                                            href={logout()}
                                            as="button"
                                            className="w-full"
                                        >
                                            {t('Выйти')}
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-[#7d6952] dark:text-[#b7a58f]"
                        >
                            {t('Войти')}
                        </Link>
                    )}
                </nav>
            </div>

            <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
        </header>
    );
}
