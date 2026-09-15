import { usePage } from '@inertiajs/react';

export function useTranslations() {
    const { translations } = usePage().props;

    return (key, replacements) => {
        let value = translations?.[key] ?? key;

        if (replacements) {
            for (const [token, replacement] of Object.entries(replacements)) {
                value = value.replaceAll(`{${token}}`, replacement);
            }
        }

        return value;
    };
}
