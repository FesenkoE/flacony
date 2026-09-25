export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-1'}>
            <h2
                className={
                    variant === 'small'
                        ? 'mb-1 text-base font-semibold text-[#241a10] dark:text-[#f6ecdd]'
                        : 'font-display text-3xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                    {description}
                </p>
            )}
        </header>
    );
}
