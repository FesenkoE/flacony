import { Head } from '@inertiajs/react';
import LotForm from '@/components/lot-form';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

export default function LotEdit({ lot }) {
    return (
        <>
            <Head title={`Редактировать — ${lot.product_name}`} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <LotForm
                    action={`/sellers/lots/${lot.id}`}
                    method="put"
                    heading={`Редактировать — ${lot.product_name}`}
                    submitLabel="Сохранить"
                    backHref="/dashboard"
                    backLabel="← Личный кабинет"
                    defaults={lot}
                />
            </div>
            <SiteFooter />
        </>
    );
}
