import { router } from '@inertiajs/react';
import { useState } from 'react';

const FADE_OUT_MS = 1300;

export function useConfirmDelete(href) {
    const [removing, setRemoving] = useState(false);

    function remove() {
        setRemoving(true);
        setTimeout(() => {
            router.delete(href, { preserveScroll: true, preserveState: true });
        }, FADE_OUT_MS);
    }

    return { removing, remove };
}
