import { Form } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Check, Copy, ScanLine } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AlertError from '@/components/alert-error';
import InputError from '@/components/input-error';
import {
    dialogClass,
    secondaryButtonClass,
    submitClass,
} from '@/components/brand-auth';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { useAppearance } from '@/hooks/use-appearance';
import { useClipboard } from '@/hooks/use-clipboard';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { confirm } from '@/routes/two-factor';

function GridScanIcon() {
    return (
        <div className="mb-3 rounded-full border border-[#e6d7bb] p-0.5 dark:border-[#ffffff29]">
            <div className="relative overflow-hidden rounded-full border border-[#e6d7bb] bg-[#c79a5f1a] p-2.5 dark:border-[#ffffff29]">
                <div className="absolute inset-0 grid grid-cols-5 opacity-50">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={`col-${i + 1}`}
                            className="border-r border-[#e6d7bb] last:border-r-0 dark:border-[#ffffff29]"
                        />
                    ))}
                </div>
                <div className="absolute inset-0 grid grid-rows-5 opacity-50">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={`row-${i + 1}`}
                            className="border-b border-[#e6d7bb] last:border-b-0 dark:border-[#ffffff29]"
                        />
                    ))}
                </div>
                <ScanLine className="relative z-20 size-6 text-[#241a10] dark:text-[#f6ecdd]" />
            </div>
        </div>
    );
}

function TwoFactorSetupStep({
    qrCodeSvg,
    manualSetupKey,
    buttonText,
    onNextStep,
    errors,
}: {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
}) {
    const t = useTranslations();
    const { resolvedAppearance } = useAppearance();
    const [copiedText, copy] = useClipboard();
    const IconComponent = copiedText === manualSetupKey ? Check : Copy;

    return (
        <>
            {errors?.length ? (
                <AlertError errors={errors} />
            ) : (
                <>
                    <div className="mx-auto flex max-w-md overflow-hidden">
                        <div className="mx-auto aspect-square w-64 rounded-2xl border border-[#e6d7bb] dark:border-[#ffffff29]">
                            <div className="z-10 flex h-full w-full items-center justify-center p-5">
                                {qrCodeSvg ? (
                                    <div
                                        className="aspect-square w-full rounded-lg bg-white p-2 [&_svg]:size-full"
                                        dangerouslySetInnerHTML={{
                                            __html: qrCodeSvg,
                                        }}
                                        style={{
                                            filter:
                                                resolvedAppearance === 'dark'
                                                    ? 'invert(1) brightness(1.5)'
                                                    : undefined,
                                        }}
                                    />
                                ) : (
                                    <Spinner />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full space-x-5">
                        <button
                            type="button"
                            className={cn(submitClass, 'mt-0 w-full')}
                            onClick={onNextStep}
                        >
                            {buttonText}
                        </button>
                    </div>

                    <div className="relative flex w-full items-center justify-center">
                        <div className="absolute inset-0 top-1/2 h-px w-full bg-[#1e160c14] dark:bg-[#ffffff1a]" />
                        <span className="relative bg-[#fffaf1] px-2 py-1 text-xs text-[#7d6952] uppercase dark:bg-[#130f0b] dark:text-[#b7a58f]">
                            {t('или введите ключ вручную')}
                        </span>
                    </div>

                    <div className="flex w-full space-x-2">
                        <div className="flex w-full items-stretch overflow-hidden rounded-xl border border-[#e6d7bb] dark:border-[#ffffff29]">
                            {!manualSetupKey ? (
                                <div className="flex h-full w-full items-center justify-center bg-[#fbf5ea] p-3 dark:bg-[#ffffff0a]">
                                    <Spinner />
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        readOnly
                                        value={manualSetupKey}
                                        className="h-full w-full bg-[#fbf5ea] p-3 font-mono text-sm text-[#241a10] outline-none dark:bg-[#ffffff0a] dark:text-[#f6ecdd]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => copy(manualSetupKey)}
                                        aria-label={t('Скопировать')}
                                        className="border-l border-[#e6d7bb] px-3 text-[#7d6952] hover:bg-[#f6efe3] dark:border-[#ffffff29] dark:text-[#b7a58f] dark:hover:bg-[#ffffff0a]"
                                    >
                                        <IconComponent className="w-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

function TwoFactorVerificationStep({
    onClose,
    onBack,
}: {
    onClose: () => void;
    onBack: () => void;
}) {
    const t = useTranslations();
    const [code, setCode] = useState<string>('');
    const pinInputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            pinInputContainerRef.current?.querySelector('input')?.focus();
        }, 0);
    }, []);

    return (
        <Form
            {...confirm.form()}
            onSuccess={() => onClose()}
            resetOnError
            resetOnSuccess
        >
            {({
                processing,
                errors,
            }: {
                processing: boolean;
                errors?: { confirmTwoFactorAuthentication?: { code?: string } };
            }) => (
                <>
                    <div
                        ref={pinInputContainerRef}
                        className="relative w-full space-y-3"
                    >
                        <div className="flex w-full flex-col items-center space-y-3 py-2">
                            <InputOTP
                                id="otp"
                                name="code"
                                maxLength={OTP_MAX_LENGTH}
                                onChange={setCode}
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
                            <InputError
                                message={
                                    errors?.confirmTwoFactorAuthentication?.code
                                }
                            />
                        </div>

                        <div className="flex w-full space-x-5">
                            <button
                                type="button"
                                className={`${secondaryButtonClass} flex-1 justify-center`}
                                onClick={onBack}
                                disabled={processing}
                            >
                                {t('Назад')}
                            </button>
                            <button
                                type="submit"
                                className={cn(submitClass, 'mt-0 flex-1 py-2.5')}
                                disabled={
                                    processing || code.length < OTP_MAX_LENGTH
                                }
                            >
                                {t('Подтвердить')}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorSetupModal({
    isOpen,
    onClose,
    requiresConfirmation,
    twoFactorEnabled,
    qrCodeSvg,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    errors,
}: Props) {
    const t = useTranslations();
    const [showVerificationStep, setShowVerificationStep] =
        useState<boolean>(false);

    const modalConfig = useMemo<{
        title: string;
        description: string;
        buttonText: string;
    }>(() => {
        if (twoFactorEnabled) {
            return {
                title: t('2FA включена'),
                description: t(
                    'Отсканируйте QR-код или введите ключ в приложении-аутентификаторе.',
                ),
                buttonText: t('Закрыть'),
            };
        }

        if (showVerificationStep) {
            return {
                title: t('Проверка кода'),
                description: t(
                    'Введите 6-значный код из приложения-аутентификатора',
                ),
                buttonText: t('Продолжить'),
            };
        }

        return {
            title: t('Включение 2FA'),
            description: t(
                'Отсканируйте QR-код или введите ключ в приложении-аутентификаторе, чтобы завершить настройку',
            ),
            buttonText: t('Продолжить'),
        };
    }, [twoFactorEnabled, showVerificationStep, t]);

    const resetModalState = useCallback(() => {
        if (twoFactorEnabled) {
            clearSetupData();
        }

        setShowVerificationStep(false);
    }, [clearSetupData, twoFactorEnabled]);

    const handleClose = useCallback(() => {
        resetModalState();
        onClose();
    }, [onClose, resetModalState]);

    const handleModalNextStep = useCallback(() => {
        if (requiresConfirmation) {
            setShowVerificationStep(true);

            return;
        }

        clearSetupData();
        handleClose();
    }, [requiresConfirmation, clearSetupData, handleClose]);

    const fetchSetupDataRef = useRef(fetchSetupData);

    useEffect(() => {
        fetchSetupDataRef.current = fetchSetupData;
    }, [fetchSetupData]);

    useEffect(() => {
        if (isOpen && !qrCodeSvg) {
            void fetchSetupDataRef.current();
        }
    }, [isOpen, qrCodeSvg]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className={`sm:max-w-md ${dialogClass}`}>
                <DialogHeader className="flex items-center justify-center">
                    <GridScanIcon />
                    <DialogTitle className="font-display text-xl font-semibold italic">
                        {modalConfig.title}
                    </DialogTitle>
                    <DialogDescription className="text-center text-[#7d6952] dark:text-[#b7a58f]">
                        {modalConfig.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-5">
                    {showVerificationStep ? (
                        <TwoFactorVerificationStep
                            onClose={handleClose}
                            onBack={() => setShowVerificationStep(false)}
                        />
                    ) : (
                        <TwoFactorSetupStep
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            buttonText={modalConfig.buttonText}
                            onNextStep={handleModalNextStep}
                            errors={errors}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
