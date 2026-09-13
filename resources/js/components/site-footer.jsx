import { Link } from '@inertiajs/react';

export default function SiteFooter() {
    return (
        <footer className="border-t border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 py-12 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#bf8438]" />
                    <span className="text-sm font-bold tracking-[0.22em] text-[#241a10] dark:text-[#f6ecdd]">
                        FLACONY
                    </span>
                </div>

                <nav className="flex gap-8 text-sm">
                    <Link
                        href="/products"
                        className="text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        Каталог
                    </Link>
                    <Link
                        href="/lots"
                        className="text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        Розпив
                    </Link>
                    <Link
                        href="/blog"
                        className="text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        Блог
                    </Link>
                    <Link
                        href="/forum"
                        className="text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        Форум
                    </Link>
                    <Link
                        href="/cart"
                        className="text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        Корзина
                    </Link>
                </nav>

                <span className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
                    © {new Date().getFullYear()} Flacony
                </span>
            </div>
        </footer>
    );
}
