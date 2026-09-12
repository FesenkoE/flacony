import { Head, Link } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';

export default function ForumIndex({ categories }) {
    return (
        <>
            <Head title="Форум" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-3xl p-6">
                    <h1 className="mb-8 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Форум
                    </h1>

                    {categories.length === 0 ? (
                        <p className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                            Разделов пока нет.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/forum/${category.slug}`}
                                    className="flex items-center gap-4 rounded-3xl border border-[#1e160c14] bg-[#fffaf1] p-6 transition-colors hover:border-[#bf843866] dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
                                >
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#bf84381a] text-[#bf8438]">
                                        <MessageCircle
                                            size={20}
                                            strokeWidth={1.75}
                                        />
                                    </span>
                                    <div className="flex flex-1 flex-col gap-1">
                                        <span className="font-display text-xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                            {category.name}
                                        </span>
                                        {category.description && (
                                            <span className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                                                {category.description}
                                            </span>
                                        )}
                                    </div>
                                    <span className="shrink-0 text-sm text-[#8a7860] dark:text-[#b7a58f]">
                                        {category.topics_count} тем
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
