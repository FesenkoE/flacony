import { Form, Head, Link } from '@inertiajs/react';
import {
    AuthCard,
    footerLinkClass,
    fieldClass,
    GoogleButton,
    labelClass,
    OrSeparator,
    PasswordField,
    submitClass,
} from '@/components/brand-auth';
import InputError from '@/components/input-error';
import { useTranslations } from '@/hooks/use-translations';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Регистрация')} />
            <AuthCard
                title={t('Создать аккаунт')}
                subtitle={t('Чтобы оформлять заказы и продавать распив')}
            >
                <div className="mt-8">
                    <GoogleButton />
                </div>
                <OrSeparator>{t('Или через email')}</OrSeparator>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass} htmlFor="name">
                                    {t('Имя')}
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    placeholder={t('Имя и фамилия')}
                                    className={fieldClass}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass} htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className={fieldClass}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    className={labelClass}
                                    htmlFor="password"
                                >
                                    {t('Пароль')}
                                </label>
                                <PasswordField
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder={t('Пароль')}
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    className={labelClass}
                                    htmlFor="password_confirmation"
                                >
                                    {t('Повторите пароль')}
                                </label>
                                <PasswordField
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    placeholder={t('Повторите пароль')}
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                data-test="register-user-button"
                                className={submitClass}
                            >
                                {t('Зарегистрироваться')}
                            </button>
                        </>
                    )}
                </Form>

                <p className="mt-6 text-center text-sm text-[#7d6952] dark:text-[#b7a58f]">
                    {t('Уже есть аккаунт?')}{' '}
                    <Link href={login()} className={footerLinkClass}>
                        {t('Войти')}
                    </Link>
                </p>
            </AuthCard>
        </>
    );
}
