import { KeyRound, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    dangerButtonClass,
    dialogClass,
    secondaryButtonClass,
} from '@/components/brand-auth';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/use-translations';
import type { Passkey } from '@/types/auth';

type Props = {
    passkey: Passkey;
    onDelete: (id: number, onError: () => void) => void;
};

export default function PasskeyItem({ passkey, onDelete }: Props) {
    const t = useTranslations();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        onDelete(passkey.id, () => setIsDeleting(false));
    };

    return (
        <div className="flex items-center justify-between border-b border-[#1e160c14] p-4 last:border-b-0 dark:border-[#ffffff14]">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c79a5f29]">
                    <KeyRound className="h-5 w-5 text-[#7d6952] dark:text-[#b7a58f]" />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <p className="font-semibold">
                            {passkey.name}
                        </p>
                        {passkey.authenticator && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#e6d7bb] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-[#7d6952] uppercase dark:border-[#ffffff29] dark:text-[#b7a58f]">
                                {passkey.authenticator}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                        {t('Добавлен {when}', {
                            when: passkey.created_at_diff,
                        })}
                        {passkey.last_used_at_diff && (
                            <>
                                <span className="mx-1 opacity-50">·</span>
                                {t('последний вход {when}', {
                                    when: passkey.last_used_at_diff,
                                })}
                            </>
                        )}
                    </p>
                </div>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="rounded-full p-2 text-[#b4432f] hover:bg-[#b4432f14] dark:text-[#e07a63] dark:hover:bg-[#e07a6314]"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t('Удалить')}</span>
                    </button>
                </DialogTrigger>
                <DialogContent className={dialogClass}>
                    <DialogTitle className="font-display text-xl font-semibold italic">
                        {t('Удалить пасскей?')}
                    </DialogTitle>
                    <DialogDescription className="text-[#7d6952] dark:text-[#b7a58f]">
                        {t(
                            'Войти с пасскеем «{name}» больше не получится.',
                            { name: passkey.name },
                        )}
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className={secondaryButtonClass}
                            >
                                {t('Отмена')}
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={dangerButtonClass}
                        >
                            {isDeleting ? t('Удаляем…') : t('Удалить')}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
