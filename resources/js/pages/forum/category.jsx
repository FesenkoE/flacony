import { Head, Link, usePage } from '@inertiajs/react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { formatDate } from '@/lib/format-date';

export default function ForumCategory({ category, topics }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title={category.name} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-3xl p-6">
                    <Link
                        href="/forum"
                        className="text-sm text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← Форум
                    </Link>

                    <div className="mt-4 mb-8 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {category.name}
                        </h1>
                        {auth.user ? (
                            <Link
                                href={`/forum/${category.slug}/create`}
                                className="rounded-full bg-[#bf8438] px-5 py-2.5 text-sm font-bold tracking-[0.04em] text-[#1c1408] uppercase"
                            >
                                + Новая тема
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="text-sm text-[#8a7860] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                            >
                                Войти, чтобы создать тему
                            </Link>
                        )}
                    </div>

                    {topics.length === 0 ? (
                        <p className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                            В этом разделе пока нет тем.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {topics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    href={`/forum/topics/${topic.id}`}
                                    className="flex items-center justify-between rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-5 dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-display text-lg font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                            {topic.title}
                                        </span>
                                        <span className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
                                            {topic.author.name} ·{' '}
                                            {formatDate(topic.created_at)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                                        {topic.replies_count} ответов
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
