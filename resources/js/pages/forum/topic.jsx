import { Form, Head, Link, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { formatDateTime as formatDate } from '@/lib/format-date';
import { useTranslations } from '@/hooks/use-translations';

function ReplyCard({ reply }) {
    return (
        <div className="flex flex-col gap-2 rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-5 dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                    {reply.author.name}
                </span>
                <span className="text-xs text-[#7d6952] dark:text-[#b7a58f]">
                    {formatDate(reply.created_at)}
                </span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line text-[#241a10] dark:text-[#f6ecdd]">
                {reply.body}
            </p>
        </div>
    );
}

export default function ForumTopic({ topic, replies }) {
    const t = useTranslations();
    const { auth } = usePage().props;

    return (
        <>
            <Head title={topic.title} />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-3xl p-6">
                    <Link
                        href={`/forum/${topic.category.slug}`}
                        className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← {topic.category.name}
                    </Link>

                    <h1 className="font-display mt-4 mb-8 text-3xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                        {topic.title}
                    </h1>

                    <div className="flex flex-col gap-4">
                        {replies.map((reply) => (
                            <ReplyCard key={reply.id} reply={reply} />
                        ))}
                    </div>

                    <div className="mt-10">
                        {auth.user ? (
                            <Form
                                action={`/forum/topics/${topic.id}/replies`}
                                method="post"
                                resetOnSuccess
                                className="flex flex-col gap-3"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <textarea
                                            name="body"
                                            rows={4}
                                            placeholder={t('Написать ответ…')}
                                            className="w-full rounded-xl border border-[#e6d7bb] bg-[#fbf5ea] px-4 py-3 text-sm text-[#241a10] outline-none focus:border-[#c79a5f] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#f6ecdd]"
                                        />
                                        <InputError message={errors.body} />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="self-start rounded-full bg-[#b3864d] dark:bg-[#c79a5f] px-6 py-3 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase disabled:opacity-60"
                                        >
                                            {t('Ответить')}
                                        </button>
                                    </>
                                )}
                            </Form>
                        ) : (
                            <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                <Link
                                    href="/login"
                                    className="text-[#c79a5f] hover:text-[#a8702e]"
                                >
                                    {t('Войди')}
                                </Link>
                                {t(', чтобы ответить в теме.')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
