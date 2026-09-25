import { Head, Link, usePage } from '@inertiajs/react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { formatDate } from '@/lib/format-date';
import { useTranslations } from '@/hooks/use-translations';
import { pluralizeRu } from '@/lib/pluralize';

export default function ForumCategory({ category, topics }) {
    const t = useTranslations();
    const { auth } = usePage().props;

    return (
        <>
            <Head title={t(category.name)} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-3xl p-6">
                    <Link
                        href="/forum"
                        className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← {t('Форум')}
                    </Link>

                    <div className="mt-4 mb-8 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                            {t(category.name)}
                        </h1>
                        {auth.user ? (
                            <Link
                                href={`/forum/${category.slug}/create`}
                                className="rounded-full bg-[#c5aa86] dark:bg-[#c79a5f] px-5 py-2.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase"
                            >
                                + {t('Новая тема')}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                            >
                                {t('Войти, чтобы создать тему')}
                            </Link>
                        )}
                    </div>

                    {topics.length === 0 ? (
                        <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            {t('В этом разделе пока нет тем.')}
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
                                        <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                            {topic.author.name} ·{' '}
                                            {formatDate(topic.created_at, t)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                        {topic.replies_count}{' '}
                                        {t(
                                            pluralizeRu(topic.replies_count, [
                                                'ответ',
                                                'ответа',
                                                'ответов',
                                            ]),
                                        )}
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
