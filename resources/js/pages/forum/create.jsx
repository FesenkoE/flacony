import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

const fieldClass =
    'w-full rounded-xl border border-[#e6d7bb] bg-[#fbf5ea] px-4 py-2.5 text-sm text-[#241a10] outline-none focus:border-[#c79a5f] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#f6ecdd]';
const labelClass =
    'text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]';

export default function ForumTopicCreate({ category }) {
    const t = useTranslations();

    return (
        <>
            <Head
                title={t('Новая тема — {category}', {
                    category: t(category.name),
                })}
            />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-xl p-6">
                    <Link
                        href={`/forum/${category.slug}`}
                        className="text-sm text-[#7d6952] hover:text-[#241a10] dark:text-[#b7a58f] dark:hover:text-[#f6ecdd]"
                    >
                        ← {t(category.name)}
                    </Link>

                    <h1 className="mt-4 mb-6 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        {t('Новая тема')}
                    </h1>

                    <Form
                        action={`/forum/${category.slug}/topics`}
                        method="post"
                        className="flex flex-col gap-5"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className={labelClass}
                                        htmlFor="title"
                                    >
                                        {t('Заголовок')}
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        className={fieldClass}
                                        placeholder={t('О чём тема?')}
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className={labelClass}
                                        htmlFor="body"
                                    >
                                        {t('Сообщение')}
                                    </label>
                                    <textarea
                                        id="body"
                                        name="body"
                                        rows={6}
                                        className={fieldClass}
                                        placeholder={t('Расскажи подробнее…')}
                                    />
                                    <InputError message={errors.body} />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 self-start rounded-full bg-[#c5aa86] dark:bg-[#c79a5f] px-7 py-3.5 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase disabled:opacity-60"
                                >
                                    {t('Создать тему')}
                                </button>
                            </>
                        )}
                    </Form>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}
