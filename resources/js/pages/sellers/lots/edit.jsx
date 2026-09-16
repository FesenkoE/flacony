import { Head } from '@inertiajs/react';
import LotForm from '@/components/lot-form';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

export default function LotEdit({ lot, brands, productNames }) {
    const t = useTranslations();
    const heading = t('Редактировать — {name}', {
        name: lot.product_name,
    });

    return (
        <div className="flex min-h-screen flex-col">
            <Head title={heading} />
            <SiteHeader />
            <div className="flex-1 bg-[#f6efe3] dark:bg-[#0d0b09]">
                <LotForm
                    action={`/sellers/lots/${lot.id}`}
                    method="put"
                    heading={heading}
                    submitLabel={t('Сохранить')}
                    backHref="/dashboard"
                    backLabel={`← ${t('Личный кабинет')}`}
                    defaults={lot}
                    brands={brands}
                    productNames={productNames}
                />
            </div>
            <SiteFooter />
        </div>
    );
}
