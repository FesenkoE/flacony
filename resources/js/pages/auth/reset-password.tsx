import { Form, Head } from '@inertiajs/react';
import {
    AuthCard,
    fieldClass,
    labelClass,
    PasswordField,
    submitClass,
} from '@/components/brand-auth';
import InputError from '@/components/input-error';
import { useTranslations } from '@/hooks/use-translations';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Новый пароль')} />
            <AuthCard
                title={t('Новый пароль')}
                subtitle={t('Придумайте новый пароль для входа')}
            >
                <Form
                    {...update.form()}
                    transform={(data) => ({ ...data, token, email })}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="mt-8 flex flex-col gap-5"
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
                                    autoComplete="email"
                                    value={email}
                                    readOnly
                                    className={`${fieldClass} opacity-70`}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    className={labelClass}
                                    htmlFor="password"
                                >
                                    {t('Новый пароль')}
                                </label>
                                <PasswordField
                                    id="password"
                                    name="password"
                                    required
                                    autoFocus
                                    autoComplete="new-password"
                                    placeholder={t('Новый пароль')}
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
                                data-test="reset-password-button"
                                className={submitClass}
                            >
                                {t('Сохранить пароль')}
                            </button>
                        </>
                    )}
                </Form>
            </AuthCard>
        </>
    );
}
