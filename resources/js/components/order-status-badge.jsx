import { useTranslations } from '@/hooks/use-translations';

// Keys mirror Order::STATUS_LABELS; RU label doubles as the translation key.
export const ORDER_STATUS_LABELS = {
    new: 'Новый',
    confirmed: 'Подтверждён',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
};

const TONES = {
    new: 'border-[#c79a5f] bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]',
    confirmed:
        'border-[#e6d7bb] text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]',
    shipped:
        'border-[#e6d7bb] text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]',
    delivered:
        'border-[#5f7a4f66] bg-[#5f7a4f1f] text-[#3f5534] dark:text-[#a9c296]',
    cancelled:
        'border-[#b4432f66] text-[#b4432f] dark:border-[#e07a6366] dark:text-[#e07a63]',
};

export default function OrderStatusBadge({ status }) {
    const t = useTranslations();

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${TONES[status] ?? TONES.new}`}
        >
            {t(ORDER_STATUS_LABELS[status] ?? status)}
        </span>
    );
}
