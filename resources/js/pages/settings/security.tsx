import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import {
    labelClass,
    mutedTextClass,
    PasswordField,
    submitClass,
} from '@/components/brand-auth';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import { useTranslations } from '@/hooks/use-translations';

// oxfmt-ignore
type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const t = useTranslations();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title={t('Безопасность')} />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('Смена пароля')}
                    description={t(
                        'Длинный случайный пароль надёжнее всего защищает аккаунт',
                    )}
                />

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="flex flex-col gap-5"
                >
                    {({ errors, processing, recentlySuccessful }) => (
                        <>
                            <div className="flex flex-col gap-1.5">
                                <label
                                    className={labelClass}
                                    htmlFor="current_password"
                                >
                                    {t('Текущий пароль')}
                                </label>
                                <PasswordField
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    autoComplete="current-password"
                                    placeholder={t('Текущий пароль')}
                                />
                                <InputError message={errors.current_password} />
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
                                    ref={passwordInput}
                                    name="password"
                                    autoComplete="new-password"
                                    placeholder={t('Новый пароль')}
                                    passwordrules={props.passwordRules}
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
                                    autoComplete="new-password"
                                    placeholder={t('Повторите пароль')}
                                    passwordrules={props.passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-password-button"
                                    className={submitClass}
                                >
                                    {t('Сохранить')}
                                </button>
                                {recentlySuccessful && (
                                    <span className={`mt-2 ${mutedTextClass}`}>
                                        {t('Пароль обновлён')}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <ManageTwoFactor
                canManageTwoFactor={props.canManageTwoFactor}
                requiresConfirmation={props.requiresConfirmation}
                twoFactorEnabled={props.twoFactorEnabled}
            />

            <ManagePasskeys
                canManagePasskeys={props.canManagePasskeys}
                passkeys={props.passkeys}
            />
        </>
    );
}
