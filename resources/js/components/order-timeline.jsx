import { Check, X } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { formatDateTime } from '@/lib/format-date';

const STEPS = [
    { status: 'new', label: 'Оформлен', dateField: 'created_at' },
    { status: 'confirmed', label: 'Подтверждён', dateField: 'confirmed_at' },
    { status: 'shipped', label: 'Отправлен', dateField: 'shipped_at' },
    { status: 'delivered', label: 'Доставлен', dateField: 'delivered_at' },
];

// Order progress as a stepper: done steps filled, current one ringed, the
// rest muted. A cancelled order stops at the last step it reached.
export default function OrderTimeline({ order }) {
    const t = useTranslations();
    const cancelled = order.status === 'cancelled';
    // A cancelled order only ever gets cancelled from new or confirmed.
    const reached = cancelled
        ? order.confirmed_at
            ? 1
            : 0
        : STEPS.findIndex((step) => step.status === order.status);
    const steps = cancelled
        ? [
              ...STEPS.slice(0, reached + 1),
              {
                  status: 'cancelled',
                  label: 'Отменён',
                  dateField: 'cancelled_at',
              },
          ]
        : STEPS;

    return (
        <ol className="flex w-full flex-col gap-4 text-left sm:flex-row sm:gap-0">
            {steps.map((step, index) => {
                const done = cancelled || index <= reached;
                const current = !cancelled && index === reached;
                const isCancel = step.status === 'cancelled';
                const date = order[step.dateField];

                return (
                    <li
                        key={step.status}
                        className="relative flex gap-3 sm:flex-1 sm:flex-col sm:items-center sm:gap-2 sm:text-center"
                    >
                        {index < steps.length - 1 && (
                            <span
                                aria-hidden
                                className={
                                    'absolute top-8 bottom-[-1rem] left-[0.9375rem] w-px sm:top-[0.9375rem] sm:right-[-50%] sm:bottom-auto sm:left-1/2 sm:h-px sm:w-auto ' +
                                    (index < reached || cancelled
                                        ? 'bg-[#c79a5f]'
                                        : 'bg-[#e6d7bb] dark:bg-[#ffffff29]')
                                }
                            />
                        )}
                        <span
                            className={
                                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ' +
                                (isCancel
                                    ? 'border-[#b4432f] bg-[#b4432f] text-white dark:border-[#e07a63] dark:bg-[#e07a63] dark:text-[#130f0b]'
                                    : done
                                      ? 'border-[#c79a5f] bg-[#c79a5f] text-[#3d2712]'
                                      : 'border-[#e6d7bb] bg-[#fffaf1] text-[#7d6952] dark:border-[#ffffff29] dark:bg-[#130f0b] dark:text-[#b7a58f]') +
                                (current ? ' ring-4 ring-[#c79a5f40]' : '')
                            }
                        >
                            {isCancel ? (
                                <X className="h-4 w-4" />
                            ) : done ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <span className="text-xs font-semibold">
                                    {index + 1}
                                </span>
                            )}
                        </span>
                        <span className="flex flex-col gap-0.5 pt-1 sm:pt-0">
                            <span
                                className={
                                    'text-sm font-semibold ' +
                                    (done
                                        ? 'text-[#241a10] dark:text-[#f6ecdd]'
                                        : 'text-[#7d6952] dark:text-[#b7a58f]')
                                }
                            >
                                {t(step.label)}
                            </span>
                            {done && date && (
                                <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                    {formatDateTime(date, t)}
                                </span>
                            )}
                            {step.status === 'shipped' &&
                                done &&
                                order.tracking_number && (
                                    <a
                                        href={`https://tracking.novaposhta.ua/#/uk/${encodeURIComponent(order.tracking_number)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-semibold text-[#241a10] underline decoration-[#c79a5f] underline-offset-4 dark:text-[#f6ecdd]"
                                    >
                                        {t('ТТН {ttn}', {
                                            ttn: order.tracking_number,
                                        })}
                                    </a>
                                )}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
