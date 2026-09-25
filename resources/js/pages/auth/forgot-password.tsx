import { Form, Head, Link } from '@inertiajs/react';
import {
    AuthCard,
    AuthStatus,
    fieldClass,
    footerLinkClass,
    labelClass,
    submitClass,
} from '@/components/brand-auth';
import InputError from '@/components/input-error';
import { useTranslations } from '@/hooks/use-translations';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Восстановление пароля')} />
            <AuthCard
                title={t('Забыли пароль?')}
                subtitle={t(
                    'Укажите email — пришлём ссылку, чтобы задать новый пароль',
                )}
            >
                {status && <AuthStatus>{status}</AuthStatus>}

                <Form {...email.form()} className="mt-8 flex flex-col gap-5">
                    {({ processing, errors }) => (
                        <>
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass} htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className={fieldClass}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                                className={submitClass}
                            >
                                {t('Отправить ссылку')}
                            </button>
                        </>
                    )}
                </Form>

                <p className="mt-6 text-center text-sm text-[#7d6952] dark:text-[#b7a58f]">
                    {t('Вспомнили пароль?')}{' '}
                    <Link href={login()} className={footerLinkClass}>
                        {t('Войти')}
                    </Link>
                </p>
            </AuthCard>
        </>
    );
}
