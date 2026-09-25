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

// DB records with a `<field>_uk` column: Ukrainian when set, Russian fallback.
export function useLocalized() {
    const { locale } = usePage().props;

    return (record, field) =>
        (locale === 'uk' && record[`${field}_uk`]) || record[field];
}
