import { router } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import { destroy } from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyRegistrationController';
import { mutedTextClass, panelClass } from '@/components/brand-auth';
import Heading from '@/components/heading';
import PasskeyItem from '@/components/passkey-item';
import PasskeyRegistration from '@/components/passkey-register';
import { useTranslations } from '@/hooks/use-translations';
import type { Passkey } from '@/types/auth';

export type Props = {
    canManagePasskeys?: boolean;
    passkeys?: Passkey[];
};

const EmptyState = () => {
    const t = useTranslations();

    return (
        <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c79a5f29]">
                <KeyRound className="h-7 w-7 text-[#7d6952] dark:text-[#b7a58f]" />
            </div>
            <p className="font-semibold">{t('Пасскеев пока нет')}</p>
            <p className={`mt-1 ${mutedTextClass}`}>
                {t('Добавьте пасскей, чтобы входить без пароля')}
            </p>
        </div>
    );
};

export default function ManagePasskeys(props: Props) {
    const t = useTranslations();
    const passkeys = props.passkeys ?? [];

    const handleDelete = (id: number, onError: () => void) => {
        router.delete(destroy.url(id), {
            preserveScroll: true,
            onError,
        });
    };

    const handleRegisterSuccess = () => {
        router.reload();
    };

    if (!(props.canManagePasskeys ?? false)) {
        return null;
    }

    return (
        <div className="space-y-6 border-t border-[#1e160c14] pt-10 dark:border-[#ffffff1a]">
            <Heading
                variant="small"
                title={t('Пасскеи')}
                description={t(
                    'Вход по отпечатку, Face ID или ключу — без пароля',
                )}
            />

            <div className={`overflow-hidden ${panelClass}`}>
                {passkeys.length > 0 ? (
                    passkeys.map((passkey) => (
                        <PasskeyItem
                            key={passkey.id}
                            passkey={passkey}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <EmptyState />
                )}
            </div>

            <PasskeyRegistration onSuccess={handleRegisterSuccess} />
        </div>
    );
}
