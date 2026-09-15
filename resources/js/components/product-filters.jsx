import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTranslations } from '@/hooks/use-translations';

function FilterGroup({ title, defaultOpen = false, children }) {
    return (
        <Collapsible defaultOpen={defaultOpen} className="py-4 first:pt-0">
            <CollapsibleTrigger className="group flex w-full items-center justify-between text-left text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                {title}
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#7d6952] transition-transform group-data-[state=open]:rotate-180 dark:text-[#b7a58f]" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 flex flex-col gap-2.5">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}

function FilterCheckbox({ checked, onChange, label }) {
    return (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#241a10] dark:text-[#f6ecdd]">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 shrink-0 rounded border-[#e6d7bb] accent-[#c79a5f] dark:border-[#ffffff29]"
            />
            {label}
        </label>
    );
}

export default function ProductFilters({
    filters,
    onUpdate,
    categories,
    brands,
    concentrations,
    accords,
    volumes,
}) {
    const t = useTranslations();
    const [minPrice, setMinPrice] = useState(filters.min_price ?? '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price ?? '');

    function toggle(key, value) {
        const current = filters[key] ?? [];
        const stringValue = String(value);
        const next = current.map(String).includes(stringValue)
            ? current.filter((v) => String(v) !== stringValue)
            : [...current, value];
        onUpdate({ [key]: next });
    }

    function applyPrice(e) {
        e.preventDefault();
        onUpdate({
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
        });
    }

    return (
        <div className="flex flex-col divide-y divide-[#1e160c14] dark:divide-[#ffffff1a]">
            <FilterGroup title={t('Пол')} defaultOpen>
                {categories.map((category) => (
                    <FilterCheckbox
                        key={category.id}
                        label={category.name}
                        checked={(filters.category ?? []).includes(
                            category.slug,
                        )}
                        onChange={() => toggle('category', category.slug)}
                    />
                ))}
            </FilterGroup>

            <FilterGroup title={t('Бренд')} defaultOpen>
                {brands.map((brand) => (
                    <FilterCheckbox
                        key={brand.id}
                        label={brand.name}
                        checked={(filters.brand ?? []).includes(brand.slug)}
                        onChange={() => toggle('brand', brand.slug)}
                    />
                ))}
            </FilterGroup>

            {concentrations.length > 0 && (
                <FilterGroup title={t('Концентрация')} defaultOpen>
                    {concentrations.map((concentration) => (
                        <FilterCheckbox
                            key={concentration}
                            label={concentration}
                            checked={(filters.concentration ?? []).includes(
                                concentration,
                            )}
                            onChange={() =>
                                toggle('concentration', concentration)
                            }
                        />
                    ))}
                </FilterGroup>
            )}

            <FilterGroup title={t('Цена, ₴')} defaultOpen>
                <form
                    onSubmit={applyPrice}
                    className="flex flex-wrap items-center gap-2"
                >
                    <input
                        type="number"
                        min="0"
                        placeholder={t('от')}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-20 rounded-full border border-[#e6d7bb] bg-transparent px-3 py-1.5 text-sm text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                    />
                    <span className="text-[#7d6952] dark:text-[#b7a58f]">
                        —
                    </span>
                    <input
                        type="number"
                        min="0"
                        placeholder="до"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-20 rounded-full border border-[#e6d7bb] bg-transparent px-3 py-1.5 text-sm text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                    />
                    <button
                        type="submit"
                        className="rounded-full border border-[#c79a5f] px-3.5 py-1.5 text-sm font-medium text-[#241a10] dark:text-[#f6ecdd]"
                    >
                        OK
                    </button>
                </form>
            </FilterGroup>

            {accords.length > 0 && (
                <FilterGroup title={t('Аромат')}>
                    {accords.map((accord) => (
                        <FilterCheckbox
                            key={accord}
                            label={accord}
                            checked={(filters.accord ?? []).includes(accord)}
                            onChange={() => toggle('accord', accord)}
                        />
                    ))}
                </FilterGroup>
            )}

            {volumes.length > 0 && (
                <FilterGroup title={t('Объём')}>
                    <div className="flex flex-wrap gap-2">
                        {volumes.map((volume) => {
                            const selected = (filters.volume ?? [])
                                .map(String)
                                .includes(String(volume));
                            return (
                                <button
                                    key={volume}
                                    type="button"
                                    onClick={() => toggle('volume', volume)}
                                    className={
                                        'rounded-full border px-3.5 py-1.5 text-sm font-medium ' +
                                        (selected
                                            ? 'border-[#c79a5f] bg-[#c79a5f29] text-[#241a10] dark:text-[#f6ecdd]'
                                            : 'border-[#e6d7bb] text-[#7d6952] dark:border-[#ffffff29] dark:text-[#b7a58f]')
                                    }
                                >
                                    {volume} мл
                                </button>
                            );
                        })}
                    </div>
                </FilterGroup>
            )}
        </div>
    );
}
