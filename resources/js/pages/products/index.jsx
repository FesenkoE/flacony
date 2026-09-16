import { Head, Link, router } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/product-card';
import ProductFilters from '@/components/product-filters';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useTranslations } from '@/hooks/use-translations';
import { pluralizeRu } from '@/lib/pluralize';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'price_asc', label: 'Сначала дешевле' },
    { value: 'price_desc', label: 'Сначала дороже' },
    { value: 'rating', label: 'По рейтингу' },
];

function pluralizeProducts(n) {
    return pluralizeRu(n, ['товар', 'товара', 'товаров']);
}

export default function ProductsIndex({
    products,
    brands,
    categories,
    concentrations,
    accords,
    volumes,
    filters,
}) {
    const t = useTranslations();

    function updateFilters(overrides) {
        const next = { ...filters, ...overrides };
        Object.entries(next).forEach(([key, value]) => {
            const isEmpty =
                value === undefined ||
                value === null ||
                value === '' ||
                (Array.isArray(value) && value.length === 0);
            if (isEmpty) delete next[key];
        });
        router.get('/products', next, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const activeChips = [
        ...(filters.category ?? []).map((slug) => ({
            key: 'category',
            value: slug,
            label: categories.find((c) => c.slug === slug)?.name ?? slug,
        })),
        ...(filters.brand ?? []).map((slug) => ({
            key: 'brand',
            value: slug,
            label: brands.find((b) => b.slug === slug)?.name ?? slug,
        })),
        ...(filters.concentration ?? []).map((value) => ({
            key: 'concentration',
            value,
            label: value,
        })),
        ...(filters.accord ?? []).map((value) => ({
            key: 'accord',
            value,
            label: value,
        })),
        ...(filters.volume ?? []).map((value) => ({
            key: 'volume',
            value,
            label: `${value} мл`,
        })),
    ];
    if (filters.min_price || filters.max_price) {
        activeChips.push({
            key: 'price',
            value: null,
            label: t('Цена: {min}–{max} ₴', {
                min: filters.min_price ?? 0,
                max: filters.max_price ?? '∞',
            }),
        });
    }

    function removeChip(chip) {
        if (chip.key === 'price') {
            updateFilters({ min_price: undefined, max_price: undefined });
            return;
        }
        const current = filters[chip.key] ?? [];
        updateFilters({
            [chip.key]: current.filter((v) => String(v) !== String(chip.value)),
        });
    }

    const filterProps = {
        filters,
        onUpdate: updateFilters,
        categories,
        brands,
        concentrations,
        accords,
        volumes,
    };

    return (
        <>
            <Head title={t('Каталог')} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-[1600px] p-6">
                    <h1 className="mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Каталог')}
                    </h1>

                    <div className="flex gap-8">
                        <aside className="hidden w-64 shrink-0 lg:block">
                            <div className="sticky top-[5.5rem] max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
                                <ProductFilters {...filterProps} />
                            </div>
                        </aside>

                        <div className="min-w-0 flex-1">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <button
                                                type="button"
                                                className="flex items-center gap-2 rounded-full border border-[#c79a5f] px-4 py-1.5 text-sm font-medium text-[#241a10] lg:hidden dark:text-[#f6ecdd]"
                                            >
                                                <SlidersHorizontal className="h-4 w-4" />
                                                {t('Фильтры')}
                                            </button>
                                        </SheetTrigger>
                                        <SheetContent
                                            side="left"
                                            className="w-full max-w-sm gap-0 overflow-y-auto border-[#1e160c14] bg-[#f6efe3] p-6 dark:border-[#ffffff1a] dark:bg-[#0d0b09]"
                                        >
                                            <SheetTitle className="mb-4 text-lg font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                                                {t('Фильтры')}
                                            </SheetTitle>
                                            <ProductFilters {...filterProps} />
                                        </SheetContent>
                                    </Sheet>
                                    <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                        {t('Найдено {count} {word}', {
                                            count: products.total,
                                            word: t(
                                                pluralizeProducts(
                                                    products.total,
                                                ),
                                            ),
                                        })}
                                    </span>
                                </div>

                                <Select
                                    value={filters.sort ?? 'newest'}
                                    onValueChange={(value) =>
                                        updateFilters({ sort: value })
                                    }
                                >
                                    <SelectTrigger className="rounded-full border-[#e6d7bb] bg-transparent px-3.5 py-1.5 text-sm text-[#241a10] dark:border-[#ffffff29] dark:bg-[#0d0b09] dark:text-[#f6ecdd]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SORT_OPTIONS.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {t(option.label)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {activeChips.length > 0 && (
                                <div className="mb-6 flex flex-wrap items-center gap-2">
                                    {activeChips.map((chip) => (
                                        <button
                                            key={`${chip.key}-${chip.value}`}
                                            type="button"
                                            onClick={() => removeChip(chip)}
                                            className="inline-flex items-center gap-2 rounded-full border border-[#c79a5f] bg-[#c79a5f29] px-4 py-1.5 text-sm font-medium text-[#241a10] dark:text-[#f6ecdd]"
                                        >
                                            {chip.label}
                                            <span aria-hidden>✕</span>
                                        </button>
                                    ))}
                                    <Link
                                        href="/products"
                                        className="text-sm text-[#7d6952] underline dark:text-[#b7a58f]"
                                    >
                                        {t('Сбросить всё')}
                                    </Link>
                                </div>
                            )}

                            <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
                                {products.data.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>

                            {products.last_page > 1 && (
                                <div className="mt-8 flex flex-wrap gap-2">
                                    {products.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={
                                                'rounded-full border px-3.5 py-1.5 text-sm ' +
                                                (link.active
                                                    ? 'border-[#c79a5f] bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]'
                                                    : 'border-[#e6d7bb] text-[#7d6952] dark:border-[#ffffff29] dark:text-[#b7a58f]') +
                                                (!link.url
                                                    ? ' pointer-events-none opacity-40'
                                                    : '')
                                            }
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
