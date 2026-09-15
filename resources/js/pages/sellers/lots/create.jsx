import { Head } from '@inertiajs/react';
import LotForm from '@/components/lot-form';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

export default function LotCreate() {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Добавить лот')} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <LotForm
                    action="/sellers/lots"
                    method="post"
                    heading={t('Выставить лот на распив')}
                    submitLabel={t('Выставить на витрину')}
                />
            </div>
            <SiteFooter />
        </>
    );
}
