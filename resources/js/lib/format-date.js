const MONTHS = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
];

// Uses UTC getters (not local getDate/getMonth/...) so the server (SSR,
// usually UTC) and the browser (user's own timezone) always render the same
// string — mismatched output between them breaks React hydration.
// t: optional useTranslations() result — month names are RU source keys.
export function formatDate(iso, t = (s) => s) {
    const date = new Date(iso);
    return `${date.getUTCDate()} ${t(MONTHS[date.getUTCMonth()])} ${date.getUTCFullYear()}`;
}

export function formatDateTime(iso, t = (s) => s) {
    const date = new Date(iso);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${date.getUTCDate()} ${t(MONTHS[date.getUTCMonth()])}, ${hours}:${minutes}`;
}
