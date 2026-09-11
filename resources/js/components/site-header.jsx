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
import { logout } from '@/routes';

export default function SiteHeader() {
    const { auth, cart } = usePage().props;
    const [searchOpen, setSearchOpen] = useState(false);

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
            <div className="mx-auto flex max-w-6xl items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#bf8438]" />
                    <span className="text-sm font-bold tracking-[0.22em] text-[#241a10] dark:text-[#f6ecdd]">
                        FLACONY
                    </span>
                </Link>

                <nav className="flex items-center gap-8">
                    <Link
                        href="/products"
                        className="text-sm font-semibold text-[#241a10] dark:text-[#f6ecdd]"
                    >
                        Каталог
                    </Link>

                    <Link
                        href="/sellers"
                        className="hidden text-sm font-semibold text-[#241a10] sm:inline dark:text-[#f6ecdd]"
                    >
                        Продавцы
                    </Link>

                    <Link
                        href="/blog"
                        className="hidden text-sm font-semibold text-[#241a10] sm:inline dark:text-[#f6ecdd]"
                    >
                        Блог
                    </Link>

                    <Link
                        href="/forum"
                        className="hidden text-sm font-semibold text-[#241a10] sm:inline dark:text-[#f6ecdd]"
                    >
                        Форум
                    </Link>

                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center text-[#241a10] dark:text-[#f6ecdd]"
                        aria-label="Поиск"
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
                            <span className="absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#bf8438] px-1 text-[10px] font-bold text-[#1c1408]">
                                {cart.count}
                            </span>
                        )}
                    </Link>

                    {auth.user ? (
                        <>
                            <Link
                                href="/favorites"
                                className="hidden text-sm font-semibold text-[#241a10] sm:inline dark:text-[#f6ecdd]"
                            >
                                Избранное
                            </Link>
                            <Link
                                href="/sellers/lots/create"
                                className="hidden text-sm font-semibold text-[#241a10] sm:inline dark:text-[#f6ecdd]"
                            >
                                Продавать
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="group flex cursor-pointer items-center gap-1.5 rounded-full transition-transform duration-150 hover:scale-105 active:scale-95"
                                    >
                                        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#bf8438] text-xs font-bold text-[#1c1408] ring-2 ring-transparent transition-all duration-150 group-hover:ring-[#bf843866]">
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
                                            className="text-[#8a7860] transition-transform duration-150 group-data-[state=open]:rotate-180 dark:text-[#b7a58f]"
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
                                            Личный кабинет
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/sellers/${auth.user.id}`}>
                                            Моя витрина
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
                                            Выйти
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-[#8a7860] dark:text-[#b7a58f]"
                        >
                            Войти
                        </Link>
                    )}
                </nav>
            </div>

            <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
        </header>
    );
}
