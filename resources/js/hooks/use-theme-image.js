import { useEffect, useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

export function useIsDarkTheme() {
    const { resolvedAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return mounted && resolvedAppearance === 'dark';
}

export function pickThemeImage(isDark, darkPath, lightPath) {
    return isDark ? darkPath : (lightPath ?? darkPath);
}

export function useThemeImagePath(darkPath, lightPath) {
    const isDark = useIsDarkTheme();

    return pickThemeImage(isDark, darkPath, lightPath);
}
