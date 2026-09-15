import { Head } from '@inertiajs/react';
import LotForm from '@/components/lot-form';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

export default function LotEdit({ lot }) {
    const t = useTranslations();
    const heading = t('Редактировать — {name}', {
        name: lot.product_name,
    });

    return (
        <>
            <Head title={heading} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <LotForm
                    action={`/sellers/lots/${lot.id}`}
                    method="put"
                    heading={heading}
                    submitLabel={t('Сохранить')}
                    backHref="/dashboard"
                    backLabel={`← ${t('Личный кабинет')}`}
                    defaults={lot}
                />
            </div>
            <SiteFooter />
        </>
    );
}
