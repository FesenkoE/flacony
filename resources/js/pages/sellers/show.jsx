import { Head, Link, usePage } from '@inertiajs/react';
import LotCard from '@/components/lot-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

export default function SellerShow({ seller, lots }) {
    const t = useTranslations();
    const { auth } = usePage().props;
    const isOwnStorefront = auth.user?.id === seller.id;

    return (
        <>
            <Head title={t('Витрина {name}', { name: seller.name })} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] p-6">
                    <Link
                        href="/sellers"
                        className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← {t('Продавцы')}
                    </Link>

                    <div className="mt-4 mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {t('Витрина {name}', { name: seller.name })}
                        </h1>
                        {isOwnStorefront && (
                            <Link
                                href="/sellers/lots/create"
                                className="rounded-full bg-[#c5aa86] px-5 py-2.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase dark:bg-[#c79a5f]"
                            >
                                + {t('Добавить лот')}
                            </Link>
                        )}
                    </div>

                    {lots.length === 0 ? (
                        <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            {isOwnStorefront
                                ? t('У тебя пока нет активных лотов.')
                                : t('У продавца сейчас нет активных лотов.')}
                        </p>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
                            {lots.map((lot) => (
                                <LotCard
                                    key={lot.id}
                                    lot={lot}
                                    isOwn={isOwnStorefront}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
