import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useTranslations } from '@/hooks/use-translations';
import { cn, toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Профиль',
        href: edit(),
        icon: null,
    },
    {
        title: 'Безопасность',
        href: editSecurity(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const t = useTranslations();
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <>
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] text-[#241a10] dark:bg-[#0d0b09] dark:text-[#f6ecdd]">
                <div className="mx-auto max-w-4xl px-6 py-10">
                    <Heading
                        title={t('Настройки')}
                        description={t('Профиль и параметры аккаунта')}
                    />

                    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                        <aside className="w-full lg:w-48">
                            <nav
                                className="flex flex-col gap-1"
                                aria-label={t('Настройки')}
                            >
                                {sidebarNavItems.map((item, index) => (
                                    <Link
                                        key={`${toUrl(item.href)}-${index}`}
                                        href={item.href}
                                        className={cn(
                                            'rounded-full px-4 py-2 text-sm font-semibold',
                                            isCurrentOrParentUrl(item.href)
                                                ? 'bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]'
                                                : 'text-[#7d6952] dark:text-[#b7a58f]',
                                        )}
                                    >
                                        {t(item.title)}
                                    </Link>
                                ))}
                            </nav>
                        </aside>

                        <Separator className="bg-[#1e160c14] lg:hidden dark:bg-[#ffffff1a]" />

                        <div className="flex-1 md:max-w-2xl">
                            <section className="max-w-xl space-y-12">
                                {children}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
