import { Form, Head } from '@inertiajs/react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import {
    AuthCard,
    labelClass,
    PasswordField,
    submitClass,
} from '@/components/brand-auth';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import { useTranslations } from '@/hooks/use-translations';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Подтверждение пароля')} />
            <AuthCard
                title={t('Подтвердите, что это вы')}
                subtitle={t(
                    'Это защищённый раздел — введите пароль, чтобы продолжить',
                )}
            >
                <div className="mt-8">
                    <PasskeyVerify
                        routes={{
                            options: confirmOptions(),
                            submit: confirmStore(),
                        }}
                        label={t('Подтвердить пасскеем')}
                        loadingLabel={t('Проверяем…')}
                        separator={t('Или паролем')}
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
                                    autoFocus
                                    autoComplete="current-password"
                                    placeholder={t('Пароль')}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                data-test="confirm-password-button"
                                className={submitClass}
                            >
                                {t('Подтвердить')}
                            </button>
                        </>
                    )}
                </Form>
            </AuthCard>
        </>
    );
}
