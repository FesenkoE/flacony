import { Head, Link } from '@inertiajs/react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { formatDate } from '@/lib/format-date';

export default function BlogIndex({ posts }) {
    return (
        <>
            <Head title="Блог" />
            <SiteHeader />
            <div className="min-h-screen bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="mx-auto max-w-3xl p-6">
                    <h1 className="mb-8 text-2xl font-semibold text-[#241a10] dark:text-[#f6ecdd]">
                        Блог
                    </h1>

                    {posts.length === 0 ? (
                        <p className="text-sm text-[#8a7860] dark:text-[#b7a58f]">
                            Пока нет статей.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="flex flex-col gap-2 border-b border-[#1e160c14] pb-8 last:border-0 dark:border-[#ffffff14]"
                                >
                                    <span className="text-xs text-[#8a7860] dark:text-[#b7a58f]">
                                        {formatDate(post.published_at)}
                                    </span>
                                    <h2 className="font-display text-3xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-sm leading-relaxed text-[#8a7860] dark:text-[#b7a58f]">
                                            {post.excerpt}
                                        </p>
                                    )}
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
