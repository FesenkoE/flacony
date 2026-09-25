import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';

// Shared shell for the auth pages (login, register, password reset, ...):
// site header/footer + one centered card, in the site's own palette instead
// of the starter kit's auth layout (deleted).

export const fieldClass =
    'w-full rounded-xl border border-[#e6d7bb] bg-[#fbf5ea] px-4 py-2.5 text-sm text-[#241a10] outline-none focus:border-[#c79a5f] dark:border-[#ffffff29] dark:bg-[#ffffff0a] dark:text-[#f6ecdd]';
export const labelClass =
    'text-[11px] font-semibold tracking-[0.1em] text-[#7d6952] uppercase dark:text-[#b7a58f]';
export const submitClass =
    'mt-2 rounded-full bg-[#c5aa86] dark:bg-[#c79a5f] px-7 py-3 text-sm font-bold tracking-[0.04em] text-[#3d2712] uppercase disabled:opacity-60';
export const secondaryButtonClass =
    'inline-flex items-center gap-2 rounded-full border border-[#e6d7bb] px-5 py-2.5 text-sm font-semibold text-[#241a10] hover:bg-[#f6efe3] disabled:opacity-60 dark:border-[#ffffff29] dark:text-[#f6ecdd] dark:hover:bg-[#ffffff0a]';
export const dangerButtonClass =
    'inline-flex items-center gap-2 rounded-full border border-[#b4432f] px-5 py-2.5 text-sm font-semibold text-[#b4432f] hover:bg-[#b4432f14] disabled:opacity-60 dark:border-[#e07a63] dark:text-[#e07a63] dark:hover:bg-[#e07a6314]';
export const dialogClass =
    'border-[#1e160c14] bg-[#fffaf1] text-[#241a10] dark:border-[#ffffff1a] dark:bg-[#130f0b] dark:text-[#f6ecdd]';
export const panelClass =
    'rounded-2xl border border-[#1e160c14] bg-[#fffaf1] dark:border-[#ffffff14] dark:bg-[#ffffff0a]';
export const mutedTextClass = 'text-sm text-[#7d6952] dark:text-[#b7a58f]';
export const footerLinkClass =
    'font-semibold text-[#241a10] hover:text-[#c79a5f] dark:text-[#f6ecdd]';

export function AuthCard({ title, subtitle, children }) {
    return (
        <>
            <SiteHeader />
            <div className="flex min-h-screen flex-col bg-[#f6efe3] dark:bg-[#0d0b09]">
                <div className="flex flex-1 items-center justify-center p-6">
                    <div className="w-full max-w-md rounded-2xl border border-[#1e160c14] bg-[#fffaf1] p-8 dark:border-[#ffffff14] dark:bg-[#ffffff0a]">
                        <h1 className="font-display text-center text-2xl font-semibold text-[#241a10] italic dark:text-[#f6ecdd]">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-2 text-center text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                {subtitle}
                            </p>
                        )}
                        {children}
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}

export function AuthStatus({ children }) {
    return (
        <div className="mt-6 rounded-xl border border-[#c79a5f4d] bg-[#c79a5f1a] px-4 py-2.5 text-center text-sm text-[#7d6952] dark:text-[#b7a58f]">
            {children}
        </div>
    );
}

export function PasswordField({ className = '', ...props }) {
    const t = useTranslations();
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                className={`${fieldClass} pr-10 ${className}`}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#7d6952] dark:text-[#b7a58f]"
                aria-label={show ? t('Скрыть пароль') : t('Показать пароль')}
                tabIndex={-1}
            >
                {show ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
            </button>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
            />
            <path
                fill="#34A853"
                d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.5404-1.8368.8591-3.0477.8591-2.3436 0-4.3282-1.5831-5.0359-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z"
            />
            <path
                fill="#FBBC05"
                d="M3.9641 10.71c-.18-.5404-.2823-1.1181-.2823-1.71s.1023-1.1696.2823-1.71V4.9582H.9573A8.9965 8.9965 0 0 0 0 9c0 1.4523.3477 2.8268.9573 4.0418L3.9641 10.71z"
            />
            <path
                fill="#EA4335"
                d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.9641 7.29C4.6718 5.1627 6.6564 3.5795 9 3.5795z"
            />
        </svg>
    );
}

export function GoogleButton() {
    const t = useTranslations();

    return (
        <a
            href="/auth/google/redirect"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e6d7bb] bg-transparent px-4 py-2.5 text-sm font-medium text-[#241a10] hover:bg-[#f6efe3] dark:border-[#ffffff29] dark:text-[#f6ecdd] dark:hover:bg-[#ffffff0a]"
        >
            <GoogleIcon />
            {t('Продолжить с Google')}
        </a>
    );
}

export function OrSeparator({ children }) {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-[#1e160c14] dark:bg-[#ffffff1a]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#fffaf1] px-2 text-[#7d6952] dark:bg-[#1c1712] dark:text-[#b7a58f]">
                    {children}
                </span>
            </div>
        </div>
    );
}
