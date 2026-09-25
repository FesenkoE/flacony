import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob(['./pages/**/*.tsx', './pages/**/*.jsx']);

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const path = Object.keys(pages).find(
            (p) => p.endsWith(`/${name}.tsx`) || p.endsWith(`/${name}.jsx`),
        );
        if (!path) {
            throw new Error(`Page not found: ${name}`);
        }
        const mod = await pages[path]();
        return mod.default ?? mod;
    },
    layout: (name) => {
        switch (true) {
            case name === 'home':
            case name === 'auth/login':
            case name === 'auth/register':
            case name === 'auth/forgot-password':
            case name === 'auth/reset-password':
            case name.startsWith('products/'):
            case name.startsWith('cart/'):
            case name.startsWith('sellers/'):
            case name.startsWith('lots/'):
            case name.startsWith('account/'):
            case name.startsWith('blog/'):
            case name.startsWith('forum/'):
            case name.startsWith('favorites/'):
            case name.startsWith('search/'):
            case name.startsWith('checkout/'):
            case name.startsWith('orders/'):
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return SettingsLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
