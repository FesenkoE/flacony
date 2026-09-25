import { usePasskeyRegister } from '@laravel/passkeys/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import {
    fieldClass,
    labelClass,
    mutedTextClass,
    panelClass,
    secondaryButtonClass,
    submitClass,
} from '@/components/brand-auth';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

type Props = {
    onSuccess: () => void;
};

export default function PasskeyRegistration({ onSuccess }: Props) {
    const t = useTranslations();
    const [name, setName] = useState(() => {
        const ua = navigator.userAgent;

        const browser = [
            { pattern: /Edg|Edge/, name: 'Edge' },
            { pattern: /OPR|Opera|OPiOS/, name: 'Opera' },
            { pattern: /Firefox|FxiOS/, name: 'Firefox' },
            { pattern: /Chrome|CriOS/, name: 'Chrome' },
            { pattern: /Safari/, name: 'Safari' },
        ].find(({ pattern }) => pattern.test(ua))?.name;

        const os = [
            { pattern: /iPhone/, name: 'iPhone' },
            { pattern: /iPad|Macintosh(?=.*Mobile)/, name: 'iPad' },
            { pattern: /Android/, name: 'Android' },
            { pattern: /Mac/, name: 'Mac' },
            { pattern: /Windows/, name: 'Windows' },
        ].find(({ pattern }) => pattern.test(ua))?.name;

        return [browser, os].filter(Boolean).join(' · ') || '';
    });

    const [showForm, setShowForm] = useState(false);
    const { register, isLoading, error, isSupported } = usePasskeyRegister({
        onSuccess: () => {
            setName('');
            setShowForm(false);
            onSuccess();
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        await register(name);
    };

    const handleCancel = () => {
        setShowForm(false);
        setName('');
    };

    if (!isSupported) {
        return (
            <div className={mutedTextClass}>
                {t('Этот браузер не поддерживает пасскеи.')}
            </div>
        );
    }

    if (!showForm) {
        return (
            <button
                type="button"
                onClick={() => setShowForm(true)}
                className={secondaryButtonClass}
            >
                {t('Добавить пасскей')}
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`space-y-4 p-4 ${panelClass}`}
        >
            <div className="flex flex-col gap-1.5">
                <label className={labelClass} htmlFor="passkey-name">
                    {t('Название')}
                </label>
                <input
                    id="passkey-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('Например, MacBook или iPhone')}
                    className={fieldClass}
                    autoFocus
                />
                <p className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                    {t('Чтобы потом отличить этот пасскей от других.')}
                </p>
            </div>

            {error && <InputError message={error} />}

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={isLoading || !name.trim()}
                    className={cn(submitClass, 'mt-0 px-5 py-2.5')}
                >
                    {isLoading ? t('Добавляем…') : t('Добавить')}
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className={secondaryButtonClass}
                >
                    {t('Отмена')}
                </button>
            </div>
        </form>
    );
}
