import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';

export default function ConfirmButton({
    label = 'Убрать',
    icon,
    title,
    description,
    confirmLabel = 'Удалить',
    onConfirm,
    className = 'text-xs text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]',
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <button
                type="button"
                onClick={() => setOpen(true)}
                title={label}
                aria-label={label}
                className={className}
            >
                {icon ?? label}
            </button>

            <DialogContent className="border-[#1e160c14] bg-[#fffaf1] text-[#241a10] dark:border-[#ffffff1a] dark:bg-[#130f0b] dark:text-[#f6ecdd]">
                <DialogTitle className="font-display text-xl font-semibold italic">
                    {title}
                </DialogTitle>
                {description && (
                    <DialogDescription className="text-[#7d6952] dark:text-[#b7a58f]">
                        {description}
                    </DialogDescription>
                )}
                <DialogFooter>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-full border border-[#e6d7bb] px-5 py-2.5 text-sm font-semibold text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onConfirm();
                        }}
                        className="rounded-full bg-[#c79a5f] px-5 py-2.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
                    >
                        {confirmLabel}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
