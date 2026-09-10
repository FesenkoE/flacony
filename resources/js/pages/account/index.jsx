import { Head, Link, usePage } from '@inertiajs/react';
import { useConfirmDelete } from '@/hooks/use-confirm-delete';
import { useFlipList } from '@/hooks/use-flip-list';
import ConfirmButton from '@/components/confirm-button';
import DissolveCard from '@/components/dissolve-card';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

const actionButtonBase =
    'flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ease-out hover:scale-110 active:scale-95';

const viewButtonClass =
    actionButtonBase +
    ' border-[#e6d7bb] text-[#8a7860] hover:border-[#6d9b8f] hover:bg-[#6d9b8f1a] hover:text-[#4f7a6f] dark:border-[#ffffff29] dark:text-[#b7a58f] dark:hover:border-[#8fc4b6] dark:hover:bg-[#8fc4b61a] dark:hover:text-[#8fc4b6]';

const editButtonClass =
    actionButtonBase +
    ' border-[#bf8438] text-[#bf8438] hover:bg-[#bf8438] hover:text-[#1c1408]';

const deleteButtonClass =
    actionButtonBase +
    ' border-[#c0645a] text-[#c0645a] hover:bg-[#c0645a] hover:text-[#fdf3f1]';

const iconProps = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

function EyeIcon() {
    return (
        <svg {...iconProps}>
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function PencilIcon() {
    return (
        <svg {...iconProps}>
            <path d="M17 3a2.83 2.83 0 0 1 4 4L7 21l-4 1 1-4Z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg {...iconProps}>
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
    );
}

function LotRow({ lot }) {
    const { removing, remove } = useConfirmDelete(`/sellers/lots/${lot.id}`);

    return (
        <DissolveCard
            active={removing}
            data-flip-key={lot.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-4 dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
        >
            <div className="flex flex-col gap-1">
                <span className="text-xs font-bold tracking-[0.1em] text-[#bf8438] uppercase">
                    {lot.brand_name}
                </span>
                <span className="font-display text-lg font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                    {lot.product_name}
                </span>
                <span className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
                    Остаток {lot.remaining_volume_ml} из {lot.total_volume_ml} мл ·{' '}
                    {Number(lot.price_per_ml).toFixed(2)} ₴/мл
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Link
                    href={`/sellers/lots/${lot.id}`}
                    title="Посмотреть"
                    aria-label="Посмотреть"
                    className={viewButtonClass}
                >
                    <EyeIcon />
                </Link>
                <Link
                    href={`/sellers/lots/${lot.id}/edit`}
                    title="Редактировать"
                    aria-label="Редактировать"
                    className={editButtonClass}
                >
                    <PencilIcon />
                </Link>
                <ConfirmButton
                    label="Удалить"
                    icon={<TrashIcon />}
                    title={`Удалить лот «${lot.product_name}»?`}
                    onConfirm={remove}
                    className={deleteButtonClass}
                />
            </div>
        </DissolveCard>
    );
}

export default function AccountIndex({ lots }) {
    const { auth } = usePage().props;
    const listRef = useFlipList([lots.length]);

    return (
        <>
            <Head title="Личный кабинет" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-4xl p-6">
                    <h1 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Личный кабинет
                    </h1>
                    <p className="mt-1 text-sm text-[#8a7860] dark:text-[#b7a58f]">
                        {auth.user.name} · {auth.user.email}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/settings/profile"
                            className="rounded-full border border-[#e6d7bb] px-5 py-2.5 text-sm font-semibold text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                        >
                            Настройки профиля
                        </Link>
                        <Link
                            href={`/sellers/${auth.user.id}`}
                            className="rounded-full border border-[#e6d7bb] px-5 py-2.5 text-sm font-semibold text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                        >
                            Моя витрина
                        </Link>
                        <Link
                            href="/cart"
                            className="rounded-full border border-[#e6d7bb] px-5 py-2.5 text-sm font-semibold text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                        >
                            Корзина
                        </Link>
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            Мои лоты
                        </h2>
                        <Link
                            href="/sellers/lots/create"
                            className="rounded-full bg-[#bf8438] px-5 py-2.5 text-sm font-bold tracking-[0.04em] text-[#1c1408] uppercase"
                        >
                            + Добавить лот
                        </Link>
                    </div>

                    {lots.length === 0 ? (
                        <p className="mt-4 text-sm text-[#8a7860] dark:text-[#b7a58f]">
                            Ты ещё не выставлял лоты на распив.
                        </p>
                    ) : (
                        <div ref={listRef} className="mt-4 flex flex-col gap-3">
                            {lots.map((lot) => (
                                <LotRow key={lot.id} lot={lot} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
