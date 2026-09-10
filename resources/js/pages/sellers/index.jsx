import { Head, Link } from '@inertiajs/react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

export default function SellersIndex({ sellers }) {
    return (
        <>
            <Head title="Продавцы" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-4xl p-6">
                    <h1 className="mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Продавцы
                    </h1>

                    {sellers.length === 0 ? (
                        <p className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                            Пока никто не выставил распив на продажу.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {sellers.map((seller) => (
                                <Link
                                    key={seller.id}
                                    href={`/sellers/${seller.id}`}
                                    className="flex items-center justify-between rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-5 dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
                                >
                                    <span className="font-display text-xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                        {seller.name}
                                    </span>
                                    <span className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                                        {seller.lots_count} лотов
                                    </span>
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
