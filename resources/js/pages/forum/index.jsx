import { Head, Link } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';
import { formatDate } from '@/lib/format-date';
import { pluralizeRu } from '@/lib/pluralize';

// Who answered last and when — shows at a glance whether a topic is alive.
function lastActivity(topic, t) {
    return `${topic.latest_reply.author.name}, ${formatDate(topic.latest_reply.created_at, t)}`;
}

export default function ForumIndex({ categories, recentTopics }) {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Форум')} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-6xl p-6">
                    <h1 className="mb-8 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Форум')}
                    </h1>

                    {categories.length === 0 ? (
                        <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            {t('Разделов пока нет.')}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
                            <div className="flex flex-col gap-3">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/forum/${category.slug}`}
                                        className="flex items-center gap-4 rounded-3xl border border-[#1e160c14] bg-[#fffaf1] p-6 transition-colors hover:border-[#c79a5f66] dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
                                    >
                                        <span className="hidden h-12 w-12 shrink-0 items-center sm:flex justify-center rounded-full bg-[#c79a5f1a] text-[#c79a5f]">
                                            <MessageCircle
                                                size={20}
                                                strokeWidth={1.75}
                                            />
                                        </span>
                                        <div className="flex flex-1 flex-col gap-1">
                                            <span className="font-display text-xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                                {t(category.name)}
                                            </span>
                                            {category.description && (
                                                <span className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                                    {t(category.description)}
                                                </span>
                                            )}
                                            {category.last_topic && (
                                                <span className="mt-1 text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                                    {t('Последнее:')}{' '}
                                                    <span className="text-[#241a10] dark:text-[#f6ecdd]">
                                                        {
                                                            category.last_topic
                                                                .title
                                                        }
                                                    </span>{' '}
                                                    ·{' '}
                                                    {lastActivity(
                                                        category.last_topic,
                                                        t,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <span className="shrink-0 text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                            {category.topics_count}{' '}
                                            {t(
                                                pluralizeRu(
                                                    category.topics_count,
                                                    ['тема', 'темы', 'тем'],
                                                ),
                                            )}
                                        </span>
                                    </Link>
                                ))}
                            </div>

                            {recentTopics.length > 0 && (
                                <aside className="lg:sticky lg:top-[5.5rem] lg:self-start">
                                    <div className="flex flex-col gap-4 rounded-3xl border border-[#1e160c14] bg-[#fffaf1] p-6 dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                                        <span className="text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]">
                                            {t('Свежие темы')}
                                        </span>
                                        {recentTopics.map((topic) => (
                                            <Link
                                                key={topic.id}
                                                href={`/forum/topics/${topic.id}`}
                                                className="group flex flex-col gap-1"
                                            >
                                                <span className="text-sm font-semibold text-[#241a10] group-hover:text-[#c79a5f] dark:text-[#f6ecdd]">
                                                    {topic.title}
                                                </span>
                                                <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                                                    {t(topic.category.name)} ·{' '}
                                                    {lastActivity(topic, t)}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </aside>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
