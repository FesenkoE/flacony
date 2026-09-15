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
                        <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                            Пока нет статей.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="flex flex-col gap-3 rounded-3xl border border-[#1e160c14] bg-[#fffaf1] p-6 transition-colors hover:border-[#c79a5f66] dark:border-[#ffffff14] dark:bg-[#ffffff0a]"
                                >
                                    <span className="w-fit rounded-full bg-[#c79a5f1a] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#c79a5f] uppercase">
                                        {formatDate(post.published_at)}
                                    </span>
                                    <h2 className="font-display text-3xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-sm leading-relaxed text-[#7d6952] dark:text-[#b7a58f]">
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
