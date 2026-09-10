import { useEffect, useRef, useState } from 'react';

export function useInView() {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0, rootMargin: '0px 0px -20% 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return [ref, inView];
}
