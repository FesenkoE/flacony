import { Head } from '@inertiajs/react';
import LotForm from '@/components/lot-form';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

export default function LotCreate() {
    return (
        <>
            <Head title="Добавить лот" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <LotForm
                    action="/sellers/lots"
                    method="post"
                    heading="Выставить лот на распив"
                    submitLabel="Выставить на витрину"
                />
            </div>
            <SiteFooter />
        </>
    );
}
