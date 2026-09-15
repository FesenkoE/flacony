import { Head, Link } from '@inertiajs/react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useInitials } from '@/hooks/use-initials';
import { useTranslations } from '@/hooks/use-translations';
import { pluralizeRu } from '@/lib/pluralize';

export default function SellersIndex({ sellers }) {
    const t = useTranslations();
    const getInitials = useInitials();

    return (
        <>
            <Head title={t('Продавцы')} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] p-6">
                    <h1 className="mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Продавцы')}
                    </h1>

                    {sellers.length === 0 ? (
                        <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            {t('Пока никто не выставил распив на продажу.')}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {sellers.map((seller) => (
                                <Link
                                    key={seller.id}
                                    href={`/sellers/${seller.id}`}
                                    className="flex flex-col items-start gap-4 rounded-3xl border border-[#1e160c14] bg-[#fffaf1] p-6 transition-colors hover:border-[#c79a5f66] dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
                                >
                                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c79a5f] text-lg font-bold text-[#3d2712]">
                                        {getInitials(seller.name)}
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-display text-xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                            {seller.name}
                                        </span>
                                        <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                            {t('{count} {word} в продаже', {
                                                count: seller.lots_count,
                                                word: t(
                                                    pluralizeRu(
                                                        seller.lots_count,
                                                        [
                                                            'лот',
                                                            'лота',
                                                            'лотов',
                                                        ],
                                                    ),
                                                ),
                                            })}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
