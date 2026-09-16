import { Head } from '@inertiajs/react';
import LotForm from '@/components/lot-form';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

export default function LotCreate({ brands, productNames }) {
    const t = useTranslations();

    return (
        <div className="flex min-h-screen flex-col">
            <Head title={t('Добавить лот')} />
            <SiteHeader />
            <div className="flex-1 bg-[#f6efe3] dark:bg-[#0d0b09]">
                <LotForm
                    action="/sellers/lots"
                    method="post"
                    heading={t('Выставить лот на распив')}
                    submitLabel={t('Выставить на витрину')}
                    brands={brands}
                    productNames={productNames}
                />
            </div>
            <SiteFooter />
        </div>
    );
}
