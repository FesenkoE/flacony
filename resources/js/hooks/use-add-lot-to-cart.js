import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useAddLotToCart() {
    const [added, setAdded] = useState(false);

    function addLotToCart(lotId, volumeMl) {
        router.post(
            '/cart/lots',
            { lot_id: lotId, volume_ml: volumeMl },
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

    return { added, addLotToCart };
}
