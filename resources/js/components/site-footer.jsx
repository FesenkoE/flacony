import { Link } from '@inertiajs/react';
import { useTranslations } from '@/hooks/use-translations';

export default function SiteFooter() {
    const t = useTranslations();
    return (
        <footer className="border-t border-[#1e160c14] bg-[#f6efe3] dark:border-[#ffffff14] dark:bg-[#0d0b09]">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 py-12 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#c79a5f]" />
                    <span className="text-sm font-bold tracking-[0.22em] text-[#241a10] dark:text-[#f6ecdd]">
                        FLACONY
                    </span>
                </div>

                <nav className="flex gap-8 text-sm">
                    <Link
                        href="/products"
                        className="text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        {t('Каталог')}
                    </Link>
                    <Link
                        href="/lots"
                        className="text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        {t('Розпив')}
                    </Link>
                    <Link
                        href="/blog"
                        className="text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        {t('Блог')}
                    </Link>
                    <Link
                        href="/forum"
                        className="text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        {t('Форум')}
                    </Link>
                    <Link
                        href="/cart"
                        className="text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        {t('Корзина')}
                    </Link>
                </nav>

                <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                    © {new Date().getFullYear()} Flacony
                </span>
            </div>
        </footer>
    );
}
