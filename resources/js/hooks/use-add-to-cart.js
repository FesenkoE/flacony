import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useAddToCart() {
    const [added, setAdded] = useState(false);

    function addToCart(variantId) {
        router.post(
            '/cart',
            { variant_id: variantId },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1800);
                },
            },
        );
    }

    return { added, addToCart };
}
