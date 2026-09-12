import { useLayoutEffect, useRef } from 'react';

/**
 * Animates siblings sliding into place when the list they belong to changes
 * (e.g. an item is removed). Attach the returned ref to the list container,
 * and put a stable `data-flip-key` on each direct child.
 */
export function useFlipList(deps) {
    const containerRef = useRef(null);
    const prevRects = useRef(new Map());

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const children = Array.from(container.children);

        children.forEach((el) => {
            const key = el.dataset.flipKey;
            if (!key) {
                return;
            }

            const prevRect = prevRects.current.get(key);
            const nextRect = el.getBoundingClientRect();

            if (prevRect) {
                const deltaX = prevRect.left - nextRect.left;
                const deltaY = prevRect.top - nextRect.top;
                if (deltaX || deltaY) {
                    el.style.transition = 'none';
                    el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                    requestAnimationFrame(() => {
                        el.style.transition = 'transform 400ms ease';
                        el.style.transform = '';
                    });
                }
            }

            prevRects.current.set(key, nextRect);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return containerRef;
}
