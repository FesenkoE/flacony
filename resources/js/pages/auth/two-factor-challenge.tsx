import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';
import {
    AuthCard,
    fieldClass,
    footerLinkClass,
    submitClass,
} from '@/components/brand-auth';
import InputError from '@/components/input-error';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { useTranslations } from '@/hooks/use-translations';
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
    const t = useTranslations();
    const [showRecoveryInput, setShowRecoveryInput] = useState(false);
    const [code, setCode] = useState('');

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <>
            <Head title={t('Двухфакторная аутентификация')} />
            <AuthCard
                title={
                    showRecoveryInput
                        ? t('Резервный код')
                        : t('Код подтверждения')
                }
                subtitle={
                    showRecoveryInput
                        ? t('Введите один из резервных кодов, сохранённых при включении 2FA')
                        : t('Введите код из приложения-аутентификатора')
                }
            >
                <Form
                    {...store.form()}
                    className="mt-8 flex flex-col gap-5"
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <div className="flex flex-col gap-1.5">
                                    <input
                                        name="recovery_code"
                                        type="text"
                                        placeholder={t('Резервный код')}
                                        autoFocus
                                        required
                                        className={fieldClass}
                                    />
                                    <InputError
                                        message={errors.recovery_code}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <InputOTP
                                        name="code"
                                        maxLength={OTP_MAX_LENGTH}
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                        disabled={processing}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        autoFocus
                                    >
                                        <InputOTPGroup>
                                            {Array.from(
                                                { length: OTP_MAX_LENGTH },
                                                (_, index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                        className="h-12 w-11 border-[#e6d7bb] bg-[#fbf5ea] text-lg text-[#241a10] shadow-none first:rounded-l-xl last:rounded-r-xl dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#f6ecdd]"
                                                    />
                                                ),
                                            )}
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className={submitClass}
                            >
                                {t('Продолжить')}
                            </button>

                            <p className="text-center text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                <button
                                    type="button"
                                    className={footerLinkClass}
                                    onClick={() =>
                                        toggleRecoveryMode(clearErrors)
                                    }
                                >
                                    {showRecoveryInput
                                        ? t('Войти по коду из приложения')
                                        : t('Войти по резервному коду')}
                                </button>
                            </p>
                        </>
                    )}
                </Form>
            </AuthCard>
        </>
    );
}
