import { useInView } from '@/hooks/use-in-view';

export default function Reveal({ children, className = '' }) {
    const [ref, inView] = useInView();

    return (
        <div ref={ref} className={`reveal ${inView ? 'is-visible' : ''} ${className}`}>
            {children}
        </div>
    );
}
