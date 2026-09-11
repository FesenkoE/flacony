import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export default function SearchOverlay({ open, onOpenChange }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ products: [], lots: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setQuery('');
            setResults({ products: [], lots: [] });
        }
    }, [open]);

    useEffect(() => {
        if (query.trim() === '') {
            setResults({ products: [], lots: [] });
            return;
        }

        setLoading(true);
        const timeout = setTimeout(() => {
            fetch(`/search/live?q=${encodeURIComponent(query)}`)
                .then((r) => r.json())
                .then(setResults)
                .catch(() => setResults({ products: [], lots: [] }))
                .finally(() => setLoading(false));
        }, 250);

        return () => clearTimeout(timeout);
    }, [query]);

    function goToFullResults() {
        onOpenChange(false);
        router.get('/search', { q: query });
    }

    function submit(e) {
        e.preventDefault();
        goToFullResults();
    }

    const hasResults = results.products.length > 0 || results.lots.length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="top-[15%] max-w-xl translate-y-0 gap-0 border-[#1e160c14] bg-[#fffaf1] p-0 text-[#241a10] dark:border-[#ffffff1a] dark:bg-[#130f0b] dark:text-[#f6ecdd]">
                <DialogTitle className="sr-only">Поиск</DialogTitle>

                <form
                    onSubmit={submit}
                    className="flex items-center gap-3 border-b border-[#1e160c14] px-5 py-4 dark:border-[#ffffff1a]"
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 text-[#8a7860] dark:text-[#b7a58f]"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Аромат, бренд, нота..."
                        autoFocus
                        className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7860] dark:placeholder:text-[#b7a58f]"
                    />
                </form>

                {query.trim() !== '' && (
                    <div className="max-h-[60vh] overflow-y-auto p-2">
                        {loading && !hasResults && (
                            <p className="px-3 py-4 text-sm text-[#8a7860] dark:text-[#b7a58f]">
                                Ищем...
                            </p>
                        )}

                        {!loading && !hasResults && (
                            <p className="px-3 py-4 text-sm text-[#8a7860] dark:text-[#b7a58f]">
                                По запросу «{query}» ничего не нашлось.
                            </p>
                        )}

                        {results.products.length > 0 && (
                            <div className="flex flex-col">
                                <span className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-[0.1em] text-[#8a7860] uppercase dark:text-[#b7a58f]">
                                    Каталог
                                </span>
                                {results.products.map((product) => (
                                    <a
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#f6efe3] dark:hover:bg-[#ffffff0a]"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f6efe3] dark:bg-[#ffffff0a]">
                                            {product.image_path && (
                                                <img
                                                    src={`/storage/${product.image_path}`}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <span className="truncate text-sm font-semibold">
                                                {product.brand} — {product.name}
                                            </span>
                                        </div>
                                        <span className="shrink-0 text-xs text-[#8a7860] dark:text-[#b7a58f]">
                                            от{' '}
                                            {Number(product.price).toFixed(0)} ₴
                                        </span>
                                    </a>
                                ))}
                            </div>
                        )}

                        {results.lots.length > 0 && (
                            <div className="flex flex-col">
                                <span className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-[0.1em] text-[#8a7860] uppercase dark:text-[#b7a58f]">
                                    Распив
                                </span>
                                {results.lots.map((lot) => (
                                    <a
                                        key={lot.id}
                                        href={`/sellers/lots/${lot.id}`}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#f6efe3] dark:hover:bg-[#ffffff0a]"
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <span className="truncate text-sm font-semibold">
                                                {lot.brand_name} —{' '}
                                                {lot.product_name}
                                            </span>
                                        </div>
                                        <span className="shrink-0 text-xs text-[#8a7860] dark:text-[#b7a58f]">
                                            {Number(lot.price_per_ml).toFixed(
                                                0,
                                            )}{' '}
                                            ₴/мл
                                        </span>
                                    </a>
                                ))}
                            </div>
                        )}

                        {hasResults && (
                            <button
                                type="button"
                                onClick={goToFullResults}
                                className="mt-1 w-full rounded-xl px-3 py-2.5 text-center text-sm font-semibold text-[#bf8438] hover:bg-[#f6efe3] dark:hover:bg-[#ffffff0a]"
                            >
                                Все результаты по «{query}» →
                            </button>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
