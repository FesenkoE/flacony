import { Form, Head, Link } from '@inertiajs/react';
import {
    AuthCard,
    AuthStatus,
    footerLinkClass,
    submitClass,
} from '@/components/brand-auth';
import { useTranslations } from '@/hooks/use-translations';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Подтверждение email')} />
            <AuthCard
                title={t('Подтвердите email')}
                subtitle={t(
                    'Мы отправили письмо со ссылкой — перейдите по ней, чтобы завершить регистрацию',
                )}
            >
                {status === 'verification-link-sent' && (
                    <AuthStatus>
                        {t('Новая ссылка отправлена на ваш email')}
                    </AuthStatus>
                )}

                <Form {...send.form()} className="mt-8 flex flex-col">
                    {({ processing }) => (
                        <button
                            type="submit"
                            disabled={processing}
                            className={submitClass}
                        >
                            {t('Отправить письмо ещё раз')}
                        </button>
                    )}
                </Form>

                <p className="mt-6 text-center text-sm text-[#7d6952] dark:text-[#b7a58f]">
                    <Link
                        href={logout()}
                        as="button"
                        className={footerLinkClass}
                    >
                        {t('Выйти')}
                    </Link>
                </p>
            </AuthCard>
        </>
    );
}
