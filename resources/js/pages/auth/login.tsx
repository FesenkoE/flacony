import { Form, Head, Link } from '@inertiajs/react';
import {
    AuthCard,
    AuthStatus,
    fieldClass,
    footerLinkClass,
    GoogleButton,
    labelClass,
    PasswordField,
    submitClass,
} from '@/components/brand-auth';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import { useTranslations } from '@/hooks/use-translations';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Вход')} />
            <AuthCard
                title={t('С возвращением')}
                subtitle={t('Войдите, чтобы продолжить покупки')}
            >
                {status && <AuthStatus>{status}</AuthStatus>}

                <div className="mt-8 flex flex-col gap-3">
                    <GoogleButton />
                    <PasskeyVerify
                        label={t('Войти через пасскей')}
                        loadingLabel={t('Проверяем…')}
                        separator={t('Или через email')}
                    />
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-5"
                >
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

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <label
                                        className={labelClass}
                                        htmlFor="password"
                                    >
                                        {t('Пароль')}
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={request()}
                                            className="text-xs font-semibold text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                                        >
                                            {t('Забыли пароль?')}
                                        </Link>
                                    )}
                                </div>
                                <PasswordField
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder={t('Пароль')}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <label className="flex items-center gap-2.5 text-sm text-[#241a10] dark:text-[#f6ecdd]">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    className="h-4 w-4 shrink-0 rounded border-[#e6d7bb] accent-[#c79a5f] dark:border-[#ffffff29]"
                                />
                                {t('Запомнить меня')}
                            </label>

                            <button
                                type="submit"
                                disabled={processing}
                                data-test="login-button"
                                className={submitClass}
                            >
                                {t('Войти')}
                            </button>
                        </>
                    )}
                </Form>

                <p className="mt-6 text-center text-sm text-[#7d6952] dark:text-[#b7a58f]">
                    {t('Нет аккаунта?')}{' '}
                    <Link href={register()} className={footerLinkClass}>
                        {t('Зарегистрироваться')}
                    </Link>
                </p>
            </AuthCard>
        </>
    );
}
